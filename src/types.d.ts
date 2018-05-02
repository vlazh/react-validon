declare module 'nano-memoize' {
  interface Options {
    maxArgs?: number; // only use the provided maxArgs for cache look-up, useful for ignoring final callback arguments
    vargs?: boolean; // forces the use of multi-argument paradigm, auto set if function has a spread argument or uses `arguments` in its body.
  }
  function memoize<T>(fn: T, options?: Options): T;
  export = memoize;
}
