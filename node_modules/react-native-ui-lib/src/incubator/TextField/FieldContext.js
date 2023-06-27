import _noop from "lodash/noop";
import { createContext } from 'react';
const FieldContext = createContext({
  isFocused: false,
  hasValue: false,
  isValid: true,
  failingValidatorIndex: undefined,
  disabled: false,
  validateField: _noop,
  checkValidity: () => true
});
export default FieldContext;