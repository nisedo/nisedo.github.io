# Slide archive

Publish native PDF exports containing only the visible slides. Keep speaker notes, comments, API dumps and other private working files outside this repository.

## Naming convention

- PDF title metadata: `Talk title — Conference — YYYY-MM — Slides`
- Filename: `talk-title-conference-yyyy-mm-dd-slides.pdf` when the exact talk date is confirmed; otherwise `talk-title-conference-yyyy-mm-slides.pdf` (lowercase ASCII, hyphen-separated). Never infer the day from file creation or modification dates.
- Dates displayed on the site and PDF title metadata stay at month precision (`YYYY-MM`).
- Folder: `talks/talk-title/`

Example:

- Title: `Patch the Planet — DeFi Security Summit — 2026-11 — Slides`
- File: `patch-the-planet/patch-the-planet-defi-security-summit-2026-11-01-slides.pdf`

Update the PDF title metadata as well as its filename; browsers can display the internal title. Check every page, extracted text, metadata, annotations and attachments before committing. Link the canonical PDF from `(Slides)` in the site, opening a new tab without forcing a download.

Keep previously shared PDF URLs working. For Patch the Planet, `patch-the-planet/patch-the-planet.pdf` and `patch-the-planet/patch-the-planet-defi-security-summit-2026-11-slides.pdf` are identical compatibility copies of the canonical dated PDF. Update all three copies together.

Normal Git history retains previous published versions when files are replaced or removed. No integrated reader or Google Drive dependency is needed.

The following previously shared paths are also retained as identical PDF copies:

- Beyond: `beyond-just-read-the-code/beyond-just-read-the-code-defi-security-summit-2025-11-slides.pdf` → canonical filename ends in `2025-11-21-slides.pdf`.
- How to Become: `how-to-become-a-smart-contract-auditor/how-to-become-a-smart-contract-auditor-ethcc-8-2025-06-slides.pdf` → canonical filename ends in `2025-07-02-slides.pdf`. The old URL keeps its historical filename, but the PDF title and site date correctly say July 2025.

Update each compatibility copy together with its canonical PDF.
