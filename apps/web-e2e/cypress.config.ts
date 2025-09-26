/// <reference types="node" />
import { defineConfig } from "cypress";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      API_BASE_URL:
        process.env.API_BASE_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:3010",
      MAILSLURP_API_KEY:
        process.env.MAILSLURP_API_KEY || process.env.CYPRESS_MAILSLURP_API_KEY,
    },
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    setupNodeEvents(on, config) {
      on("task", {
        log(message: any) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});
