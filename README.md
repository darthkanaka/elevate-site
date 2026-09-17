# Elevate Media HI

The custom rebuild of elevatemediahi.com, replacing the Squarespace site.

Static HTML, CSS and JavaScript. No build step, no bundler, no package manager.
Edit a file, commit, push. GitHub Pages serves `main` from the repo root.

## Layout

```
index.html          homepage
contact.html        contact form
terms.html          privacy policy and SMS terms
assets/css/site.css one stylesheet, sectioned and numbered
assets/js/site.js   one IIFE per effect, each independently deletable
assets/fonts/       Poppins 300 to 700, latin subset, self hosted
assets/img/         web sized images
assets/video/       hero loop and the two service loops
harvest/            the old Squarespace site, archived. Read harvest/manifest.md
```

## Local preview

```
python3 -m http.server 8777
```

Then open http://localhost:8777.

## Before launch

Search the source for `TODO-LAUNCH`. Right now that is:

1. Remove `<meta name="robots" content="noindex">` from all three pages.
2. Give the contact form a real `action`, and update the handler in `site.js`.
3. Add a `CNAME` file once DNS is ready.

`TODO-CONTENT` marks the five placeholder projects in the work rail.

## Rules this codebase keeps

These are not preferences. Each one is a defect found in the reference build
this site borrowed its effects from, and the fix is structural rather than a
patch.

1. Nothing animates when the visitor has asked for reduced motion. The script
   checks once at the top and every effect respects it, and the stylesheet
   kills anything the script might miss.
2. No animation loop runs while its section is off screen or the tab is
   hidden. Every canvas and marquee goes through one `visibleLoop` helper.
3. Content is never hidden by default. A `js` class on the root element, set by
   one inline line, is what enables the hidden-until-revealed states, so with
   JavaScript off the page is complete rather than blank.
4. Canvases scale by device pixel ratio. Pointer listeners are passive. Resize
   handlers are debounced.
5. The pinned horizontal rail is desktop and fine-pointer only. On touch the
   same markup is a native scroll-snap row.
6. Every image carries alt text, every field has a real label, focus is always
   visible, and text clears 4.5 to 1 contrast.
7. No em dashes anywhere, in copy or in comments.

## Verified

Checked with Playwright and axe-core across the homepage, contact and terms, at
1440, 1024 and 390 pixels:

- No console errors, no failed requests, no horizontal overflow.
- Zero accessibility violations under WCAG 2.1 AA plus best practice.
- With JavaScript disabled: all content visible, nothing stuck invisible.
- With reduced motion: particle canvas removed, marquee stopped, band
  un-rotated, nothing left hidden.
- On mobile: hamburger opens and closes, escape closes it, the work rail is a
  scroll row rather than a pinned section.
