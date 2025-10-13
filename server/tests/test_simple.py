import pytest
import sys
from unittest.mock import MagicMock

# Mock dependencies before importing main
sys.modules['TTS'] = MagicMock()
sys.modules['TTS.utils'] = MagicMock()
sys.modules['TTS.utils.synthesizer'] = MagicMock()
sys.modules['phonemizer'] = MagicMock()
sys.modules['phonemizer.backend'] = MagicMock()
sys.modules['phonemizer.backend.espeak'] = MagicMock()
sys.modules['phonemizer.backend.espeak.wrapper'] = MagicMock()
sys.modules['supabase'] = MagicMock()
sys.modules['mutagen'] = MagicMock()
sys.modules['mutagen.mp3'] = MagicMock()
sys.modules['mutagen.wave'] = MagicMock()
sys.modules['g2p'] = MagicMock()

from fastapi.testclient import TestClient


def test_import_main():
    """Test that we can import the main module"""
    try:
        from main import app
        assert app is not None
        print("✅ Successfully imported main module")
    except Exception as e:
        pytest.fail(f"Failed to import main module: {e}")


def test_fastapi_app_creation():
    """Test that FastAPI app is created successfully"""
    from main import app
    assert app is not None
    assert hasattr(app, 'get')
    assert hasattr(app, 'post')
    print("✅ FastAPI app created successfully")


def test_basic_client_creation():
    """Test that we can create a test client"""
    from main import app
    client = TestClient(app)
    assert client is not None
    print("✅ Test client created successfully")


def test_root_endpoint_exists():
    """Test that the root endpoint responds"""
    from main import app
    client = TestClient(app)
    
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Hello" in data["message"]
    print("✅ Root endpoint working correctly")


if __name__ == "__main__":
    test_import_main()
    test_fastapi_app_creation()
    test_basic_client_creation()
    test_root_endpoint_exists()
    print("🎉 All basic tests passed!")