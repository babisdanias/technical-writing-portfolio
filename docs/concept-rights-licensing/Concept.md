---
id: rights-licensing
title: Understanding rights and licensing in open data APIs
sidebar_position: 1
---
# Understanding rights and licensing in open data APIs

When you search an open data API for a digitized manuscript, an ancient
artifact, or a historical text, you might assume that "open" means "freely
usable." In reality, "open" gives you access, but not necessarily the right to reuse it.

Open data APIs gather content from hundreds of institutions, each sharing records
with their own licensing history. A single item in the database can carry
four different layers of rights at the same time — and what the API returns
tells you only part of the story.

This document explains how rights and licensing work in open data APIs,
using the Europeana API and the Open Library API as real-world examples.
It is about the rights model itself, not about how to call either API. 
The goal is that after reading it, you can look at the rights field
an API returns and understand exactly what it means.
For request syntax, parameters, and the complete license lists,
see each API's reference documentation.

---

## What "open" actually means

The word "open" in open data APIs refers primarily to the metadata (the record *about* an item,
not the item itself). Metadata being open doesn't mean the actual photo, text, or recording is free to use.

There is a design reason for this split. A central hub exists to make records from thousands of institutions searchable,
which only works if the descriptive data can flow freely. This is why platforms like Europeana require all metadata to be released under CC0.
The platform never owned the original items, so the rights to the actual content stay with the institution that provided it.
The openness of the metadata was a policy decision; the rights to the content are set by the institutions.

This means two items in the same search result can have completely
different licensing:

- Item A: metadata CC0, image CC BY (freely reusable)
- Item B: metadata CC0, image in Copyright (permission required)

An application built on the assumption that "open API" means "open
content" will end up displaying restricted material.

---

## The layered rights model

A single item in a cultural heritage database can carry multiple
independent layers of rights, each potentially different from the
others. The diagram below shows the core problem.

![Rights and licensing layers in open data APIs](/img/portfolio/rights_licensing_layers.png)

Take a digitized edition of Homer's Iliad as a concrete example.

The **original text,** written in ancient Greek approximately 2,800
years ago, is in the public domain. No copyright applies
to Homer's words.

A **modern translation** of that text — say, the 1990 Penguin Classics
edition — is a new creative work. The translator's choices,
interpretations, and phrasings are protected by copyright, usually
for 70 years after the translator's death. The ancient text is free;
the translation is not.

A **scanned image** of that translation, made by a European library,
may carry its own rights statement depending on when and how the scan was made.
Some countries grant separate rights to digital copies;
others do not.

Finally, the **thumbnail image** (the small preview the API returns)
can carry its own redistribution restrictions even when the underlying
scan is accessible. Europeana marks such thumbnails with a dedicated
flag in its responses; the exact field belongs in the API reference.
What matters here is that even the preview is a rights-bearing layer
of its own.

Four layers. Four potentially different answers to the question "can I
use this?"

---

## Two designs for exposing rights information

Europeana and Open Library expose that complexity in different ways.
Europeana hands over the raw legal instrument; Open Library abstracts it into an access category.
Neither choice is wrong. But each determines what a consumer of the API can and cannot know,
and each fails in a different way when that choice is misread.

### Raw rights URLs

In the Europeana API, the `rights` field returns an array containing a
single license URL — not a simple label. Most items use Creative
Commons URLs, while others use RightsStatements.org URLs, a separate
standard designed specifically for cultural heritage institutions:

```
// Example 1: Creative Commons
{
  "rights": ["http://creativecommons.org/licenses/by-sa/4.0/"]
}

// Example 2: RightsStatements.org
{
  "rights": ["http://rightsstatements.org/vocab/InC/1.0/"]
}
```

These two standards exist side by side for a reason: 
they solve different problems. A Creative Commons license
comes from the rights holder, the person or institution 
that owns the copyright, giving explicit permission
to reuse the work under certain conditions. 
But cultural heritage institutions often hold items 
whose rights they don't own, can't trace, or can't confirm. 
So they have no permission to give, because it was never
theirs to give. In that situation, the most an institution
can do is describe what it knows about the item's status — not license anything.
That's what RightsStatements.org is for.

RightsStatements.org, launched in 2016 by Europeana
and the Digital Public Library of America, offers a small vocabulary
of standardized statements about rights status, like "In Copyright"
or "No Copyright", rather than licenses. An institution can apply one of these
whether or not it holds any rights at all, because a statement just reports what's known;
it doesn't grant permission. So when a `rights` field points 
to a rightsstatements.org URL, the institution is telling you what it knows.
It isn't granting you anything.

