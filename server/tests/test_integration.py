import pytest
from unittest.mock import patch, Mock
from fastapi.testclient import TestClient
from main import app


@pytest.mark.integration
class TestIntegrationFlow:
    """Integration tests for complete user flows"""
    
    def setup_method(self):
        self.client = TestClient(app)
    
    @patch('main.supabase')
    @patch('main.convert_text')
    @patch('main.synthesizer')
    def test_complete_tts_flow(self, mock_synthesizer, mock_convert_text, mock_supabase):
        """Test complete TTS flow from text to audio"""
        # Setup mocks
        mock_convert_text.return_value = "phonemized_text"
        mock_synthesizer.tts.return_value = b"fake_audio_data"
        
        # Mock save_wav to actually write data to the buffer
        def mock_save_wav(wav_data, buffer):
            buffer.write(b"fake_audio_content")
        mock_synthesizer.save_wav.side_effect = mock_save_wav
        
        # Test text synthesis
        response = self.client.post(
            "/synthesize",
            json={"text": "සුභ දවසක්"}
        )
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "audio/wav"
        assert len(response.content) > 0
    
    @patch('main.supabase')
    def test_complete_auth_flow(self, mock_supabase):
        """Test complete authentication flow"""
        # Setup mocks for signup
        mock_supabase.auth.sign_up.return_value = Mock(user=Mock(id="test-user-id"))
        
        # Test signup
        signup_response = self.client.post(
            "/signup",
            json={
                "email": "integration@test.com",
                "password": "testpass123"
            }
        )
        assert signup_response.status_code == 200
        
        # Setup mocks for login
        mock_supabase.auth.sign_in_with_password.return_value = Mock(
            session=Mock(
                access_token="test-token",
                refresh_token="test-refresh"
            )
        )
        
        # Test login
        login_response = self.client.post(
            "/login",
            json={
                "email": "integration@test.com",
                "password": "testpass123"
            }
        )
        assert login_response.status_code == 200
        assert "access_token" in login_response.json()
    
    @patch('main.supabase')
    @patch('main.get_audio_duration')
    @patch('os.path.getsize')
    def test_audio_upload_integration(self, mock_getsize, mock_duration, mock_supabase):
        """Test audio upload integration"""
        # Setup mocks
        mock_getsize.return_value = 5120
        mock_duration.return_value = 10.5
        mock_supabase.storage.from_.return_value.upload.return_value = True
        mock_supabase.storage.from_.return_value.get_public_url.return_value = "https://test-url.com/audio.wav"
        mock_supabase.table.return_value.insert.return_value.execute.return_value = True
        
        # Create fake audio file
        import io
        audio_content = b"RIFF" + b"\x00" * 40 + b"WAVE" + b"\x00" * 100
        
        with patch('builtins.open'):
            response = self.client.post(
                "/upload-audio",
                files={"file": ("test.wav", io.BytesIO(audio_content), "audio/wav")},
                data={"user_id": "550e8400-e29b-41d4-a716-446655440000"}
            )
        
        assert response.status_code == 200
        json_response = response.json()
        assert "audio_id" in json_response
        assert "url" in json_response
        assert "duration" in json_response


@pytest.mark.integration
@pytest.mark.slow
class TestPerformanceIntegration:
    """Performance and load integration tests"""
    
    def setup_method(self):
        self.client = TestClient(app)
    
    def test_multiple_requests_performance(self):
        """Test handling multiple concurrent requests"""
        responses = []
        
        # Test multiple root endpoint calls
        for i in range(10):
            response = self.client.get("/")
            responses.append(response)
        
        # All should succeed
        for response in responses:
            assert response.status_code == 200
    
    @patch('main.convert_text')
    @patch('main.synthesizer')
    def test_tts_performance(self, mock_synthesizer, mock_convert_text):
        """Test TTS endpoint performance with longer text"""
        mock_convert_text.return_value = "long_phonemized_text" * 10
        mock_synthesizer.tts.return_value = b"fake_audio_data" * 1000
        
        # Mock save_wav to actually write data to the buffer
        def mock_save_wav(wav_data, buffer):
            buffer.write(b"large_fake_audio_content" * 100)
        mock_synthesizer.save_wav.side_effect = mock_save_wav
        
        long_text = "මෙය දිගු පාඨ කොටසකි. " * 20
        
        response = self.client.post(
            "/synthesize",
            json={"text": long_text}
        )
        
        assert response.status_code == 200
        assert len(response.content) > 0