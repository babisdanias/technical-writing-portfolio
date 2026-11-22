# Technical writing portfolio

Every sample here was built hands-on, on a real system. I tested the
Open Library and Europeana APIs live in Postman and documented edge
cases their official docs don't cover. The case study shows how I got
my tablet's rear camera working on Linux.

---

## Samples

### Case study

[Rear camera on the Dell Latitude 7320 Detachable](./case-study-linux-camera/linux-camera-case-study)

I found what powers the camera, proved each value with a control test,
and sent two driver fixes to the kernel maintainers.
The full investigation log and the patches are linked.


---

### Getting started guide

[Getting started with the Open Library API](./getting-started-open-library/open-library-guide)

A first guide for developers. It covers search, fetching works and looking up authors.
It also shows how the API handles author names in different languages and data that comes back in mixed formats.
Documented by testing every endpoint live in Postman.

---

### Tutorial + API reference

[Build a command-line search tool with the Europeana API](./tutorial-europeana/europeana-tutorial)  
[Europeana Search API quick reference](./tutorial-europeana/tutorial-reference)

This is a complete Python tutorial with working, tested code. 
It covers authentication, search, multilingual data parsing, 
and reusability filtering. It's paired with a full API reference 
for the Search endpoint.

---

### Concept doc

[Understanding rights and licensing in open data APIs](./concept-rights-licensing/rights-licensing)

An explanation of how rights layer across museum and library APIs,
and why a single item can carry multiple licenses. Illustrated with
an original diagram and backed by live testing of the Europeana and
Open Library APIs.