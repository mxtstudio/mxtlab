import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Verify Homepage
        page.goto(f"file://{os.getcwd()}/index.html")
        page.screenshot(path="verification/home_mpa.png")
        print("Captured home_mpa.png")

        # Verify a Lesson Page
        page.goto(f"file://{os.getcwd()}/lessons/g9-soil-formation.html")
        page.screenshot(path="verification/lesson_mpa.png")
        print("Captured lesson_mpa.png")

        # Verify Topics Page
        page.goto(f"file://{os.getcwd()}/topics.html")
        page.screenshot(path="verification/topics_mpa.png")
        print("Captured topics_mpa.png")

        browser.close()

if __name__ == "__main__":
    run()
