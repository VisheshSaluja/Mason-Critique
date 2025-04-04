import requests
from bs4 import BeautifulSoup
import csv
import json

FACULTY_URL = "https://cs.gmu.edu/directory/by-category/faculty/"
response = requests.get(FACULTY_URL)
soup = BeautifulSoup(response.content, "html.parser")

faculty_data = []
faculty_cards = soup.select("div.person")

for idx, card in enumerate(faculty_cards, 1):
    fields = card.find("div", class_="person-fields-container")
    contact = card.find("div", class_="contact")

    name = fields.find("div", class_="name").get_text(strip=True) if fields.find("div", class_="name") else "N/A"
    title = fields.find("div", class_="jobtitle").get_text(strip=True) if fields.find("div", class_="jobtitle") else "N/A"

    office = phone = email = website = "N/A"

    contact_fields = contact.find_all("div", class_="field")
    for field in contact_fields:
        label = field.find("div", class_="field-name").get_text(strip=True)
        value_div = field.find("div", class_="field-value")

        if label == "Office":
            office = value_div.get_text(strip=True)
        elif label == "Phone":
            phone = value_div.get_text(strip=True)
        elif label == "Email":
            a_tag = value_div.find("a", href=True)
            email = a_tag.get_text(strip=True) if a_tag else value_div.get_text(strip=True)
        elif label == "Web":
            a_tag = value_div.find("a", href=True)
            website = a_tag["href"] if a_tag else value_div.get_text(strip=True)

    faculty_data.append({
        "id": idx,
        "name": name,
        "title": title,
        "email": email,
        "office": office,
        "phone": phone,
        "website": website
    })

# Save to CSV
if faculty_data:
    with open("gmu_cs_faculty_final.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=faculty_data[0].keys())
        writer.writeheader()
        writer.writerows(faculty_data)

    # Save to JSON
    with open("gmu_cs_faculty_final.json", "w", encoding="utf-8") as jf:
        json.dump(faculty_data, jf, indent=2)

    print(f"✅ Scraped and saved {len(faculty_data)} faculty members.")
else:
    print("⚠️ Still no faculty data found — please check the page structure again.")
