import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import vercel from '@astrojs/vercel';

// Preserve previously shared report links without serving report pages.
const retiredPaperSlugs = ['wang-2003-pat', 'zhang-2008-fp-pat', 'lin-2021-3d-pact', 'huynh-2024-fast-fp-pat'];

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  redirects: Object.fromEntries(retiredPaperSlugs.map(slug => [
    `/photoacoustic/fundamentals/pact/${slug}`,
    { status: 302, destination: `/photoacoustic/fundamentals/pact/#${slug}` },
  ])),
  vite: {
    plugins: [tailwindcss()],
    build: {
      rolldownOptions: {
        treeshake: {
          // The Vercel adapter imports routing constants from its build module.
          // Keep unused build tools out of the deployed function: Rolldown's
          // native bindings are not runtime dependencies and are not traced.
          moduleSideEffects: (id, external) =>
            !(external && (id === 'rolldown' || id === '@vercel/routing-utils')),
        },
      },
    },
  },
});
