import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ValidableContext, State, Validators } from './Validable';

export interface Options<P> {
  getValue?: (props: P) => any;
  getValidators?: (props: P) => Validators;
}

export interface Props extends Pick<State, 'subscribe' | 'unsubscribe'> {
  name: string;
  value?: any;
  validators?: Validators;
  validation: Pick<State, 'validate' | 'result'>;
}

/**
 * Provide props validation: { error, type, validate }.
 * By default, value and validators obtain from props.value and props.validators but you can
 * provide you own mechanism of obtain them through options: getValue(props), getValidators(props).
 */
export default function validationField<P extends Props>({
  getValue,
  getValidators,
}: Options<P> = {}) {
  return <C extends React.ComponentType<P>>(Component: C): React.StatelessComponent<P> => {
    class ValidationField extends React.Component<P> {
      static displayName = `${validationField.name}(${Component.displayName ||
        Component.name ||
        (Component.constructor && Component.constructor.name) ||
        'Unknown'})`;
      static wrappedComponent = Component;

      getValue = () => (getValue ? getValue(this.props) : this.props.value);

      getValidators = () => (getValidators ? getValidators(this.props) : this.props.validators);

      componentWillMount() {
        const { subscribe, name } = this.props;
        subscribe({ name, getValue: this.getValue, getValidators: this.getValidators });
      }

      componentWillUnmount() {
        const { unsubscribe, name } = this.props;
        unsubscribe(name);
      }

      render() {
        // const { subscribe, unsubscribe, ...rest } = this.props;
        // Not using spread operator because of https://github.com/Microsoft/TypeScript/issues/17281
        return React.createElement<P>(Component, this.props);
      }
    }

    // Static fields from Component should be visible on the generated HOC
    hoistNonReactStatics(ValidationField, Component);

    return props => (
      <ValidableContext.Consumer>
        {({ subscribe, unsubscribe, validate, result }: State) => (
          <ValidationField
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
