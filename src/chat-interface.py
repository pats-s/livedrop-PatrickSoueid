import requests
import json
import sys
from datetime import datetime

## for a better look
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_banner():
    print("\n" + "-" * 60)
    print(f"{Colors.BOLD}Shoplite Customer Service Assistant{Colors.ENDC}")
    print("-" * 60 + "\n")

def get_api_url():
    ##Prompt user for the RAG system URL
    print(f"{Colors.BOLD}Enter your RAG system URL:{Colors.ENDC}")
    
    url = input("\nURL: ").strip()
    
    if url.endswith('/'):
        url = url[:-1]
    
    if not url.startswith('http'):
        print(f"\n{Colors.FAIL}Error: URL must start with http:// or https://{Colors.ENDC}")
        sys.exit(1)
    
    return url



def ask_question(api_url, question):
    try:
        response = requests.post(
            f"{api_url}/chat",
            json={"question": question},
            timeout=120
        )
        
        if response.status_code == 200:
            return response.json(), None
        else:
            error_msg = f"Error (Status {response.status_code}): {response.text}"
            return None, error_msg
            
    except requests.exceptions.Timeout:
        return None, "Request timed out (>120s). The system may be processing a complex query."
    except requests.exceptions.RequestException as e:
        return None, f"Connection error: {str(e)}"

def format_response(result):
    print("\n" + "-" * 60)
    
    # Answer
    answer = result.get('answer', 'No answer provided')
    print(f"\n{Colors.BOLD}Answer:{Colors.ENDC}")
    print(f"{answer}\n")
    
    # Sources
    sources = result.get('sources', [])
    if sources:
        print(f"{Colors.BOLD}Sources:{Colors.ENDC}")
        for i, source in enumerate(sources, 1):
            # Extract doc name
            source_name = source.split(':', 1)[1].strip() if ':' in source else source
            print(f"  {i}. {source_name}")
        print()
    
    confidence = result.get('confidence_level', 'N/A')
    similarity = result.get('top_similarity', 0)
    
    if confidence == "High":
        conf_color = Colors.OKGREEN
    elif confidence == "Medium":
        conf_color = Colors.WARNING
    else:
        conf_color = Colors.FAIL
    
    print(f"{Colors.BOLD}Confidence:{Colors.ENDC} {conf_color}{confidence}{Colors.ENDC} (Similarity: {similarity:.3f})")
    print("-" * 60 + "\n")

def save_conversation(api_url, conversations):
    """Save conversation history to file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"shoplite_chat_log_{timestamp}.json"
    
    log_data = {
        "api_url": api_url,
        "timestamp": timestamp,
        "conversations": conversations
    }
    
    try:
        with open(filename, 'w') as f:
            json.dump(log_data, f, indent=2)
        print(f"{Colors.OKGREEN}✓ Conversation saved to {filename}{Colors.ENDC}")
    except Exception as e:
        print(f"{Colors.FAIL}✗ Failed to save conversation: {str(e)}{Colors.ENDC}")

def print_help():
    print("\n" + "-" * 60)
    print(f"{Colors.BOLD}Available Commands:{Colors.ENDC}")
    print("  help    - Show this help message")
    print("  clear   - Clear the screen")
    print("  save    - Save conversation history to file")
    print("  quit    - Exit the chat interface")
    print("-" * 60 + "\n")

def main():
    print_banner()
    
    api_url = get_api_url()
    
    
    conversations = []
    
    print(f"\n{Colors.OKGREEN}Connected successfully!{Colors.ENDC}")
    print(f"\nType your questions about Shoplite below.")
    print(f"Type '{Colors.BOLD}help{Colors.ENDC}' for commands or '{Colors.BOLD}quit{Colors.ENDC}' to exit.\n")
    
    # Main loop
    while True:
        try:
            user_input = input(f"{Colors.BOLD}{Colors.OKBLUE}You: {Colors.ENDC}").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() == 'quit':
                print(f"\n{Colors.OKCYAN}Thank you for using Shoplite Customer Service!{Colors.ENDC}\n")
                break
            
            elif user_input.lower() == 'help':
                print_help()
                continue
            
            elif user_input.lower() == 'clear':
                print("\033[2J\033[H")  # Clear screen
                print_banner()
                continue
            
            elif user_input.lower() == 'save':
                save_conversation(api_url, conversations)
                continue
            
            print(f"{Colors.OKCYAN}Thinking...{Colors.ENDC}")
            result, error = ask_question(api_url, user_input)
            
            if error:
                print(f"\n{Colors.FAIL}Error: {error}{Colors.ENDC}\n")
                continue
            
            format_response(result)
            
            conversations.append({
                "timestamp": datetime.now().isoformat(),
                "question": user_input,
                "response": result
            })
        
        except KeyboardInterrupt:
            print(f"\n\n{Colors.OKCYAN}Chat interrupted. Type 'quit' to exit or continue asking questions.{Colors.ENDC}\n")
            continue
        
        except Exception as e:
            print(f"\n{Colors.FAIL}Unexpected error: {str(e)}{Colors.ENDC}\n")
            continue

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.OKCYAN}Goodbye!{Colors.ENDC}\n")
        sys.exit(0)