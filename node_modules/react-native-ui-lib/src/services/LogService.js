function warn(message) {
  if (__DEV__) {
    console.warn(message);
  }
}
function error(message) {
  if (__DEV__) {
    console.error(message);
  }
}
function getDeprecationMessage({
  component,
  oldProp,
  newProp
}) {
  const message = newProp ? `RNUILib's ${component} "${oldProp}" prop will be deprecated soon, please use the "${newProp}" prop instead` : `RNUILib's ${component} "${oldProp}" prop will be deprecated soon, please stop using it`;
  return message;
}
function getComponentDeprecationMessage({
  oldComponent,
  newComponent
}) {
  const message = `RNUILib's ${oldComponent} component will be deprecated soon, please use the "${newComponent}" component instead`;
  return message;
}
function deprecationWarn({
  component,
  oldProp,
  newProp
}) {
  warn(getDeprecationMessage({
    component,
    oldProp,
    newProp
  }));
}
function componentDeprecationWarn({
  oldComponent,
  newComponent
}) {
  warn(getComponentDeprecationMessage({
    oldComponent,
    newComponent
  }));
}
function deprecationError({
  component,
  oldProp,
  newProp
}) {
  error(getDeprecationMessage({
    component,
    oldProp,
    newProp
  }));
}
function componentDeprecationError({
  oldComponent,
  newComponent
}) {
  error(getComponentDeprecationMessage({
    oldComponent,
    newComponent
  }));
}
export default {
  warn,
  error,
  deprecationWarn,
  componentDeprecationWarn,
  deprecationError,
  componentDeprecationError
};