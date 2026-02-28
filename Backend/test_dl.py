import urllib.request
try:
    req = urllib.request.Request("http://127.0.0.1:8000/api/applications/1/download-resume/")
    with urllib.request.urlopen(req) as response:
        print(response.read())
except Exception as e:
    print("Error:", e)
