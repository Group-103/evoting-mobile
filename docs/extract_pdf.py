import sys
import os

pdf_path = "Emergency_251204_112414.pdf"

try:
    import PyPDF2
    print("Using PyPDF2")
    reader = PyPDF2.PdfReader(pdf_path)
    print(f"Pages: {len(reader.pages)}")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"Page {i+1} text length: {len(text) if text else 0}")
        if text:
            print(f"--- Page {i+1} ---")
            print(text)
        else:
            print(f"--- Page {i+1} is empty ---")
except Exception as e:
    print(f"Error: {e}")
