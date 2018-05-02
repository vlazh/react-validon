declare module 'nano-memoize' {
  function memoize<T>(fn: T): T;
  export = memoize;
}
