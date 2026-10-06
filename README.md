# neminwu.github.io

Personal website of Nemin Wu, served by GitHub Pages at <https://neminwu.github.io>.

Plain static HTML/CSS/JS — no build step and no npm dependencies.

## Layout

```
docs/        Published site (GitHub Pages source: main branch, /docs folder)
  *.html       Pages: index, experience, research, interests (+ redirect stubs)
  css/ js/ img/
  robots.txt, sitemap.xml, Google Search Console verification file
scripts/     Maintenance scripts (not published)
```

## Commands

| Command | What it does |
|---|---|
| `npm run search` | Rebuild `docs/js/search-index.js` after editing page content |
| `npm run serve` | Preview locally at <http://localhost:8000> |

## License

Based on the [Start Bootstrap Resume](https://startbootstrap.com/theme/resume) theme, MIT licensed — see [LICENSE](LICENSE).
