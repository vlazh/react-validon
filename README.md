# react-validon [![npm package](https://img.shields.io/npm/v/react-validon.svg?style=flat-square)](https://www.npmjs.org/package/react-validon)

**React-validon** is a small, simple, flexible and extensible validation library for React >= 16.

**React-validon** is independent of store and can work with [local component state](https://reactjs.org/docs/faq-state.html), [Redux](https://redux.js.org/) and [MobX](https://github.com/mobxjs/mobx).

**React-validon** validators supports memoization (with [nano-memoize](https://github.com/anywhichway/nano-memoize)), so you should not worry about performance when you call validator creator function in component render method like this:

```javascript
<Input name="name" value={this.state.name} validators={required()}>
```

## [Simple demo](https://vlazh.github.io/react-validon/)

## [Examples](https://github.com/vlazh/react-validon/tree/master/examples/)

## License

[MIT](https://opensource.org/licenses/mit-license.php)
