"""Selenium WebDriver checks for The Pan N Grill.

Usage:
    python test_app.py http://<load-balancer-dns>
    python test_app.py http://localhost --headless

The script opens the deployed site in Chrome and checks:
  1. the home page heading
  2. navigation to the menu and the menu items
  3. adding an item to the cart (cart badge)
  4. the API health endpoint, which also reports the database state
  5. placing an order and confirming it was saved in PostgreSQL

It exits with code 0 when every check passes and 1 otherwise.
"""
import argparse
import json
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

TIMEOUT = 15
RESULTS = []


def check(name, condition, detail=""):
    """Record and print one check; PASS/FAIL lines are the evidence shown in the viva."""
    RESULTS.append(bool(condition))
    print(f"[{'PASS' if condition else 'FAIL'}] {name}" + (f"  ({detail})" if detail else ""))
    return bool(condition)


def read_json(driver, url):
    """Opens a JSON endpoint in the browser and parses what it shows."""
    driver.get(url)
    body = driver.find_element(By.TAG_NAME, "body").text
    return json.loads(body)


def dismiss_location_prompt(driver):
    """The site asks for a location on the first visit; skip it so it does not cover the page."""
    try:
        WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Skip for now']"))
        ).click()
    except TimeoutException:
        pass  # prompt not shown (already answered)


def run(base_url, headless, screenshot_path):
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1366,900")
    if headless:
        options.add_argument("--headless=new")
    driver = webdriver.Chrome(options=options)  # Selenium Manager downloads the matching driver
    wait = WebDriverWait(driver, TIMEOUT)

    try:
        print(f"Testing {base_url}\n")

        # 1. Home page heading
        driver.get(base_url)
        dismiss_location_prompt(driver)
        heading = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "h1"))).text
        check("Home page heading is visible", "PAKISTANI TASTE" in heading.upper(), heading)

        # 2. Menu page
        driver.find_element(By.XPATH, "//header//a[normalize-space()='Menu']").click()
        wait.until(EC.url_contains("/menu"))
        cards = wait.until(lambda d: d.find_elements(By.TAG_NAME, "article"))
        check("Menu page lists items", len(cards) >= 20, f"{len(cards)} items")

        # 3. Add to cart
        driver.find_element(By.CSS_SELECTOR, "article button[aria-label^='Add']").click()
        cart_button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[aria-label^='Open cart']")))
        wait.until(lambda d: cart_button.text.strip() == "1")
        check("Cart badge shows 1 after adding an item", cart_button.text.strip() == "1", cart_button.get_attribute("aria-label"))

        # 4. API health (proves web -> backend -> database)
        health = read_json(driver, f"{base_url}/api/health")
        check("API health endpoint reports ok", health.get("status") == "ok", json.dumps(health))
        database = health.get("database")

        before = read_json(driver, f"{base_url}/api/orders/summary")

        # 5. Place an order through the UI
        driver.get(f"{base_url}/checkout")
        wait.until(EC.visibility_of_element_located((By.ID, "fullName"))).send_keys("Selenium Tester")
        driver.find_element(By.ID, "phone").send_keys("0300 1234567")
        driver.find_element(By.ID, "deliveryAddress").send_keys("House 1, Test Street, near Adhiwal Chowk, Jhang")
        main_window = driver.current_window_handle
        driver.find_element(By.XPATH, "//aside//button[@type='submit']").click()
        success = wait.until(EC.visibility_of_element_located((By.ID, "order-success-title"))).text
        check("Order success dialog appears", "ORDER READY" in success.upper(), success)
        for handle in driver.window_handles:  # checkout opens WhatsApp in a new tab; close it
            if handle != main_window:
                driver.switch_to.window(handle)
                driver.close()
        driver.switch_to.window(main_window)

        after = read_json(driver, f"{base_url}/api/orders/summary")
        if database == "up":
            check(
                "Order was saved in PostgreSQL",
                after.get("count") == before.get("count", 0) + 1,
                f"orders before={before.get('count')} after={after.get('count')}",
            )
        else:
            print(f"[SKIP] Database check (database state: {database})")

        driver.get(base_url)
        driver.save_screenshot(str(screenshot_path))
        print(f"\nScreenshot saved to {screenshot_path}")
    finally:
        driver.quit()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("url", help="site address, for example http://my-alb-123.us-east-1.elb.amazonaws.com")
    parser.add_argument("--headless", action="store_true", help="run Chrome without a window")
    parser.add_argument("--screenshot", default="selenium-result.png", help="where to save the final screenshot")
    args = parser.parse_args()

    started = time.time()
    try:
        run(args.url.rstrip("/"), args.headless, Path(args.screenshot))
    except Exception as exc:  # any unexpected error counts as a failed run
        check("Test run completed without errors", False, f"{type(exc).__name__}: {exc}")

    passed, total = sum(RESULTS), len(RESULTS)
    print(f"\n{passed}/{total} checks passed in {time.time() - started:.1f}s")
    sys.exit(0 if passed == total and total > 0 else 1)


if __name__ == "__main__":
    main()
