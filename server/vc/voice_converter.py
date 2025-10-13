"""
Voice Conversion Module
This module provides a simplified interface for voice conversion using Seed-VC model.
"""

import os
os.environ['HF_HUB_CACHE'] = 'server/vc/checkpoints/hf_cache'

import torch
import torchaudio
import librosa
import yaml
import numpy as np
from modules.commons import build_model, load_checkpoint, recursive_munch
from hf_utils import load_custom_model_from_hf
import soundfile as sf


class VoiceConverter:
    """
    A class to handle voice conversion using the Seed-VC model.
    """
    
    def __init__(self, checkpoint_path=None, config_path=None, device=None, fp16=True):
        """
        Initialize the Voice Converter.
        
        Args:
            checkpoint_path (str): Path to model checkpoint. If None, downloads from HuggingFace.
            config_path (str): Path to config file. If None, downloads from HuggingFace.
            device (torch.device): Device to run the model on.
            fp16 (bool): Whether to use fp16 precision.
        """
        self.fp16 = fp16
        
        # Set device
        if device is None:
            if torch.cuda.is_available():
                self.device = torch.device("cuda")
            elif torch.backends.mps.is_available():
                self.device = torch.device("mps")
            else:
                self.device = torch.device("cpu")
        else:
            self.device = device
            
        print(f"Using device: {self.device}")
        print(f"Using fp16: {self.fp16}")
        
        # Load model and configuration
        self._load_models(checkpoint_path, config_path)
        
    def _load_models(self, checkpoint_path, config_path):
        """Load all required models and configurations."""
        
        # Load checkpoint and config
        if checkpoint_path is None or checkpoint_path == "":
            dit_checkpoint_path, dit_config_path = load_custom_model_from_hf(
                "Plachta/Seed-VC",
                "DiT_seed_v2_uvit_whisper_small_wavenet_bigvgan_pruned.pth",
                "config_dit_mel_seed_uvit_whisper_small_wavenet.yml"
            )
        else:
            dit_checkpoint_path = checkpoint_path
            dit_config_path = config_path
            
        # Load config
        config = yaml.safe_load(open(dit_config_path, "r"))
        model_params = recursive_munch(config["model_params"])
        model_params.dit_type = 'DiT'
        
        # Build model
        model = build_model(model_params, stage="DiT")
        self.hop_length = config["preprocess_params"]["spect_params"]["hop_length"]
        self.sr = config["preprocess_params"]["sr"]
        
        # Load checkpoints
        model, _, _, _ = load_checkpoint(
            model,
            None,
            dit_checkpoint_path,
            load_only_params=True,
            ignore_modules=[],
            is_distributed=False,
        )
        
        for key in model:
            model[key].eval()
            model[key].to(self.device)
        model.cfm.estimator.setup_caches(max_batch_size=1, max_seq_length=8192)
        
        self.model = model
        
        # Load CAMPlus speaker encoder
        self._load_campplus()
        
        # Load vocoder
        self._load_vocoder(model_params, config)
        
        # Load speech tokenizer
        self._load_speech_tokenizer(model_params, config)
        
        # Setup mel spectrogram function
        self._setup_mel_fn(config)
        
        # Setup streaming parameters
        self.max_context_window = self.sr // self.hop_length * 30
        self.overlap_frame_len = 16
        self.overlap_wave_len = self.overlap_frame_len * self.hop_length
        
    def _load_campplus(self):
        """Load CAMPlus speaker encoder."""
        from DTDNN import CAMPPlus
        
        campplus_ckpt_path = load_custom_model_from_hf(
            "funasr/campplus", "campplus_cn_common.bin", config_filename=None
        )
        campplus_model = CAMPPlus(feat_dim=80, embedding_size=192)
        campplus_model.load_state_dict(torch.load(campplus_ckpt_path, map_location="cpu"))
        campplus_model.eval()
        campplus_model.to(self.device)
        
        self.campplus_model = campplus_model
        
    def _load_vocoder(self, model_params, config):
        """Load vocoder model."""
        vocoder_type = model_params.vocoder.type
        
        if vocoder_type == 'bigvgan':
            from modules.bigvgan import bigvgan
            bigvgan_name = model_params.vocoder.name
            bigvgan_model = bigvgan.BigVGAN.from_pretrained(bigvgan_name, use_cuda_kernel=False)
            bigvgan_model.remove_weight_norm()
            bigvgan_model = bigvgan_model.eval().to(self.device)
            self.vocoder_fn = bigvgan_model
        elif vocoder_type == 'hifigan':
            from modules.hifigan.generator import HiFTGenerator
            from modules.hifigan.f0_predictor import ConvRNNF0Predictor
            hift_config = yaml.safe_load(open('configs/hifigan.yml', 'r'))
            hift_gen = HiFTGenerator(**hift_config['hift'], f0_predictor=ConvRNNF0Predictor(**hift_config['f0_predictor']))
            hift_path = load_custom_model_from_hf("FunAudioLLM/CosyVoice-300M", 'hift.pt', None)
            hift_gen.load_state_dict(torch.load(hift_path, map_location='cpu'))
            hift_gen.eval()
            hift_gen.to(self.device)
            self.vocoder_fn = hift_gen
        elif vocoder_type == "vocos":
            vocos_config = yaml.safe_load(open(model_params.vocoder.vocos.config, 'r'))
            vocos_path = model_params.vocoder.vocos.path
            vocos_model_params = recursive_munch(vocos_config['model_params'])
            vocos = build_model(vocos_model_params, stage='mel_vocos')
            vocos_checkpoint_path = vocos_path
            vocos, _, _, _ = load_checkpoint(vocos, None, vocos_checkpoint_path,
                                             load_only_params=True, ignore_modules=[], is_distributed=False)
            _ = [vocos[key].eval().to(self.device) for key in vocos]
            _ = [vocos[key].to(self.device) for key in vocos]
            self.vocoder_fn = vocos.decoder
        else:
            raise ValueError(f"Unknown vocoder type: {vocoder_type}")
            
    def _load_speech_tokenizer(self, model_params, config):
        """Load speech tokenizer (Whisper/CNHubert/XLSR)."""
        speech_tokenizer_type = model_params.speech_tokenizer.type
        
        if speech_tokenizer_type == 'whisper':
            from transformers import AutoFeatureExtractor, WhisperModel
            whisper_name = model_params.speech_tokenizer.name
            whisper_model = WhisperModel.from_pretrained(whisper_name, torch_dtype=torch.float16).to(self.device)
            del whisper_model.decoder
            whisper_feature_extractor = AutoFeatureExtractor.from_pretrained(whisper_name)
            
            def semantic_fn(waves_16k):
                ori_inputs = whisper_feature_extractor([waves_16k.squeeze(0).cpu().numpy()],
                                                       return_tensors="pt",
                                                       return_attention_mask=True)
                ori_input_features = whisper_model._mask_input_features(
                    ori_inputs.input_features, attention_mask=ori_inputs.attention_mask).to(self.device)
                with torch.no_grad():
                    ori_outputs = whisper_model.encoder(
                        ori_input_features.to(whisper_model.encoder.dtype),
                        head_mask=None,
                        output_attentions=False,
                        output_hidden_states=False,
                        return_dict=True,
                    )
                S_ori = ori_outputs.last_hidden_state.to(torch.float32)
                S_ori = S_ori[:, :waves_16k.size(-1) // 320 + 1]
                return S_ori
                
            self.semantic_fn = semantic_fn
            
        elif speech_tokenizer_type == 'cnhubert':
            from transformers import Wav2Vec2FeatureExtractor, HubertModel
            hubert_model_name = config['model_params']['speech_tokenizer']['name']
            hubert_feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(hubert_model_name)
            hubert_model = HubertModel.from_pretrained(hubert_model_name)
            hubert_model = hubert_model.to(self.device)
            hubert_model = hubert_model.eval()
            hubert_model = hubert_model.half()
            
            def semantic_fn(waves_16k):
                ori_waves_16k_input_list = [
                    waves_16k[bib].cpu().numpy()
                    for bib in range(len(waves_16k))
                ]
                ori_inputs = hubert_feature_extractor(ori_waves_16k_input_list,
                                                      return_tensors="pt",
                                                      return_attention_mask=True,
                                                      padding=True,
                                                      sampling_rate=16000).to(self.device)
                with torch.no_grad():
                    ori_outputs = hubert_model(
                        ori_inputs.input_values.half(),
                    )
                S_ori = ori_outputs.last_hidden_state.float()
                return S_ori
                
            self.semantic_fn = semantic_fn
            
        elif speech_tokenizer_type == 'xlsr':
            from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2Model
            model_name = config['model_params']['speech_tokenizer']['name']
            output_layer = config['model_params']['speech_tokenizer']['output_layer']
            wav2vec_feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)
            wav2vec_model = Wav2Vec2Model.from_pretrained(model_name)
            wav2vec_model.encoder.layers = wav2vec_model.encoder.layers[:output_layer]
            wav2vec_model = wav2vec_model.to(self.device)
            wav2vec_model = wav2vec_model.eval()
            wav2vec_model = wav2vec_model.half()
            
            def semantic_fn(waves_16k):
                ori_waves_16k_input_list = [
                    waves_16k[bib].cpu().numpy()
                    for bib in range(len(waves_16k))
                ]
                ori_inputs = wav2vec_feature_extractor(ori_waves_16k_input_list,
                                                       return_tensors="pt",
                                                       return_attention_mark=True,
                                                       padding=True,
                                                       sampling_rate=16000).to(self.device)
                with torch.no_grad():
                    ori_outputs = wav2vec_model(
                        ori_inputs.input_values.half(),
                    )
                S_ori = ori_outputs.last_hidden_state.float()
                return S_ori
                
            self.semantic_fn = semantic_fn
        else:
            raise ValueError(f"Unknown speech tokenizer type: {speech_tokenizer_type}")
            
    def _setup_mel_fn(self, config):
        """Setup mel spectrogram function."""
        from modules.audio import mel_spectrogram
        
        mel_fn_args = {
            "n_fft": config['preprocess_params']['spect_params']['n_fft'],
            "win_size": config['preprocess_params']['spect_params']['win_length'],
            "hop_size": config['preprocess_params']['spect_params']['hop_length'],
            "num_mels": config['preprocess_params']['spect_params']['n_mels'],
            "sampling_rate": self.sr,
            "fmin": config['preprocess_params']['spect_params'].get('fmin', 0),
            "fmax": None if config['preprocess_params']['spect_params'].get('fmax', "None") == "None" else 8000,
            "center": False
        }
        
        self.to_mel = lambda x: mel_spectrogram(x, **mel_fn_args)
        
    @staticmethod
    def _crossfade(chunk1, chunk2, overlap):
        """Apply crossfade between two audio chunks."""
        fade_out = np.cos(np.linspace(0, np.pi / 2, overlap)) ** 2
        fade_in = np.cos(np.linspace(np.pi / 2, 0, overlap)) ** 2
        chunk2[:overlap] = chunk2[:overlap] * fade_in + chunk1[-overlap:] * fade_out
        return chunk2
        
    @torch.no_grad()
    @torch.inference_mode()
    def convert_voice(self, source_audio_path, target_audio_path, diffusion_steps=10, 
                     length_adjust=1.0, inference_cfg_rate=0.7):
        """
        Convert source audio to match target voice.
        
        Args:
            source_audio_path (str): Path to source audio file
            target_audio_path (str): Path to target/reference audio file
            diffusion_steps (int): Number of diffusion steps (default: 10, 50-100 for best quality)
            length_adjust (float): Length adjustment factor (<1.0 speeds up, >1.0 slows down)
            inference_cfg_rate (float): Inference CFG rate (default: 0.7)
            
        Returns:
            tuple: (sample_rate, audio_array) - Generated audio as numpy array
        """
        # Load audio files
        source_audio = librosa.load(source_audio_path, sr=self.sr)[0]
        ref_audio = librosa.load(target_audio_path, sr=self.sr)[0]
        
        # Process audio
        source_audio = torch.tensor(source_audio).unsqueeze(0).float().to(self.device)
        ref_audio = torch.tensor(ref_audio[:self.sr * 25]).unsqueeze(0).float().to(self.device)
        
        # Resample to 16kHz for feature extraction
        ref_waves_16k = torchaudio.functional.resample(ref_audio, self.sr, 16000)
        converted_waves_16k = torchaudio.functional.resample(source_audio, self.sr, 16000)
        
        # Extract semantic features from source audio
        if converted_waves_16k.size(-1) <= 16000 * 30:
            S_alt = self.semantic_fn(converted_waves_16k)
        else:
            # Process long audio in chunks
            overlapping_time = 5  # 5 seconds
            S_alt_list = []
            buffer = None
            traversed_time = 0
            while traversed_time < converted_waves_16k.size(-1):
                if buffer is None:  # first chunk
                    chunk = converted_waves_16k[:, traversed_time:traversed_time + 16000 * 30]
                else:
                    chunk = torch.cat([buffer, converted_waves_16k[:, traversed_time:traversed_time + 16000 * (30 - overlapping_time)]], dim=-1)
                S_alt = self.semantic_fn(chunk)
                if traversed_time == 0:
                    S_alt_list.append(S_alt)
                else:
                    S_alt_list.append(S_alt[:, 50 * overlapping_time:])
                buffer = chunk[:, -16000 * overlapping_time:]
                traversed_time += 30 * 16000 if traversed_time == 0 else chunk.size(-1) - 16000 * overlapping_time
            S_alt = torch.cat(S_alt_list, dim=1)
        
        # Extract semantic features from reference audio
        S_ori = self.semantic_fn(ref_waves_16k)
        
        # Generate mel spectrograms
        mel = self.to_mel(source_audio.to(self.device).float())
        mel2 = self.to_mel(ref_audio.to(self.device).float())
        
        # Calculate target lengths
        target_lengths = torch.LongTensor([int(mel.size(2) * length_adjust)]).to(mel.device)
        target2_lengths = torch.LongTensor([mel2.size(2)]).to(mel2.device)
        
        # Extract speaker embedding from reference
        feat2 = torchaudio.compliance.kaldi.fbank(ref_waves_16k,
                                                  num_mel_bins=80,
                                                  dither=0,
                                                  sample_frequency=16000)
        feat2 = feat2 - feat2.mean(dim=0, keepdim=True)
        style2 = self.campplus_model(feat2.unsqueeze(0))
        
        # Length regulation
        cond, _, codes, commitment_loss, codebook_loss = self.model.length_regulator(
            S_alt, ylens=target_lengths, n_quantizers=3, f0=None)
        prompt_condition, _, codes, commitment_loss, codebook_loss = self.model.length_regulator(
            S_ori, ylens=target2_lengths, n_quantizers=3, f0=None)
        
        # Process in chunks
        max_source_window = self.max_context_window - mel2.size(2)
        processed_frames = 0
        generated_wave_chunks = []
        
        while processed_frames < cond.size(1):
            chunk_cond = cond[:, processed_frames:processed_frames + max_source_window]
            is_last_chunk = processed_frames + max_source_window >= cond.size(1)
            cat_condition = torch.cat([prompt_condition, chunk_cond], dim=1)
            
            with torch.autocast(device_type=self.device.type, dtype=torch.float16 if self.fp16 else torch.float32):
                # Voice Conversion
                vc_target = self.model.cfm.inference(cat_condition,
                                                     torch.LongTensor([cat_condition.size(1)]).to(mel2.device),
                                                     mel2, style2, None, diffusion_steps,
                                                     inference_cfg_rate=inference_cfg_rate)
                vc_target = vc_target[:, :, mel2.size(-1):]
                
            vc_wave = self.vocoder_fn(vc_target.float())[0]
            if vc_wave.ndim == 1:
                vc_wave = vc_wave.unsqueeze(0)
                
            if processed_frames == 0:
                if is_last_chunk:
                    output_wave = vc_wave[0].cpu().numpy()
                    generated_wave_chunks.append(output_wave)
                    break
                output_wave = vc_wave[0, :-self.overlap_wave_len].cpu().numpy()
                generated_wave_chunks.append(output_wave)
                previous_chunk = vc_wave[0, -self.overlap_wave_len:]
                processed_frames += chunk_cond.size(1) - self.overlap_frame_len
            elif is_last_chunk:
                output_wave = self._crossfade(previous_chunk.cpu().numpy(), vc_wave[0].cpu().numpy(), self.overlap_wave_len)
                generated_wave_chunks.append(output_wave)
                processed_frames += chunk_cond.size(1) - self.overlap_frame_len
                break
            else:
                output_wave = self._crossfade(previous_chunk.cpu().numpy(), vc_wave[0, :-self.overlap_wave_len].cpu().numpy(), self.overlap_wave_len)
                generated_wave_chunks.append(output_wave)
                previous_chunk = vc_wave[0, -self.overlap_wave_len:]
                processed_frames += chunk_cond.size(1) - self.overlap_frame_len
        
        # Concatenate all chunks
        final_wave = np.concatenate(generated_wave_chunks)
        
        return self.sr, final_wave


