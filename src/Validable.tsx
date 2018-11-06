import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Validator, Type } from './validators';

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

export interface ValidationResult {
  error?: string;
  type?: Type;
}

interface FieldValidationResults {
  [P: string]: ValidationResult;
}

export interface State {
  isValid: boolean;
  result: ValidationResult;
  subscribe: (field: Field) => void;
  unsubscribe: (name: string) => void;
  validate: (fieldName: string, value: any) => boolean;
}

export interface Props {
  validation: Pick<State, 'isValid' | 'validate' | 'result'>;
}

export const ValidableContext = React.createContext<State>({
  isValid: true,
  result: {},
  subscribe: () => {},
  unsubscribe: () => {},
  validate: () => true,
});

export const typePropTypes = PropTypes.oneOf(['ERROR', 'WARN', 'INFO']);

/**
 * Provide props isValid, validationResult, validate.
 */
export default function validable<P extends Props>() {
  return <C extends React.ComponentType<P>>(Component: C): C => {
    class Validable extends React.Component<P, State> {
      static displayName = `${validable.name}(${Component.displayName ||
        Component.name ||
        (Component.constructor && Component.constructor.name) ||
        'Unknown'})`;

      static wrappedComponent = Component;

      private fields: Fields = {};

      private subscribe = (field: Field) => {
        if (!field.name) {
          console.warn(
            'Validable fields with empty names will be ignored! You must specify unique field name.'
          );
          return;
        }
        if (this.fields[field.name]) {
          console.warn(`Validable field '${field.name}' already subscribed!`);
          return;
        }
        this.fields[field.name] = field;
      };

      private unsubscribe = (name: string) => {
        if (!this.fields[name]) {
          console.warn(`Validable field '${name}' not subscribed!`);
          return;
        }
        delete this.fields[name];
      };

      private normalizeValidators = (validators: Validators) =>
        !validators || Array.isArray(validators) ? validators : [validators];

      private validateField = ({ name, getValue, getValidators }: Field): ValidationResult => {
        const validators = this.normalizeValidators(getValidators());
        if (!validators) return {};

        const value = getValue();
        const notValid = validators.find(v => !v.validator(value, name));

        return {
          error: notValid && notValid.message.replace(/{PROP}/, name).replace(/{VALUE}/, value),
          type: notValid && notValid.type,
        };
      };

      private validateFields = (fieldName?: string, value?: any): FieldValidationResults => {
        // if validate only one field with value
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

      private validate = (fieldName?: string, value?: any): boolean => {
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
        const component = React.createElement<P>(
          Component,
          /* tslint:disable-next-line:prefer-object-spread */
          Object.assign({}, this.props, {
            validation: {
              isValid: this.state.isValid,
              result: this.state.result,
              validate: this.state.validate,
            },
          })
        );
        return (
          <ValidableContext.Provider value={this.state}>{component}</ValidableContext.Provider>
        );
      }
    }

    // Static fields from Component should be visible on the generated HOC
    hoistNonReactStatics(Validable, Component);

    const wrappedComponent = Validable.wrappedComponent as any;

    (wrappedComponent.propTypes as Required<React.ValidationMap<Props>>) = {
      validation: PropTypes.shape({
        isValid: PropTypes.bool.isRequired,
        result: PropTypes.objectOf(
          PropTypes.shape({
            error: PropTypes.string,
            type: typePropTypes,
          })
        ).isRequired,
        validate: PropTypes.func.isRequired,
      }).isRequired,
      ...wrappedComponent.propTypes,
    };

    return Validable as C & ValidableClass<P> & typeof Validable;
  };
}
