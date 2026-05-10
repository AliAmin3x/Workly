import subprocess
import sys
import os

def run_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running '{command}': {e}")
        print(f"Error output: {e.stderr}")
        return None

def check_chrome():
    # Check for Chromium (snap)
    chromium_snap = run_command("which chromium")
    if not chromium_snap or not os.path.exists("/snap/bin/chromium"):
        print("❌ Chromium (snap) not found")
        print("   Install with: sudo snap install chromium")
        return False
    print("✅ Chromium found at:", chromium_snap)
    return True

def check_chromedriver():
    chromedriver = run_command("which chromedriver")
    if not chromedriver:
        print("❌ ChromeDriver not found")
        print("   Install with: sudo apt install chromium-chromedriver")
        return False
    print("✅ ChromeDriver found at:", chromedriver)
    return True

def check_packages():
    try:
        import selenium
        import bs4
        print("✅ Required Python packages (selenium, beautifulsoup4) are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing Python package: {e.name}")
        print("   Install with: pip install selenium beautifulsoup4")
        return False

def main():
    print("\nChecking Selenium WebDriver dependencies...\n")
    
    chrome_ok = check_chrome()
    driver_ok = check_chromedriver()
    packages_ok = check_packages()
    
    print("\nSummary:")
    if all([chrome_ok, driver_ok, packages_ok]):
        print("✅ All dependencies are properly installed!")
    else:
        print("❌ Some dependencies are missing. Please install them using the commands above.")
        print("\nAfter installing, run your app again with:")
        print("python app.py")
        sys.exit(1)

if __name__ == "__main__":
    main()