from playwright.sync_api import sync_playwright
import time
import re

def verify_interactive():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            print("Connecting to http://localhost:3001...")
            page.goto("http://localhost:3001")
            page.wait_for_load_state("networkidle")

            # 1. Verify initial state
            print(f"Title: {page.title()}")

            # 2. Test Language Switching
            print("Testing Language Switching...")
            try:
                # Use exact text for LanguageSwitcher buttons
                en_btn = page.get_by_role("button", name="EN", exact=True)
                ru_btn = page.get_by_role("button", name="RU", exact=True)

                print("Switching to RU...")
                ru_btn.click()
                time.sleep(1)

                # Verify Russian text in Hero
                if page.get_by_text("Full Stack разработчик").first.is_visible():
                    print("Successfully switched to RU")
                else:
                    print("Failed to find Russian text after switch")

                print("Switching back to EN...")
                en_btn.click()
                time.sleep(1)
                if page.get_by_text("Full Stack Developer").first.is_visible():
                    print("Successfully switched back to EN")

            except Exception as e:
                print(f"Language switch error: {e}")
                page.screenshot(path="verification/lang_switch_error_refined.png")

            # 3. Test Project Gallery and Modal
            print("Testing Project Gallery...")
            try:
                # Scroll to works section
                page.get_by_role("link", name="WORKS").click()
                time.sleep(1)

                # Use the aria-label from ProjectCard
                project_card = page.get_by_role("button", name=re.compile(r"Open details for .*")).first
                project_card_name = project_card.get_attribute("aria-label")
                print(f"Clicking on: {project_card_name}")
                project_card.click()
                time.sleep(1)

                # Check for modal content
                # The modal has TWO buttons with "Close project details"
                # One is backdrop, one is the X button. We want the X button (usually second).
                close_buttons = page.get_by_role("button", name="Close project details")
                if close_buttons.count() > 0:
                    print(f"Found {close_buttons.count()} close buttons")
                    print("Project modal opened successfully")

                    # Try to close with Escape
                    page.keyboard.press("Escape")
                    time.sleep(1)
                    if close_buttons.count() == 0 or not close_buttons.first.is_visible():
                        print("Modal closed with Escape")
                    else:
                        print("Modal failed to close with Escape, clicking the X button")
                        close_buttons.nth(1).click()
                        time.sleep(0.5)
                else:
                    print("Project modal failed to open (close button not found)")

            except Exception as e:
                print(f"Project gallery error: {e}")
                page.screenshot(path="verification/project_gallery_error_refined.png")

            # 4. Test Contact Form Validation
            print("Testing Contact Form Validation...")
            try:
                # Ensure modal is closed before clicking Contact
                page.keyboard.press("Escape")

                page.get_by_role("link", name="CONTACT", exact=True).click()
                time.sleep(1)

                # Check for contact section
                contact_section = page.locator("#contact")
                if not contact_section.is_visible():
                    print("Contact section not visible, scrolling manually")
                    page.goto("http://localhost:3001/#contact")
                    time.sleep(1)

                submit_btn = page.get_by_role("button", name="Send Message").first
                submit_btn.scroll_into_view_if_needed()
                submit_btn.click()

                # Wait for validation error
                time.sleep(1)
                if page.get_by_text("Please fill in all required fields").is_visible():
                     print("Contact form validation triggered successfully")
                else:
                     print("Could not find validation error message")
            except Exception as e:
                print(f"Contact form error: {e}")
                page.screenshot(path="verification/contact_form_error_refined.png")

            # Final screenshot
            page.screenshot(path="verification/interactive_final_refined.png", full_page=True)
            print("Interactive verification complete.")

        except Exception as e:
            print(f"General error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_interactive()
