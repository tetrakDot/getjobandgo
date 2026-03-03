import requests

def test_urls():
    base_url = "http://127.0.0.1:8000"
    urls = [
        "/api/2ex/evaluate/",
        "/api/2ex/evaluate",
        "/2ex/evaluate/",
    ]
    
    for path in urls:
        full_url = base_url + path
        print(f"Testing {full_url}...")
        try:
            # We use a dummy file
            response = requests.post(
                full_url, 
                data={"job_description": "test"}, 
                files={"resume": ("test.txt", b"test content")}
            )
            print(f"  Status: {response.status_code}")
        except Exception as e:
            print(f"  Error: {str(e)}")

if __name__ == "__main__":
    test_urls()
