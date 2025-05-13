import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/**/*.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  target: "node22",
  outDir: "dist",
  minify: false,
  dts: true
});
