# Technical writing portfolio

Source for [babisdanias.com](https://babisdanias.com), a portfolio of developer documentation written by Babis Danias.

Every sample here was built by testing a real, public API by hand in Postman, then documenting what the official docs leave out: inconsistent data formats, multilingual fields, and the edge cases that break a first integration.

## Samples

### Getting started guide

**[Getting started with the Open Library API](https://babisdanias.com/docs/getting-started-open-library/open-library-guide)**

A developer orientation guide covering search, work retrieval, and author lookup. It documents how the API handles multilingual author names and inconsistent data formats, both verified endpoint by endpoint in Postman.

*Demonstrates: onboarding a developer from zero to a first working request.*

### Tutorial and API reference

**[Build a command-line search tool with the Europeana API](https://babisdanias.com/docs/tutorial-europeana/europeana-tutorial)**
**[Europeana Search API quick reference](https://babisdanias.com/docs/tutorial-europeana/tutorial-reference)**

A Python tutorial with working, tested code, covering authentication, search, multilingual data parsing, and reusability filtering. The reference was pulled out of the tutorial as a separate document so that each one does a single job.

*Demonstrates: task-based instruction with runnable code, plus lookup-oriented reference writing.*

### Concept guide

**[Understanding rights and licensing in open data APIs](https://babisdanias.com/docs/concept-rights-licensing/rights-licensing)**

An explanation of how rights layer across museum and library APIs, and why a single item can carry more than one licence. Illustrated with an original diagram and backed by live testing of both the Europeana and Open Library APIs.

*Demonstrates: explaining a model the reader has to hold in their head before the API makes sense.*

## Standards

- **[Google Developer Documentation Style Guide](https://developers.google.com/style)** for voice, terminology, and code formatting.
- **[Diátaxis](https://diataxis.fr/)** for structure. Each sample sits in one quadrant and stays there. The Europeana reference was split out of the tutorial for exactly this reason: instruction and lookup are different jobs, and mixing them serves neither reader.
- Every code sample and every API response in these documents was run before it was published.

## Toolchain

| | |
|---|---|
| Site | Docusaurus 3 |
| Content | Markdown |
| Version control | Git and GitHub |
| Hosting | GitHub Pages, custom domain |
| API testing | Postman |
| Code samples | Python 3 |

Docs-as-code throughout: content lives in Markdown next to the site config, changes go through Git, and the published site is built from the repository.

## Build locally

```bash
npm install      # install dependencies
npm start        # dev server with live reload
npm run build    # static build into ./build
```

## About

I spent years translating poetry and editing philosophy, work where one wrong word changes the meaning of the whole. I document APIs the same way: exact meaning, no guessing, nothing wasted.

More at [babisdanias.com/about](https://babisdanias.com/about). Reach me at [BabisDanias@tutamail.com](mailto:BabisDanias@tutamail.com).
