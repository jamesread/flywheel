"""Resets the app's localStorage to the fictional seed in ../seed/ and reloads.

Flywheel keeps all state in localStorage (see frontend/src/utils/storage.js),
so this writes the same keys and formats the app does. Ticks are keyed by
today's UTC date, computed in the browser exactly as the app does.
"""
import json
import os
import time

SEED = os.path.join(os.path.dirname(__file__), "..", "seed")


def _load(name):
    with open(os.path.join(SEED, name), encoding="utf-8") as f:
        return json.load(f)


def run(driver):
    habits = _load("habits.json")
    ticks = _load("ticks.json")
    driver.execute_script(
        """
        const [habits, ticked, cacheVersion] = arguments;
        const today = new Date().toISOString().split('T')[0];
        localStorage.clear();
        localStorage.setItem('flywheel_habits', JSON.stringify(habits));
        localStorage.setItem('flywheel_ticks', JSON.stringify({[today]: ticked}));
        localStorage.setItem('flywheel_cache_version', cacheVersion);
        localStorage.setItem('flywheel_install_dismissed', 'true');
        location.reload();
        """,
        habits,
        ticks["ticked_today"],
        ticks["cache_version"],
    )
    time.sleep(2)
