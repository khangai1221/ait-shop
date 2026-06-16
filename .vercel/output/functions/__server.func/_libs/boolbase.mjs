import { g as getDefaultExportFromCjs } from "./react.mjs";
var boolbase$1;
var hasRequiredBoolbase;
function requireBoolbase() {
  if (hasRequiredBoolbase) return boolbase$1;
  hasRequiredBoolbase = 1;
  boolbase$1 = {
    trueFunc: function trueFunc() {
      return true;
    },
    falseFunc: function falseFunc() {
      return false;
    }
  };
  return boolbase$1;
}
var boolbaseExports = requireBoolbase();
const boolbase = /* @__PURE__ */ getDefaultExportFromCjs(boolbaseExports);
export {
  boolbaseExports as a,
  boolbase as b
};
