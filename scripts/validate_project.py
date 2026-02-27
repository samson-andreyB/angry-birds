#!/usr/bin/env python3
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
JS_PATH = ROOT / "AngryBirdsGame.js"

REQUIRED_FILES = [
    ROOT / "index.html",
    ROOT / "AngryBirds.htm",
    ROOT / "AngryBirdsGame.htm",
    ROOT / "AngryBirdsGame.js",
    ROOT / "worker.js",
]


def fail(msg: str) -> None:
    print(f"[FAIL] {msg}")
    sys.exit(1)


def main() -> int:
    for f in REQUIRED_FILES:
        if not f.exists():
            fail(f"Missing required file: {f.relative_to(ROOT)}")

    js = JS_PATH.read_text(encoding="utf-8", errors="ignore")

    # 1) Check referenced embedded assets exist on disk.
    refs = sorted(set(re.findall(r"assets/embedded/[A-Za-z0-9_./-]+", js)))
    missing = [p for p in refs if not (ROOT / p).exists()]
    if missing:
        print("[FAIL] Missing embedded assets referenced in AngryBirdsGame.js:")
        for p in missing:
            print(f"  - {p}")
        return 1

    # 2) Ensure level definitions are contiguous and loaded.
    defined = sorted(set(int(n) for n in re.findall(r"var\s+level(\d+)\s*=", js)))
    loaded = sorted(set(int(n) for n in re.findall(r'load\.text\("level(\d+)"', js)))

    if not defined:
        fail("No level definitions found (var levelN = ...)")

    expected = list(range(1, max(defined) + 1))
    if defined != expected:
        fail(f"Level definitions are not contiguous. Found: {defined}")

    if loaded != expected:
        fail(f"Loaded levels mismatch. Expected {expected}, got {loaded}")

    # 3) Ensure no legacy states are still registered.
    if 'game.state.add("AngryBirds.Splash"' in js or 'game.state.add("AngryBirds.Disclaimer"' in js:
        fail("Legacy Splash/Disclaimer states are still registered")

    print("[OK] Project validation passed")
    print(f"[INFO] Referenced embedded assets: {len(refs)}")
    print(f"[INFO] Levels defined/loaded: 1..{max(defined)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
