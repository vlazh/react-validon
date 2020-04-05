import React from 'react';
import PropTypes from 'prop-types';
import { validableField } from 'react-validon';
// import { validableField } from '../../../../../../dist';
import css from './Input.css';

@validableField()
class Input extends React.Component {
  onChange = (event) => {
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
        className={validation.error ? css[validation.type.toLowerCase()] : undefined}
        title={validation.error}
      />
    );
  }
}

Input.propTypes = {
  prop1: PropTypes.string.isRequired,
};

export default Input;
