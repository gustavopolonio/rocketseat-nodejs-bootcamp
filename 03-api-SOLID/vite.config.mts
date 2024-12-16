/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      [
        'src/http/controllers/**',
        'prisma/vitest-environment-prisma/prisma-test-environment.ts',
      ],
    ],
  },
})
