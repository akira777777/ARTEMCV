from playwright.sync_api import sync_playwright
import time

def capture_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            print("Starting dev server check...")
            page.goto("http://localhost:3001")
            page.wait_for_load_state("networkidle")

            # Capture EN
            print("Capturing EN...")
            page.get_by_role("button", name="EN", exact=True).click()
            time.sleep(1)
            page.screenshot(path="verification/hero_en.png")

            # Capture RU
            print("Capturing RU...")
            page.get_by_role("button", name="RU", exact=True).click()
            time.sleep(1)
            page.screenshot(path="verification/hero_ru.png")

            # Capture CS
            print("Capturing CS...")
            page.get_by_role("button", name="CS", exact=True).click()
            time.sleep(1)
            page.screenshot(path="verification/hero_cs.png")

            # Scroll to Works
            print("Capturing Works (CS)...")
            page.goto("http://localhost:3001/#works")
            time.sleep(1)
            page.screenshot(path="verification/works_cs.png")

            # Scroll to Contact
            print("Capturing Contact (CS)...")
            page.goto("http://localhost:3001/#contact")
            time.sleep(1)
            page.screenshot(path="verification/contact_cs.png")

            print("Screenshots captured successfully.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    capture_screenshots()
