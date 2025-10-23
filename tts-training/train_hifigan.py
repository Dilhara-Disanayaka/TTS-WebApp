import os
from trainer import Trainer, TrainerArgs

from TTS.utils.audio import AudioProcessor
from TTS.vocoder.configs import hifigan_config
from TTS.vocoder.datasets.preprocess import load_wav_data
from TTS.vocoder.models.gan import GAN
from TTS.config.shared_configs import BaseAudioConfig

output_path = "Enter the path to your HiFi-GAN output directory here"

config = hifigan_config.HifiganConfig()
config.load_json("Enter the path to your HiFi-GAN config.json here")

ap = AudioProcessor(**config.audio)
eval_samples, train_samples = load_wav_data(config.data_path, config.eval_split_size)

model = GAN(config,ap)

trainer = Trainer(
    TrainerArgs(
        continue_path="Enter the path to your previous HiFi-GAN checkpoint here",
        gpu=0,
    ),
    config=config,
    output_path=output_path,
    model=model,
    train_samples=train_samples,
    eval_samples=eval_samples,
)


print(f"Model has {sum(p.numel() for p in model.parameters())} parameters")

if __name__ == "__main__":
    print("Starting HiFi-GAN training for Sinhala...")
    trainer.fit()