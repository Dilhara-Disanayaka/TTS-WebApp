import time
import statistics
from synthesis import synthesizer, tts
from g2p import convert_text
from num2sinhala import num_convert
from short2sinhala import short_convert

# Test texts of different sizes
TEST_TEXTS = {
    "short": [
        "හේලෝ",
        "ඔබට කොහොමද?",
        "අද කාලගුණය හොඳයි",
        "මම පාසලට යනවා",
        "ස්තූතියි ඔබට"
    ],
    "medium": [
        "මම රු. 1000ක් ගෙවුවා. පෙ.ව. 8.30ට පැමිණෙන්න.",
        "අද උදේ පෙ.ව. 7.00ට නැගිට්ටා. පාසලට යන්න ලෑස්ති වුණා.",
        "ගත වූ කාලය 5 මිනිත්තු 30 තත්පර විතරයි. ඉතින් ඉක්මනින් කරලා තිබුණා.",
        "ප.ව. 2.00ට රැස්වීම තියෙනවා. $ 50ක් වටිනවා.",
        "කොළඹ නගරයේ ගමනාගමනය අදත් ගැටළුකාරී වෙලා තියෙනවා."
    ],
    "long": [
        "ශ්‍රී ලංකාව දකුණු ආසියාවේ පිහිටි සුන්දර දූපත් රටකි. මෙහි ජනගහනය මිලියන 22ක් පමණ වේ. කොළඹ වාණිජ අගනුවර වන අතර ශ්‍රී ජයවර්ධනපුර කෝට්ටේ නිල අගනුවරයි. රටේ ප්‍රධාන භාෂා වන්නේ සිංහල සහ දෙමළ ය.",
        "අද පෙ.ව. 9.00ට ආරම්භ වූ රැස්වීමේදී අලුත් ව්‍යාපෘතිය ගැන කතා කළා. ඒකට රු. 10,000,000ක් වියදම් වෙනවා කියලා තීරණය කළා. ව්‍යාපෘතිය අවසන් කරන්න මාස 6ක් විතර ගතවෙයි කියලා අපේක්ෂා කරනවා.",
        "පරිගණකය සහ ඉන්ටර්නෙට් තාක්ෂණය දියුණු වීමත් සමඟ අපේ ජීවිතය බොහෝ සෙයින් පහසු වී තිබේ. ඔන්ලයින් ගනුදෙනු, ඉගෙනීම, සන්නිවේදනය යන සියල්ලම දැන් ගෙදරින්ම කරගන්න පුළුවන්.",
        "$ 1,500ක් වටිනා මේ උපකරණය භාවිතා කරලා ප.ව. 3.30ට වැඩ ආරම්භ කරන්න. රාත්‍රී 11.45ට වැඩ නවත්තලා අලුත් දිනයට සූදානම් වෙන්න.",
        "ගම්බද ප්‍රදේශවල ජනතාවගේ ජීවන තත්ත්වය ඉහළ නැංවීම සඳහා රජය විවිධ වැඩසටහන් ක්‍රියාත්මක කරනවා. අධ්‍යාපනය, සෞඛ්‍ය සේවා, පරිසර සංරක්ෂණය වැනි ක්ෂේත්‍රවල විශේෂ අවධානය යොමු කරලා තිබේ."
    ]
}

def warm_up_model():
    """Warm up the model with a simple inference"""
    print("Warming up the model...")
    start_time = time.time()
    
    # Simple warm-up text
    warm_up_text = "හේලෝ"
    text_processed = short_convert(warm_up_text)
    text_processed = num_convert(text_processed)
    ph = convert_text(text_processed)
    wav = synthesizer.tts(ph)
    
    warm_up_time = time.time() - start_time
    print(f"Model warmed up in {warm_up_time:.2f} seconds")
    return warm_up_time

def measure_inference_time(text):
    """Measure inference time for a single text"""
    # Preprocessing time
    preprocess_start = time.time()
    text_processed = short_convert(text)
    text_processed = num_convert(text_processed)
    ph = convert_text(text_processed)
    preprocess_time = time.time() - preprocess_start
    
    # TTS inference time
    tts_start = time.time()
    wav = synthesizer.tts(ph)
    tts_time = time.time() - tts_start
    
    # Calculate audio duration (assuming 22050 Hz sample rate)
    audio_duration = len(wav) / 22050
    
    # Real-time factor
    rtf = tts_time / audio_duration if audio_duration > 0 else 0
    
    return {
        'preprocess_time': preprocess_time,
        'tts_time': tts_time,
        'total_time': preprocess_time + tts_time,
        'audio_duration': audio_duration,
        'rtf': rtf,
        'text_length': len(text),
        'phoneme_length': len(ph.split())
    }

