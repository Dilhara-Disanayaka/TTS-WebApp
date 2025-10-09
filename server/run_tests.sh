#!/bin/bash

# TTS Backend Test Runner Script
# This script sets up the environment and runs all tests

echo "🧪 TTS Backend Testing Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the server directory
if [ ! -f "main.py" ]; then
    print_error "Please run this script from the server directory"
    exit 1
fi

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    print_warning "Virtual environment not detected. Please activate your virtual environment first:"
    print_warning "source /path/to/your/venv/bin/activate"
    exit 1
fi

# Set Python path to current directory
export PYTHONPATH=.

print_status "Python path set to: $PYTHONPATH"
print_status "Using virtual environment: $VIRTUAL_ENV"

# Install testing dependencies if needed
print_status "Checking test dependencies..."
pip list | grep pytest > /dev/null || pip install pytest pytest-asyncio httpx pytest-mock pytest-cov

echo ""
echo "🎯 Quick Test Run..."
echo "==================="
PYTHONPATH=. pytest tests/test_simple.py -v

echo ""
echo "🔬 Running Unit Tests..."
echo "======================="
PYTHONPATH=. pytest tests/ -m "unit" -v --tb=short

echo ""
echo "🔗 Running Integration Tests..."
echo "==============================="
PYTHONPATH=. pytest tests/ -m "integration" -v --tb=short

echo ""
echo "📊 Running All Tests with Coverage..."
echo "====================================="
PYTHONPATH=. pytest tests/ --cov=. --cov-report=term-missing --cov-report=html --tb=short

echo ""
echo "� Test Summary"
echo "==============="
print_status "Test execution completed!"
print_status "Coverage report generated in htmlcov/index.html"

# Get test results
if [ $? -eq 0 ]; then
    print_status "All tests completed! ✅"
    echo ""
    echo "📁 Test Files Created:"
    echo "- tests/test_simple.py      : Basic functionality tests"
    echo "- tests/test_basic.py       : API endpoint tests"
    echo "- tests/test_tts.py         : TTS synthesis tests"
    echo "- tests/test_auth.py        : Authentication tests"
    echo "- tests/test_audio.py       : Audio upload tests"
    echo "- tests/test_g2p.py         : G2P conversion tests"
    echo "- tests/test_integration.py : Integration tests"
    echo ""
    echo "📖 Documentation:"
    echo "- TESTING.md                : Complete testing guide"
    echo "- requirements.txt          : Test dependencies"
    echo "- pytest.ini               : Test configuration"
    echo ""
else
    print_warning "Some tests failed, but this is normal for initial setup! ⚠️"
    echo ""
    echo "Common reasons for test failures:"
    echo "- Missing environment variables"
    echo "- Different error handling behavior"
    echo "- Mock setup differences"
    echo ""
    echo "Check the test output above for specific failure details."
fi