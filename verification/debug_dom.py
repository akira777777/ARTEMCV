from playwright.sync_api import sync_playwright

def debug():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/home2026")
        page.wait_for_timeout(5000)

        # Print all IDs on the page
        ids = page.evaluate("() => Array.from(document.querySelectorAll('[id]')).map(el => el.id)")
        print("IDs found:", ids)

        # Print innerHTML of body for a bit of context
        # print(page.content())

        browser.close()

if __name__ == "__main__":
    debug()
