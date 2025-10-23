import pytest
import os
import tempfile
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, MagicMock
import sys
from unittest.mock import MagicMock

# Mock TTS module
sys.modules['TTS'] = MagicMock()
sys.modules['TTS.utils'] = MagicMock()
sys.modules['TTS.utils.synthesizer'] = MagicMock()
sys.modules['phonemizer'] = MagicMock()
sys.modules['phonemizer.backend'] = MagicMock()
sys.modules['supabase'] = MagicMock()
sys.modules['mutagen'] = MagicMock()
sys.modules['mutagen.mp3'] = MagicMock()
sys.modules['mutagen.wave'] = MagicMock()

from main import app


@pytest.fixture
def client():
    """FastAPI test client fixture"""
    return TestClient(app)


@pytest.fixture
def mock_supabase():
    """Mock Supabase client"""
    with patch('main.supabase') as mock_sb:
        mock_sb.auth.sign_up.return_value = Mock(user=Mock(id="test-user-id"))
        mock_sb.auth.sign_in_with_password.return_value = Mock(
            session=Mock(
                access_token="test-access-token",
                refresh_token="test-refresh-token"
            )
        )
        mock_sb.auth.sign_in_with_oauth.return_value = Mock(
            url="https://test-oauth-url.com"
        )
        mock_sb.storage.from_.return_value.upload.return_value = True
        mock_sb.storage.from_.return_value.get_public_url.return_value = "https://test-url.com/file"
        mock_sb.table.return_value.insert.return_value.execute.return_value = True
        yield mock_sb


@pytest.fixture
def mock_synthesizer():
    """Mock TTS synthesizer"""
    with patch('main.synthesizer') as mock_synth:
        mock_synth.tts.return_value = b"fake_audio_data"
        mock_synth.save_wav = Mock()
        yield mock_synth


@pytest.fixture
def mock_convert_text():
    """Mock g2p convert_text function"""
    with patch('main.convert_text') as mock_convert:
        mock_convert.return_value = "fake phonemized text"
        yield mock_convert


@pytest.fixture
def sample_audio_file():
    """Create a temporary audio file for testing"""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        # Write minimal WAV header
        f.write(b'RIFF')
        f.write(b'\x24\x00\x00\x00')  # file size
        f.write(b'WAVE')
        f.write(b'fmt ')
        f.write(b'\x10\x00\x00\x00')  # fmt chunk size
        f.write(b'\x01\x00')  # audio format (PCM)
        f.write(b'\x01\x00')  # num channels
        f.write(b'\x44\xac\x00\x00')  # sample rate (44100)
        f.write(b'\x88\x58\x01\x00')  # byte rate
        f.write(b'\x02\x00')  # block align
        f.write(b'\x10\x00')  # bits per sample
        f.write(b'data')
        f.write(b'\x00\x00\x00\x00')  # data size
        yield f.name
    os.unlink(f.name)


@pytest.fixture
def mock_audio_duration():
    """Mock audio duration functions"""
    with patch('main.get_audio_duration') as mock_duration:
        mock_duration.return_value = 5.25  # 5.25 seconds
        yield mock_duration


@pytest.fixture
def test_env_vars():
    """Set up test environment variables"""
    test_vars = {
        "SUPABASE_URL": "https://test-supabase-url.com",
        "SUPABASE_SERVICE_ROLE_KEY": "test-service-role-key"
    }
    
    original_values = {}
    for key, value in test_vars.items():
        original_values[key] = os.environ.get(key)
        os.environ[key] = value
    
    yield test_vars
    
    # Restore original values
    for key, original_value in original_values.items():
        if original_value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = original_value