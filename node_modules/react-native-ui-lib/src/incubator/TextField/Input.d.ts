/// <reference types="react" />
import { ForwardRefInjectedProps } from '../../commons/new';
import { InputProps } from './types';
declare const Input: {
    ({ style, hint, color, forwardedRef, formatter, useGestureHandlerInput, ...props }: InputProps & ForwardRefInjectedProps): JSX.Element;
    displayName: string;
};
export default Input;
