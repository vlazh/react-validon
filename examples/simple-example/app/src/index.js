import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

function render(Component) {
  ReactDOM.render(<Component />, document.getElementById('root'));
}

render(App);

if (module.hot) {
  module.hot.accept(['components/App'], () => {
    render(App);
  });
}
