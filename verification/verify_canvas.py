from playwright.sync_api import sync_playwright

def verify_canvas():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Go to the local server
            page.goto("http://localhost:3001")

            # Wait for the canvas to be present (it's inside GradientShaderCard)
            # Inspecting the component might help, but let's assume it's visible if the page loads.
            # I'll wait a bit for animation to start
            page.wait_for_timeout(2000)

            # Take a screenshot
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved to verification/verification.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_canvas()
