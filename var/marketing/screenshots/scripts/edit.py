"""Opens Edit List mode: tapping the title reveals the mode switcher."""
import time

from selenium.webdriver.common.by import By


def run(driver):
    driver.find_element(By.CSS_SELECTOR, "h1.title-clickable").click()
    time.sleep(0.5)
    for button in driver.find_elements(By.CSS_SELECTOR, ".mode-btn"):
        if button.text.strip() == "Edit List":
            button.click()
            break
    time.sleep(0.5)
