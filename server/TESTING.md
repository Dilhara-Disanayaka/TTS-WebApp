# TTS Backend Testing Guide

This document provides comprehensive information about testing the TTS (Text-to-Speech) backend using PyTest.

## Setup

### 1. Install Dependencies
```bash
cd server
pip install -r requirements.txt
```

### 2. Environment Setup
Make sure you have a `.env` file in the server directory with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Running Tests

### Quick Start
```bash
# Run all tests
./run_tests.sh

# Or manually:
pytest tests/ -v
```

### Test Categories

#### Unit Tests
```bash
pytest tests/ -m "unit" -v
```
Tests individual components in isolation:
- Basic endpoints (`test_basic.py`)
- TTS synthesis (`test_tts.py`) 
- Authentication (`test_auth.py`)
- Audio upload (`test_audio.py`)
- G2P conversion (`test_g2p.py`)

#### Integration Tests
```bash
pytest tests/ -m "integration" -v
```
Tests complete user workflows:
- End-to-end TTS flow
- Complete authentication flow
- Audio upload integration
- Performance tests

#### Coverage Report
```bash
pytest tests/ --cov=. --cov-report=html
```
Generates detailed coverage report in `htmlcov/index.html`

### Specific Test Files

#### Basic API Tests
```bash
pytest tests/test_basic.py -v
```
- Root endpoint functionality
- CORS configuration

#### TTS Functionality Tests
```bash
pytest tests/test_tts.py -v
```
- Text synthesis with mocked TTS engine
- Sinhala text processing
- Error handling
- Audio format validation

#### Authentication Tests
```bash
pytest tests/test_auth.py -v
```
- User signup/login
- OAuth integration
- Token management
- Error scenarios

#### Audio Upload Tests
```bash
pytest tests/test_audio.py -v
```
- File upload handling
- Metadata extraction
- Supabase storage integration
- Duration calculation

#### G2P Conversion Tests
```bash
pytest tests/test_g2p.py -v
```
- Sinhala grapheme-to-phoneme conversion
- Character mapping validation
- Text processing edge cases

## Test Configuration

### Pytest Configuration (`pytest.ini`)
- Test discovery patterns
- Coverage settings
- Markers for test categories
- Async test support

### Fixtures (`conftest.py`)
- Mock Supabase client
- Mock TTS synthesizer
- Test file creation
- Environment variable setup

## Mocking Strategy

The tests use extensive mocking to:
- **Supabase**: Mock database and storage operations
- **TTS Engine**: Mock audio synthesis to avoid loading large models
- **File Operations**: Mock file I/O for consistent testing
- **External APIs**: Mock OAuth and other external services

## Environment Isolation

Tests run in complete isolation:
- No actual TTS model loading
- No real Supabase connections
- No file system side effects
- Controlled environment variables

## Coverage Goals

Current test coverage includes:
- ✅ API endpoint functionality
- ✅ Authentication flows
- ✅ Error handling
- ✅ Data validation
- ✅ File upload/storage
- ✅ Text processing

## Adding New Tests

### For New Endpoints
1. Create test file in `tests/`
2. Use appropriate markers (`@pytest.mark.unit` or `@pytest.mark.integration`)
3. Mock external dependencies
4. Test both success and failure cases

### For New Features
1. Add unit tests for individual components
2. Add integration tests for complete workflows
3. Update fixtures if needed
4. Maintain coverage above 80%

## Continuous Integration

The test suite is designed to run in CI environments:
- No external dependencies
- Fast execution with mocks
- Comprehensive error reporting
- Coverage metrics

## Troubleshooting

### Common Issues

1. **Import Errors**: Install all dependencies with `pip install -r requirements.txt`
2. **Missing TTS Models**: Tests use mocks, no real models needed
3. **Supabase Errors**: Tests use mocked Supabase client
4. **Environment Variables**: Use test fixtures for consistent env setup

### Debug Mode
```bash
pytest tests/ -v -s --tb=long
```

### Run Specific Test
```bash
pytest tests/test_tts.py::TestTTSSynthesis::test_synthesize_success -v
```

## Performance Testing

Performance tests are marked with `@pytest.mark.slow`:
```bash
pytest tests/ -m "slow" -v
```

These tests check:
- Response times
- Memory usage
- Concurrent request handling
- Large file processing

## Test Data

Test data is generated dynamically:
- Fake audio files
- Mock UUIDs
- Sample text in multiple languages
- Controlled error scenarios

This ensures tests are:
- Reproducible
- Fast
- Independent
- Maintainable