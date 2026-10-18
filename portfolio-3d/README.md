# Saurabh Patel — 3D portfolio

Vite + React, Three.js via React Three Fiber, GSAP + ScrollTrigger, Lenis and Motion. Fonts are self-hosted (Bricolage Grotesque, Instrument Sans, JetBrains Mono).

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the build locally
```

`dist/` is a ready-to-host static site. Drag it onto Netlify Drop, or deploy it with Vercel, GitHub Pages or any static host. It needs a web server, so don't open `dist/index.html` directly from disk.

## Edit your content

Every personal fact lives in **`src/content.js`**: bio, services, projects and case studies, experience, FAQ, contact details and testimonials.

- **`projects`**: the six featured case studies on the home page.
- **`archive`**: every other project. Together they make up the **All projects** screen (`#/projects`), and each one opens its own case study (`#/projects/<id>`). Add a project by copying an entry and setting `categories` (`app`, `web`, `admin`), `accent` (its banner colour) and `image` (a 1280×800 WebP in `public/work/`).
- **Banners:** the original artwork is always shown whole, framed on a backdrop tinted with the project's `accent`. Nothing is cropped.

- **Testimonials:** add real quotes to `testimonials` (`{ quote, name, title }`). The "work with me" panel is replaced automatically.
- **Tiffexx screenshot:** put a 1280×800 image at `public/work/tiffexx.webp` and set `image: '/work/tiffexx.webp'` on the Tiffexx project.
- **Resume:** replace `public/Saurabh_Kumar_Patel_Resume.pdf`.

## Contact form

Set `contact.form.provider` in `src/content.js`:

| provider    | what happens                                                                 |
|-------------|------------------------------------------------------------------------------|
| `email`     | opens the visitor's email app with the message pre-filled (default)          |
| `whatsapp`  | opens WhatsApp with the message pre-filled (`whatsappNumber`)                |
| `formspree` | sends from the page — create a form at formspree.io and paste its ID in `formspreeId` |

Without Formspree the form never claims a message was sent. It tells the visitor to press send in their own app.

## After you deploy

Social previews need absolute URLs. In `index.html`, change `./og-image.png` (in `og:image` and `twitter:image`) to your full domain, e.g. `https://yourdomain.com/og-image.png`.

## How it's built

- `src/three/Scene.jsx`: procedural phone stack (no model files). It reacts to the cursor, then fans out on scroll in the sticky "What I do" stage. It's lazy-loaded, uses a lower pixel ratio and fewer particles on mobile, and stops rendering when off-screen.
- No WebGL → a static image (`public/hero-fallback.webp`) is shown instead.
- `prefers-reduced-motion` → no smooth scroll, a static 3D pose and a plain list for the stage, with all content visible.
- Accessibility: skip link, a keyboard menu (focus trap, Esc to close, focus returns), labelled split text and visible focus rings.
