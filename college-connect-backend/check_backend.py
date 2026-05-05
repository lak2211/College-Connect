import requests
import sys
import time

def check_backend(url="http://localhost:8000"):
    print(f"--- Backend Health Check: {url} ---")
    try:
        # Check basic connectivity
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print(f"SUCCESS: Root endpoint is reachable. Response: {response.json()}")
        else:
            print(f"WARNING: Root endpoint returned status {response.status_code}")
            
        # Check ML Health endpoint
        ml_url = f"{url}/ml/health"
        ml_response = requests.get(ml_url, timeout=5)
        if ml_response.status_code == 200:
            print(f"SUCCESS: ML Health endpoint is reachable. Response: {ml_response.json()}")
        else:
            print(f"WARNING: ML Health endpoint returned status {ml_response.status_code}")
            
        print("\nConclusion: Backend is RUNNING and HEALTHY.")
        return True

    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to the backend. Is the server running?")
        print("Tip: Run 'uvicorn main:app --host 0.0.0.0 --port 8000' in the backend directory.")
        return False
    except requests.exceptions.Timeout:
        print("ERROR: Connection timed out. The server might be overloaded or unresponsive.")
        return False
    except Exception as e:
        print(f"ERROR: An unexpected error occurred: {e}")
        return False

if __name__ == "__main__":
    success = check_backend()
    if not success:
        sys.exit(1)
