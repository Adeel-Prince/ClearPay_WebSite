# ClearPay: Responsive Multi-Page Website

A complete, accessible and responsive website for **ClearPay**, a _fictional_ fintech startup.
Built with plain **HTML5, CSS and vanilla JavaScript** (no frameworks, no build step, no external requests).

- **Live site:** `https://YOUR-USERNAME.github.io/clearpay/` _(replace after deploying)_
- **Repository:** `https://github.com/YOUR-USERNAME/clearpay` _(replace after creating the repo)_
- **Author:** Adeel Ahmad, Reg. No: SEP26-FE24-13

## Pages

| Page     | File            | Highlights                                                        |
| -------- | --------------- | ----------------------------------------------------------------- |
| Home     | `index.html`    | Hero, animated counters, feature highlights, steps, testimonials  |
| Features | `features.html` | Filter by category + live search, empty state, `#hash` deep links |
| Pricing  | `pricing.html`  | Real-time pricing calculator, plan comparison table, FAQ          |
| About    | `about.html`    | Mission, values, timeline, team                                   |
| Contact  | `contact.html`  | Accessible validated form with error summary and success state    |
| 404      | `404.html`      | Custom not-found page (used automatically by GitHub Pages)        |

## Requirements checklist

| Requirement                                                      | Where it is implemented                                                                                           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Semantic HTML5, zero accessibility errors                        | `<header> <nav> <main> <footer>`, skip link, one `<h1>` per page, labelled controls, `aria-*` only where needed   |
| CSS design token system                                          | `css/tokens.css` (colour, type scale, spacing, radius, shadow, motion, layers; light and dark values)             |
| Layout from 320px to 2560px                                      | Fluid type with `clamp()`, `min()`/`minmax()` grids, container width, root font-size scaling at 1920px and 2400px |
| Real-time JavaScript pricing calculator                          | `js/pricing.js` (updates on every input; compares 3 plans and a typical processor)                                |
| Filterable features section                                      | `js/features.js` (category buttons with `aria-pressed`, search, live count, empty state)                          |
| Intersection Observer scroll animations                          | `js/main.js` (`.reveal` fade-up, animated counters; respects `prefers-reduced-motion`)                            |
| Validated contact form                                           | `js/contact.js` (inline errors, error summary, focus management, success message)                                 |
| localStorage theme persistence                                   | `js/theme.js` + tiny inline script in each `<head>` (no flash of wrong theme; follows system setting by default)  |
| Lighthouse above 90 (performance, accessibility, best practices) | No images, no web fonts, no third-party code, ~45 KB per page, deferred scripts, valid ARIA, AA contrast          |

## Project structure

```
clearpay/
  index.html  features.html  pricing.html  about.html  contact.html  404.html
  css/   tokens.css  styles.css
  js/    theme.js  main.js  pricing.js  features.js  contact.js
  assets/favicon.svg
  .gitignore  README.md
```

## Run locally

Open `index.html` directly in a browser, or use the VS Code **Live Server** extension. No install needed.

## Deploy

### GitHub Pages

```bash
cd clearpay
git init
git add .
git commit -m "ClearPay responsive multi-page website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/clearpay.git
git push -u origin main
```

Then on GitHub: **Settings > Pages > Build and deployment > Source: Deploy from a branch > Branch: main, folder: / (root) > Save.**
After about a minute the site is live at `https://YOUR-USERNAME.github.io/clearpay/`.

### Netlify (alternative)

Go to app.netlify.com > **Add new site > Deploy manually** and drag the `clearpay` folder onto the page,
or connect the GitHub repository (build command: none, publish directory: `.`).

## Measure Lighthouse

1. Open the **live HTTPS URL** in Chrome (Incognito, extensions off).
2. DevTools (F12) > **Lighthouse** > categories: Performance, Accessibility, Best practices, SEO > **Analyze page load** (Mobile).
3. Repeat for every page and record the scores.

## Design notes

- **Tokens first:** every colour, size and duration comes from `css/tokens.css`. The dark theme only overrides colour tokens.
- **Accessibility:** keyboard operable everywhere, visible focus ring, 44px+ touch targets, AA contrast in both themes, status messages announced politely, reduced-motion support.
- **Progressive enhancement:** with JavaScript off, the content, navigation and forms markup remain visible; animations only hide content when JavaScript is running.
- **Performance:** system font stack, inline SVG icons, no images, small CSS/JS, `defer` on scripts.

> ClearPay is a fictional company. All names, figures, prices and addresses are made up for a learning project; no payments are processed and the contact form does not send data anywhere.
