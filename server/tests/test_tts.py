import pytest
from unittest.mock import patch, Mock
from fastapi.testclient import TestClient
from main import app


@pytest.mark.unit
class TestTTSSynthesis:
    """Test Text-to-Speech synthesis endpoint"""
    
    def setup_method(self):
        self.client = TestClient(app)
    
    @patch('main.convert_text')
    @patch('main.synthesizer')
    def test_synthesize_success(self, mock_synthesizer, mock_convert_text):
        """Test successful text synthesis"""
        # Setup mocks
        mock_convert_text.return_value = "phonemized_text"
        mock_synthesizer.tts.return_value = b"fake_audio_data"
        mock_synthesizer.save_wav = Mock()
        
        # Make request
        response = self.client.post(
            "/synthesize",
            json={"text": "Hello world"}
        )
        
        # Assertions
        assert response.status_code == 200
        assert response.headers["content-type"] == "audio/wav"
        assert "Content-Disposition" in response.headers
        assert "synthesized.wav" in response.headers["Content-Disposition"]
        
        # Verify mocks were called
        mock_convert_text.assert_called_once_with("Hello world")
        mock_synthesizer.tts.assert_called_once_with("phonemized_text")
    
    def test_synthesize_empty_text(self):
        """Test synthesis with empty text"""
        response = self.client.post(
            "/synthesize",
            json={"text": ""}
        )
        # Should still work, but might produce minimal audio
        assert response.status_code in [200, 400]  # Depending on implementation
    
    def test_synthesize_missing_text_field(self):
        """Test synthesis with missing text field"""
        response = self.client.post(
            "/synthesize",
            json={}
        )
        assert response.status_code == 422  # Validation error
    
    def test_synthesize_invalid_json(self):
        """Test synthesis with invalid JSON"""
        response = self.client.post(
            "/synthesize",
            data="invalid json"
        )
        assert response.status_code == 422
    
    @patch('main.convert_text')
    @patch('main.synthesizer')
    def test_synthesize_with_sinhala_text(self, mock_synthesizer, mock_convert_text):
        """Test synthesis with Sinhala text"""
        mock_convert_text.return_value = "sinhala_phonemes"
        mock_synthesizer.tts.return_value = b"sinhala_audio_data"
        mock_synthesizer.save_wav = Mock()
        
        response = self.client.post(
            "/synthesize",
            json={"text": "සුභ දවසක්"}
        )
        
        assert response.status_code == 200
        mock_convert_text.assert_called_once_with("සුභ දවසක්")
        mock_synthesizer.tts.assert_called_once_with("sinhala_phonemes")
    
    @patch('main.convert_text')
    @patch('main.synthesizer')
    def test_synthesize_error_handling(self, mock_synthesizer, mock_convert_text):
        """Test error handling in synthesis"""
        mock_convert_text.side_effect = Exception("G2P conversion failed")
        
        # The actual implementation doesn't have try-catch, so exception propagates
        try:
            response = self.client.post(
                "/synthesize",
                json={"text": "test text"}
            )
            # If we get here without exception, the test setup is wrong
            assert False, "Expected an exception but didn't get one"
        except Exception as e:
            # The exception should propagate from the G2P conversion
            assert "G2P conversion failed" in str(e)