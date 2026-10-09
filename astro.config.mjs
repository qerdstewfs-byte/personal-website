import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
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
