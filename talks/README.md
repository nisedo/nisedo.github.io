# Slide archive

Publish native PDF exports containing only the visible slides. Keep speaker notes, comments, API dumps and other private working files outside this repository.

## Naming convention

- PDF title metadata: `Talk title — Conference — YYYY-MM — Slides`
- Filename: `talk-title-conference-yyyy-mm-slides.pdf` (lowercase ASCII, hyphen-separated)
- Folder: `talks/talk-title/`

Example:

- Title: `Patch the Planet — DeFi Security Summit — 2026-11 — Slides`
- File: `patch-the-planet/patch-the-planet-defi-security-summit-2026-11-slides.pdf`

Update the PDF title metadata as well as its filename; browsers can display the internal title. Check every page, extracted text, metadata, annotations and attachments before committing. Link the canonical PDF from `(Slides)` in the site, opening a new tab without forcing a download.

Keep previously shared PDF URLs working. For Patch the Planet, `patch-the-planet/patch-the-planet.pdf` is an identical compatibility copy of the canonical PDF. Update both copies together.

Normal Git history retains previous published versions when files are replaced or removed. No integrated reader or Google Drive dependency is needed.
