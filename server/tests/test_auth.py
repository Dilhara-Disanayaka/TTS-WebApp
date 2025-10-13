import pytest
from unittest.mock import patch, Mock
from fastapi.testclient import TestClient
from main import app
from fastapi import HTTPException


@pytest.mark.unit
class TestAuthentication:
    """Test authentication endpoints"""
    
    def setup_method(self):
        self.client = TestClient(app)
    
    @patch('main.supabase')
    def test_signup_success(self, mock_supabase):
        """Test successful user signup"""
        # Setup mock
        mock_supabase.auth.sign_up.return_value = Mock(user=Mock(id="test-user-id"))
        
        response = self.client.post(
            "/signup",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 200
        assert "Signup successful" in response.json()["message"]
        mock_supabase.auth.sign_up.assert_called_once_with({
            "email": "test@example.com",
            "password": "testpassword123"
        })
    
    @patch('main.supabase')
    def test_signup_failure(self, mock_supabase):
        """Test failed user signup"""
        mock_supabase.auth.sign_up.return_value = Mock(user=None)
        
        response = self.client.post(
            "/signup",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 400
        assert "Signup failed" in response.json()["detail"]
    
    @patch('main.supabase')
    def test_signup_exception(self, mock_supabase):
        """Test signup with exception"""
        mock_supabase.auth.sign_up.side_effect = Exception("Database error")
        
        response = self.client.post(
            "/signup",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 400
        assert "Database error" in response.json()["detail"]
    
    @patch('main.supabase')
    def test_signup_invalid_email(self, mock_supabase):
        """Test signup with invalid email format"""
        # The actual implementation doesn't validate email format - it passes to Supabase
        mock_supabase.auth.sign_up.return_value = Mock(user=Mock(id="test-user-id"))
        
        response = self.client.post(
            "/signup",
            json={
                "email": "invalid-email",
                "password": "testpassword123"
            }
        )
        
        # FastAPI doesn't validate email format by default, so this succeeds
        assert response.status_code == 200
    
    def test_signup_missing_fields(self):
        """Test signup with missing fields"""
        response = self.client.post(
            "/signup",
            json={"email": "test@example.com"}
        )
        
        assert response.status_code == 422
    
    @patch('main.supabase')
    def test_login_success(self, mock_supabase):
        """Test successful user login"""
        mock_supabase.auth.sign_in_with_password.return_value = Mock(
            session=Mock(
                access_token="test-access-token",
                refresh_token="test-refresh-token"
            )
        )
        
        response = self.client.post(
            "/login",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 200
        json_response = response.json()
        assert json_response["access_token"] == "test-access-token"
        assert json_response["refresh_token"] == "test-refresh-token"
    
    @patch('main.supabase')
    def test_login_invalid_credentials(self, mock_supabase):
        """Test login with invalid credentials"""
        mock_supabase.auth.sign_in_with_password.return_value = Mock(session=None)
        
        response = self.client.post(
            "/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword"
            }
        )
        
        # The actual implementation returns 400 for this case, not 401
        assert response.status_code == 400
        assert "Invalid credentials" in response.json()["detail"]
    
    @patch('main.supabase')
    def test_login_exception(self, mock_supabase):
        """Test login with exception"""
        mock_supabase.auth.sign_in_with_password.side_effect = Exception("Auth service down")
        
        response = self.client.post(
            "/login",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 400
        assert "Auth service down" in response.json()["detail"]
    
    @patch('main.supabase')
    def test_google_auth_success(self, mock_supabase):
        """Test Google OAuth URL generation"""
        mock_supabase.auth.sign_in_with_oauth.return_value = Mock(
            url="https://supabase.auth.google.com/oauth?redirect=..."
        )
        
        response = self.client.get("/auth/google")
        
        assert response.status_code == 200
        assert "auth_url" in response.json()
        assert "google.com" in response.json()["auth_url"]
    
    @patch('main.supabase')
    def test_google_auth_failure(self, mock_supabase):
        """Test Google OAuth failure"""
        mock_supabase.auth.sign_in_with_oauth.side_effect = Exception("OAuth error")
        
        response = self.client.get("/auth/google")
        
        assert response.status_code == 400
        assert "OAuth error" in response.json()["detail"]
    
    def test_auth_callback(self):
        """Test OAuth callback endpoint"""
        response = self.client.get("/auth/callback")
        
        assert response.status_code == 200
        assert "OAuth callback received" in response.json()["message"]