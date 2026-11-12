# Fabrizzio Ruiz — portfolio

Responsive, editable portfolio website built with Vite and plain HTML, CSS, and JavaScript.

## Run locally

```bash
npm install
npm run dev
```

## Edit the website text

Open `src/content.js` in Codex. This is the editing file for the site's main text, services, portfolio placeholders, Lab topics, contact form labels, and contact email. Change the words inside quotes while keeping the property names, commas, and brackets in place.

For example, to change the first headline, edit `copy.home.hero.line1`, `line2`, and `accent`. The `accent` words get the colored styling. To change a service, edit its entry in the `services` array. To add a real Lab post, add an entry to `labEntries` with its category, title, summary, date, and URL.

The hero's looping project album uses `heroCovers` in the same file. Put approved cover images in `public/images/`, then set each cover's `thumbnail` to a relative path such as `./images/my-project.webp`. Update its `title`, `category`, and `href` at the same time. Empty thumbnails show the colorful placeholder design.

The compact Spotify playlist embed above the project album uses `site.playlistUrl` in `src/content.js`. Visitors can play the playlist in Spotify’s embedded player or open it in Spotify. Change the embed URL there to use another playlist.

English is the editable source in `src/content.js`. Spanish and Portuguese text is in `src/translations.js`. The EN / ES / PT switch saves the visitor's choice in the browser and uses it across pages.

Save the file while `npm run dev` is running; the preview updates automatically. Run `npm run build` to check the site before committing. The site's layout and colors remain in `src/main.js`, `src/styles.css`, `src/palette.css`, and `src/lab.css`.

## Foody AR Farm

https://fabrizzioruiz.com/lab/foody-ar-game/ is built from the public repo [foody-ar-farm](https://github.com/contactonodo3d-byte/foody-ar-farm) during the Pages workflow. The workflow clones `main`, installs it, and builds with `FOODY_BASE_PATH=/lab/foody-ar-game/` and `VITE_PUBLIC_URL=https://fabrizzioruiz.com/lab/foody-ar-game/`. The result is copied to `dist/lab/foody-ar-game/` before the site artifact is uploaded. `/lab/foody-ar-game` redirects to the trailing-slash URL in local preview; GitHub Pages does the same for the directory.

The workflow also runs on **Run workflow** and on a `repository_dispatch` of type `foody-updated`. **Run workflow** accepts a `foody_ref` (branch or tag, default `main`). A dispatch may send the same name as `client_payload.ref`. Triggering that dispatch from foody-ar-farm needs a token that can start workflows in this repository. The default `GITHUB_TOKEN` cannot. Until that secret exists, run **Deploy portfolio to GitHub Pages** from the Actions tab after Foody changes land on `main`.

`scripts/foody-public-url.patch` is applied only while Foody `main` still defaults the QR to `contactonodo3d-byte.github.io`. It sets the default public URL, adds that URL to the share caption, and serves the 8th Wall manifest under the lab path. Delete the patch and this step after those changes are on Foody `main`. The deploy token for this repository cannot push that pull request.

## Build

```bash
npm run build
```

The production files are written to `dist/`.

## Before publishing

1. Replace the provisional portfolio records in `src/content.js` with approved projects and real images. The current compositions are illustrative only.
2. Replace `hello@example.com` with the correct inquiry email in `src/content.js`. The contact form prepares an email in the visitor's email application; it does not send to a server.
3. Replace the portrait placeholder in the About page and verify all biographical and service copy.
4. Add and verify social links, testimonials, metrics, and project outcomes only when supplied and approved.
5. Decide whether to add a Spanish version before publishing the EN/ES switch. No switch is displayed yet.

## Pages

- `/` — Home
- `/work/` — Work
- `/services.html` — Services
- `/lab.html` — Lab: articles, use cases, and experiments
- `/about.html` — About
- `/contact.html` — Contact

Lab entries are listed in `src/content.js`. Keep the list empty until real work is ready to publish; each entry needs a category, title, summary, date, and URL.