Because the API returns full URLs rather than simple permission flags, 
the URL itself is the license: there's no separate lookup table to consult.
This does mean Europeana's database contains over 60 distinct license URLs in total,
but that number is less alarming than it sounds: most of the variation is just older
versions and country-specific variants of the same handful of core licenses.
The part that actually matters — attribution, share-alike, non-commercial use,
in-copyright status — always sits in one predictable segment of the URL: `by`, `by-nc`, `InC`,
and so on. Everything else in the URL (version numbers, country codes) is detail around that core segment, not a change to it.

The full text of every license and statement lives at creativecommons.org
and rightsstatements.org. What matters for the model here is simpler: 
the URL is structured, and its structure *is* where the legal meaning lives.

### Structured reusability parameters

Parsing every URL individually isn't always practical,
so Europeana also offers a `reusability` filter that sorts items
into three broad categories: `open`, `restricted`, and `permission`. 
Filtering by `reusability=open` returns only items that are freely usable in some way,
without needing to inspect every item's `rights` field one by one.

But `open` is a category, not a license, and this is where the two fields diverge.
`reusability` tells you *whether* an item can be reused at all: it's a yes-or-no
filter applied before you see any results. `rights` tells you *what a specific item's actual license requires:*
attribution, share-alike, no restrictions, or something else. 
Every item inside `reusability=open` has passed the yes-or-no check, 
but they haven't all passed it the same way: some require attribution,
some require share-alike, and some ask for nothing at all. 
The `open` category confirms that reuse is allowed; it takes the specific `rights` field on that item to know what's owed in return.

That convenience has a real cost. A search for "ancient greek amphora"
returns 1,571 items unfiltered, but only 240 once `reusability=open` is applied.
The other 1,331 weren't dropped for being irrelevant; they were dropped 
for not being freely reusable. A category filter is a blunt instrument by design:
it buys convenience at the cost of precision.

### The `ebook_access` field in Open Library

The Open Library API takes the opposite approach: instead of a raw license URL,
it returns a structured `ebook_access` field with a few broad categories,
like `public` and `borrowable`.

This is easier to read, but it's answering a different question.
Open Library is a project of the Internet Archive, and `ebook_access` 
describes what the Archive can do with a text: make it freely readable,
lend it or not. It's an access model, not a legal status. A value of `public` means
the text is freely accessible through the Internet Archive.
It does not mean the text is in the public domain.
Search for the Iliad and you may find Robert Fagles's 1990 translation marked `public`:
you can read it freely, but the translation itself remains under active copyright.
What the library makes freely readable and what the rights holder permits 
you to reproduce are not the same thing.

Set side by side, the trade-off between the two designs is clear.
Europeana's raw URLs are exact but demand interpretation; Open
Library's categories are effortless but confuse access with rights.
An exact answer that must be decoded, or an easy answer to a subtly
different question — every platform ends up making this choice, one
way or the other.

---

## The public domain trap

The most common licensing mistake around cultural heritage APIs is
assuming that ancient content is freely usable.

The content itself — Homer's words, Plato's arguments, a Roman mosaic
— is in the public domain. But access to that content almost always
comes through a layer that is not:

- A critical edition with scholarly apparatus added by a modern editor
- A translation into a modern language
- A photographic reproduction of an artifact
- A digitization produced by an institution that claims reproduction rights

Each of these layers potentially resets the licensing clock. If you
search for "ancient Greek texts" and find items with
`ebook_access: public` or `reusability: open`, you are not necessarily
looking at copyright-free content — you are looking at content the
platform makes accessible under specific conditions.

For researchers and academics, this distinction has real consequences.
A researcher who reproduces a "public domain" text that is actually a
copyrighted translation exposes themselves, and any application that
presented the text as unrestricted — to legal risk.

---

## The rights model in brief

Rights in open data APIs are not binary. They are layered,
item-specific, and often inconsistently documented across the
institutions that contribute to aggregated databases. Four ideas
organize everything above:

**"Open" refers to the metadata, not the content.** Metadata rights
and content rights are separate concerns. A platform can publish its
metadata freely while the actual items remain under copyright.

**Filter parameters and rights fields answer different questions.**
The `reusability` filter scopes the dataset; the `rights` field
tells you what can actually be done with a specific result.

**Access and reusability are not the same.** A user can freely read
something that the rights holder has not permitted for reproduction.

**Age doesn't guarantee freedom from rights.** Translations,
digitizations, and modern reproductions carry rights independent of
the original historical work.

One last question follows from all of this: when an application displays an item, 
should it show the raw license URL, or a simple explanation of it?

There is a strong case for the URL itself. It is the exact legal rule.
Any summary you add can stop matching the real license, or worse,
accidentally turn into legal advice you never meant to give.
But the other side is just as true: a bare URL means nothing to most readers.
That is why simple categories like `reusability` and `ebook_access` exist in the first place.
The trade-off between being exact and being easy to read never really goes away.
That is why the rights model itself matters more than any single display choice.

Understanding this model doesn't require a legal background. It
requires recognizing that "open data" describes how an API shares
information — not what that information permits you to do.
