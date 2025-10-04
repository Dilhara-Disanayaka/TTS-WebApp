
import os
import traceback
##from TTS.utils.synthesizer import Synthesizer
from fastapi import FastAPI,UploadFile,Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
from fastapi.responses import JSONResponse, Response
from phonemizer import phonemize
from phonemizer.backend.espeak.wrapper import EspeakWrapper
from dotenv import load_dotenv
from supabase import  create_client,Client
from fastapi import HTTPException, Request
import uuid
from mutagen.mp3 import MP3
from mutagen.wave import WAVE
import datetime
##from mutagen.mp3 import MP3
##from mutagen.wave import WAVE
# For Windows users, specify the path to the eSpeak NG DLL if needed
# EspeakWrapper.set_library('C:\\Program Files\\eSpeak NG\\libespeak-ng.dll')

# For macOS users, specify the path to the eSpeak library if needed
EspeakWrapper.set_library('/opt/homebrew/Cellar/espeak-ng/1.52.0/lib/libespeak-ng.1.dylib')
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
'''
class TextRequest(BaseModel):
    text: str

tts_path = "tacotron2.pth"
tts_config_path = "tacotron2.json"
vocoder_path = "hifigan.pth"
vocoder_config_path = "hifigan.json"

synthesizer = Synthesizer(
    tts_checkpoint=tts_path,
    tts_config_path=tts_config_path,
    vocoder_checkpoint=vocoder_path,
    vocoder_config=vocoder_config_path,
)


@app.post("/synthesize")
async def synthesize(request: TextRequest):

    ph = phonemize(request.text, language='si', strip=True, preserve_punctuation=True,punctuation_marks=';:,.!?¡¿—…"«»“”‘’\'"()[]{}=+-*/\\')

    wav = synthesizer.tts(ph)

    audio_buffer = io.BytesIO()
    synthesizer.save_wav(wav, audio_buffer)
    audio_buffer.seek(0)

    return Response(
       content=audio_buffer.getvalue(),
        media_type="audio/wav",
        headers={"Content-Disposition": "inline; filename=synthesized.wav"},
   )'''
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
                "options": {"redirect_to": "http://localhost:3000/Home"},
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
    user_id=uuid.UUID(user_id)
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
            "user_id": str(user_id),
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
'''

@app.post("/upload-audio/")
async def upload_audio(
    file: UploadFile,
    user_id: str = Form(...)
):
    
    audio_id = str(uuid.uuid4())
    filename = f"{audio_id}_{file.filename}"

    temp_path = f"./{filename}"

    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())

    return {"message": "File received successfully", "user_id": user_id, "filename": filename}
@app.middleware("http")
async def log_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        print("❌ ERROR in request:", request.url)
        print("❌ Exception:", str(e))
        traceback.print_exc()
        raise e 
        '''