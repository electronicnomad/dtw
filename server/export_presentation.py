#!/usr/bin/env python3
import functools
import http.server
import os
import subprocess
import sys
import tempfile
import threading
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER_DIR = os.path.join(BASE_DIR, "server")
TOTAL_SLIDES = 31

CHROME_BIN = os.environ.get(
    "CHROME_BIN",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if os.path.exists("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    else "google-chrome",
)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def start_local_server():
    handler = functools.partial(QuietHandler, directory=SERVER_DIR)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd, port


def capture_slide(slide_num, port, slides_dir, tmp_root):
    out_path = os.path.join(slides_dir, f"slide_{slide_num:02d}.png")
    profile_dir = os.path.join(tmp_root, f"profile_{slide_num:02d}")
    os.makedirs(profile_dir, exist_ok=True)
    url = f"http://127.0.0.1:{port}/index.html?export=true&slide={slide_num}"
    cmd = [
        CHROME_BIN,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--window-size=1920,1080",
        "--virtual-time-budget=3000",
        f"--user-data-dir={profile_dir}",
        f"--screenshot={out_path}",
        url,
    ]
    result = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if result.returncode == 0 and os.path.exists(out_path):
        print(f"Slide {slide_num:02d}/{TOTAL_SLIDES:02d} captured successfully.")
        return out_path
    print(f"Error capturing slide {slide_num:02d}", file=sys.stderr)
    return None


def main():
    httpd, port = start_local_server()
    try:
        with tempfile.TemporaryDirectory(prefix="dtw_export_") as tmp_root:
            slides_dir = os.path.join(tmp_root, "slides")
            os.makedirs(slides_dir, exist_ok=True)

            print(f"Capturing {TOTAL_SLIDES} presentation slides via headless Chrome (http://127.0.0.1:{port})...")
            with ThreadPoolExecutor(max_workers=4) as executor:
                futures = [
                    executor.submit(capture_slide, i, port, slides_dir, tmp_root)
                    for i in range(1, TOTAL_SLIDES + 1)
                ]
                for f in futures:
                    f.result()

            slide_paths = [
                os.path.join(slides_dir, f"slide_{i:02d}.png")
                for i in range(1, TOTAL_SLIDES + 1)
            ]

            for p in slide_paths:
                if not os.path.exists(p):
                    print(f"Missing slide: {p}", file=sys.stderr)
                    sys.exit(1)

            print("\nGenerating 16:9 PDF presentation...")
            images = []
            for p in slide_paths:
                with Image.open(p) as im:
                    images.append(im.convert("RGB"))

            pdf_out = os.path.join(SERVER_DIR, "dtw_presentation.pdf")
            images[0].save(pdf_out, save_all=True, append_images=images[1:], resolution=150.0)
            print(f"PDF saved: {pdf_out} ({os.path.getsize(pdf_out) / (1024 * 1024):.2f} MB)")
            print(f"\nExport completed successfully! All {TOTAL_SLIDES} slides exported to PDF.")
    finally:
        httpd.shutdown()
        httpd.server_close()


if __name__ == "__main__":
    main()
