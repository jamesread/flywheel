"""Opens Edit List mode: clicking the logo/title reveals the mode switcher."""
import time

from selenium.webdriver.common.by import By


def run(driver):
    driver.find_element(By.CSS_SELECTOR, "header .image-and-title").click()
    time.sleep(0.5)
    for button in driver.find_elements(By.CSS_SELECTOR, "header .header-toolbar button"):
        if button.text.strip() == "Edit List":
            button.click()
            break
    else:
        raise RuntimeError("Edit List button not found in the header toolbar")
    deadline = time.time() + 5
    while time.time() < deadline and not driver.find_elements(By.CSS_SELECTOR, ".reorder-list-row"):
        time.sleep(0.25)
    time.sleep(0.5)
