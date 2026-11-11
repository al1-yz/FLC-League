import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    env: { LOLMECHS_CONTENT_DIR: "tests/e2e/fixtures/content", NEXT_DIST_DIR: ".next-e2e" },
  },
});
