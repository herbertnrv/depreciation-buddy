import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const electronBuild = process.env.ELECTRON_BUILD === "1";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  ...(electronBuild
    ? {
        nitro: { preset: "node-server" },
      }
    : {}),
});
