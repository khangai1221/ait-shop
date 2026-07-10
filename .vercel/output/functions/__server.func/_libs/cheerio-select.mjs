import { _ as _compileToken, p as prepareContext } from "./css-select.mjs";
import { a as getChildren, D as DomUtils, f as find$1, u as uniqueSort } from "./domutils.mjs";
import { a as boolbaseExports } from "./boolbase.mjs";
import { p as parse, i as isTraversal, S as SelectorType } from "./css-what.mjs";
import { i as isTag } from "./domhandler.mjs";
const filterNames = /* @__PURE__ */ new Set([
  "first",
  "last",
  "eq",
  "gt",
  "nth",
  "lt",
  "even",
  "odd"
]);
function isFilter(s) {
  if (s.type !== "pseudo")
    return false;
  if (filterNames.has(s.name))
    return true;
  if (s.name === "not" && Array.isArray(s.data)) {
    return s.data.some((s2) => s2.some(isFilter));
  }
  return false;
}
function getLimit(filter2, data, partLimit) {
  const num = data != null ? parseInt(data, 10) : NaN;
  switch (filter2) {
    case "first":
      return 1;
    case "nth":
    case "eq":
      return isFinite(num) ? num >= 0 ? num + 1 : Infinity : 0;
    case "lt":
      return isFinite(num) ? num >= 0 ? Math.min(num, partLimit) : Infinity : 0;
    case "gt":
      return isFinite(num) ? Infinity : 0;
    case "odd":
      return 2 * partLimit;
    case "even":
      return 2 * partLimit - 1;
    case "last":
    case "not":
      return Infinity;
  }
}
function getDocumentRoot(node) {
  while (node.parent)
    node = node.parent;
  return node;
}
function groupSelectors(selectors) {
  const filteredSelectors = [];
  const plainSelectors = [];
  for (const selector of selectors) {
    if (selector.some(isFilter)) {
      filteredSelectors.push(selector);
    } else {
      plainSelectors.push(selector);
    }
  }
  return [plainSelectors, filteredSelectors];
}
const UNIVERSAL_SELECTOR = {
  type: SelectorType.Universal,
  namespace: null
};
const SCOPE_PSEUDO = {
  type: SelectorType.Pseudo,
  name: "scope",
  data: null
};
function is(element, selector, options = {}) {
  return some([element], selector, options);
}
function some(elements, selector, options = {}) {
  if (typeof selector === "function")
    return elements.some(selector);
  const [plain, filtered] = groupSelectors(parse(selector));
  return plain.length > 0 && elements.some(_compileToken(plain, options)) || filtered.some((sel) => filterBySelector(sel, elements, options).length > 0);
}
function filterByPosition(filter2, elems, data, options) {
  const num = typeof data === "string" ? parseInt(data, 10) : NaN;
  switch (filter2) {
    case "first":
    case "lt":
      return elems;
    case "last":
      return elems.length > 0 ? [elems[elems.length - 1]] : elems;
    case "nth":
    case "eq":
      return isFinite(num) && Math.abs(num) < elems.length ? [num < 0 ? elems[elems.length + num] : elems[num]] : [];
    case "gt":
      return isFinite(num) ? elems.slice(num + 1) : [];
    case "even":
      return elems.filter((_, i) => i % 2 === 0);
    case "odd":
      return elems.filter((_, i) => i % 2 === 1);
    case "not": {
      const filtered = new Set(filterParsed(data, elems, options));
      return elems.filter((e) => !filtered.has(e));
    }
  }
}
function filter(selector, elements, options = {}) {
  return filterParsed(parse(selector), elements, options);
}
function filterParsed(selector, elements, options) {
  if (elements.length === 0)
    return [];
  const [plainSelectors, filteredSelectors] = groupSelectors(selector);
  let found;
  if (plainSelectors.length) {
    const filtered = filterElements(elements, plainSelectors, options);
    if (filteredSelectors.length === 0) {
      return filtered;
    }
    if (filtered.length) {
      found = new Set(filtered);
    }
  }
  for (let i = 0; i < filteredSelectors.length && (found === null || found === void 0 ? void 0 : found.size) !== elements.length; i++) {
    const filteredSelector = filteredSelectors[i];
    const missing = found ? elements.filter((e) => isTag(e) && !found.has(e)) : elements;
    if (missing.length === 0)
      break;
    const filtered = filterBySelector(filteredSelector, elements, options);
    if (filtered.length) {
      if (!found) {
        if (i === filteredSelectors.length - 1) {
          return filtered;
        }
        found = new Set(filtered);
      } else {
        filtered.forEach((el) => found.add(el));
      }
    }
  }
  return typeof found !== "undefined" ? found.size === elements.length ? elements : (
    // Filter elements to preserve order
    elements.filter((el) => found.has(el))
  ) : [];
}
function filterBySelector(selector, elements, options) {
  var _a;
  if (selector.some(isTraversal)) {
    const root = (_a = options.root) !== null && _a !== void 0 ? _a : getDocumentRoot(elements[0]);
    const opts = { ...options, context: elements, relativeSelector: false };
    selector.push(SCOPE_PSEUDO);
    return findFilterElements(root, selector, opts, true, elements.length);
  }
  return findFilterElements(elements, selector, options, false, elements.length);
}
function select(selector, root, options = {}, limit = Infinity) {
  if (typeof selector === "function") {
    return find(root, selector);
  }
  const [plain, filtered] = groupSelectors(parse(selector));
  const results = filtered.map((sel) => findFilterElements(root, sel, options, true, limit));
  if (plain.length) {
    results.push(findElements(root, plain, options, limit));
  }
  if (results.length === 0) {
    return [];
  }
  if (results.length === 1) {
    return results[0];
  }
  return uniqueSort(results.reduce((a, b) => [...a, ...b]));
}
function findFilterElements(root, selector, options, queryForSelector, totalLimit) {
  const filterIndex = selector.findIndex(isFilter);
  const sub = selector.slice(0, filterIndex);
  const filter2 = selector[filterIndex];
  const partLimit = selector.length - 1 === filterIndex ? totalLimit : Infinity;
  const limit = getLimit(filter2.name, filter2.data, partLimit);
  if (limit === 0)
    return [];
  const elemsNoLimit = sub.length === 0 && !Array.isArray(root) ? getChildren(root).filter(isTag) : sub.length === 0 ? (Array.isArray(root) ? root : [root]).filter(isTag) : queryForSelector || sub.some(isTraversal) ? findElements(root, [sub], options, limit) : filterElements(root, [sub], options);
  const elems = elemsNoLimit.slice(0, limit);
  let result = filterByPosition(filter2.name, elems, filter2.data, options);
  if (result.length === 0 || selector.length === filterIndex + 1) {
    return result;
  }
  const remainingSelector = selector.slice(filterIndex + 1);
  const remainingHasTraversal = remainingSelector.some(isTraversal);
  if (remainingHasTraversal) {
    if (isTraversal(remainingSelector[0])) {
      const { type } = remainingSelector[0];
      if (type === SelectorType.Sibling || type === SelectorType.Adjacent) {
        result = prepareContext(result, DomUtils, true);
      }
      remainingSelector.unshift(UNIVERSAL_SELECTOR);
    }
    options = {
      ...options,
      // Avoid absolutizing the selector
      relativeSelector: false,
      /*
       * Add a custom root func, to make sure traversals don't match elements
       * that aren't a part of the considered tree.
       */
      rootFunc: (el) => result.includes(el)
    };
  } else if (options.rootFunc && options.rootFunc !== boolbaseExports.trueFunc) {
    options = { ...options, rootFunc: boolbaseExports.trueFunc };
  }
  return remainingSelector.some(isFilter) ? findFilterElements(result, remainingSelector, options, false, totalLimit) : remainingHasTraversal ? (
    // Query existing elements to resolve traversal.
    findElements(result, [remainingSelector], options, totalLimit)
  ) : (
    // If we don't have any more traversals, simply filter elements.
    filterElements(result, [remainingSelector], options)
  );
}
function findElements(root, sel, options, limit) {
  const query = _compileToken(sel, options, root);
  return find(root, query, limit);
}
function find(root, query, limit = Infinity) {
  const elems = prepareContext(root, DomUtils, query.shouldTestNextSiblings);
  return find$1((node) => isTag(node) && query(node), elems, true, limit);
}
function filterElements(elements, sel, options) {
  const els = (Array.isArray(elements) ? elements : [elements]).filter(isTag);
  if (els.length === 0)
    return els;
  const query = _compileToken(sel, options);
  return query === boolbaseExports.trueFunc ? els : els.filter(query);
}
export {
  some as a,
  filter as f,
  is as i,
  select as s
};
