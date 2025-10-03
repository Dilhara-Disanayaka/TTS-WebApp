
from TTS.utils.synthesizer import Synthesizer
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
from fastapi.responses import Response
from g2p import convert_text

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    ph = convert_text(request.text)

    print(f"Phonemized text: {ph}")

    wav = synthesizer.tts(ph)

    audio_buffer = io.BytesIO()
    synthesizer.save_wav(wav, audio_buffer)
    audio_buffer.seek(0)

    return Response(
        content=audio_buffer.getvalue(),
        media_type="audio/wav",
        headers={"Content-Disposition": "inline; filename=synthesized.wav"},
    )