import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Validator } from './validators';

export type Validators = Validator | Validator[] | undefined;

export interface Field {
  name: string;
  getValue: () => any;
  getValidators: () => Validators;
}

interface Fields {
  [P: string]: Field;
}

interface ValidableClass<P> {
  wrappedComponent: React.ComponentType<P>;
}

export interface Props {
  isValid: string;
  validationResult: {};
  validate: (fieldName: string, value: any) => boolean;
}

export interface State {
  isValid: boolean;
  result: {};
  subscribe: (field: Field) => void;
  unsubscribe: (name: string) => void;
  validate: (fieldName: string, value: any) => boolean;
}

export const ValidableContext = React.createContext<State>({
  isValid: true,
  result: {},
  subscribe: () => {
    return;
  },
  unsubscribe: () => {
    return;
  },
  validate: () => {
    return true;
  },
});

/**
 * Provide props isValid, validationResult, validate.
 */
export default function validable<P extends Props>() {
  return <C extends React.ComponentClass<P>>(Component: C): C => {
    class Validable extends React.Component<P, State> {
      static displayName = `${validable.name}(${Component.displayName ||
        Component.name ||
        (Component.constructor && Component.constructor.name) ||
        'Unknown'})`;
      static wrappedComponent = Component;

      private fields: Fields = {};

      private subscribe = (field: Field) => {
        if (this.fields[field.name]) {
          console.warn(`'${field.name}' already subscribed!`);
          return;
        }
        this.fields[field.name] = field;
      };

      private unsubscribe = (name: string) => {
        if (!this.fields[name]) {
          console.warn(`'${name}' not subscribed!`);
          return;
        }
        delete this.fields[name];
      };

      private normalizeValidators = (validators: Validators) =>
        !validators || Array.isArray(validators) ? validators : [validators];

      private validateField = ({ name, getValue, getValidators }: Field) => {
        const validators = this.normalizeValidators(getValidators());
        if (!validators) return {};

        const value = getValue();
        const notValid = validators.find(v => !v.validator(value, name));

        return {
          error: notValid && notValid.message.replace(/{PROP}/, name).replace(/{VALUE}/, value),
          type: notValid && notValid.type,
        };
      };

      private validateFields = (fieldName: string, value: any) => {
        if (fieldName && value !== undefined) {
          return {
            [fieldName]: this.validateField({
              ...this.fields[fieldName],
              getValue() {
                return value;
              },
            }),
          };
        }

        const fieldNames = fieldName ? [fieldName] : Object.getOwnPropertyNames(this.fields);
        return fieldNames.reduce((acc, name) => {
          acc[name] = this.validateField(this.fields[name]);
          return acc;
        }, {});
      };

      private validate = (fieldName: string, value: any) => {
        const prevState = this.state;
        const result = {
          ...prevState.result,
          ...this.validateFields(fieldName, value),
        };
        const isValid = Object.getOwnPropertyNames(result).every(name => !result[name].error);
        this.setState({ result, isValid });
        return isValid;
      };

      state = {
        isValid: true,
        result: {},
        subscribe: this.subscribe,
        unsubscribe: this.unsubscribe,
        validate: this.validate,
      };

      render() {
        return (
          <ValidableContext.Provider value={this.state}>
            <Component
              {...this.props}
              isValid={this.state.isValid}
              validationResult={this.state.result}
              validate={this.validate}
            />
          </ValidableContext.Provider>
        );
      }
    }

    // Static fields from Component should be visible on the generated HOC
    hoistNonReactStatics(Validable, Component);

    return Validable as C & ValidableClass<P> & typeof Validable;
  };
}
