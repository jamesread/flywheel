"""Pins the colour scheme; the browser session is shared across captures.

Flywheel only follows prefers-color-scheme, so this emulates it through the
DevTools protocol. The emulation persists until changed, hence every section
pins it (light.py in [DEFAULT], dark.py on dark sections).
"""


def set_theme(driver, theme):
    driver.execute_cdp_cmd(
        "Emulation.setEmulatedMedia",
        {"features": [{"name": "prefers-color-scheme", "value": theme}]},
    )
