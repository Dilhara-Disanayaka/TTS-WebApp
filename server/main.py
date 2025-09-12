from TTS.utils.synthesizer import Synthesizer
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
from fastapi.responses import Response

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

model_path = "sinhala.pth"
config_path = "config.json"

synthesizer = Synthesizer(
    tts_checkpoint=model_path,
    tts_config_path=config_path,
)

@app.post("/synthesize")
async def synthesize(request: TextRequest):
    wav = synthesizer.tts(request.text)

    audio_buffer = io.BytesIO()
    synthesizer.save_wav(wav, audio_buffer)
    audio_buffer.seek(0)

    return Response(
        content=audio_buffer.getvalue(),
        media_type="audio/wav",
        headers={"Content-Disposition": "inline; filename=synthesized.wav"},
    )