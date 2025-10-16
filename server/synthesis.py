from TTS.utils.synthesizer import Synthesizer

from g2p import convert_text
from num2sinhala import num_convert

tts_path = "server/models/dinithi2.pth"
tts_config_path = "server/models/dinithi2.json"
vocoder_path = "server/models/dinithi_vocoder.pth"
vocoder_config_path = "server/models/dinithi_vocoder.json"

synthesizer = Synthesizer(
    tts_checkpoint=tts_path,
    tts_config_path=tts_config_path,
    vocoder_checkpoint=vocoder_path,
    vocoder_config=vocoder_config_path,
)

def tts(text):
    text_with_numbers_converted = num_convert(text)
    print(f"Text after number conversion: {text_with_numbers_converted}")
    ph = convert_text(text_with_numbers_converted)

    print(f"Phonemized text: {ph}")

    wav = synthesizer.tts(ph)

    filename = f"sinh_tts.wav"
    temp_path = f"./{filename}"

    synthesizer.save_wav(wav, temp_path)

if __name__ == "__main__":
    tts("මගේ නම ජෙරී, මම ඔයාල හැමෝටම ගොඩක් ආදරෙයි.")