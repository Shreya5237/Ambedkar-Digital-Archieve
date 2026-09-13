import PyPDF2
import os

pdf_dir = "data"
pdfs = ["Volume1.pdf", "Volume17_Part_I.pdf", "VolumeH1.pdf", "VolumeH40.pdf"]

for pdf in pdfs:
    path = os.path.join(pdf_dir, pdf)
    if os.path.exists(path):
        try:
            reader = PyPDF2.PdfReader(path)
            text = ""
            for i in range(min(5, len(reader.pages))):
                page_text = reader.pages[i].extract_text()
                if page_text:
                    text += page_text + "\n"
            print(f"--- {pdf} ---")
            print(text[:1000])
            print("\n")
        except Exception as e:
            print(f"Error reading {pdf}: {e}")
