declare function warn(message: string): void;
declare function error(message: string): void;
declare function deprecationWarn({ component, oldProp, newProp }: {
    component: string;
    oldProp: string;
    newProp?: string;
}): void;
declare function componentDeprecationWarn({ oldComponent, newComponent }: {
    oldComponent: string;
    newComponent: string;
}): void;
declare function deprecationError({ component, oldProp, newProp }: {
    component: string;
    oldProp: string;
    newProp?: string;
}): void;
declare function componentDeprecationError({ oldComponent, newComponent }: {
    oldComponent: string;
    newComponent: string;
}): void;
declare const _default: {
    warn: typeof warn;
    error: typeof error;
    deprecationWarn: typeof deprecationWarn;
    componentDeprecationWarn: typeof componentDeprecationWarn;
    deprecationError: typeof deprecationError;
    componentDeprecationError: typeof componentDeprecationError;
};
export default _default;
