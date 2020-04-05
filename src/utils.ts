/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

// eslint-disable-next-line import/prefer-default-export
export function isEmptyObject(obj: object): boolean {
  for (const _ in obj) {
    return false;
  }
  return true;
}
