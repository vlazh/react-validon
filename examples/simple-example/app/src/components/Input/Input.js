import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { validableField } from 'react-validon';
// import { validableField } from '../../../../../../dist';
import css from './Input.css';

@validableField()
export default class Input extends React.Component {
  static propTypes = {
    prop1: PropTypes.string.isRequired,
  };

  onChange = event => {
    const { onChange, validation, name } = this.props;
    onChange && onChange(event);
    validation.validate(name, event.target.value);
  };

  render() {
    const { subscribe, unsubscribe, validation, onChange, ...rest } = this.props;

    return (
      <input
        {...rest}
        onChange={this.onChange}
        className={classNames(validation.error && css[validation.type.toLowerCase()])}
        title={validation.error}
      />
    );
  }
}
