import { registerHooks } from "node:module";

// Node strips types natively but needs file extensions, which the app's own
// imports leave to the bundler. This fills them in for `npm test` only.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[cm]?[jt]s$/.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
