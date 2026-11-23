# Katrio — Copyright, Licensing & Attribution Decisions

**Audit Date:** 2026-11-22

## 1. Official TNSCERT Textbook PDFs (`10th-Books/`)
- **Copyright Notice Observed in PDF Front Matter:** Published by Tamil Nadu Textbook and Educational Services Corporation (`© SCERT 2019`, revised 2020–2025).
- **Decision (Rule A8 — Strict Rights Hygiene):**
  - Possession of local PDFs in `10th-Books/` authorizes **curriculum mapping, factual verification, page indexing, and original educational authoring**. It does **not** automatically grant permission to republish full verbatim textbook chapters, copyright-protected prose/poetry excerpts, or textbook illustrations on a public web server.
  - Therefore, the **"Read the book, chunk by chunk"** section at the bottom of every History Unit 4 lesson provides:
    1. Exact section, lettered subheading `(a)/(b)`, printed page, and PDF page citations.
    2. **Original authored chunk summaries** + clickable bilingual glossary terms + *"Explain this chunk"* & *"What did I just read?"* recall prompts.
    3. Direct attribution & link to the official Tamil Nadu Textbook portal (`https://textbookcorp.tn.gov.in/`).
  - Full verbatim textbook reader mode remains **disabled** unless explicit written TNSCERT license permission is obtained and recorded.
  - **Third-Party Guide Books (Commercial Guides):** Strictly **prohibited** — zero scraping or copying from commercial guides or third-party question banks.

## 2. Open-Source 3D Models & NASA Imagery
All bundled static assets under `public/models/` and `public/textures/earth/` are permissively licensed (MIT, Apache 2.0, CC0 1.0, or US Government / NASA / NIH Public Domain) and fully itemized in `public/models/PROVENANCE.md`.

## 3. Factual & Textbook-vs-Current-World Nuance Notes (Rule A7)
Katrio never silently rewrites textbook statements; instead, verified factual discrepancies or post-publication updates are surfaced in clearly labelled **`Updated Context / Historical Note`** callouts:
1. **History 4.1 (Opium Wars Dates, p. 41):** Textbook prints *"two opium wars of 1832 and 1848"*. Context note clarifies standard international historiography dates the First Opium War to **1839–1842** and the Second Opium War to **1856–1860**.
2. **History 4.7 (Arab–Israeli Armistice Dates, p. 45):** Textbook prints *"armistice agreements (1947 Feb–June)"*. Context note clarifies the 1948–1949 Arab–Israeli Armistice Agreements were signed between **February and July 1949**.
3. **History 4.9 (EU Member States, p. 48):** Textbook prints *"Today the European Union has 28 member states"*. Updated Context Note clarifies that following the United Kingdom's withdrawal (Brexit) on **31 January 2020**, the EU consists of **27 member states** (checked 2026-11-22).