def run_performance_test():
    """Run comprehensive performance tests"""
    print("Starting TTS Performance Measurement")
    print("=" * 50)
    
    # Warm up the model
    warm_up_time = warm_up_model()
    print()
    
    results = {}
    
    for category, texts in TEST_TEXTS.items():
        print(f"Testing {category.upper()} texts...")
        category_results = []
        
        for i, text in enumerate(texts, 1):
            print(f"  Processing {category} text {i}/{len(texts)}: {text[:50]}...")
            
            # Run multiple iterations for more stable measurements
            iterations = 3 if category == "long" else 5
            iteration_results = []
            
            for j in range(iterations):
                result = measure_inference_time(text)
                iteration_results.append(result)
            
            # Average the iterations
            avg_result = {
                'preprocess_time': statistics.mean([r['preprocess_time'] for r in iteration_results]),
                'tts_time': statistics.mean([r['tts_time'] for r in iteration_results]),
                'total_time': statistics.mean([r['total_time'] for r in iteration_results]),
                'audio_duration': statistics.mean([r['audio_duration'] for r in iteration_results]),
                'rtf': statistics.mean([r['rtf'] for r in iteration_results]),
                'text_length': iteration_results[0]['text_length'],
                'phoneme_length': iteration_results[0]['phoneme_length']
            }
            
            category_results.append(avg_result)
        
        results[category] = category_results
        print(f"Completed {category} texts\n")
    
    return results

def calculate_statistics(results):
    """Calculate comprehensive statistics"""
    stats = {}
    
    for category, category_results in results.items():
        stats[category] = {
            'count': len(category_results),
            'avg_preprocess_time': statistics.mean([r['preprocess_time'] for r in category_results]),
            'avg_tts_time': statistics.mean([r['tts_time'] for r in category_results]),
            'avg_total_time': statistics.mean([r['total_time'] for r in category_results]),
            'avg_audio_duration': statistics.mean([r['audio_duration'] for r in category_results]),
            'avg_rtf': statistics.mean([r['rtf'] for r in category_results]),
            'avg_text_length': statistics.mean([r['text_length'] for r in category_results]),
            'avg_phoneme_length': statistics.mean([r['phoneme_length'] for r in category_results]),
            'min_total_time': min([r['total_time'] for r in category_results]),
            'max_total_time': max([r['total_time'] for r in category_results]),
            'std_total_time': statistics.stdev([r['total_time'] for r in category_results]) if len(category_results) > 1 else 0
        }
    
    return stats

def print_performance_report(stats):
    """Print a detailed performance report"""
    print("PERFORMANCE REPORT USING RTX 3050 GPU")
    print("=" * 80)
    
    print(f"{'Category':<10} {'Count':<6} {'Avg Time':<10} {'Avg RTF':<10} {'Text Len':<10} {'Audio Dur':<10}")
    print("-" * 80)
    
    for category, data in stats.items():
        print(f"{category.capitalize():<10} "
              f"{data['count']:<6} "
              f"{data['avg_total_time']:.3f}s{'':<4} "
              f"{data['avg_rtf']:.3f}{'':<6} "
              f"{data['avg_text_length']:.0f}{'':<6} "
              f"{data['avg_audio_duration']:.2f}s{'':<5}")
    
    print("\nDETAILED BREAKDOWN")
    print("=" * 80)
    
    for category, data in stats.items():
        print(f"\n{category.upper()} TEXTS:")
        print(f"Average text length: {data['avg_text_length']:.0f} characters")
        print(f"Average phoneme count: {data['avg_phoneme_length']:.0f}")
        print(f"Average preprocessing: {data['avg_preprocess_time']:.3f}s")
        print(f"Average TTS inference: {data['avg_tts_time']:.3f}s")
        print(f"Average total time: {data['avg_total_time']:.3f}s")
        print(f"Average audio duration: {data['avg_audio_duration']:.2f}s")
        print(f"Average RTF: {data['avg_rtf']:.3f}")
        print(f"Time range: {data['min_total_time']:.3f}s - {data['max_total_time']:.3f}s")
        print(f"Standard deviation: {data['std_total_time']:.3f}s")

def main():
    """Main performance testing function"""
    try:
        results = run_performance_test()
        stats = calculate_statistics(results)
        print_performance_report(stats)
        
        # Overall summary
        all_times = []
        all_rtfs = []
        for category_results in results.values():
            all_times.extend([r['total_time'] for r in category_results])
            all_rtfs.extend([r['rtf'] for r in category_results])
        
        print(f"\nOVERALL SUMMARY")
        print("=" * 50)
        print(f"Total tests run: {len(all_times)}")
        print(f"Overall average time: {statistics.mean(all_times):.3f}s")
        print(f"Overall average RTF: {statistics.mean(all_rtfs):.3f}")
        print(f"Best RTF: {min(all_rtfs):.3f}")
        print(f"Worst RTF: {max(all_rtfs):.3f}")
        
    except Exception as e:
        print(f"Error during performance testing: {e}")

if __name__ == "__main__":
    main()
