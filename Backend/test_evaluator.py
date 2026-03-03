import requests

def test_evaluation():
    url = "http://127.0.0.1:8000/api/2ex/evaluate/"
    data = {
        "job_description": "Nurse with experience in ICU"
    }
    # Create a dummy file
    files = {
        "resume": ("resume.txt", b"This is a dummy resume with React and Django experience. I have 5 years of experience.")
    }
    
    try:
        response = requests.post(url, data=data, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_evaluation()
