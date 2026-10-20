"""Waits for the habit list to render before capture."""
import time

from selenium.webdriver.common.by import By


def run(driver):
    deadline = time.time() + 15
    while time.time() < deadline:
        if driver.find_elements(By.CSS_SELECTOR, ".habit-item"):
            break
        time.sleep(0.25)
    # Headless Chrome draws classic scrollbars, which no phone or recent
    # desktop browser shows; hide them so tall pages stay centred.
    driver.execute_script(
        "const s = document.createElement('style');"
        "s.textContent = 'html { scrollbar-width: none; }';"
        "document.head.appendChild(s);"
        "window.scrollTo(0, 0);"
    )
