# ZEXALVA Ecommerce Frontend

Modern storefront for the ZEXALVA streetwear label, built with Vite + React + TypeScript. The project ships with a storefront experience (routing, cart management, checkout flow) and a Gemini‑powered stylist assistant that persists conversations client side.

## Highlights

- **Storefront UX**
  - Responsive layout with hero billboard, product discovery pages, and checkout.
  - Navigation with anchored sections (e.g. `Campaign`, `Stores`) for quick storytelling access.
  - Persistent cart drawer driven by React context.
- **Stylist AI**
  - Gemini API integration (`generateStylistReply`) for conversational shopping help.
  - LocalStorage persistence and reusable chat bubbles (`chat/` components) with quick replies.
- **Brand Storytelling**
  - Editorial hero slides (editable `season`, headline, and CTA copy in `Hero.tsx`).
  - Brand billboard animations (Framer Motion) and About page narrative blocks.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind utility classes (no build-time Tailwind configuration required)
- Framer Motion (brand billboard animations)
- Lucide icons
- Gemini API client (`@google/genai`)

## Getting Started

```bash
# install dependencies
npm install

# start local dev server (http://localhost:5173)
npm run dev
```

### Core Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start Vite dev server                    |
| `npm run build`    | Production build to `dist/`              |
| `npm run preview`  | Preview the production bundle            |
| `npm run lint`     | ESLint (see `eslint.config.js`)          |
| `npm run typecheck`| Global TypeScript check (`tsconfig.app.json`) |

## Environment Variables

The AI assistant requires a Gemini API key. Create `.env.local`:

```
VITE_GEMINI_API_KEY=your_key_here
```

The key is consumed in `src/services/aiClient.ts`. Keep secrets out of version control.

## Project Structure

```
src/
  components/
    zexalva/
      Hero.tsx              // hero slides, edit copy & imagery here
      BrandBillboard.tsx    // brand storytelling section (Framer Motion enabled)
      AIAssistant.tsx       // main assistant shell (uses chat sub-components)
      chat/
        ChatBubbleAI.tsx
        ChatBubbleUser.tsx
        ChatQuickActions.tsx
      ...
  context/
    CartContext.tsx         // cart state provider
    AIContext.tsx           // assistant message persistence
  data/
    products.json           // editable product catalogue
  lib/
    fuzzySearch.ts          // navigation search helper
    getProducts.ts          // product utility helpers
  pages/
    Home.tsx, Shop.tsx, ProductDetail.tsx, Checkout.tsx, About.tsx
  services/
    aiClient.ts             // Gemini client & response mappers
```

## Customisation Notes

- **Hero Slides**: edit the `slides` array in `Hero.tsx` (`season`, `headline`, `description`, CTA labels, and image URLs).
- **Navigation Search**: powered by `fuzzySearch.ts` against `products.json`. Update the dataset to match inventory.
- **Brand Billboard**: uses Framer Motion for scroll-triggered animation. Adjust easing/duration in `BrandBillboard.tsx`.
- **Campaign Section**: `About.tsx` contains the anchored `#campaign` block. Update copy to reflect current drops.
- **AI Assistant**:
  - Quick replies (`lihat hoodie`, `promo hari ini`, etc.) live near the top of `AIAssistant.tsx`.
  - Chat bubble components in `components/zexalva/chat/` control visual presentation.
  - Persistent history managed via `AIContext.tsx`.

## Building & Deployment

1. `npm run build` to create the production bundle.
2. Serve the `dist/` folder with any static host (Netlify, Vercel, Cloudflare Pages, etc.).

## Troubleshooting

- **Gemini errors**: ensure `VITE_GEMINI_API_KEY` is set and valid. The assistant falls back with a user-facing message on failure.
- **Type issues**: run `npm run typecheck` to catch missing product fields or incorrect props after edits.
- **Hot reload**: Vite handles module reloads; if state behaves unexpectedly after editing contexts, refresh the browser session.

## Contributing

1. Fork / clone.
2. Create a branch (`git checkout -b feature/my-update`).
3. Commit with imperative messages (`Add hero animation`).
4. Run `npm run typecheck && npm run build` before opening a PR.

Happy building! Feel free to adapt the storytelling, product catalogue, and assistant personality to match the current ZEXALVA campaign. 👟🔥
