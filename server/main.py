
from TTS.utils.synthesizer import Synthesizer
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
from fastapi.responses import Response
from phonemizer import phonemize
from phonemizer.backend.espeak.wrapper import EspeakWrapper

# For Windows users, specify the path to the eSpeak NG DLL if needed
# EspeakWrapper.set_library('C:\\Program Files\\eSpeak NG\\libespeak-ng.dll')

# For macOS users, specify the path to the eSpeak library if needed
EspeakWrapper.set_library('/opt/homebrew/Cellar/espeak-ng/1.52.0/lib/libespeak-ng.1.dylib')

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

model_path = "tacotron2.pth"
config_path = "tacotron2.json"

synthesizer = Synthesizer(
    tts_checkpoint=model_path,
    tts_config_path=config_path,
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
    )

