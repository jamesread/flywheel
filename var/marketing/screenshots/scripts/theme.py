"""Pins the colour scheme; the browser session is shared across captures.

PicoCrank's useTheme stores the choice in localStorage['picocrank-theme'],
which wins over prefers-color-scheme. seed.py keeps that key when it resets
localStorage and then reloads, so the theme applies on load. The media
emulation is set too, so anything still following the system matches.
Every section pins it (light.py in [DEFAULT], dark.py on dark sections).
"""


def set_theme(driver, theme):
    driver.execute_cdp_cmd(
        "Emulation.setEmulatedMedia",
        {"features": [{"name": "prefers-color-scheme", "value": theme}]},
    )
    driver.execute_script(
        "localStorage.setItem('picocrank-theme', arguments[0]);", theme
    )
