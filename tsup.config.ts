import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    clean: true,
    sourcemap: true,
    format: ["esm", "cjs"],
    dts: true,
})
