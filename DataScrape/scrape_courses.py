import requests
from bs4 import BeautifulSoup
import csv
import json

COURSE_URL = "https://catalog.gmu.edu/courses/cs/"
response = requests.get(COURSE_URL)
soup = BeautifulSoup(response.content, "html.parser")

courses = []

course_blocks = soup.select("div.courseblock")

for block in course_blocks:
    code_tag = block.select_one("strong.cb_code")
    title_tag = block.select_one("em.cb_title")

    code = code_tag.get_text(strip=True).replace('\xa0', ' ') if code_tag else "N/A"
    title = title_tag.get_text(strip=True) if title_tag else "N/A"

    courses.append({
        "code": code,
        "title": title
    })

# Save to CSV
if courses:
    with open("gmu_cs_courses.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["code", "title"])
        writer.writeheader()
        writer.writerows(courses)

    # Save to JSON
    with open("gmu_cs_courses.json", "w", encoding="utf-8") as jf:
        json.dump(courses, jf, indent=2)

    print(f"✅ Scraped and saved {len(courses)} CS courses.")
else:
    print("⚠️ No courses found — check selector.")
