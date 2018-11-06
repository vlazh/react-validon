import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ValidableContext, State, Validators, typePropTypes } from './Validable';

export interface Options<P> {
  getValue?: (props: P) => any;
  getValidators?: (props: P) => Validators;
}

export interface Props {
  name: string;
  value?: any;
  validators?: Validators;
  validation: Pick<State, 'validate' | 'result'>;
}

export type ValidableFieldProps = Pick<State, 'subscribe' | 'unsubscribe'>;

const validatorPropTypes = PropTypes.shape({
  validator: PropTypes.func.isRequired,
  type: typePropTypes.isRequired,
  message: PropTypes.string.isRequired,
});

/**
 * Provide props validation: { error, type, validate }.
 * By default, value and validators obtain from props.value and props.validators but you can
 * provide you own mechanism of obtain them through options: getValue(props), getValidators(props).
 */
export default function validableField<P extends Props & ValidableFieldProps>({
  getValue,
  getValidators,
}: Options<P> = {}) {
  return <C extends React.ComponentType<P>>(Component: C): React.StatelessComponent<P> => {
    class ValidableField extends React.Component<P> {
      static displayName = `${validableField.name}(${Component.displayName ||
        Component.name ||
        (Component.constructor && Component.constructor.name) ||
        'Unknown'})`;

      static wrappedComponent = Component;

      getValue = () => (getValue ? getValue(this.props) : this.props.value);

      getValidators = () => (getValidators ? getValidators(this.props) : this.props.validators);

      constructor(props: P) {
        super(props);
        const { subscribe, name } = this.props;
        subscribe({ name, getValue: this.getValue, getValidators: this.getValidators });
      }

      componentWillUnmount() {
        const { unsubscribe, name } = this.props;
        name && unsubscribe(name);
      }

      render() {
        // const { subscribe, unsubscribe, ...rest } = this.props;
        // Not used spread operator because of https://github.com/Microsoft/TypeScript/issues/17281
        return React.createElement(Component, this.props);
      }
    }

    // Static fields from Component should be visible on the generated HOC
    hoistNonReactStatics(ValidableField, Component);

    const wrappedComponent = ValidableField.wrappedComponent as any;

    (wrappedComponent.propTypes as Required<React.ValidationMap<Props>>) = {
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
      validators: PropTypes.oneOfType([PropTypes.arrayOf(validatorPropTypes), validatorPropTypes]),
      validation: PropTypes.shape({
        error: PropTypes.string,
        type: typePropTypes,
        validate: PropTypes.func.isRequired,
      }),
      ...wrappedComponent.propTypes,
    };

    return props => (
      <ValidableContext.Consumer>
        {({ subscribe, unsubscribe, validate, result }: State) => (
          <ValidableField
            {...props}
            subscribe={subscribe}
            unsubscribe={unsubscribe}
            validation={{
              ...result[props.name],
              validate,
            }}
          />
        )}
      </ValidableContext.Consumer>
    );
  };
}
