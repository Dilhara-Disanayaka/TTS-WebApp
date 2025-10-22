import re
from typing import Dict

class SinhalaAbbreviationConverter:
    def __init__(self):
        self.abbreviations: Dict[str, str] = {
            "රු.": "රුපියල්",
            "පෙ.ව.": "පෙරවරු",
            "ප.ව.": "පස්වරු",
            "$": "ඩොලර්"
        }
    
    def convert_time_format(self, text: str) -> str:
        """Convert time formats with පෙ.ව. or ප.ව."""
        # Pattern to match time with පෙ.ව. or ප.ව. (e.g., "2.30ට පෙ.ව." or "පෙ.ව. 8.00ට")
        time_pattern = r'(\d{1,2})\.(\d{2})([^\s]*)\s*(පෙ\.ව\.|ප\.ව\.)|((පෙ\.ව\.|ප\.ව\.)\s*(\d{1,2})\.(\d{2})([^\s]*))'
        
        def replace_time(match):
            if match.group(1):  # Time before පෙ.ව./ප.ව.
                hour = match.group(1)
                minute = match.group(2)
                suffix = match.group(3) or ""
                period = match.group(4)
            else:  # පෙ.ව./ප.ව. before time
                period = match.group(6)
                hour = match.group(7)
                minute = match.group(8)
                suffix = match.group(9) or ""
            
            # Convert period abbreviation
            period_full = self.abbreviations.get(period, period)
            
            # Handle time format
            if minute == "00":
                # Remove .00, just keep the hour
                if match.group(1):  # Time before period
                    return f"{hour}{suffix} {period_full}"
                else:  # Period before time
                    return f"{period_full} {hour}{suffix}"
            else:
                # Replace dot with යි when minutes are not zero
                if match.group(1):  # Time before period
                    return f"{hour} යි {minute}{suffix} {period_full}"
                else:  # Period before time
                    return f"{period_full} {hour} යි {minute}{suffix}"
        
        return re.sub(time_pattern, replace_time, text)
    
    def convert(self, text: str) -> str:
        """Convert abbreviations in Sinhala text to their full forms"""
        # First handle time formats
        result = self.convert_time_format(text)
        
        # Then handle remaining abbreviations that weren't part of time formats
        sorted_abbrevs = sorted(self.abbreviations.items(), key=lambda x: len(x[0]), reverse=True)
        
        for abbrev, full_form in sorted_abbrevs:
            if abbrev == "$":
                result = result.replace(abbrev, full_form)
            elif abbrev not in ["පෙ.ව.", "ප.ව."]:  # Skip time periods as they're already handled
                pattern = re.escape(abbrev)
                result = re.sub(pattern, full_form, result)
            else:
                # Handle standalone පෙ.ව./ප.ව. that aren't part of time
                # Simple replacement for remaining instances not caught by time conversion
                if abbrev in result:
                    result = result.replace(abbrev, full_form)
        
        return result


def short_convert(text: str) -> str:
    """Convert abbreviations in a Sinhala text to full forms"""
    converter = SinhalaAbbreviationConverter()
    return converter.convert(text)


if __name__ == "__main__":
    # Example usage
    sample_text = "මම රු. 1000ක් ගෙවුවා. පෙ.ව. 8.30ට පැමිණෙන්න. ප.ව. 2.00ට රැස්වීම තියෙනවා. $ 50ක් වටිනවා."
    converted_text = short_convert(sample_text)
    print(f"Original: {sample_text}")
    print(f"Converted: {converted_text}")
