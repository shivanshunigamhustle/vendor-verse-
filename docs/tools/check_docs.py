#!/usr/bin/env python3
"""Consistency check and phase-view generator for the VendorVerse docs.

    python docs/tools/check_docs.py            # check only (exit 1 on problems)
    python docs/tools/check_docs.py --write    # also regenerate docs/02-phase-scope.md tables

Checks:
  * every feature ID in 01-feature-spec.md is unique, has a valid phase, and appears in 03-mockup-sync-matrix.md
  * every feature ID in the matrix exists in the spec
  * every screen ID in the matrix exists in the web / mobile registry
  * every registry screen is mapped to a feature or listed as retired
  * statuses are from the allowed set
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPEC = ROOT / "docs" / "01-feature-spec.md"
MATRIX = ROOT / "docs" / "03-mockup-sync-matrix.md"
PHASE = ROOT / "docs" / "02-phase-scope.md"
WEB_REG = ROOT / "web" / "src" / "registry.jsx"
MOB_REG = ROOT / "mobile" / "src" / "registry.jsx"

PHASES = ["P1", "P2", "P3", "OPEN"]
STATUSES = {"Done", "Partial", "Missing", "Hold", "Unverified", "N/A"}
BEGIN, END = "<!-- BEGIN GENERATED: do not edit by hand, run check_docs.py --write -->", "<!-- END GENERATED -->"


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def registry_ids(path):
    return set(re.findall(r"R\('(\w+)'", path.read_text(encoding="utf8")))


def parse_spec():
    feats, area = {}, None
    for line in SPEC.read_text(encoding="utf8").splitlines():
        m = re.match(r"## \d+\. (.+?) \((\w+)\)", line)
        if m:
            area = m.group(1)
        if line.startswith("| F-"):
            c = cells(line)
            feats[c[0]] = {"name": c[1], "phase": c[2], "area": area}
    return feats


def main():
    write = "--write" in sys.argv
    errors = []
    spec_lines = [l for l in SPEC.read_text(encoding="utf8").splitlines() if l.startswith("| F-")]
    ids = [cells(l)[0] for l in spec_lines]
    for i in {x for x in ids if ids.count(x) > 1}:
        errors.append(f"duplicate feature ID in spec: {i}")
    feats = parse_spec()
    for fid, f in feats.items():
        if f["phase"] not in PHASES:
            errors.append(f"{fid}: phase '{f['phase']}' not in {PHASES}")

    web_ids, mob_ids = registry_ids(WEB_REG), registry_ids(MOB_REG)
    mapped_web, mapped_mob, matrix_ids = set(), set(), []
    for line in MATRIX.read_text(encoding="utf8").splitlines():
        if line.startswith("| F-"):
            c = cells(line)
            fid = c[0]
            matrix_ids.append(fid)
            if fid not in feats:
                errors.append(f"matrix has {fid} which is not in the spec")
            for col, status_col, reg, bag, label in ((1, 2, web_ids, mapped_web, "web"), (3, 4, mob_ids, mapped_mob, "mobile")):
                for s in re.findall(r"`(\w+)`", c[col]):
                    if s not in reg:
                        errors.append(f"{fid}: {label} screen `{s}` not in {label} registry")
                    bag.add(s)
                if c[status_col] not in STATUSES:
                    errors.append(f"{fid}: {label} status '{c[status_col]}' invalid")
        elif line.startswith("| RET-"):
            c = cells(line)
            for s in re.findall(r"`(\w+)`", c[1]):
                if s not in web_ids:
                    errors.append(f"{c[0]}: web screen `{s}` not in web registry")
                mapped_web.add(s)
            if c[3] not in feats:
                errors.append(f"{c[0]}: folds into unknown feature {c[3]}")
    for i in {x for x in matrix_ids if matrix_ids.count(x) > 1}:
        errors.append(f"duplicate feature ID in matrix: {i}")
    for fid in feats:
        if fid not in matrix_ids:
            errors.append(f"{fid} is in the spec but not in the matrix")
    for s in sorted(web_ids - mapped_web):
        errors.append(f"web screen `{s}` is not mapped to any feature or retired")
    for s in sorted(mob_ids - mapped_mob):
        errors.append(f"mobile screen `{s}` is not mapped to any feature")

    counts = {p: sum(1 for f in feats.values() if f["phase"] == p) for p in PHASES}
    print(f"features: {len(feats)}  " + "  ".join(f"{p}={n}" for p, n in counts.items()))
    print(f"web screens: {len(web_ids)} ({len(mapped_web)} mapped)  mobile screens: {len(mob_ids)} ({len(mapped_mob)} mapped)")

    if write:
        out = [BEGIN, ""]
        titles = {"P1": "Phase 1 (launch scope)", "P2": "Phase 2", "P3": "Phase 3 (roadmap)", "OPEN": "Phase not decided (OPEN)"}
        for p in PHASES:
            out.append(f"### {titles[p]}: {counts[p]} features\n")
            out.append("| ID | Feature | Area |")
            out.append("|---|---|---|")
            for fid, f in feats.items():
                if f["phase"] == p:
                    out.append(f"| {fid} | {f['name']} | {f['area']} |")
            out.append("")
        out.append(END)
        text = PHASE.read_text(encoding="utf8")
        block = "\n".join(out)
        if BEGIN in text:
            text = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END), lambda _: block, text, flags=re.S)
            PHASE.write_text(text, encoding="utf8")
            print("regenerated docs/02-phase-scope.md tables")
        else:
            errors.append("02-phase-scope.md has no generated block markers")

    if errors:
        print(f"\n{len(errors)} problem(s):")
        for e in errors:
            print("  -", e)
        return 1
    print("OK: spec, matrix and registries agree")
    return 0


if __name__ == "__main__":
    sys.exit(main())
