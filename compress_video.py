"""
Video compression script to reduce file size below GitHub's 100 MB limit.
This script compresses the BridgeGen demo video to a web-optimized format.
"""

try:
    from moviepy.editor import VideoFileClip
    import os
    
    # Input and output paths
    input_video = r"c:\Users\Aryan Kota\AppData\Local\Packages\Microsoft.ScreenSketch_8wekyb3d8bbwe\TempState\Recordings\20260215-0826-55.6965840.mp4"
    output_video = r"c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask\public\images\bridgegen\demo-compressed.mp4"
    
    print(f"Loading video from: {input_video}")
    
    # Load the video
    video = VideoFileClip(input_video)
    
    # Get video info
    duration = video.duration
    original_size = os.path.getsize(input_video) / (1024 * 1024)  # MB
    
    print(f"Original video: {original_size:.2f} MB, Duration: {duration:.2f}s")
    print("Compressing video...")
    
    # Compress the video with web-optimized settings
    # Reduce bitrate significantly to get under 100 MB
    # Target: ~50 MB for safety margin
    target_size_mb = 50
    target_bitrate = f"{int((target_size_mb * 8192) / duration)}k"
    
    video.write_videofile(
        output_video,
        codec='libx264',
        audio_codec='aac',
        bitrate=target_bitrate,
        preset='medium',
        threads=4
    )
    
    # Get compressed size
    compressed_size = os.path.getsize(output_video) / (1024 * 1024)  # MB
    compression_ratio = (1 - compressed_size / original_size) * 100
    
    print(f"\n✓ Compression complete!")
    print(f"Compressed video: {compressed_size:.2f} MB")
    print(f"Reduction: {compression_ratio:.1f}%")
    print(f"Output saved to: {output_video}")
    
    video.close()
    
except ImportError:
    print("❌ Error: moviepy is not installed.")
    print("\nTo install moviepy, run:")
    print("  pip install moviepy")
    print("\nAlternatively, you can:")
    print("1. Use an online video compressor (e.g., https://www.freeconvert.com/video-compressor)")
    print("2. Upload to YouTube as unlisted and embed the link")
    print("3. Use Cloudflare Stream (paid) or another video hosting service")
except Exception as e:
    print(f"❌ Error compressing video: {e}")
    print("\nAlternative solutions:")
    print("1. Use an online video compressor: https://www.freeconvert.com/video-compressor")
    print("2. Upload to YouTube (unlisted) and embed: https://youtube.com/upload")
    print("3. Use HandBrake (free desktop app): https://handbrake.fr/")
