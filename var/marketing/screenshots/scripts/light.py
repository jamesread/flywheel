"""Forces the light colour scheme before capture."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from theme import set_theme  # noqa: E402


def run(driver):
    set_theme(driver, "light")
