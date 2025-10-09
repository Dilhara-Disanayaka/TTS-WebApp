import pytest
from g2p import convert_text, VOWEL_SIGNS, INDEP_VOWELS, CONS_MAP, SPECIAL_SIGNS


@pytest.mark.unit
class TestG2PConversion:
    """Test Grapheme-to-Phoneme conversion functionality"""
    
    def test_convert_simple_sinhala_word(self):
        """Test conversion of simple Sinhala word"""
        # Test a simple word - you may need to adjust based on actual implementation
        result = convert_text("කට")
        assert isinstance(result, str)
        assert len(result) > 0
    
    def test_convert_empty_string(self):
        """Test conversion of empty string"""
        result = convert_text("")
        assert result == ""
    
    def test_convert_english_text(self):
        """Test conversion of English text"""
        result = convert_text("hello")
        assert isinstance(result, str)
    
    def test_convert_mixed_text(self):
        """Test conversion of mixed Sinhala and English text"""
        result = convert_text("hello කට")
        assert isinstance(result, str)
        assert len(result) > 0
    
    def test_convert_sinhala_sentence(self):
        """Test conversion of Sinhala sentence"""
        result = convert_text("සුභ උදෑසනක්")
        assert isinstance(result, str)
        assert len(result) > 0
    
    def test_convert_with_numbers(self):
        """Test conversion with numbers"""
        result = convert_text("123 කට")
        assert isinstance(result, str)
    
    def test_convert_with_punctuation(self):
        """Test conversion with punctuation"""
        result = convert_text("කට, මට.")
        assert isinstance(result, str)
    
    def test_vowel_signs_mapping(self):
        """Test that vowel signs mapping is correct"""
        assert "ා" in VOWEL_SIGNS
        assert VOWEL_SIGNS["ා"] == "aː"
        assert "ි" in VOWEL_SIGNS
        assert VOWEL_SIGNS["ි"] == "i"
    
    def test_independent_vowels_mapping(self):
        """Test that independent vowels mapping is correct"""
        assert "අ" in INDEP_VOWELS
        assert INDEP_VOWELS["අ"] == "a"
        assert "ආ" in INDEP_VOWELS
        assert INDEP_VOWELS["ආ"] == "aː"
    
    def test_consonants_mapping(self):
        """Test that consonants mapping is correct"""
        assert "ක" in CONS_MAP
        assert CONS_MAP["ක"] == "k"
        assert "ග" in CONS_MAP
        assert CONS_MAP["ග"] == "g"
    
    def test_special_signs_mapping(self):
        """Test that special signs mapping is correct"""
        assert "ං" in SPECIAL_SIGNS
        assert SPECIAL_SIGNS["ං"] == "ŋ"
        assert "ඃ" in SPECIAL_SIGNS
        assert SPECIAL_SIGNS["ඃ"] == "h"
    
    def test_convert_with_virama(self):
        """Test conversion with virama (hal kirima)"""
        result = convert_text("ක්")
        assert isinstance(result, str)
    
    def test_convert_long_text(self):
        """Test conversion with longer text"""
        long_text = "මෙය දිගු සිංහල වාක්‍යයකි. " * 5
        result = convert_text(long_text)
        assert isinstance(result, str)
        assert len(result) > 0
    
    def test_convert_special_characters(self):
        """Test conversion with special Unicode characters"""
        result = convert_text("අඩුතරනි")
        assert isinstance(result, str)
    
    def test_convert_preserves_spaces(self):
        """Test that spaces are preserved in conversion"""
        result = convert_text("කට මට")
        assert " " in result or len(result.split()) >= 2
    
    @pytest.mark.parametrize("input_text,expected_type", [
        ("කට", str),
        ("hello", str),
        ("123", str),
        ("!@#", str),
        ("", str),
    ])
    def test_convert_text_types(self, input_text, expected_type):
        """Test that convert_text always returns the expected type"""
        result = convert_text(input_text)
        assert isinstance(result, expected_type)
    
    def test_convert_none_input(self):
        """Test conversion with None input"""
        with pytest.raises((TypeError, AttributeError)):
            convert_text(None)
    
    def test_convert_numeric_input(self):
        """Test conversion with numeric input"""
        with pytest.raises((TypeError, AttributeError)):
            convert_text(123)