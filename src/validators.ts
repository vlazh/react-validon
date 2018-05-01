import messages from './messages';
import { isEmptyObject } from './utils';

export enum Type {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
}

export interface Validator {
  validator: (value: any, fieldName: string) => boolean;
  type: Type;
  message: string;
}

export function required(type: Type = Type.ERROR, message = messages.required): Validator {
  return {
    validator: value => {
      if (value == null) {
        return false;
      }

      switch (typeof value) {
        case 'string':
          return value.length > 0;
        case 'number':
          return isFinite(value);
        case 'object': {
          if (Array.isArray(value)) {
            return !!value.length;
          }
          // value.length for mobx ObservableArrays
          // value.size for immutable structures
          const length = value.length || value.size;
          return length != null ? !!length : !isEmptyObject(value);
        }
        default:
          return true;
      }
    },
    type,
    message,
  };
}

/* Number */

export function min(
  minValue: any,
  type: Type = Type.ERROR,
  message = messages.number.min
): Validator {
  return {
    validator: value => +value >= +minValue,
    type,
    message: message.replace(/{MIN}/, minValue.toString()),
  };
}

export function max(
  maxValue: any,
  type: Type = Type.ERROR,
  message = messages.number.max
): Validator {
  return {
    validator: value => +value <= +maxValue,
    type,
    message: message.replace(/{MAX}/, maxValue.toString()),
  };
}

/* String */

export function minLength(
  minValue: any,
  type: Type = Type.ERROR,
  message = messages.string.minLength
): Validator {
  return {
    validator: value => value == null || value.length >= +minValue,
    type,
    message: message.replace(/{MINLENGTH}/, minValue.toString()),
  };
}

export function maxLength(
  maxValue: any,
  type: Type = Type.ERROR,
  message = messages.string.maxLength
): Validator {
  return {
    validator: value => value == null || value.length <= +maxValue,
    type,
    message: message.replace(/{MAXLENGTH}/, maxValue.toString()),
  };
}

export function match(
  regExp: RegExp,
  type: Type = Type.ERROR,
  message = messages.string.match
): Validator {
  return {
    validator: value => {
      if (!regExp) return false;
      return value ? regExp.test(value) : true;
    },
    type,
    message,
  };
}

/* Misc */

export function oneOf(values: any[], type: Type = Type.ERROR, message = messages.oneOf): Validator {
  return {
    validator: value => value == null || values.indexOf(value) >= 0,
    type,
    message,
  };
}

export function email(type: Type = Type.ERROR, message = messages.email): Validator {
  return {
    validator: value =>
      value == null ||
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      ),
    type,
    message,
  };
}
