---
id: open-library-guide
title: Getting started with the Open Library API
sidebar_position: 1
---
# Open Library API: Search for books and authors

The Open Library API provides access to one of the world's largest open book databases.
It is free to use and requires no API key or account.

This guide shows you how to complete the core research workflow:

1. Search for a book by title, author, or keyword.
2. Retrieve full metadata for a specific work.
3. Look up an author's biography and other works.

## Prerequisites

Before you begin, make sure you have the following:

- **An HTTP client.** You can run the examples using `curl`,
  [Postman](https://www.postman.com/downloads/), or any other client that sends HTTP requests.
- **An internet connection.** No API key or account is required.
- **Familiarity with JSON.** All API responses return JSON.

## Base URLs

This guide uses two base URLs:

| Service                                          | Base URL                          |
|--------------------------------------------------|-----------------------------------|
| Search, works, authors, editions, subjects, ISBN | `https://openlibrary.org`         |
| Cover images                                     | `https://covers.openlibrary.org`  |

Add each endpoint path to the relevant base URL.

Any request can return `503 Service Unavailable` if Open
Library is temporarily down. Wait and retry, increasing the delay each time.

## Step 1: Search for a book

Use the search endpoint to find a book by title, author, or keyword.

### HTTP request

```http
GET https://openlibrary.org/search.json
```

### Parameters

| Parameter | Example          | Description                          |
|-----------|------------------|--------------------------------------|
| `q`       | `q=republic`     | Searches by general keyword.         |
| `author`  | `author=plato`   | Filters by author name.              |
| `title`   | `title=republic` | Filters by title.                    |
| `limit`   | `limit=5`        | Sets the maximum number of results.  |

Text parameters (`q`, `author`, `title`) accept any value without validation,
and unknown parameters are ignored rather than rejected. Numeric parameters
like `limit` must receive a number, or the API returns `422` (see
[Error responses](#error-responses)).

### Send a request

The following request searches for the *Republic*:

```bash
curl "https://openlibrary.org/search.json?q=republic"
```

To filter, combine parameters — for example:

```bash
curl "https://openlibrary.org/search.json?author=plato&title=republic&limit=5"
```

### Interpret the response

A successful request returns `200 OK` with a JSON body. The following example
shows a partial response for `?q=republic`:

```json
{
  "numFound": 165016,
  "start": 0,
  "q": "republic",
  "docs": [
    {
      "author_key": [
        "OL12823A"
      ],
      "author_name": [
        "Plato"
      ],
      "cover_i": 14418448,
      "ebook_access": "public",
      "edition_count": 794,
      "first_publish_year": 1554,
      "key": "/works/OL51831W",
      "title": "πολιτεία"
    }
  ]
}
```

| Field                  | Type    | Description                                                                                                        |
|------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| `numFound`             | integer | Total number of matching works.                                                                                    |
| `docs`                 | array   | Works matching your search query.                                                                                  |
| `docs[].author_key`    | array   | Unique identifiers for each author, as used internally by Open Library.                                            |
| `docs[].author_name`   | array   | Author names, which often appear in non-Latin scripts.                                                             |
| `docs[].cover_i`       | integer | A single cover image ID for this work. See [Display cover images and author photos](#display-cover-images-and-author-photos).|
| `docs[].ebook_access`  | string  | Public accessibility status of the full text. See the following table for possible values.                                   |
| `docs[].edition_count` | integer | Number of published editions. A higher count generally reflects a longer publication history.                                |
| `docs[].key`           | string  | Unique identifier for the work. You use this in [Step 2](#step-2-retrieve-a-specific-work).                                  |
| `docs[].title`         | string  | Title of the work, which often appears in a non-Latin script.                                                                |

**Handle non-Latin characters.** Open Library stores text fields, including
`author_name` and `title`, exactly as they appear in its database, often in
their original scripts. For example, searching for "republic" may return
`"title": "πολιτεία"` — the ancient Greek form. Make sure your application can
handle and display non-Latin characters in these fields.

**Understand `ebook_access` values.**

| Value           | Description                                               |
|-----------------|--------------------------------------------------------- -|
| `public`        | Fully accessible with no restrictions.                    |
| `borrowable`    | Available through the Internet Archive lending program.   |
| `printdisabled` | Accessible only to users with print disabilities.         |
| `no_ebook`      | No digital version available                              |

Ancient Greek and Latin works are in the public domain, but modern translations
are not. A recent English translation of the *Republic* likely returns
`"ebook_access": "borrowable"`, even though Plato's original text is thousands
of years old.

**Save the `key` value from your first result.** It looks like `/works/OL51831W` —
keep just the ID at the end (`OL51831W`). You'll use it in the next step.

### Error responses

| Status code                | Cause                                                                     | What to do                                       |
|----------------------------|---------------------------------------------------------------------------|--------------------------------------------------|
| `422 Unprocessable Entity` | A parameter value has the wrong type (for example, a non-numeric `limit`).| Pass a number to numeric parameters like `limit`.|

## Step 2: Retrieve a specific work

Use the work key from Step 1 to retrieve its full metadata.

### HTTP request

```http
GET https://openlibrary.org/works/{work_id}.json
```

Replace `{work_id}` with the ID you saved — for example, `OL51831W`.

### Send a request

```bash
curl "https://openlibrary.org/works/OL51831W.json"
```

### Interpret the response

A successful request returns `200 OK`. The following example shows a partial
response for the *Republic* (`OL51831W`):

```json
{
  "description": "The Republic is Plato's most famous work and one of the seminal texts of Western philosophy...",
  "authors": [
    {
      "author": { "key": "/authors/OL12823A" },
      "type": { "key": "/type/author_role" }
    }
  ],
  "covers": [14418448],
  "first_publish_date": "1963",
  "key": "/works/OL51831W",
  "subject_people": ["Plato", "Platōn"],
  "subject_times": ["Early works to 1800", "Ouvrages avant 1800"],
  "subjects": ["Political science", "Justice"],
  "title": "πολιτεία"
}
```

| Field            | Description                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------|
| `description`    | Summary of the work. For the format, see the note below.                                                   |
| `authors`        | Author references. Each contains a `key` you use in [Step 3](#step-3-retrieve-author-details).             |
| `covers`         | Cover image IDs. See [Display cover images and author photos](#display-cover-images-and-author-photos).    |
| `subject_people` | Historical figures referenced in the work.                                      |
| `subject_times`  | Historical periods associated with the work.                                     |

**Handle two `description` formats.** The `description` field returns either a
plain string or an object:

```json
"description": "The Republic is Plato's most famous work..."
```

```json
"description": {
  "type": "/type/text",
  "value": "The Republic is Plato's most famous work..."
}
```

Check the type before accessing the value; otherwise your code will fail on
one of the two formats.

**Handle duplicate `subject_people` and `subject_times` entries.** Because both
fields combine data from multiple library cataloging traditions, the same entity
often appears more than once in different formats or languages:

```json
"subject_people": [
  "Plato",
  "Platōn (427-347 p.Ch)",
  "Platon (0427?-0348? av. J.-C.)."
]
```

Before displaying these entries in your UI, de-duplicate or group them.

**Save the author key from the work's `authors` array.** Each entry's
`author.key` looks like `/authors/OL12823A`. Keep just the ID (`OL12823A`) to
use in the next step.

### Error responses

| Status code     | Cause                                      | What to do                                         |
|-----------------|--------------------------------------------|----------------------------------------------------|
| `404 Not Found` | The work ID does not exist in Open Library. | Confirm the ID came from a Step 1 search response.|

## Step 3: Retrieve author details

Use the author key from Step 2 to retrieve the author's biography, dates, and
external identifiers.

### HTTP request

```http
GET https://openlibrary.org/authors/{author_id}.json
```

Replace `{author_id}` with the ID you saved — for example, `OL12823A`.

### Send a request

```bash
curl "https://openlibrary.org/authors/OL12823A.json"
```

### Interpret the response

A successful request returns `200 OK`. The following example shows a partial
response:

```json
{
  "alternate_names": [
    "Πλάτων",
    "Platon",
    "Platōn",
    "Platón",
    "Platone"
  ],
  "remote_ids": {
    "wikidata": "Q859",
    "project_gutenberg": "93"
  },
  "photos": [
    6457448,
    3366955,
    6319952,
    6319966,
    -1
  ],
  "death_date": "348/347 BC",
  "bio": "Classical Greek philosopher",
  "name": "Plato",
  "birth_date": "428/427 BC"
}
```

| Field             | Description                                                                                                |
|-------------------|------------------------------------------------------------------------------------------------------------|
| `alternate_names` | Other names the author is known by, including non-Latin scripts.                                           |
| `remote_ids`      | Cross-references to external databases. See the following table for details.                               |
| `photos`          | Author photo IDs. See Display cover images and author photos. A value of -1 means no photo exists. Before building a URL, filter out this value.|
| `death_date`      | Date of death. The format varies, and this field may be absent.                                                                                 |
| `bio`             | Biography. This field returns either a plain string or an object, similar to the `description` field in [Step 2](#step-2-retrieve-a-specific-work). |
| `name`            | Author's full name                                                                                                                                  |
| `birth_date`      | Date of birth. The format varies and may be approximate or absent for ancient authors.                                                              |

**Use `remote_ids` to link to external sources.** This field is particularly
useful if you're building a research tool — it lets you link an author profile
to authoritative external databases without additional searching. For example:

| Identifier          | Description                                                 |
|---------------------|-------------------------------------------------------------|
| `project_gutenberg` | Links to freely accessible texts on Project Gutenberg.      |
| `wikidata`          | Links to Wikidata's multilingual structured knowledge base. |

Not every author has all identifiers populated. Before using a field, check if it exists.

**Handle missing fields gracefully.** For ancient authors, many fields —
including `bio`, `birth_date`, and `death_date` — may be null or absent. Your
application must handle both null and missing fields without throwing an error.

### Retrieve all works by an author

Once you have the author key, retrieve all works associated with that author:

```bash
curl "https://openlibrary.org/authors/OL12823A/works.json"
```

This lets users start from a single text and discover an author's entire
body of work in one request.

### Error responses

| Status code     | Cause                                        | What to do                                        |
|-----------------|----------------------------------------------|---------------------------------------------------|
| `404 Not Found` | The author ID does not exist in Open Library. | Confirm the ID came from a Step 2 work response. |

## Next steps

Now that you've completed the core workflow, here are a few ways to build on it.

### Explore subjects and topics

To browse all works in a specific category, use the subjects endpoint:

```bash
curl "https://openlibrary.org/subjects/ancient_greek_literature.json"
```

This enables category-level browsing, letting users explore an entire
literary tradition without knowing specific titles.

**Handle inconsistent subject taxonomy.** Open Library's subject tags are
community-contributed. The same body of literature may be cataloged under
different tags depending on who added the record:

-`greek_literature`         
-`classical_literature`     
-`ancient_philosophy`       
-`ancient_greek_literature` 

For comprehensive results, run parallel requests across multiple subject
endpoints and merge the results in your application.

---

### Retrieve editions of a work

A work is the abstract text (for example, the *Republic*). 
An edition is a specific published version, such as an *Oxford Classics translation*
with a particular ISBN and page count.

To retrieve all editions of a work, use the work key from
[Step 2](#step-2-retrieve-a-specific-work):

```bash
curl "https://openlibrary.org/works/OL51831W/editions.json"
```

**Use the work key, not the author key.** Passing an author key to this
endpoint returns `404 Not Found` error. Before constructing a request, verify which key type you are using.

---

### Display cover images and author photos

Both works and authors can have associated images. Works have **cover images**
(from the `covers` field in [Step 2](#step-2-retrieve-a-specific-work)); authors
have **photos** (from the `photos` field in
[Step 3](#step-3-retrieve-author-details)). Both use the same image endpoint and
ID pattern.

```http
GET https://covers.openlibrary.org/b/id/{id}-{size}.jpg
```

Replace `{id}` with a numeric ID from the `covers` array
([Step 2](#step-2-retrieve-a-specific-work)) or the `photos` array
([Step 3](#step-3-retrieve-author-details)). Replace `{size}` with one of the
following values:

| Value | Description |
|-------|-------------|
| `S`   | Small       |
| `M`   | Medium      |
| `L`   | Large       |

**Display a work's cover image.** Use a numeric ID from the work's `covers`
array (for example, `14418448`):

```bash
curl "https://covers.openlibrary.org/b/id/14418448-M.jpg" --output cover.jpg
```

**Display an author's photo.** Use a numeric ID from the author's `photos`
array (for example, `6457448`):

```bash
curl "https://covers.openlibrary.org/b/id/6457448-M.jpg" --output photo.jpg
```

**Handle missing photos.** Unlike `covers`, the `photos` array can contain
`-1` as a placeholder when no photo exists:

```json
"photos": [6457448, 3366955, -1]
```

Before constructing an image URL, filter out any `-1` value. Otherwise, the request
returns a generic "image not found" placeholder instead of failing cleanly.

---

### Search by ISBN

If a user already knows a book's ISBN, you can retrieve the specific edition directly:

```bash
curl "https://openlibrary.org/isbn/9780140275360.json"
```

This returns the edition associated with that ISBN, which is more precise than a
keyword search when the exact publication matters.

---

### Handle missing and inconsistently formatted data

As you saw in [Step 2](#step-2-retrieve-a-specific-work) and
[Step 3](#step-3-retrieve-author-details), some fields are inconsistently
formatted or absent entirely. Before deploying your application, make sure it
handles the following cases:

| Case                                                                         | Fields affected                                            |
|------------------------------------------------------------------------------|------------------------------------------------------------|
| A field returns a plain string or an object.                                 | `description`, `bio`                                       |
| A field is `null` or absent entirely.                                      | `bio`, `birth_date`, `death_date`, `covers`, `description`   |
| A work has no associated authors.                                             | `authors`                                                 |
| Fields contain duplicates in multiple languages.                            | `subject_people`, `subject_times`                           |

---

### Go further

For the complete endpoint reference, see the
[Open Library API documentation](https://openlibrary.org/developers/api).
