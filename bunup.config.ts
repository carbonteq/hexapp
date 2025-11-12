import { type DefineConfigItem, defineConfig } from "bunup";

const r: DefineConfigItem = defineConfig({
  clean: true,
  sourceBase: "./src",
  entry: ["./src/**/*.ts"],
  outDir: "dist",
  dts: true,
  target: "node",
  sourcemap: "linked",
  format: ["cjs", "esm"],
  minify: false,
  minifyWhitespace: true,
  minifyIdentifiers: false,
  minifySyntax: true,
  drop: [],
  unused: true,
  shims: true,
}) as DefineConfigItem;

export default r;
