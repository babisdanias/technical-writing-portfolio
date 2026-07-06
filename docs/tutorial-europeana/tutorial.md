---
id: europeana-tutorial
title: Build a command-line search tool with the Europeana API
sidebar_position: 1
---
# Build a command-line search tool with the Europeana API

Europeana provides access to millions of digitized historical objects from museums, libraries, and archives across Europe
— including ancient Greek pottery, sculpture, and manuscripts.

In this tutorial, you will build a command-line tool in Python that searches Europeana for ancient Greek artifacts and prints
each result as a readable card: title, holding institution, date, license, and a link to view the item.
Next, you will update the script to read your own search words and add a filter to show only items that are free to reuse.

You will build this project in small steps, and at the end of each step, you will run your code to see the new output. The entire process takes about 30 minutes.

## Before you begin

You need three things:

- **Python 3.9 or later.** This guide uses the `python` command. (Note: On some systems, you may need to type `python3` instead).
- **The [`requests`](https://pypi.org/project/requests/) library.** Install it with `pip install requests`.
- **A personal Europeana API key.** Create one at [europeana.eu/en/account/api-keys](https://europeana.eu/en/account/api-keys).

## Step 1: Set your API key

Open your terminal. Run the command for your system to save your key. Replace `YOUR_API_KEY` with your real key:
**Linux or Mac:**

```bash
export EUROPEANA_API_KEY=YOUR_API_KEY
```

**Windows (PowerShell):**

```powershell
$env:EUROPEANA_API_KEY = "YOUR_API_KEY"
```

**Windows (Command Prompt):**

```cmd
set EUROPEANA_API_KEY=YOUR_API_KEY
```

**Important:** This setup only lasts while your current terminal window stays open.
 If you close the window and come back later, you must run this command again before you run your script.

## Step 2: Make your first request

Create a file named `search.py` and paste the following code:

```python
import os

import requests

API_KEY = os.environ.get("EUROPEANA_API_KEY")
if not API_KEY:
    raise SystemExit("Set the EUROPEANA_API_KEY environment variable, then run the script again.")

BASE_URL = "https://api.europeana.eu/record/v2/search.json"

params = {
    "query": "ancient greek amphora",
    "wskey": API_KEY,
    "rows": 5,
    "qf": "TYPE:IMAGE",
}

response = requests.get(BASE_URL, params=params, timeout=10)
response.raise_for_status()
data = response.json()

print(f"Found {data['totalResults']} matching items in Europeana.")
```

The request sends four parameters:

- `query` — the search term.
- `wskey` — your API key, required on every request.
- `rows` — how many results to return. Five keeps the output readable.
- `qf` set to `TYPE:IMAGE` — limits results to image records: photographed objects rather than text documents.

Run the script:

```bash
python search.py
```

Your output will look similar to the following:

```
Found 1571 matching items in Europeana.
```

Your key works, and you've made your first successful search. The exact number may differ as Europeana's collections grow.

## Step 3: Print the titles

A count proves the search works — now show what it found. In `search.py`, replace the final line (the `print(...)` call) with the following code:

```python
print(f"Found {data['totalResults']} matching items. Showing the first 5:\n")

for item in data["items"]:
    english_titles = item.get("dcTitleLangAware", {}).get("en")
    if english_titles:
        title = english_titles[0]
    else:
        title = (item.get("title") or ["Untitled"])[0]
    print(title)
```

Europeana gathers records from institutions across Europe, and many write their titles in their own language.
The loop looks for an English title first. It checks `dcTitleLangAware`, which stores titles by language code.
If it cannot find English, it falls back to the original title.

Run the script again:

```bash
python search.py
```

The output is similar to the following:

```
Found 1571 matching items. Showing the first 5:

Ancient Greek pottery. Amphora
Ancient Greek pottery. Amphora
Ancient Greek pottery. Amphora
Ancient Greek pottery. Design amphora
Ancient Greek pottery. Fragments amphora Niobide
```

Because Europeana's database updates constantly, your exact titles might look different. 
The code ensures the script will print a title safely, regardless of what language the institution used.

## Step 4: Show institution, date, rights, and link

A title alone doesn't tell you where an item is held or whether you can use it. In `search.py`,
replace everything below the `data = response.json()` line with the following code:

```python
print(f"Found {data['totalResults']} matching items. Showing the first 5:\n")
print("-" * 50)

for item in data["items"]:
    english_titles = item.get("dcTitleLangAware", {}).get("en")
    if english_titles:
        title = english_titles[0]
    else:
        title = (item.get("title") or ["Untitled"])[0]

    institution = (item.get("dataProvider") or ["Unknown institution"])[0]
    country = (item.get("country") or ["Unknown country"])[0]

    timespans = item.get("edmTimespanLabel")
    date = timespans[0].get("def", "Unknown date") if timespans else "Unknown date"

    rights = (item.get("rights") or ["No rights information"])[0]

    # The item URL embeds tracking parameters; keep only the clean link.
    link = item.get("guid", "No link available").split("?")[0]

    print(f"Title:       {title}")
    print(f"Institution: {institution} ({country})")
    print(f"Date:        {date}")
    print(f"Rights:      {rights}")
    print(f"View:        {link}")
    print("-" * 50)
```

The loop reads these additional fields from each record:

- `dataProvider` and `country` — the museum, library, or archive that holds the item, and where it is located.
- `edmTimespanLabel` — the artifact's date, when the record includes one. If a record lacks a date, the script prints `"Unknown date"`.
- `rights` — the URL of the exact license that applies to the item.
- `guid` — the item's page on Europeana. The code removes the URL's tracking parameters so the link is clean to share.

Run the script again. The output is similar to the following:

```
Found 1571 matching items. Showing the first 5:

--------------------------------------------------
Title:       Ancient Greek pottery. Amphora
Institution: Catholic University of Leuven (Belgium)
Date:        1910/1939
Rights:      http://creativecommons.org/publicdomain/mark/1.0/
View:        https://www.europeana.eu/item/2024903/photography_ProvidedCHO_KU_Leuven_9991819830101488
--------------------------------------------------
...
```
Each result is now a complete card. You can clearly see the `Rights` link, which is what you will use in the next step.

## Step 5: Filter for freely reusable items

You can tell the API to return only items that are free to reuse. In your `params` block, add the `"reusability"` line so it looks like this:

```python
params = {
    "query": "ancient greek amphora",
    "wskey": API_KEY,
    "rows": 5,
    "qf": "TYPE:IMAGE",
    "reusability": "open",
}
```

Run the script again. Your output will look similar to the following:

```
Found 240 matching items. Showing the first 5:

--------------------------------------------------
Title:       Ancient Greek pottery. Amphora
Institution: Catholic University of Leuven (Belgium)
Date:        1910/1939
Rights:      http://creativecommons.org/publicdomain/mark/1.0/
View:        https://www.europeana.eu/item/2024903/photography_ProvidedCHO_KU_Leuven_9991819830101488
--------------------------------------------------
...
```
The total number dropped from 1,571 to 240. The filter removed every item you cannot freely use.
Every `Rights` link in your output now points to an open license, like Creative Commons or the Public Domain Mark.

Keep printing the rights link even with the filter on — it tells anyone using your script the exact terms that apply to each item.

## Step 6: Make the tool interactive

Right now, the search term and the filter are fixed in the code. In this final step,
the script asks for both when it starts — turning it into a real search tool.
Replace the entire contents of `search.py` with this version:

```python
import os

import requests

API_KEY = os.environ.get("EUROPEANA_API_KEY")
if not API_KEY:
    raise SystemExit("Set the EUROPEANA_API_KEY environment variable, then run the script again.")

BASE_URL = "https://api.europeana.eu/record/v2/search.json"


def search_artifacts(query, open_only=False, rows=5):
    """Search Europeana and print a readable card for each result."""
    params = {
        "query": query,
        "wskey": API_KEY,
        "rows": rows,
        "qf": "TYPE:IMAGE",
    }
    if open_only:
        params["reusability"] = "open"

    response = requests.get(BASE_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    print(f"\nFound {data['totalResults']} matching items. Showing the first {rows}:\n")
    print("-" * 50)

    for item in data["items"]:
        english_titles = item.get("dcTitleLangAware", {}).get("en")
        if english_titles:
            title = english_titles[0]
        else:
            title = (item.get("title") or ["Untitled"])[0]

        institution = (item.get("dataProvider") or ["Unknown institution"])[0]
        country = (item.get("country") or ["Unknown country"])[0]

        timespans = item.get("edmTimespanLabel")
        date = timespans[0].get("def", "Unknown date") if timespans else "Unknown date"

        rights = (item.get("rights") or ["No rights information"])[0]

        # Remove tracking parameters for a clean link.
        link = item.get("guid", "No link available").split("?")[0]

        print(f"Title:       {title}")
        print(f"Institution: {institution} ({country})")
        print(f"Date:        {date}")
        print(f"Rights:      {rights}")
        print(f"View:        {link}")
        print("-" * 50)


if __name__ == "__main__":
    print("Europeana Ancient Artifact Search")
    print("=================================")
    query = input("Search term: ")
    filter_choice = input("Show only freely reusable items? (yes/no): ").strip().lower()
    search_artifacts(query, open_only=(filter_choice == "yes"))
```

Two things changed. First, the search logic now lives in a `search_artifacts` function — 
everything inside it is the exact code you already wrote. Second, the block at the bottom
asks you for a search term and a filter choice, then passes them to the function.

Run the script one more time and answer the prompts:

```bash
python search.py
```

```
Europeana Ancient Artifact Search
=================================
Search term: ancient greek amphora
Show only freely reusable items? (yes/no): yes

Found 240 matching items. Showing the first 5:

--------------------------------------------------
Title:       Ancient Greek pottery. Amphora
Institution: Catholic University of Leuven (Belgium)
Date:        1910/1939
Rights:      http://creativecommons.org/publicdomain/mark/1.0/
View:        https://www.europeana.eu/item/2024903/photography_ProvidedCHO_KU_Leuven_9991819830101488
--------------------------------------------------
...
```

## What you built

In six steps, you built a complete command-line search tool. It authenticates with your API key,
queries the Europeana Search API, handles multilingual records, shows the exact license of every item, and filters for results that are free to reuse.

Try it with your own searches — `homer papyrus`, `cicero manuscript`, `kalevala illustration`. The tool handles any term you give it.

## Where to go next

- **Page through large result sets.** The Search API's `cursor` parameter lets you retrieve results beyond the first page.
- **Retrieve full item records.** Each result includes a `link` field pointing to the Record API. You can use this to get an item's full details, including its measurements, where it was found, and its full description.
- **Show images.** Each result includes an `edmPreview` field with a thumbnail link you can display in a richer interface.
- **Search other media.** Remove the `TYPE:IMAGE` filter to include manuscripts, audio recordings, and video.

To review the exact parameters, response fields, and license rules used in this script, check the [Europeana Search API quick reference](./tutorial-reference.md). For the complete API, see the official [Europeana APIs documentation](https://europeana.atlassian.net/wiki/spaces/EF/pages/2385313793/Europeana+APIs+Documentation).
