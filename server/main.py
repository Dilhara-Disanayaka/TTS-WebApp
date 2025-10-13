import os
from TTS.utils.synthesizer import Synthesizer
from fastapi import FastAPI, Response,UploadFile,Form,Query,Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from g2p import convert_text
from g2p import convert_text
from supabase import  create_client,Client
from fastapi import HTTPException, Request
import uuid
from mutagen.mp3 import MP3
from mutagen.wave import WAVE
import datetime
from num2sinhala import num_convert
load_dotenv()
app = FastAPI()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
BUCKET_NAME = "audio_files"
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Hello, Supabase with FastAPI is working!"}


class TextRequest(BaseModel):
    text: str

tts_path = "models/dinithi2.pth"
tts_config_path = "models/dinithi2.json"
vocoder_path = "models/dinithi_vocoder.pth"
vocoder_config_path = "models/dinithi_vocoder.json"

synthesizer = Synthesizer(
    tts_checkpoint=tts_path,
    tts_config_path=tts_config_path,
    vocoder_checkpoint=vocoder_path,
    vocoder_config=vocoder_config_path,
)

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# ---------------------------
# Signup with email/password
# ---------------------------
@app.post("/signup")
async def signup(request: SignupRequest):
    try:
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
        if not response.user:
            raise HTTPException(status_code=400, detail="Signup failed")
        return {"message": "Signup successful. Check your email for confirmation."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ---------------------------
# Login with email/password
# ---------------------------
@app.post("/login")
async def login(request: LoginRequest):
    print(request.email, request.password)
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        if not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {
             "user_id": response.user.id,
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ---------------------------
# Google OAuth Sign-In
# ---------------------------
@app.get("/auth/google")
async def google_auth():
    """
    Returns the URL the frontend should redirect the user to for Google login.
    """
    try:
        # Build the OAuth URL
        # "redirect_to" should be YOUR frontend URL (where Supabase will redirect back after login)
        redirect_url = supabase.auth.sign_in_with_oauth(
            {
                "provider": "google",
                "options": {"redirect_to": "http://localhost:3000/home"},
            }
        )
        return {"auth_url": redirect_url.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ---------------------------
# OAuth callback (Supabase redirects here)
# ---------------------------
@app.get("/auth/callback")
async def auth_callback(request: Request):
    """
    Supabase will redirect here after Google login.
    The URL will contain access_token in query params.
    Example: http://localhost:8000/auth/callback#access_token=...&refresh_token=...
    """
    return {"message": "OAuth callback received. Parse token from URL fragment on frontend."}




def get_audio_duration(file_path: str):
    """Get audio duration in seconds"""
    if file_path.endswith(".mp3"):
        return round((MP3(file_path).info.length),2)
    elif file_path.endswith(".wav"):
        return round((WAVE(file_path).info.length), 2)
    return None


@app.post("/upload-audio")
async def upload_audio(
    file: UploadFile,
    user_id: str = Form(...)
):
    # Generate unique ID for audio
    ##return {"message": "Files ok  ", "user_id": user_id, "filename": file.filename}
    try:
        user_id_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id format")
    audio_id = str(uuid.uuid4())
    filename = f"{audio_id}_{file.filename}"
    #return {"message": "File received ", "user_id": user_id, "filename": filename}
    # Save temporarily
    temp_path = f"./{filename}"
    try:
        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())
    
    # Get file size and duration
        size = round(os.path.getsize(temp_path)/1024)
        duration = get_audio_duration(temp_path)
    
    # Upload to Supabase Storage
        with open(temp_path, "rb") as f:
            supabase.storage.from_(BUCKET_NAME).upload(filename, f)
    ##return {"message": "File uploaded successfully", "user_id": user_id, "filename": filename}
    # Get public URL
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)

    # Insert metadata into Supabase DB
        created_at = datetime.datetime.utcnow().isoformat()
        supabase.table("audio").insert({
            "id": str(audio_id),
            "user_id": str(user_id_uuid),
            "created_at": created_at,
            "size": size,
            "duration": duration,
            "url": public_url
        }).execute()

    # Delete temp file
    

        return {
            "audio_id": audio_id,
            "url": public_url,
            "size": size,
            "duration": duration,
            "created_at": created_at
        }
    finally:
        # ✅ Always delete temp file — even if something fails
        if os.path.exists(temp_path):
            os.remove(temp_path)



@app.get("/audio")
def get_audio_files(user_id: str = Query(...)):
    response = supabase.table("audio").select("*").eq("user_id", user_id).execute()
    audio_rows = response.data

    # Base public URL for your bucket
    bucket_url = f"{SUPABASE_URL}/storage/v1/object/public/audio_files/"

    # Add full URL for frontend playback
    for row in audio_rows:
        if "audio_url" in row and not row["audio_url"].startswith("http"):
            row["audio_url"] = bucket_url + row["audio_url"]

    return audio_rows
@app.get("/user-stats/{user_id}")
async def get_user_stats(user_id: str):
    try:
        # Fetch all audio entries for this user from Supabase
        response = supabase.table("audio").select("text").eq("user_id", user_id).execute()
        data = response.data or []

        # Count total audio files
        audios_generated = len(data)

        # Sum total characters processed
        characters_processed = sum(len(item["text"]) for item in data if "text" in item)

        return {
            "audios_generated": audios_generated,
            "characters_processed": characters_processed
        }

    except Exception as e:
        print("Error fetching user stats:", e)
        return {
            "audios_generated": 0,
            "characters_processed": 0
        }

# ---- Request Model ----
class TextRequest(BaseModel):
    text: str
    user_id: str | None = None  # Make user_id optional


@app.post("/synthesize")
async def synthesize(request: TextRequest):
    text_with_numbers_converted = num_convert(request.text)
    print(f"Text after number conversion: {text_with_numbers_converted}")
    ph = convert_text(text_with_numbers_converted)

    print(f"Phonemized text: {ph}")

    wav = synthesizer.tts(ph)

    # Log the user ID
    user_id = request.user_id
    print(f"User ID: {user_id}")

    # Step 3: Save to a temporary file (for Supabase upload if user is logged in)
    audio_id = str(uuid.uuid4())
    filename = f"{audio_id}_sinh_tts.wav"
    temp_path = f"./{filename}"

    synthesizer.save_wav(wav, temp_path)

    # Only store in database if user is logged in and user_id is not null
    if user_id and user_id != "null":
        try:
            # Step 4: Upload to Supabase Storage
            with open(temp_path, "rb") as f:
                supabase.storage.from_(BUCKET_NAME).upload(filename, f)

            # Get public URL
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)

            # Step 5: Collect metadata
            size_kb = round(os.path.getsize(temp_path) / 1024, 2)
            duration = get_audio_duration(temp_path)
            created_at = datetime.datetime.utcnow().isoformat()

            # Step 6: Insert record into Supabase table
            supabase.table("audio").insert({
                "id": audio_id,
                "user_id": str(user_id),
                "created_at": created_at,
                "size": size_kb,
                "duration": duration,
                "url": public_url,
                "text": request.text
            }).execute()
        except Exception as e:
            print(f"Error saving to database: {e}")
            # Continue without saving to database

    # Step 7: Read audio bytes to return
    with open(temp_path, "rb") as f:
        audio_bytes = f.read()

    # Step 8: Delete temp file
    os.remove(temp_path)

    # Step 9: Return audio to frontend (for playback)
    headers = {"Content-Disposition": "inline; filename=synthesized.wav"}
    if user_id and user_id != "null":
        headers.update({
            "x-audio-id": audio_id,
            "x-public-url": public_url if user_id else ""
        })
    
    return Response(
        content=audio_bytes,
        media_type="audio/wav",
        headers=headers,
    )