# Portfolio redesign

The redesigned version of https://kolossdesign.github.io/.
The previous live version is preserved in a backup-before-redesign branch.

## Changes

- Rebuilt Russian and English homepages with focused B2B / financial products / eCommerce positioning.
- Featured Beeline, Siberian Wellness and ToBeOut; retained all six case studies and original visual assets.
- Added clearer collaboration paths and contact sections to every case study.
- Added a before/after journey comparison and six screen captions to Beeline.
- Separated project outcomes from claims of design causality; removed unsourced Stenn revenue figures from the revision.
- Added an explicit contribution summary to Siberian Wellness.
- Replaced automatic language redirects with manual language selection.
- Made links work on a GitHub Pages project subpath.
- Preserved the existing Yandex Metrika counter when promoting the redesign to the primary site.

No new research findings, testimonials, dates, team sizes or performance figures were invented. Measurement methodology, exact availability and an email address require the portfolio owner's input.

## Preview

```sh
python3 -m http.server 8765
```

Open http://localhost:8765/. No build or package installation is needed.

## Publish

GitHub repository Settings → Pages → Source: GitHub Actions.
The existing `.github/workflows/static.yml` publishes the main branch.
