from playwright.sync_api import sync_playwright

def list_elements():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3001")
        page.wait_for_load_state("networkidle")

        buttons = page.get_by_role("button").all()
        print(f"Found {len(buttons)} buttons:")
        for btn in buttons:
            print(f"Button: text='{btn.inner_text()}', aria-label='{btn.get_attribute('aria-label')}', title='{btn.get_attribute('title')}'")

        links = page.get_by_role("link").all()
        print(f"\nFound {len(links)} links:")
        for link in links:
            print(f"Link: text='{link.inner_text()}', href='{link.get_attribute('href')}'")

        browser.close()

if __name__ == "__main__":
    list_elements()
