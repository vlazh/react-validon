import memoizeBase from 'nano-memoize';
import messages from './messages';
import { isEmptyObject } from './utils';

export enum Type {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
}

export interface Validator<V = any> {
  validator: (value: V, fieldName: string) => boolean;
  type: Type;
  message: string;
}

const memoize = <T extends any>(fn: T): T => memoizeBase(fn, { vargs: true });

export const required = memoize(
  (type: Type = Type.ERROR, message = messages.required): Validator => ({
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
  })
);

/* Number */

export const min = memoize(
  (
    minValue: number,
    type: Type = Type.ERROR,
    message = messages.number.min
  ): Validator<number> => ({
    validator: value => +value >= +minValue,
    type,
    message: message.replace(/{MIN}/, minValue.toString()),
  })
);

export const max = memoize(
  (
    maxValue: number,
    type: Type = Type.ERROR,
    message = messages.number.max
  ): Validator<number> => ({
    validator: value => +value <= +maxValue,
    type,
    message: message.replace(/{MAX}/, maxValue.toString()),
  })
);

/* String */

export const minLength = memoize(
  (
    minValue: number,
    type: Type = Type.ERROR,
    message = messages.string.minLength
  ): Validator<string> => ({
    validator: value => value == null || value.length >= +minValue,
    type,
    message: message.replace(/{MINLENGTH}/, minValue.toString()),
  })
);

export const maxLength = memoize(
  (
    maxValue: number,
    type: Type = Type.ERROR,
    message = messages.string.maxLength
  ): Validator<string> => ({
    validator: value => value == null || value.length <= +maxValue,
    type,
    message: message.replace(/{MAXLENGTH}/, maxValue.toString()),
  })
);

export const match = memoize(
  (
    regExp: RegExp,
    type: Type = Type.ERROR,
    message = messages.string.match
  ): Validator<string> => ({
    validator: value => {
      if (!regExp) return false;
      return value ? regExp.test(value) : true;
    },
    type,
    message,
  })
);

/* Misc */

export const oneOf = memoize(
  (values: any[], type: Type = Type.ERROR, message = messages.oneOf): Validator => ({
    validator: value => value == null || values.indexOf(value) >= 0,
    type,
    message,
  })
);

export const email = memoize(
  (type: Type = Type.ERROR, message = messages.email): Validator<string> => ({
    validator: value =>
      value == null ||
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      ),
    type,
    message,
  })
);
