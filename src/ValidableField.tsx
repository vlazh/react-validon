import React, { useContext } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ValidableContext, State, Validators } from './Validable';

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

/**
 * Provide props validation: { error, type, validate }.
 * By default, value and validators obtain from props.value and props.validators but you can
 * provide you own mechanism of obtain them through options: getValue(props), getValidators(props).
 */
export default function validableField<P extends Props & ValidableFieldProps>({
  getValue,
  getValidators,
}: Options<P> = {}) {
  return <C extends React.ComponentType<P>>(Component: C): React.FunctionComponent<P> => {
    class ValidableField extends React.Component<P> {
      static wrappedComponent = Component;

      getValue = (): any => (getValue ? getValue(this.props) : this.props.value);

      getValidators = (): Validators =>
        getValidators ? getValidators(this.props) : this.props.validators ?? [];

      constructor(props: P) {
        super(props);
        const { subscribe, name } = this.props;
        subscribe({ name, getValue: this.getValue, getValidators: this.getValidators });
      }

      componentWillUnmount(): void {
        const { unsubscribe, name } = this.props;
        name && unsubscribe(name);
      }

      render(): JSX.Element {
        // const { subscribe, unsubscribe, ...rest } = this.props;
        // Not used spread operator because of https://github.com/Microsoft/TypeScript/issues/17281
        return React.createElement(Component, this.props);
      }
    }

    (ValidableField as React.ComponentClass<P>).displayName = `${validableField.name}(${
      Component.displayName ||
      Component.name ||
      (Component.constructor && Component.constructor.name) ||
      'Unknown'
    })`;

    // Static fields from Component should be visible on the generated HOC
    hoistNonReactStatics(ValidableField, Component);

    return (props) => {
      const { subscribe, unsubscribe, validate, result } = useContext(ValidableContext);

      return (
        <ValidableField
          {...props}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          validation={{
            // eslint-disable-next-line react/destructuring-assignment
            ...result[props.name],
            validate,
          }}
        />
      );
    };
  };
}
