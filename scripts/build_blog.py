from __future__ import annotations

import json
import math
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "blog-src" / "content" / "posts"
OUTPUT_DIR = ROOT / "blog"
MANIFEST_PATH = OUTPUT_DIR / "posts.json"


def parse_date(value: str) -> datetime | None:
    formats = ("%Y-%m-%d %H:%M", "%Y-%m-%d", "%Y/%m/%d")
    for date_format in formats:
        try:
            return datetime.strptime(value.strip(), date_format)
        except ValueError:
            continue
    return None


def strip_markdown(content: str) -> str:
    cleaned = content
    cleaned = re.sub(r"```[\s\S]*?```", " ", cleaned)
    cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)
    cleaned = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", cleaned)
    cleaned = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", cleaned)
    cleaned = re.sub(r"^#{1,6}\s+", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^>\s?", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^[-*+]\s+", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^\d+\.\s+", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"\*\*(.*?)\*\*", r"\1", cleaned)
    cleaned = re.sub(r"\*(.*?)\*", r"\1", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()


def parse_markdown_file(file_path: Path) -> dict[str, object]:
    text = file_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    metadata: dict[str, str] = {}
    body_lines: list[str] = []
    in_metadata = True

    for line in lines:
        if in_metadata:
            if not line.strip():
                in_metadata = False
                continue

            if ":" in line:
                key, value = line.split(":", 1)
                metadata[key.strip().lower()] = value.strip()
                continue

            in_metadata = False

        body_lines.append(line)

    title = metadata.get("title") or file_path.stem.replace("-", " ").title()
    slug = metadata.get("slug") or file_path.stem
    date_raw = metadata.get("date", "")
    parsed_date = parse_date(date_raw)
    summary = metadata.get("summary", "").strip()
    body = "\n".join(body_lines).strip()

    if not summary:
        summary = strip_markdown(body).split(". ")[0].strip()

    plain_text = strip_markdown(body)
    word_count = len([word for word in plain_text.split() if word])
    read_time = max(1, math.ceil(word_count / 220))
    tags = [tag.strip() for tag in metadata.get("tags", "").split(",") if tag.strip()]

    return {
        "title": title,
        "excerpt": summary,
        "date": date_raw or "",
        "dateLabel": parsed_date.strftime("%b %d, %Y") if parsed_date else (date_raw or "Undated"),
        "readTime": read_time,
        "tags": tags,
        "url": f"./blog/{slug}.html",
        "sortTime": parsed_date.timestamp() if parsed_date else 0,
    }


def build_pelican_output() -> None:
    command = [
        sys.executable,
        "-m",
        "pelican",
        "-s",
        "pelicanconf.py",
        "-o",
        "blog",
        "--delete-output-directory",
    ]
    subprocess.run(command, cwd=ROOT, check=True)


def write_manifest() -> int:
    posts = [parse_markdown_file(file_path) for file_path in SOURCE_DIR.glob("*.md")]
    posts.sort(key=lambda post: float(post["sortTime"]), reverse=True)

    manifest = []
    for post in posts:
        manifest.append({key: value for key, value in post.items() if key != "sortTime"})

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return len(manifest)


def main() -> int:
    if not SOURCE_DIR.exists():
        print(f"Source directory not found: {SOURCE_DIR}", file=sys.stderr)
        return 1

    try:
        build_pelican_output()
    except subprocess.CalledProcessError as error:
        print("Pelican build failed. Install dependencies with: uv sync", file=sys.stderr)
        return error.returncode or 1

    post_count = write_manifest()
    print(f"Built {post_count} blog post(s) into {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
