---
id: tutorial-reference
title: Europeana Search API quick reference
sidebar_position: 1
---


# Europeana Search API quick reference

This reference covers the specific parts of the Europeana Search API used in the companion tutorial, [Build a command-line search tool with the Europeana API](./tutorial.md). It summarizes the endpoint, request parameters, response fields, error codes, and rights values. 

For the complete API, see the official [Europeana APIs documentation](https://europeana.atlassian.net/wiki/spaces/EF/pages/2385313793/Europeana+APIs+Documentation).

## Endpoint

```
GET https://api.europeana.eu/record/v2/search.json
```

Requests are authenticated with an API key passed as the `wskey` query parameter. Responses are JSON.

## API keys

| Key type | Intended use |
|---|---|
| **Personal API key** | Learning, testing, and personal use |
| **Project API key** | Production applications with higher request rates |

Register a key at [europeana.eu/en/account/api-keys](https://europeana.eu/en/account/api-keys).

## Request parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Keyword search across all fields. Because it matches text anywhere, prefer specific terms ( `ancient greek amphora`) over general ones (`greek vase`) to avoid returning modern objects. |
| `wskey` | string | Yes | Your API key. |
| `rows` | integer | No | Number of results per response. Default: `12`. |
| `qf` | string | No | Additional query filter in `FIELD:value` form. For example, `TYPE:IMAGE` returns only image records. |
| `reusability` | string | No | Filters results by license category: `open`, `restricted`, or `permission`. See [Rights and reusability](#rights-and-reusability). |
| `cursor` | string | No | Pagination token. Pass `cursor=*` on the first request. See [Pagination](#pagination). |

## Pagination

The API pages through result sets with a cursor:

1. The first request sends `cursor=*`.
2. When more pages exist, the response includes a `nextCursor` value.
3. Each following request passes the previous response's `nextCursor` as `cursor`. The value must be URL-encoded — in Python, `urllib.parse.quote(cursor, safe='')`. An unencoded cursor returns `400 Bad Request`.
4. The final page contains no `nextCursor`.

## Response

### Top-level fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded. |
| `itemsCount` | integer | Number of items in this response, controlled by `rows`. |
| `totalResults` | integer | Total matching items in the database, independent of `itemsCount`. |
| `nextCursor` | string | Token for the next page of results. Present only when more pages are available. |
| `items` | array | The matching records. See [Item fields](#item-fields). |

### Item fields

| Field | Type | Description |
|-------|------|-------------|
| `country` | array | The country where the physical artifact is currently located. |
| `dataProvider` | array |The institution holding the physical item. |
| `dcTitleLangAware` | object | Titles keyed by language code (for example, `en`, `ro`). The `en` key is absent when the institution provides no English metadata; fall back to `title`. |
| `edmIsShownBy` | array | Direct URL to the full-quality media file at the source institution. Distinct from `edmPreview`. |
| `edmPreview` | array | URL of a Europeana-hosted thumbnail. Display is governed by `previewNoDistribute`. |
| `edmTimespanLabel` | array | Date or date range of the artifact, accessed as `edmTimespanLabel[0]["def"]`. Many records omit this field, so your code must handle missing values safely. |
| `guid` | string | URL of the item's page on Europeana. Includes your API key as a tracking parameter — remove this before sharing the link publicly. |
| `link` | string | Record API URL for the item, for programmatic access only. Contains the API key as a query parameter — do not log, cache, or display this link. |
| `previewNoDistribute` | boolean | When `true`, the thumbnail is restricted from redistribution: do not render `edmPreview`. |
| `rights` | array | Full license URL for the item. See [Rights and reusability](#rights-and-reusability). |
| `title` | array | Item title, possibly in several languages. Prefer `dcTitleLangAware` when selecting a title by language. |
| `type` | string | Media type: `IMAGE`, `TEXT`, `VIDEO`, or `SOUND`. |

### Example response

```json
{
  "success": true,
  "requestNumber": 999,
  "itemsCount": 1,
  "totalResults": 240,
  "nextCursor": "AoREQ3Pekv69iAM/FS85NTEvQ3VsdHVyYWxpYV8yNzFjODk4Yl8xMWMyXzQ3ODRfOGU2Zl84MmUzNzQxN2ZjOTQ=",
  "items": [
    {
      "dataProvider": ["National Museum of Romanian History"],
      "country": ["Romania"],
      "dcTitleLangAware": { "ro": ["Amforă"] },
      "title": ["Amforă"],
      "edmIsShownBy": ["https://resource.culturalia.ro/imagini-clasate/imagini50/c9e3a5a12c3c4ddc80600a1d3a5f6b001200.jpg"],
      "edmPreview": ["https://api.europeana.eu/thumbnail/v2/url.json?uri=...&type=IMAGE"],
      "guid": "https://www.europeana.eu/item/2048047/Clasate_1a4ad07a715847d3a76a2086fc535307",
      "link": "https://api.europeana.eu/record/2048047/Clasate_1a4ad07a715847d3a76a2086fc535307.json",
      "rights": ["http://creativecommons.org/licenses/by-sa/4.0/"],
      "previewNoDistribute": false,
      "type": "IMAGE"
    }
  ]
}
```

In this record, `dcTitleLangAware` has no `en` key and `edmTimespanLabel` is absent. Both situations are common.

## Errors

| HTTP status | JSON `code` | Cause |
|-------------|-------------|-------|
| `400 Bad Request` | `400-SC` | Malformed request — most often an unencoded or invalid `cursor` value. |
| `400 Bad Request` | `401_key_invalid` | Authentication failed: the `wskey` value is missing, expired, or invalid. Despite the code's name, the API returns HTTP `400`, not `401`, for this error. |

## Rights and reusability

The `reusability` request parameter filters results by license category. The `rights` response field states each item's exact license. In short: **the filter controls *which* items you get back; the field tells you the exact rules for *using* them.**

| `reusability` value | What it returns |
|---------------------|-----------------|
| `open` | Items that permit free reuse (but may still require attribution, like CC BY). |
| `restricted` | Items that permit reuse with restrictions (such as non-commercial use). |
| `permission` | Items that require the rights holder's explicit permission. |

Common `rights` values:

| License URL | Meaning |
|-------------|---------|
| `http://creativecommons.org/publicdomain/mark/1.0/` | Public domain — no restrictions. |
| `http://creativecommons.org/licenses/by/4.0/` | CC BY — free to use with attribution. |
| `http://creativecommons.org/licenses/by-nc/4.0/` | CC BY-NC — non-commercial use only. |
| `http://rightsstatements.org/vocab/InC/1.0/` | In copyright — permission required. |

## See also

- Tutorial: [Build a command-line search tool with the Europeana API](./tutorial.md)
- [Europeana APIs documentation](https://europeana.atlassian.net/wiki/spaces/EF/pages/2385313793/Europeana+APIs+Documentation) — the complete official reference, including the Record API
- [API key registration](https://europeana.eu/en/account/api-keys)
