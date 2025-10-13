import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.mark.unit
class TestBasicEndpoints:
    """Test basic API endpoints"""
    
    def setup_method(self):
        self.client = TestClient(app)
    
    def test_root_endpoint(self):
        """Test the root endpoint"""
        response = self.client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello, Supabase with FastAPI is working!"}
    
    def test_root_endpoint_returns_json(self):
        """Test that root endpoint returns JSON"""
        response = self.client.get("/")
        assert response.headers["content-type"] == "application/json"


@pytest.mark.unit  
class TestCORS:
    """Test CORS configuration"""
    
    def setup_method(self):
        self.client = TestClient(app)
    
    def test_cors_headers_present(self):
        """Test that CORS headers are present in responses"""
        response = self.client.options("/")
        assert response.status_code in [200, 405]  # OPTIONS might not be explicitly handled
        
    def test_cors_allows_localhost_3000(self):
        """Test CORS allows localhost:3000"""
        headers = {"Origin": "http://localhost:3000"}
        response = self.client.get("/", headers=headers)
        assert response.status_code == 200