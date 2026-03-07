"""
Quick test script to verify the API is working
Run this after starting the server to test suggestion generation
"""

import requests
import json

API_URL = "http://localhost:8000"

def test_health():
    """Test if server is running"""
    print("Testing server health...")
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            print("✓ Server is running!")
            print(f"  Response: {response.json()}")
            return True
        else:
            print(f"✗ Server returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Is it running?")
        print("  Run: python main.py")
        return False

def test_suggestions():
    """Test suggestion generation"""
    print("\nTesting suggestion generation...")
    
    test_messages = [
        "Hey, how are you?",
        "Can you send me the report by tomorrow?",
        "Thanks for your help!",
        "Are you free for a meeting at 3pm?"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n--- Test {i} ---")
        print(f"Message: \"{message}\"")
        
        try:
            response = requests.post(
                f"{API_URL}/generate-reply",
                json={
                    "message": message,
                    "platform": "whatsapp"
                },
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✓ Suggestions generated:")
                for j, suggestion in enumerate(data["suggestions"], 1):
                    print(f"  {j}. {suggestion}")
            else:
                print(f"✗ Error: {response.status_code}")
                print(f"  {response.text}")
                
        except Exception as e:
            print(f"✗ Error: {str(e)}")

def main():
    print("=" * 50)
    print("AI Chat Reply Assistant - API Test")
    print("=" * 50)
    print()
    
    # Test health first
    if test_health():
        # If server is running, test suggestions
        test_suggestions()
        
        print("\n" + "=" * 50)
        print("Testing complete!")
        print("=" * 50)
    else:
        print("\nPlease start the server first:")
        print("  python main.py")

if __name__ == "__main__":
    main()