def generate_voice_conversion(source_audio_path, target_audio_path, 
                              checkpoint_path=None, config_path=None,
                              diffusion_steps=10, length_adjust=1.0, 
                              inference_cfg_rate=0.7, device=None, fp16=True):
    """
    High-level function to perform voice conversion.
    
    Args:
        source_audio_path (str): Path to source audio file
        target_audio_path (str): Path to target/reference audio file
        checkpoint_path (str, optional): Path to model checkpoint
        config_path (str, optional): Path to config file
        diffusion_steps (int): Number of diffusion steps (default: 10)
        length_adjust (float): Length adjustment factor (default: 1.0)
        inference_cfg_rate (float): Inference CFG rate (default: 0.7)
        device (torch.device, optional): Device to run on
        fp16 (bool): Whether to use fp16 precision (default: True)
        
    Returns:
        tuple: (sample_rate, audio_array) - Generated audio
        
    Example:
        >>> sr, audio = generate_voice_conversion(
        ...     "source.wav", 
        ...     "target.wav",
        ...     diffusion_steps=50
        ... )
        >>> # Save output
        >>> import soundfile as sf
        >>> sf.write("output.wav", audio, sr)
    """
    converter = VoiceConverter(checkpoint_path, config_path, device, fp16)
    return converter.convert_voice(source_audio_path, target_audio_path, 
                                   diffusion_steps, length_adjust, inference_cfg_rate)


if __name__ == "__main__":
   sr,audio = generate_voice_conversion(source_audio_path="server/target.mp3", target_audio_path="server/source.mp3",checkpoint_path="server/vc/checkpoints/Indic-seed-uvit-whisper-small-wavenet.pth",config_path="server/vc/checkpoints/config_dit_mel_seed_uvit_whisper_small_wavenet.yml")

   sf.write("converted_output2.wav", audio, sr)