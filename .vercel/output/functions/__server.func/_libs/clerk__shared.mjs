import { R as React, r as reactExports } from "./react.mjs";
import { S as SWRConfig } from "./swr.mjs";
import { d as dequal } from "./dequal.mjs";
const automatedEnvironmentVariables = [
  "CI",
  "CONTINUOUS_INTEGRATION",
  "GITHUB_ACTIONS",
  "GITLAB_CI",
  "CIRCLECI",
  "TRAVIS",
  "BUILDKITE",
  "BITBUCKET_BUILD_NUMBER",
  "APPVEYOR",
  "CODEBUILD_BUILD_ID",
  "TF_BUILD",
  "TEAMCITY_VERSION",
  "JENKINS_URL",
  "HUDSON_URL",
  "BAMBOO_BUILDKEY",
  "CF_PAGES"
];
const isTestEnvironment$1 = () => {
  try {
    return false;
  } catch {
  }
  return false;
};
const isProductionEnvironment$1 = () => {
  try {
    return true;
  } catch {
  }
  return false;
};
const displayedWarnings$1 = /* @__PURE__ */ new Set();
const deprecated$1 = (fnName, warning, key) => {
  const hideWarning = isTestEnvironment$1() || isProductionEnvironment$1();
  const messageId = fnName;
  if (displayedWarnings$1.has(messageId) || hideWarning) return;
  displayedWarnings$1.add(messageId);
  console.warn(`Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.
${warning}`);
};
const LEGACY_DEV_INSTANCE_SUFFIXES = [
  ".lcl.dev",
  ".lclstage.dev",
  ".lclclerk.com"
];
const CURRENT_DEV_INSTANCE_SUFFIXES = [
  ".accounts.dev",
  ".accountsstage.dev",
  ".accounts.lclclerk.com"
];
const isomorphicAtob$1 = (data) => {
  if (typeof atob !== "undefined" && typeof atob === "function") return atob(data);
  else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data, "base64").toString();
  return data;
};
const isomorphicBtoa = (data) => {
  if (typeof btoa !== "undefined" && typeof btoa === "function") return btoa(data);
  else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data).toString("base64");
  return data;
};
const PUBLISHABLE_KEY_LIVE_PREFIX$1 = "pk_live_";
const PUBLISHABLE_KEY_TEST_PREFIX$1 = "pk_test_";
function isValidDecodedPublishableKey$1(decoded) {
  if (!decoded.endsWith("$")) return false;
  const withoutTrailing = decoded.slice(0, -1);
  if (withoutTrailing.includes("$")) return false;
  return withoutTrailing.includes(".");
}
function parsePublishableKey$1(key, options = {}) {
  key = key || "";
  if (!key || !isPublishableKey$1(key)) {
    if (options.fatal && !key) throw new Error("Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys");
    if (options.fatal && !isPublishableKey$1(key)) throw new Error("Publishable key not valid.");
    return null;
  }
  const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX$1) ? "production" : "development";
  let decodedFrontendApi;
  try {
    decodedFrontendApi = isomorphicAtob$1(key.split("_")[2]);
  } catch {
    if (options.fatal) throw new Error("Publishable key not valid: Failed to decode key.");
    return null;
  }
  if (!isValidDecodedPublishableKey$1(decodedFrontendApi)) {
    if (options.fatal) throw new Error("Publishable key not valid: Decoded key has invalid format.");
    return null;
  }
  let frontendApi = decodedFrontendApi.slice(0, -1);
  if (options.proxyUrl) frontendApi = options.proxyUrl;
  else if (instanceType !== "development" && options.domain && options.isSatellite) frontendApi = `clerk.${options.domain}`;
  return {
    instanceType,
    frontendApi
  };
}
function isPublishableKey$1(key = "") {
  try {
    if (!(key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX$1) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX$1))) return false;
    const parts = key.split("_");
    if (parts.length !== 3) return false;
    const encodedPart = parts[2];
    if (!encodedPart) return false;
    return isValidDecodedPublishableKey$1(isomorphicAtob$1(encodedPart));
  } catch {
    return false;
  }
}
function isProductionFromPublishableKey(apiKey) {
  return apiKey.startsWith("live_") || apiKey.startsWith("pk_live_");
}
function isDevelopmentFromSecretKey(apiKey) {
  return apiKey.startsWith("test_") || apiKey.startsWith("sk_test_");
}
async function getCookieSuffix(publishableKey, subtle = globalThis.crypto.subtle) {
  const data = new TextEncoder().encode(publishableKey);
  const digest = await subtle.digest("sha-1", data);
  return isomorphicBtoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
}
const getSuffixedCookieName = (cookieName, cookieSuffix) => {
  return `${cookieName}_${cookieSuffix}`;
};
const defaultOptions$1 = {
  initialDelay: 125,
  maxDelayBetweenRetries: 0,
  factor: 2,
  shouldRetry: (_2, iteration) => iteration < 5,
  retryImmediately: false,
  jitter: true
};
const RETRY_IMMEDIATELY_DELAY$1 = 100;
const sleep$1 = async (ms) => new Promise((s2) => setTimeout(s2, ms));
const applyJitter$1 = (delay, jitter) => {
  return jitter ? delay * (1 + Math.random()) : delay;
};
const createExponentialDelayAsyncFn$1 = (opts) => {
  let timesCalled = 0;
  const calculateDelayInMs = () => {
    const constant = opts.initialDelay;
    const base = opts.factor;
    let delay = constant * Math.pow(base, timesCalled);
    delay = applyJitter$1(delay, opts.jitter);
    return Math.min(opts.maxDelayBetweenRetries || delay, delay);
  };
  return async () => {
    await sleep$1(calculateDelayInMs());
    timesCalled++;
  };
};
const retry$1 = async (callback, options = {}) => {
  let iterations = 0;
  const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter, onBeforeRetry } = {
    ...defaultOptions$1,
    ...options
  };
  const delay = createExponentialDelayAsyncFn$1({
    initialDelay,
    maxDelayBetweenRetries,
    factor,
    jitter
  });
  while (true) try {
    return await callback();
  } catch (e) {
    iterations++;
    if (!shouldRetry(e, iterations)) throw e;
    if (onBeforeRetry) await onBeforeRetry(iterations);
    if (retryImmediately && iterations === 1) await sleep$1(applyJitter$1(RETRY_IMMEDIATELY_DELAY$1, jitter));
    else await delay();
  }
};
function isLegacyDevAccountPortalOrigin(host) {
  return LEGACY_DEV_INSTANCE_SUFFIXES.some((legacyDevSuffix) => {
    return host.startsWith("accounts.") && host.endsWith(legacyDevSuffix);
  });
}
function isCurrentDevAccountPortalOrigin(host) {
  return CURRENT_DEV_INSTANCE_SUFFIXES.some((currentDevSuffix) => {
    return host.endsWith(currentDevSuffix) && !host.endsWith(".clerk" + currentDevSuffix);
  });
}
function createErrorTypeGuard(ErrorClass) {
  function typeGuard(error) {
    const target = error ?? this;
    if (!target) throw new TypeError(`${ErrorClass.kind || ErrorClass.name} type guard requires an error object`);
    if (ErrorClass.kind && typeof target === "object" && target !== null && "constructor" in target) {
      if (target.constructor?.kind === ErrorClass.kind) return true;
    }
    return target instanceof ErrorClass;
  }
  return typeGuard;
}
var ClerkError$1 = class ClerkError extends Error {
  static kind = "ClerkError";
  clerkError = true;
  code;
  longMessage;
  docsUrl;
  cause;
  get name() {
    return this.constructor.name;
  }
  constructor(opts) {
    super(new.target.formatMessage(new.target.kind, opts.message, opts.code, opts.docsUrl), { cause: opts.cause });
    Object.setPrototypeOf(this, ClerkError.prototype);
    this.code = opts.code;
    this.docsUrl = opts.docsUrl;
    this.longMessage = opts.longMessage;
    this.cause = opts.cause;
  }
  toString() {
    return `[${this.name}]
Message:${this.message}`;
  }
  static formatMessage(name, msg, code, docsUrl) {
    const prefix = "Clerk:";
    const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
    msg = msg.replace(regex, "");
    msg = `${prefix} ${msg.trim()}

(code="${code}")

`;
    if (docsUrl) msg += `

Docs: ${docsUrl}`;
    return msg;
  }
};
var ClerkAPIError = class {
  static kind = "ClerkAPIError";
  code;
  message;
  longMessage;
  meta;
  constructor(json) {
    const parsedError = {
      code: json.code,
      message: json.message,
      longMessage: json.long_message,
      meta: {
        paramName: json.meta?.param_name,
        sessionId: json.meta?.session_id,
        emailAddresses: json.meta?.email_addresses,
        identifiers: json.meta?.identifiers,
        zxcvbn: json.meta?.zxcvbn,
        plan: json.meta?.plan,
        isPlanUpgradePossible: json.meta?.is_plan_upgrade_possible,
        seatsQuantityToAdd: json.meta?.seats_quantity_to_add,
        seatsQuantity: json.meta?.seats_quantity
      }
    };
    this.code = parsedError.code;
    this.message = parsedError.message;
    this.longMessage = parsedError.longMessage;
    this.meta = parsedError.meta;
  }
};
function parseError(error) {
  return new ClerkAPIError(error);
}
var ClerkAPIResponseError = class ClerkAPIResponseError2 extends ClerkError$1 {
  static kind = "ClerkAPIResponseError";
  status;
  clerkTraceId;
  retryAfter;
  errors;
  constructor(message, options) {
    const { data: errorsJson, status, clerkTraceId, retryAfter } = options;
    super({
      ...options,
      message,
      code: "api_response_error"
    });
    Object.setPrototypeOf(this, ClerkAPIResponseError2.prototype);
    this.status = status;
    this.clerkTraceId = clerkTraceId;
    this.retryAfter = retryAfter;
    this.errors = (errorsJson || []).map((e) => new ClerkAPIError(e));
  }
  toString() {
    let message = `[${this.name}]
Message:${this.message}
Status:${this.status}
Serialized errors: ${this.errors.map((e) => JSON.stringify(e))}`;
    if (this.clerkTraceId) message += `
Clerk Trace ID: ${this.clerkTraceId}`;
    return message;
  }
  static formatMessage(name, msg, _2, __) {
    return msg;
  }
};
const isClerkAPIResponseError = createErrorTypeGuard(ClerkAPIResponseError);
const DefaultMessages$1 = Object.freeze({
  InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
  InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
  MissingPublishableKeyErrorMessage: `Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
  MissingSecretKeyErrorMessage: `Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
  MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
function buildErrorThrower$1({ packageName, customMessages }) {
  let pkg = packageName;
  function buildMessage(rawMessage, replacements) {
    if (!replacements) return `${pkg}: ${rawMessage}`;
    let msg = rawMessage;
    const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
    for (const match2 of matches) {
      const replacement = (replacements[match2[1]] || "").toString();
      msg = msg.replace(`{{${match2[1]}}}`, replacement);
    }
    return `${pkg}: ${msg}`;
  }
  const messages = {
    ...DefaultMessages$1,
    ...customMessages
  };
  return {
    setPackageName({ packageName: packageName$1 }) {
      if (typeof packageName$1 === "string") pkg = packageName$1;
      return this;
    },
    setMessages({ customMessages: customMessages$1 }) {
      Object.assign(messages, customMessages$1 || {});
      return this;
    },
    throwInvalidPublishableKeyError(params) {
      throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
    },
    throwInvalidProxyUrl(params) {
      throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
    },
    throwMissingPublishableKeyError() {
      throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
    },
    throwMissingSecretKeyError() {
      throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
    },
    throwMissingClerkProviderError(params) {
      throw new Error(buildMessage(messages.MissingClerkProvider, params));
    },
    throw(message) {
      throw new Error(buildMessage(message));
    }
  };
}
function buildAccountsBaseUrl(frontendApi) {
  if (!frontendApi) return "";
  return `https://${frontendApi.replace(/clerk\.accountsstage\./, "accountsstage.").replace(/clerk\.accounts\.|clerk\./, "accounts.")}`;
}
const loggedMessages = /* @__PURE__ */ new Set();
const logger = {
  warnOnce: (msg) => {
    if (loggedMessages.has(msg)) return;
    loggedMessages.add(msg);
    console.warn(msg);
  },
  logOnce: (msg) => {
    if (loggedMessages.has(msg)) return;
    console.log(msg);
    loggedMessages.add(msg);
  }
};
const AUTO_PROXY_HOST_SUFFIXES = [".vercel.app"];
const AUTO_PROXY_PATH = "/__clerk";
function shouldAutoProxy(hostname) {
  return AUTO_PROXY_HOST_SUFFIXES.some((hostSuffix) => hostname?.endsWith(hostSuffix)) ?? false;
}
function getDefaultEnvironment() {
  return typeof process !== "undefined" && process.env ? process.env : {};
}
function normalizeHostname(hostnameOrUrl) {
  if (hostnameOrUrl.startsWith("http://") || hostnameOrUrl.startsWith("https://")) try {
    return new URL(hostnameOrUrl).hostname;
  } catch {
    return "";
  }
  return hostnameOrUrl.split("/")[0] || "";
}
function getAutoProxyUrlFromEnvironment({ publishableKey, hasDomain = false, hasProxyUrl = false, environment = getDefaultEnvironment() }) {
  if (hasProxyUrl || hasDomain || !isProductionFromPublishableKey(publishableKey)) return "";
  if (environment.VERCEL_TARGET_ENV !== "production") return "";
  const vercelProductionHostname = environment.VERCEL_PROJECT_PRODUCTION_URL;
  if (!vercelProductionHostname || !shouldAutoProxy(normalizeHostname(vercelProductionHostname))) return "";
  return AUTO_PROXY_PATH;
}
const TYPES_TO_OBJECTS$1 = {
  strict_mfa: {
    afterMinutes: 10,
    level: "multi_factor"
  },
  strict: {
    afterMinutes: 10,
    level: "second_factor"
  },
  moderate: {
    afterMinutes: 60,
    level: "second_factor"
  },
  lax: {
    afterMinutes: 1440,
    level: "second_factor"
  }
};
const ALLOWED_LEVELS$1 = /* @__PURE__ */ new Set([
  "first_factor",
  "second_factor",
  "multi_factor"
]);
const ALLOWED_TYPES$1 = /* @__PURE__ */ new Set([
  "strict_mfa",
  "strict",
  "moderate",
  "lax"
]);
const ORG_SCOPES = /* @__PURE__ */ new Set([
  "o",
  "org",
  "organization"
]);
const USER_SCOPES = /* @__PURE__ */ new Set(["u", "user"]);
const isValidMaxAge$1 = (maxAge) => typeof maxAge === "number" && maxAge > 0;
const isValidLevel$1 = (level) => ALLOWED_LEVELS$1.has(level);
const isValidVerificationType$1 = (type) => ALLOWED_TYPES$1.has(type);
const isValidFactorAge$1 = (x) => typeof x === "number" && Number.isFinite(x) && (x === -1 || x >= 0);
const prefixWithOrg$1 = (value) => value.replace(/^(org:)*/, "org:");
const checkOrgAuthorization$1 = (params, options) => {
  const { orgId, orgRole, orgPermissions } = options;
  const roleAsked = params.role !== void 0;
  const permissionAsked = params.permission !== void 0;
  if (!roleAsked && !permissionAsked) return "skip";
  if (roleAsked && typeof params.role !== "string") return "fail";
  if (permissionAsked && typeof params.permission !== "string") return "fail";
  if (!orgId) return "fail";
  if (roleAsked) {
    if (typeof orgRole !== "string" || !orgRole) return "fail";
    if (prefixWithOrg$1(orgRole) !== prefixWithOrg$1(params.role)) return "fail";
  }
  if (permissionAsked) {
    if (!Array.isArray(orgPermissions)) return "fail";
    if (!orgPermissions.includes(prefixWithOrg$1(params.permission))) return "fail";
  }
  return "pass";
};
const checkForFeatureOrPlan$1 = (claim, featureOrPlan) => {
  const { org: orgFeatures, user: userFeatures } = splitByScope$1(claim);
  const [rawScope, rawId] = featureOrPlan.split(":");
  const hasExplicitScope = rawId !== void 0;
  const scope = rawScope;
  const id = rawId || rawScope;
  if (hasExplicitScope && !ORG_SCOPES.has(scope) && !USER_SCOPES.has(scope)) throw new Error(`Invalid scope: ${scope}`);
  if (hasExplicitScope) {
    if (ORG_SCOPES.has(scope)) return orgFeatures.includes(id);
    if (USER_SCOPES.has(scope)) return userFeatures.includes(id);
  }
  return [...orgFeatures, ...userFeatures].includes(id);
};
const checkBillingAuthorization$1 = (params, options) => {
  const { features, plans } = options;
  const featureAsked = params.feature !== void 0;
  const planAsked = params.plan !== void 0;
  if (!featureAsked && !planAsked) return "skip";
  if (featureAsked && typeof params.feature !== "string") return "fail";
  if (planAsked && typeof params.plan !== "string") return "fail";
  if (featureAsked) {
    if (typeof features !== "string" || !features) return "fail";
    try {
      if (!checkForFeatureOrPlan$1(features, params.feature)) return "fail";
    } catch {
      return "fail";
    }
  }
  if (planAsked) {
    if (typeof plans !== "string" || !plans) return "fail";
    try {
      if (!checkForFeatureOrPlan$1(plans, params.plan)) return "fail";
    } catch {
      return "fail";
    }
  }
  return "pass";
};
const splitByScope$1 = (fea) => {
  const org = [];
  const user = [];
  if (!fea) return {
    org,
    user
  };
  const parts = fea.split(",");
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    const colonIndex = part.indexOf(":");
    if (colonIndex === -1) throw new Error(`Invalid claim element (missing colon): ${part}`);
    const scope = part.slice(0, colonIndex);
    const value = part.slice(colonIndex + 1);
    if (scope === "o") org.push(value);
    else if (scope === "u") user.push(value);
    else if (scope === "ou" || scope === "uo") {
      org.push(value);
      user.push(value);
    }
  }
  return {
    org,
    user
  };
};
const validateReverificationConfig$1 = (config) => {
  if (!config) return false;
  const convertConfigToObject = (config$1) => {
    if (typeof config$1 === "string") return TYPES_TO_OBJECTS$1[config$1];
    return config$1;
  };
  const isValidStringValue = typeof config === "string" && isValidVerificationType$1(config);
  const isValidObjectValue = typeof config === "object" && isValidLevel$1(config.level) && isValidMaxAge$1(config.afterMinutes);
  if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
  return false;
};
const checkReverificationAuthorization$1 = (params, { factorVerificationAge }) => {
  if (params.reverification === void 0) return "skip";
  if (!factorVerificationAge) return "fail";
  if (!Array.isArray(factorVerificationAge) || factorVerificationAge.length !== 2 || !isValidFactorAge$1(factorVerificationAge[0]) || !isValidFactorAge$1(factorVerificationAge[1])) return "fail";
  const getConfig = validateReverificationConfig$1(params.reverification);
  if (!getConfig) return "fail";
  const { level, afterMinutes } = getConfig();
  const [factor1Age, factor2Age] = factorVerificationAge;
  if (factor1Age === -1 && factor2Age === -1) return "fail";
  const factor1FreshEnough = factor1Age !== -1 && afterMinutes > factor1Age;
  const factor2FreshEnough = factor2Age !== -1 && afterMinutes > factor2Age;
  switch (level) {
    case "first_factor":
      return factor1FreshEnough ? "pass" : "fail";
    case "second_factor":
      if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
      if (factor1Age === -1) return factor2FreshEnough ? "pass" : "fail";
      return factor2FreshEnough ? "pass" : "fail";
    case "multi_factor":
      if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
      if (factor1Age === -1) return "fail";
      return factor1FreshEnough && factor2FreshEnough ? "pass" : "fail";
  }
};
const combine$1 = (results) => results.some((r) => r === "pass") && results.every((r) => r === "pass" || r === "skip");
const createCheckAuthorization$1 = (options) => {
  return (params) => {
    if (!options.userId) return false;
    return combine$1([
      checkOrgAuthorization$1(params, options),
      checkBillingAuthorization$1(params, options),
      checkReverificationAuthorization$1(params, options)
    ]);
  };
};
const parsePermissions = ({ per, fpm }) => {
  if (!per || !fpm) return {
    permissions: [],
    featurePermissionMap: []
  };
  const permissions = per.split(",").map((p) => p.trim());
  return {
    permissions,
    featurePermissionMap: fpm.split(",").map((permission) => Number.parseInt(permission.trim(), 10)).map((permission) => permission.toString(2).padStart(permissions.length, "0").split("").map((bit) => Number.parseInt(bit, 10)).reverse()).filter(Boolean)
  };
};
function buildOrgPermissions({ features, permissions, featurePermissionMap }) {
  if (!features || !permissions || !featurePermissionMap) return [];
  const orgPermissions = [];
  for (let featureIndex = 0; featureIndex < features.length; featureIndex++) {
    const feature = features[featureIndex];
    if (featureIndex >= featurePermissionMap.length) continue;
    const permissionBits = featurePermissionMap[featureIndex];
    if (!permissionBits) continue;
    for (let permIndex = 0; permIndex < permissionBits.length; permIndex++) if (permissionBits[permIndex] === 1) orgPermissions.push(`org:${feature}:${permissions[permIndex]}`);
  }
  return orgPermissions;
}
const __experimental_JWTPayloadToAuthObjectProperties = (claims) => {
  let orgId;
  let orgRole;
  let orgSlug;
  let orgPermissions;
  const factorVerificationAge = claims.fva ?? null;
  const sessionStatus = claims.sts ?? null;
  switch (claims.v) {
    case 2:
      if (claims.o) {
        orgId = claims.o?.id;
        orgSlug = claims.o?.slg;
        if (claims.o?.rol) orgRole = `org:${claims.o?.rol}`;
        const { org } = splitByScope$1(claims.fea);
        const { permissions, featurePermissionMap } = parsePermissions({
          per: claims.o?.per,
          fpm: claims.o?.fpm
        });
        orgPermissions = buildOrgPermissions({
          features: org,
          featurePermissionMap,
          permissions
        });
      }
      break;
    default:
      orgId = claims.org_id;
      orgRole = claims.org_role;
      orgSlug = claims.org_slug;
      orgPermissions = claims.org_permissions;
      break;
  }
  return {
    sessionClaims: claims,
    sessionId: claims.sid,
    sessionStatus,
    actor: claims.act,
    userId: claims.sub,
    orgId,
    orgRole,
    orgSlug,
    orgPermissions,
    factorVerificationAge
  };
};
function _(r) {
  for (var n = [], e = 0; e < r.length; ) {
    var a = r[e];
    if (a === "*" || a === "+" || a === "?") {
      n.push({
        type: "MODIFIER",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === "\\") {
      n.push({
        type: "ESCAPED_CHAR",
        index: e++,
        value: r[e++]
      });
      continue;
    }
    if (a === "{") {
      n.push({
        type: "OPEN",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === "}") {
      n.push({
        type: "CLOSE",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === ":") {
      for (var u = "", t = e + 1; t < r.length; ) {
        var c = r.charCodeAt(t);
        if (c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95) {
          u += r[t++];
          continue;
        }
        break;
      }
      if (!u) throw new TypeError("Missing parameter name at ".concat(e));
      n.push({
        type: "NAME",
        index: e,
        value: u
      }), e = t;
      continue;
    }
    if (a === "(") {
      var o = 1, m = "", t = e + 1;
      if (r[t] === "?") throw new TypeError('Pattern cannot start with "?" at '.concat(t));
      for (; t < r.length; ) {
        if (r[t] === "\\") {
          m += r[t++] + r[t++];
          continue;
        }
        if (r[t] === ")") {
          if (o--, o === 0) {
            t++;
            break;
          }
        } else if (r[t] === "(" && (o++, r[t + 1] !== "?")) throw new TypeError("Capturing groups are not allowed at ".concat(t));
        m += r[t++];
      }
      if (o) throw new TypeError("Unbalanced pattern at ".concat(e));
      if (!m) throw new TypeError("Missing pattern at ".concat(e));
      n.push({
        type: "PATTERN",
        index: e,
        value: m
      }), e = t;
      continue;
    }
    n.push({
      type: "CHAR",
      index: e,
      value: r[e++]
    });
  }
  return n.push({
    type: "END",
    index: e,
    value: ""
  }), n;
}
function F(r, n) {
  n === void 0 && (n = {});
  for (var e = _(r), a = n.prefixes, u = a === void 0 ? "./" : a, t = n.delimiter, c = t === void 0 ? "/#?" : t, o = [], m = 0, h = 0, p = "", f = function(l) {
    if (h < e.length && e[h].type === l) return e[h++].value;
  }, w = function(l) {
    var v = f(l);
    if (v !== void 0) return v;
    var E = e[h], N = E.type, S = E.index;
    throw new TypeError("Unexpected ".concat(N, " at ").concat(S, ", expected ").concat(l));
  }, d = function() {
    for (var l = "", v; v = f("CHAR") || f("ESCAPED_CHAR"); ) l += v;
    return l;
  }, M = function(l) {
    for (var v = 0, E = c; v < E.length; v++) {
      var N = E[v];
      if (l.indexOf(N) > -1) return true;
    }
    return false;
  }, A = function(l) {
    var v = o[o.length - 1], E = l || (v && typeof v == "string" ? v : "");
    if (v && !E) throw new TypeError('Must have text between two parameters, missing text after "'.concat(v.name, '"'));
    return !E || M(E) ? "[^".concat(s(c), "]+?") : "(?:(?!".concat(s(E), ")[^").concat(s(c), "])+?");
  }; h < e.length; ) {
    var T = f("CHAR"), x = f("NAME"), C = f("PATTERN");
    if (x || C) {
      var g = T || "";
      u.indexOf(g) === -1 && (p += g, g = ""), p && (o.push(p), p = ""), o.push({
        name: x || m++,
        prefix: g,
        suffix: "",
        pattern: C || A(g),
        modifier: f("MODIFIER") || ""
      });
      continue;
    }
    var i = T || f("ESCAPED_CHAR");
    if (i) {
      p += i;
      continue;
    }
    p && (o.push(p), p = "");
    if (f("OPEN")) {
      var g = d(), y = f("NAME") || "", O = f("PATTERN") || "", b = d();
      w("CLOSE"), o.push({
        name: y || (O ? m++ : ""),
        pattern: y && !O ? A(g) : O,
        prefix: g,
        suffix: b,
        modifier: f("MODIFIER") || ""
      });
      continue;
    }
    w("END");
  }
  return o;
}
function H(r, n) {
  var e = [];
  return I(P(r, e, n), e, n);
}
function I(r, n, e) {
  e === void 0 && (e = {});
  var a = e.decode, u = a === void 0 ? function(t) {
    return t;
  } : a;
  return function(t) {
    var c = r.exec(t);
    if (!c) return false;
    for (var o = c[0], m = c.index, h = /* @__PURE__ */ Object.create(null), p = function(w) {
      if (c[w] === void 0) return "continue";
      var d = n[w - 1];
      d.modifier === "*" || d.modifier === "+" ? h[d.name] = c[w].split(d.prefix + d.suffix).map(function(M) {
        return u(M, d);
      }) : h[d.name] = u(c[w], d);
    }, f = 1; f < c.length; f++) p(f);
    return {
      path: o,
      index: m,
      params: h
    };
  };
}
function s(r) {
  return r.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function D(r) {
  return r && r.sensitive ? "" : "i";
}
function $(r, n) {
  if (!n) return r;
  for (var e = /\((?:\?<(.*?)>)?(?!\?)/g, a = 0, u = e.exec(r.source); u; ) n.push({
    name: u[1] || a++,
    prefix: "",
    suffix: "",
    modifier: "",
    pattern: ""
  }), u = e.exec(r.source);
  return r;
}
function W(r, n, e) {
  var a = r.map(function(u) {
    return P(u, n, e).source;
  });
  return new RegExp("(?:".concat(a.join("|"), ")"), D(e));
}
function L(r, n, e) {
  return U(F(r, e), n, e);
}
function U(r, n, e) {
  e === void 0 && (e = {});
  for (var a = e.strict, u = a === void 0 ? false : a, t = e.start, c = t === void 0 ? true : t, o = e.end, m = o === void 0 ? true : o, h = e.encode, p = h === void 0 ? function(v) {
    return v;
  } : h, f = e.delimiter, w = f === void 0 ? "/#?" : f, d = e.endsWith, M = d === void 0 ? "" : d, A = "[".concat(s(M), "]|$"), T = "[".concat(s(w), "]"), x = c ? "^" : "", C = 0, g = r; C < g.length; C++) {
    var i = g[C];
    if (typeof i == "string") x += s(p(i));
    else {
      var R = s(p(i.prefix)), y = s(p(i.suffix));
      if (i.pattern) if (n && n.push(i), R || y) if (i.modifier === "+" || i.modifier === "*") {
        var O = i.modifier === "*" ? "?" : "";
        x += "(?:".concat(R, "((?:").concat(i.pattern, ")(?:").concat(y).concat(R, "(?:").concat(i.pattern, "))*)").concat(y, ")").concat(O);
      } else x += "(?:".concat(R, "(").concat(i.pattern, ")").concat(y, ")").concat(i.modifier);
      else {
        if (i.modifier === "+" || i.modifier === "*") throw new TypeError('Can not repeat "'.concat(i.name, '" without a prefix and suffix'));
        x += "(".concat(i.pattern, ")").concat(i.modifier);
      }
      else x += "(?:".concat(R).concat(y, ")").concat(i.modifier);
    }
  }
  if (m) u || (x += "".concat(T, "?")), x += e.endsWith ? "(?=".concat(A, ")") : "$";
  else {
    var b = r[r.length - 1], l = typeof b == "string" ? T.indexOf(b[b.length - 1]) > -1 : b === void 0;
    u || (x += "(?:".concat(T, "(?=").concat(A, "))?")), l || (x += "(?=".concat(T, "|").concat(A, ")"));
  }
  return new RegExp(x, D(e));
}
function P(r, n, e) {
  return r instanceof RegExp ? $(r, n) : Array.isArray(r) ? W(r, n, e) : L(r, n, e);
}
function match(str, options) {
  try {
    return H(str, options);
  } catch (e) {
    throw new Error(`Invalid path and options: Consult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x
${e.message}`);
  }
}
function isTruthy(value) {
  if (typeof value === `boolean`) return value;
  if (value === void 0 || value === null) return false;
  if (typeof value === `string`) {
    if (value.toLowerCase() === `true`) return true;
    if (value.toLowerCase() === `false`) return false;
  }
  const number = parseInt(value, 10);
  if (isNaN(number)) return false;
  if (number > 0) return true;
  return false;
}
const PROCESS_FLAG = /* @__PURE__ */ Symbol.for("@clerk/shared.telemetryNoticeShown");
const NOTICE_LINES = [
  "Attention: Clerk collects telemetry data from its SDKs when connected to development instances.",
  "The data collected is used to inform Clerk's product roadmap.",
  "To learn more, including how to opt-out from the telemetry program, visit: https://clerk.com/docs/telemetry."
];
function isServerRuntime() {
  if (typeof window !== "undefined") return false;
  if (typeof globalThis.EdgeRuntime !== "undefined") return false;
  return true;
}
function isCI() {
  if (typeof process === "undefined" || !process.env) return false;
  return automatedEnvironmentVariables.some((name) => isTruthy(process.env[name]));
}
function hasSeen() {
  return Boolean(globalThis[PROCESS_FLAG]);
}
function markSeen() {
  globalThis[PROCESS_FLAG] = true;
}
function printNotice() {
  if (typeof console === "undefined" || typeof console.log !== "function") return;
  for (const line of NOTICE_LINES) console.log(line);
  console.log("");
}
function maybeShowTelemetryNotice(options = {}) {
  if (options.skip) return;
  try {
    if (!isServerRuntime()) return;
    if (isCI()) return;
    if (hasSeen()) return;
    printNotice();
    markSeen();
  } catch {
  }
}
const DEFAULT_CACHE_TTL_MS = 864e5;
var TelemetryEventThrottler = class {
  #cache;
  #cacheTtl = DEFAULT_CACHE_TTL_MS;
  constructor(cache) {
    this.#cache = cache;
  }
  isEventThrottled(payload) {
    const now = Date.now();
    const key = this.#generateKey(payload);
    const entry = this.#cache.getItem(key);
    if (!entry) {
      this.#cache.setItem(key, now);
      return false;
    }
    if (now - entry > this.#cacheTtl) {
      this.#cache.setItem(key, now);
      return false;
    }
    return true;
  }
  /**
  * Generates a consistent unique key for telemetry events by sorting payload properties.
  * This ensures that payloads with identical content in different orders produce the same key.
  */
  #generateKey(event) {
    const { sk: _sk, pk: _pk, payload, ...rest } = event;
    const sanitizedEvent = {
      ...payload,
      ...rest
    };
    return JSON.stringify(Object.keys({
      ...payload,
      ...rest
    }).sort().map((key) => sanitizedEvent[key]));
  }
};
var LocalStorageThrottlerCache = class {
  #storageKey = "clerk_telemetry_throttler";
  getItem(key) {
    return this.#getCache()[key];
  }
  setItem(key, value) {
    try {
      const cache = this.#getCache();
      cache[key] = value;
      localStorage.setItem(this.#storageKey, JSON.stringify(cache));
    } catch (err) {
      if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED") && localStorage.length > 0) localStorage.removeItem(this.#storageKey);
    }
  }
  removeItem(key) {
    try {
      const cache = this.#getCache();
      delete cache[key];
      localStorage.setItem(this.#storageKey, JSON.stringify(cache));
    } catch {
    }
  }
  #getCache() {
    try {
      const cacheString = localStorage.getItem(this.#storageKey);
      if (!cacheString) return {};
      return JSON.parse(cacheString);
    } catch {
      return {};
    }
  }
  static isSupported() {
    return typeof window !== "undefined" && !!window.localStorage;
  }
};
var InMemoryThrottlerCache = class {
  #cache = /* @__PURE__ */ new Map();
  #maxSize = 1e4;
  getItem(key) {
    if (this.#cache.size > this.#maxSize) {
      this.#cache.clear();
      return;
    }
    return this.#cache.get(key);
  }
  setItem(key, value) {
    this.#cache.set(key, value);
  }
  removeItem(key) {
    this.#cache.delete(key);
  }
};
function isWindowClerkWithMetadata(clerk) {
  return typeof clerk === "object" && clerk !== null && "constructor" in clerk && typeof clerk.constructor === "function";
}
const VALID_LOG_LEVELS = /* @__PURE__ */ new Set([
  "error",
  "warn",
  "info",
  "debug",
  "trace"
]);
const DEFAULT_CONFIG = {
  samplingRate: 1,
  maxBufferSize: 5,
  endpoint: "https://clerk-telemetry.com"
};
var TelemetryCollector = class {
  #config;
  #eventThrottler;
  #metadata = {};
  #buffer = [];
  #pendingFlush = null;
  constructor(options) {
    this.#config = {
      maxBufferSize: options.maxBufferSize ?? DEFAULT_CONFIG.maxBufferSize,
      samplingRate: options.samplingRate ?? DEFAULT_CONFIG.samplingRate,
      perEventSampling: options.perEventSampling ?? true,
      disabled: options.disabled ?? false,
      debug: options.debug ?? false,
      endpoint: DEFAULT_CONFIG.endpoint
    };
    if (!options.clerkVersion && typeof window === "undefined") this.#metadata.clerkVersion = "";
    else this.#metadata.clerkVersion = options.clerkVersion ?? "";
    this.#metadata.sdk = options.sdk;
    this.#metadata.sdkVersion = options.sdkVersion;
    this.#metadata.publishableKey = options.publishableKey ?? "";
    const parsedKey = parsePublishableKey$1(options.publishableKey);
    if (parsedKey) this.#metadata.instanceType = parsedKey.instanceType;
    if (options.secretKey) this.#metadata.secretKey = options.secretKey.substring(0, 16);
    this.#eventThrottler = new TelemetryEventThrottler(LocalStorageThrottlerCache.isSupported() ? new LocalStorageThrottlerCache() : new InMemoryThrottlerCache());
    maybeShowTelemetryNotice({ skip: !this.isEnabled });
  }
  get isEnabled() {
    if (this.#metadata.instanceType !== "development") return false;
    if (this.#config.disabled || typeof process !== "undefined" && process.env && isTruthy(process.env.CLERK_TELEMETRY_DISABLED)) return false;
    if (typeof window !== "undefined" && !!window?.navigator?.webdriver) return false;
    return true;
  }
  get isDebug() {
    return this.#config.debug || typeof process !== "undefined" && process.env && isTruthy(process.env.CLERK_TELEMETRY_DEBUG);
  }
  record(event) {
    try {
      const preparedPayload = this.#preparePayload(event.event, event.payload);
      this.#logEvent(preparedPayload.event, preparedPayload);
      if (!this.#shouldRecord(preparedPayload, event.eventSamplingRate)) return;
      this.#buffer.push({
        kind: "event",
        value: preparedPayload
      });
      this.#scheduleFlush();
    } catch (error) {
      console.error("[clerk/telemetry] Error recording telemetry event", error);
    }
  }
  /**
  * Records a telemetry log entry if logging is enabled and not in debug mode.
  *
  * @param entry - The telemetry log entry to record.
  */
  recordLog(entry) {
    try {
      if (!this.#shouldRecordLog(entry)) return;
      const levelIsValid = typeof entry?.level === "string" && VALID_LOG_LEVELS.has(entry.level);
      const messageIsValid = typeof entry?.message === "string" && entry.message.trim().length > 0;
      let normalizedTimestamp = null;
      const timestampInput = entry?.timestamp;
      if (typeof timestampInput === "number" || typeof timestampInput === "string") {
        const candidate = new Date(timestampInput);
        if (!Number.isNaN(candidate.getTime())) normalizedTimestamp = candidate;
      }
      if (!levelIsValid || !messageIsValid || normalizedTimestamp === null) {
        if (this.isDebug && typeof console !== "undefined") console.warn("[clerk/telemetry] Dropping invalid telemetry log entry", {
          levelIsValid,
          messageIsValid,
          timestampIsValid: normalizedTimestamp !== null
        });
        return;
      }
      const sdkMetadata = this.#getSDKMetadata();
      const logData = {
        sdk: sdkMetadata.name,
        sdkv: sdkMetadata.version,
        cv: this.#metadata.clerkVersion ?? "",
        lvl: entry.level,
        msg: entry.message,
        ts: normalizedTimestamp.toISOString(),
        pk: this.#metadata.publishableKey || null,
        payload: this.#sanitizeContext(entry.context)
      };
      this.#buffer.push({
        kind: "log",
        value: logData
      });
      this.#scheduleFlush();
    } catch (error) {
      console.error("[clerk/telemetry] Error recording telemetry log entry", error);
    }
  }
  #shouldRecord(preparedPayload, eventSamplingRate) {
    return this.isEnabled && !this.isDebug && this.#shouldBeSampled(preparedPayload, eventSamplingRate);
  }
  #shouldRecordLog(_entry) {
    return true;
  }
  #shouldBeSampled(preparedPayload, eventSamplingRate) {
    const randomSeed = Math.random();
    if (!(randomSeed <= this.#config.samplingRate && (this.#config.perEventSampling === false || typeof eventSamplingRate === "undefined" || randomSeed <= eventSamplingRate))) return false;
    return !this.#eventThrottler.isEventThrottled(preparedPayload);
  }
  #scheduleFlush() {
    if (typeof window === "undefined") {
      this.#flush();
      return;
    }
    if (this.#buffer.length >= this.#config.maxBufferSize) {
      if (this.#pendingFlush) if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(Number(this.#pendingFlush));
      else clearTimeout(Number(this.#pendingFlush));
      this.#flush();
      return;
    }
    if (this.#pendingFlush) return;
    if ("requestIdleCallback" in window) this.#pendingFlush = requestIdleCallback(() => {
      this.#flush();
      this.#pendingFlush = null;
    });
    else this.#pendingFlush = setTimeout(() => {
      this.#flush();
      this.#pendingFlush = null;
    }, 0);
  }
  #flush() {
    const itemsToSend = [...this.#buffer];
    this.#buffer = [];
    this.#pendingFlush = null;
    if (itemsToSend.length === 0) return;
    const eventsToSend = itemsToSend.filter((item) => item.kind === "event").map((item) => item.value);
    const logsToSend = itemsToSend.filter((item) => item.kind === "log").map((item) => item.value);
    if (eventsToSend.length > 0) {
      const eventsUrl = new URL("/v1/event", this.#config.endpoint);
      fetch(eventsUrl, {
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST",
        body: JSON.stringify({ events: eventsToSend })
      }).catch(() => void 0);
    }
    if (logsToSend.length > 0) {
      const logsUrl = new URL("/v1/logs", this.#config.endpoint);
      fetch(logsUrl, {
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST",
        body: JSON.stringify({ logs: logsToSend })
      }).catch(() => void 0);
    }
  }
  /**
  * If running in debug mode, log the event and its payload to the console.
  */
  #logEvent(event, payload) {
    if (!this.isDebug) return;
    if (typeof console.groupCollapsed !== "undefined") {
      console.groupCollapsed("[clerk/telemetry]", event);
      console.log(payload);
      console.groupEnd();
    } else console.log("[clerk/telemetry]", event, payload);
  }
  /**
  * If in browser, attempt to lazily grab the SDK metadata from the Clerk singleton, otherwise fallback to the initially passed in values.
  *
  * This is necessary because the sdkMetadata can be set by the host SDK after the TelemetryCollector is instantiated.
  */
  #getSDKMetadata() {
    const sdkMetadata = {
      name: this.#metadata.sdk,
      version: this.#metadata.sdkVersion
    };
    if (typeof window !== "undefined") {
      const windowWithClerk = window;
      if (windowWithClerk.Clerk) {
        const windowClerk = windowWithClerk.Clerk;
        if (isWindowClerkWithMetadata(windowClerk) && windowClerk.constructor.sdkMetadata) {
          const { name, version } = windowClerk.constructor.sdkMetadata;
          if (name !== void 0) sdkMetadata.name = name;
          if (version !== void 0) sdkMetadata.version = version;
        }
      }
    }
    return sdkMetadata;
  }
  /**
  * Append relevant metadata from the Clerk singleton to the event payload.
  */
  #preparePayload(event, payload) {
    const sdkMetadata = this.#getSDKMetadata();
    return {
      event,
      cv: this.#metadata.clerkVersion ?? "",
      it: this.#metadata.instanceType ?? "",
      sdk: sdkMetadata.name,
      sdkv: sdkMetadata.version,
      ...this.#metadata.publishableKey ? { pk: this.#metadata.publishableKey } : {},
      ...this.#metadata.secretKey ? { sk: this.#metadata.secretKey } : {},
      payload
    };
  }
  /**
  * Best-effort sanitization of the context payload. Returns a plain object with JSON-serializable
  * values or null when the input is missing or not serializable. Arrays are not accepted.
  */
  #sanitizeContext(context) {
    if (context === null || typeof context === "undefined") return null;
    if (typeof context !== "object") return null;
    try {
      const cleaned = JSON.parse(JSON.stringify(context));
      if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned)) return cleaned;
      return null;
    } catch {
      return null;
    }
  }
};
var ClerkError2 = class ClerkError3 extends Error {
  static kind = "ClerkError";
  clerkError = true;
  code;
  longMessage;
  docsUrl;
  cause;
  get name() {
    return this.constructor.name;
  }
  constructor(opts) {
    super(new.target.formatMessage(new.target.kind, opts.message, opts.code, opts.docsUrl), { cause: opts.cause });
    Object.setPrototypeOf(this, ClerkError3.prototype);
    this.code = opts.code;
    this.docsUrl = opts.docsUrl;
    this.longMessage = opts.longMessage;
    this.cause = opts.cause;
  }
  toString() {
    return `[${this.name}]
Message:${this.message}`;
  }
  static formatMessage(name, msg, code, docsUrl) {
    const prefix = "Clerk:";
    const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
    msg = msg.replace(regex, "");
    msg = `${prefix} ${msg.trim()}

(code="${code}")

`;
    if (docsUrl) msg += `

Docs: ${docsUrl}`;
    return msg;
  }
};
const DefaultMessages = Object.freeze({
  InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
  InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
  MissingPublishableKeyErrorMessage: `Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
  MissingSecretKeyErrorMessage: `Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
  MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
function buildErrorThrower({ packageName, customMessages }) {
  let pkg = packageName;
  function buildMessage(rawMessage, replacements) {
    if (!replacements) return `${pkg}: ${rawMessage}`;
    let msg = rawMessage;
    const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
    for (const match2 of matches) {
      const replacement = (replacements[match2[1]] || "").toString();
      msg = msg.replace(`{{${match2[1]}}}`, replacement);
    }
    return `${pkg}: ${msg}`;
  }
  const messages = {
    ...DefaultMessages,
    ...customMessages
  };
  return {
    setPackageName({ packageName: packageName$1 }) {
      if (typeof packageName$1 === "string") pkg = packageName$1;
      return this;
    },
    setMessages({ customMessages: customMessages$1 }) {
      Object.assign(messages, customMessages$1 || {});
      return this;
    },
    throwInvalidPublishableKeyError(params) {
      throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
    },
    throwInvalidProxyUrl(params) {
      throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
    },
    throwMissingPublishableKeyError() {
      throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
    },
    throwMissingSecretKeyError() {
      throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
    },
    throwMissingClerkProviderError(params) {
      throw new Error(buildMessage(messages.MissingClerkProvider, params));
    },
    throw(message) {
      throw new Error(buildMessage(message));
    }
  };
}
var ClerkRuntimeError = class ClerkRuntimeError2 extends ClerkError2 {
  static kind = "ClerkRuntimeError";
  /**
  * @deprecated Use `clerkError` property instead. This property is maintained for backward compatibility.
  */
  clerkRuntimeError = true;
  constructor(message, options) {
    super({
      ...options,
      message
    });
    Object.setPrototypeOf(this, ClerkRuntimeError2.prototype);
  }
};
const TYPES_TO_OBJECTS = {
  strict_mfa: {
    afterMinutes: 10,
    level: "multi_factor"
  },
  strict: {
    afterMinutes: 10,
    level: "second_factor"
  },
  moderate: {
    afterMinutes: 60,
    level: "second_factor"
  },
  lax: {
    afterMinutes: 1440,
    level: "second_factor"
  }
};
const ALLOWED_LEVELS = /* @__PURE__ */ new Set([
  "first_factor",
  "second_factor",
  "multi_factor"
]);
const ALLOWED_TYPES = /* @__PURE__ */ new Set([
  "strict_mfa",
  "strict",
  "moderate",
  "lax"
]);
const isValidMaxAge = (maxAge) => typeof maxAge === "number" && maxAge > 0;
const isValidLevel = (level) => ALLOWED_LEVELS.has(level);
const isValidVerificationType = (type) => ALLOWED_TYPES.has(type);
const isValidFactorAge = (x) => typeof x === "number" && Number.isFinite(x) && (x === -1 || x >= 0);
const prefixWithOrg = (value) => value.replace(/^(org:)*/, "org:");
const checkOrgAuthorization = (params, options) => {
  const { orgId, orgRole, orgPermissions } = options;
  const roleAsked = params.role !== void 0;
  const permissionAsked = params.permission !== void 0;
  if (!roleAsked && !permissionAsked) return "skip";
  if (roleAsked && typeof params.role !== "string") return "fail";
  if (permissionAsked && typeof params.permission !== "string") return "fail";
  if (!orgId) return "fail";
  if (roleAsked) {
    if (typeof orgRole !== "string" || !orgRole) return "fail";
    if (prefixWithOrg(orgRole) !== prefixWithOrg(params.role)) return "fail";
  }
  if (permissionAsked) {
    if (!Array.isArray(orgPermissions)) return "fail";
    if (!orgPermissions.includes(prefixWithOrg(params.permission))) return "fail";
  }
  return "pass";
};
const checkForFeatureOrPlan = (claim, featureOrPlan) => {
  const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
  const [scope, _id] = featureOrPlan.split(":");
  const id = _id || scope;
  if (scope === "org") return orgFeatures.includes(id);
  else if (scope === "user") return userFeatures.includes(id);
  else return [...orgFeatures, ...userFeatures].includes(id);
};
const checkBillingAuthorization = (params, options) => {
  const { features, plans } = options;
  const featureAsked = params.feature !== void 0;
  const planAsked = params.plan !== void 0;
  if (!featureAsked && !planAsked) return "skip";
  if (featureAsked && typeof params.feature !== "string") return "fail";
  if (planAsked && typeof params.plan !== "string") return "fail";
  if (featureAsked) {
    if (typeof features !== "string" || !features) return "fail";
    try {
      if (!checkForFeatureOrPlan(features, params.feature)) return "fail";
    } catch {
      return "fail";
    }
  }
  if (planAsked) {
    if (typeof plans !== "string" || !plans) return "fail";
    try {
      if (!checkForFeatureOrPlan(plans, params.plan)) return "fail";
    } catch {
      return "fail";
    }
  }
  return "pass";
};
const splitByScope = (fea) => {
  const features = fea ? fea.split(",").map((f) => f.trim()) : [];
  return {
    org: features.filter((f) => f.split(":")[0].includes("o")).map((f) => f.split(":")[1]),
    user: features.filter((f) => f.split(":")[0].includes("u")).map((f) => f.split(":")[1])
  };
};
const validateReverificationConfig = (config) => {
  if (!config) return false;
  const convertConfigToObject = (config$1) => {
    if (typeof config$1 === "string") return TYPES_TO_OBJECTS[config$1];
    return config$1;
  };
  const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
  const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
  if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
  return false;
};
const checkReverificationAuthorization = (params, { factorVerificationAge }) => {
  if (params.reverification === void 0) return "skip";
  if (!factorVerificationAge) return "fail";
  if (!Array.isArray(factorVerificationAge) || factorVerificationAge.length !== 2 || !isValidFactorAge(factorVerificationAge[0]) || !isValidFactorAge(factorVerificationAge[1])) return "fail";
  const getConfig = validateReverificationConfig(params.reverification);
  if (!getConfig) return "fail";
  const { level, afterMinutes } = getConfig();
  const [factor1Age, factor2Age] = factorVerificationAge;
  if (factor1Age === -1 && factor2Age === -1) return "fail";
  const factor1FreshEnough = factor1Age !== -1 && afterMinutes > factor1Age;
  const factor2FreshEnough = factor2Age !== -1 && afterMinutes > factor2Age;
  switch (level) {
    case "first_factor":
      return factor1FreshEnough ? "pass" : "fail";
    case "second_factor":
      if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
      if (factor1Age === -1) return factor2FreshEnough ? "pass" : "fail";
      return factor2FreshEnough ? "pass" : "fail";
    case "multi_factor":
      if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
      if (factor1Age === -1) return "fail";
      return factor1FreshEnough && factor2FreshEnough ? "pass" : "fail";
  }
};
const combine = (results) => results.some((r) => r === "pass") && results.every((r) => r === "pass" || r === "skip");
const createCheckAuthorization = (options) => {
  return (params) => {
    if (!options.userId) return false;
    return combine([
      checkOrgAuthorization(params, options),
      checkBillingAuthorization(params, options),
      checkReverificationAuthorization(params, options)
    ]);
  };
};
const resolveAuthState = ({ authObject: { sessionId, sessionStatus, userId, actor, orgId, orgRole, orgSlug, signOut, getToken, has, sessionClaims }, options: { treatPendingAsSignedOut = true } }) => {
  if (sessionId === void 0 && userId === void 0) return {
    isLoaded: false,
    isSignedIn: void 0,
    sessionId,
    sessionClaims: void 0,
    userId,
    actor: void 0,
    orgId: void 0,
    orgRole: void 0,
    orgSlug: void 0,
    has: void 0,
    signOut,
    getToken
  };
  if (sessionId === null && userId === null) return {
    isLoaded: true,
    isSignedIn: false,
    sessionId,
    userId,
    sessionClaims: null,
    actor: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    has: () => false,
    signOut,
    getToken
  };
  if (treatPendingAsSignedOut && sessionStatus === "pending") return {
    isLoaded: true,
    isSignedIn: false,
    sessionId: null,
    userId: null,
    sessionClaims: null,
    actor: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    has: () => false,
    signOut,
    getToken
  };
  if (!!sessionId && !!sessionClaims && !!userId && !!orgId && !!orgRole) return {
    isLoaded: true,
    isSignedIn: true,
    sessionId,
    sessionClaims,
    userId,
    actor: actor || null,
    orgId,
    orgRole,
    orgSlug: orgSlug || null,
    has,
    signOut,
    getToken
  };
  if (!!sessionId && !!sessionClaims && !!userId && !orgId) return {
    isLoaded: true,
    isSignedIn: true,
    sessionId,
    sessionClaims,
    userId,
    actor: actor || null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    has,
    signOut,
    getToken
  };
};
const DEV_OR_STAGING_SUFFIXES = [
  ".lcl.dev",
  ".stg.dev",
  ".lclstage.dev",
  ".stgstage.dev",
  ".dev.lclclerk.com",
  ".stg.lclclerk.com",
  ".accounts.lclclerk.com",
  "accountsstage.dev",
  "accounts.dev"
];
const isomorphicAtob = (data) => {
  if (typeof atob !== "undefined" && typeof atob === "function") return atob(data);
  else if (typeof global !== "undefined" && global.Buffer) return new global.Buffer(data, "base64").toString();
  return data;
};
const PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
const PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
function isValidDecodedPublishableKey(decoded) {
  if (!decoded.endsWith("$")) return false;
  const withoutTrailing = decoded.slice(0, -1);
  if (withoutTrailing.includes("$")) return false;
  return withoutTrailing.includes(".");
}
function parsePublishableKey(key, options = {}) {
  key = key || "";
  if (!key || !isPublishableKey(key)) {
    if (options.fatal && !key) throw new Error("Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys");
    if (options.fatal && !isPublishableKey(key)) throw new Error("Publishable key not valid.");
    return null;
  }
  const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
  let decodedFrontendApi;
  try {
    decodedFrontendApi = isomorphicAtob(key.split("_")[2]);
  } catch {
    if (options.fatal) throw new Error("Publishable key not valid: Failed to decode key.");
    return null;
  }
  if (!isValidDecodedPublishableKey(decodedFrontendApi)) {
    if (options.fatal) throw new Error("Publishable key not valid: Decoded key has invalid format.");
    return null;
  }
  let frontendApi = decodedFrontendApi.slice(0, -1);
  if (options.proxyUrl) frontendApi = options.proxyUrl;
  else if (instanceType !== "development" && options.domain && options.isSatellite) frontendApi = `clerk.${options.domain}`;
  return {
    instanceType,
    frontendApi
  };
}
function isPublishableKey(key = "") {
  try {
    if (!(key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX))) return false;
    const parts = key.split("_");
    if (parts.length !== 3) return false;
    const encodedPart = parts[2];
    if (!encodedPart) return false;
    return isValidDecodedPublishableKey(isomorphicAtob(encodedPart));
  } catch {
    return false;
  }
}
function createDevOrStagingUrlCache() {
  const devOrStagingUrlCache = /* @__PURE__ */ new Map();
  return { isDevOrStagingUrl: (url) => {
    if (!url) return false;
    const hostname = typeof url === "string" ? url : url.hostname;
    let res = devOrStagingUrlCache.get(hostname);
    if (res === void 0) {
      res = DEV_OR_STAGING_SUFFIXES.some((s2) => hostname.endsWith(s2));
      devOrStagingUrlCache.set(hostname, res);
    }
    return res;
  } };
}
const EVENT_METHOD_CALLED = "METHOD_CALLED";
const EVENT_SAMPLING_RATE$2 = 0.1;
function eventMethodCalled(method, payload) {
  return {
    event: EVENT_METHOD_CALLED,
    eventSamplingRate: EVENT_SAMPLING_RATE$2,
    payload: {
      method,
      ...payload
    }
  };
}
function assertContextExists(contextVal, msgOrCtx) {
  if (!contextVal) throw typeof msgOrCtx === "string" ? new Error(msgOrCtx) : /* @__PURE__ */ new Error(`${msgOrCtx.displayName} not found`);
}
const createContextAndHook = (displayName, options) => {
  const { assertCtxFn = assertContextExists } = {};
  const Ctx = React.createContext(void 0);
  Ctx.displayName = displayName;
  const useCtx = () => {
    const ctx = React.useContext(Ctx);
    assertCtxFn(ctx, `${displayName} not found`);
    return ctx.value;
  };
  const useCtxWithoutGuarantee = () => {
    const ctx = React.useContext(Ctx);
    return ctx ? ctx.value : {};
  };
  return [
    Ctx,
    useCtx,
    useCtxWithoutGuarantee
  ];
};
function SWRConfigCompat({ swrConfig, children }) {
  return /* @__PURE__ */ React.createElement(SWRConfig, { value: swrConfig }, children);
}
const [ClerkInstanceContext, useClerkInstanceContext] = createContextAndHook("ClerkInstanceContext");
const [UserContext, useUserContext] = createContextAndHook("UserContext");
const [ClientContext] = createContextAndHook("ClientContext");
const [SessionContext] = createContextAndHook("SessionContext");
React.createContext({});
const [CheckoutContext] = createContextAndHook("CheckoutContext");
const __experimental_CheckoutProvider = ({ children, ...rest }) => {
  return /* @__PURE__ */ React.createElement(CheckoutContext.Provider, { value: { value: rest } }, children);
};
const [OrganizationContextInternal] = createContextAndHook("OrganizationContext");
const OrganizationProvider = ({ children, organization, swrConfig }) => {
  return /* @__PURE__ */ React.createElement(SWRConfigCompat, { swrConfig }, /* @__PURE__ */ React.createElement(OrganizationContextInternal.Provider, { value: { value: { organization } } }, children));
};
function useAssertWrappedByClerkProvider(displayNameOrFn) {
  if (!React.useContext(ClerkInstanceContext)) {
    if (typeof displayNameOrFn === "function") {
      displayNameOrFn();
      return;
    }
    throw new Error(`${displayNameOrFn} can only be used within the <ClerkProvider /> component.

Possible fixes:
1. Ensure that the <ClerkProvider /> is correctly wrapping your application where this component is used.
2. Check for multiple versions of the \`@clerk/shared\` package in your project. Use a tool like \`npm ls @clerk/shared\` to identify multiple versions, and update your dependencies to only rely on one.

Learn more: https://clerk.com/docs/components/clerk-provider`.trim());
  }
}
typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
const hookName$1 = "useUser";
function useUser() {
  useAssertWrappedByClerkProvider(hookName$1);
  const user = useUserContext();
  useClerkInstanceContext().telemetry?.record(eventMethodCalled(hookName$1));
  if (user === void 0) return {
    isLoaded: false,
    isSignedIn: void 0,
    user: void 0
  };
  if (user === null) return {
    isLoaded: true,
    isSignedIn: false,
    user: null
  };
  return {
    isLoaded: true,
    isSignedIn: true,
    user
  };
}
const isDeeplyEqual = dequal;
const usePrevious = (value) => {
  const ref = reactExports.useRef(value);
  reactExports.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
const useAttachEvent = (element, event, cb) => {
  const cbDefined = !!cb;
  const cbRef = reactExports.useRef(cb);
  reactExports.useEffect(() => {
    cbRef.current = cb;
  }, [cb]);
  reactExports.useEffect(() => {
    if (!cbDefined || !element) return () => {
    };
    const decoratedCb = (...args) => {
      if (cbRef.current) cbRef.current(...args);
    };
    element.on(event, decoratedCb);
    return () => {
      element.off(event, decoratedCb);
    };
  }, [
    cbDefined,
    event,
    element,
    cbRef
  ]);
};
const ElementsContext = React.createContext(null);
ElementsContext.displayName = "ElementsContext";
const parseElementsContext = (ctx, useCase) => {
  if (!ctx) throw new Error(`Could not find Elements context; You need to wrap the part of your app that ${useCase} in an <Elements> provider.`);
  return ctx;
};
const isUnknownObject = (raw) => {
  return raw !== null && typeof raw === "object";
};
const extractAllowedOptionsUpdates = (options, prevOptions, immutableKeys) => {
  if (!isUnknownObject(options)) return null;
  return Object.keys(options).reduce((newOptions, key) => {
    const isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
    if (immutableKeys.includes(key)) {
      if (isUpdated) console.warn(`Unsupported prop change: options.${key} is not a mutable property.`);
      return newOptions;
    }
    if (!isUpdated) return newOptions;
    return {
      ...newOptions || {},
      [key]: options[key]
    };
  }, null);
};
const PLAIN_OBJECT_STR = "[object Object]";
const isEqual = (left, right) => {
  if (!isUnknownObject(left) || !isUnknownObject(right)) return left === right;
  const leftArray = Array.isArray(left);
  if (leftArray !== Array.isArray(right)) return false;
  const leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
  if (leftPlainObject !== (Object.prototype.toString.call(right) === PLAIN_OBJECT_STR)) return false;
  if (!leftPlainObject && !leftArray) return left === right;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  const keySet = {};
  for (let i = 0; i < leftKeys.length; i += 1) keySet[leftKeys[i]] = true;
  for (let i = 0; i < rightKeys.length; i += 1) keySet[rightKeys[i]] = true;
  const allKeys = Object.keys(keySet);
  if (allKeys.length !== leftKeys.length) return false;
  const l = left;
  const r = right;
  const pred = (key) => {
    return isEqual(l[key], r[key]);
  };
  return allKeys.every(pred);
};
const useElementsOrCheckoutSdkContextWithUseCase = (useCaseString) => {
  return parseElementsContext(React.useContext(ElementsContext), useCaseString);
};
const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const createElementComponent = (type, isServer) => {
  const displayName = `${capitalized(type)}Element`;
  const ClientElement = ({ id, className, fallback, options = {}, onBlur, onFocus, onReady, onChange, onEscape, onClick, onLoadError, onLoaderStart, onNetworksChange, onConfirm, onCancel, onShippingAddressChange, onShippingRateChange }) => {
    const ctx = useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
    const elements = "elements" in ctx ? ctx.elements : null;
    const [element, setElement] = React.useState(null);
    const elementRef = React.useRef(null);
    const domNode = React.useRef(null);
    const [isReady, setReady] = reactExports.useState(false);
    useAttachEvent(element, "blur", onBlur);
    useAttachEvent(element, "focus", onFocus);
    useAttachEvent(element, "escape", onEscape);
    useAttachEvent(element, "click", onClick);
    useAttachEvent(element, "loaderror", onLoadError);
    useAttachEvent(element, "loaderstart", onLoaderStart);
    useAttachEvent(element, "networkschange", onNetworksChange);
    useAttachEvent(element, "confirm", onConfirm);
    useAttachEvent(element, "cancel", onCancel);
    useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
    useAttachEvent(element, "shippingratechange", onShippingRateChange);
    useAttachEvent(element, "change", onChange);
    let readyCallback;
    if (onReady) readyCallback = () => {
      setReady(true);
      onReady(element);
    };
    useAttachEvent(element, "ready", readyCallback);
    React.useLayoutEffect(() => {
      if (elementRef.current === null && domNode.current !== null && elements) {
        let newElement = null;
        if (elements) newElement = elements.create(type, options);
        elementRef.current = newElement;
        setElement(newElement);
        if (newElement) newElement.mount(domNode.current);
      }
    }, [elements, options]);
    const prevOptions = usePrevious(options);
    React.useEffect(() => {
      if (!elementRef.current) return;
      const updates = extractAllowedOptionsUpdates(options, prevOptions, ["paymentRequest"]);
      if (updates && "update" in elementRef.current) elementRef.current.update(updates);
    }, [options, prevOptions]);
    React.useLayoutEffect(() => {
      return () => {
        if (elementRef.current && typeof elementRef.current.destroy === "function") try {
          elementRef.current.destroy();
          elementRef.current = null;
        } catch {
        }
      };
    }, []);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, !isReady && fallback, /* @__PURE__ */ React.createElement("div", {
      id,
      style: {
        height: isReady ? "unset" : "0px",
        visibility: isReady ? "visible" : "hidden"
      },
      className,
      ref: domNode
    }));
  };
  const ServerElement = (props) => {
    useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
    const { id, className } = props;
    return /* @__PURE__ */ React.createElement("div", {
      id,
      className
    });
  };
  const Element = isServer ? ServerElement : ClientElement;
  Element.displayName = displayName;
  Element.__elementType = type;
  return Element;
};
createElementComponent("payment", typeof window === "undefined");
createContextAndHook("PaymentElementContext");
createContextAndHook("StripeUtilsContext");
const isDevelopmentEnvironment = () => {
  try {
    return false;
  } catch {
  }
  return false;
};
const isTestEnvironment = () => {
  try {
    return false;
  } catch {
  }
  return false;
};
const isProductionEnvironment = () => {
  try {
    return true;
  } catch {
  }
  return false;
};
const displayedWarnings = /* @__PURE__ */ new Set();
const deprecated = (fnName, warning, key) => {
  const hideWarning = isTestEnvironment() || isProductionEnvironment();
  const messageId = fnName;
  if (displayedWarnings.has(messageId) || hideWarning) return;
  displayedWarnings.add(messageId);
  console.warn(`Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.
${warning}`);
};
function handleValueOrFn(value, url, defaultValue) {
  if (typeof value === "function") return value(url);
  if (typeof value !== "undefined") return value;
  if (typeof defaultValue !== "undefined") return defaultValue;
}
const logErrorInDevMode = (message) => {
  if (isDevelopmentEnvironment()) console.error(`Clerk: ${message}`);
};
const without = (obj, ...props) => {
  const copy = { ...obj };
  for (const prop of props) delete copy[prop];
  return copy;
};
const defaultOptions = {
  initialDelay: 125,
  maxDelayBetweenRetries: 0,
  factor: 2,
  shouldRetry: (_2, iteration) => iteration < 5,
  retryImmediately: false,
  jitter: true
};
const RETRY_IMMEDIATELY_DELAY = 100;
const sleep = async (ms) => new Promise((s2) => setTimeout(s2, ms));
const applyJitter = (delay, jitter) => {
  return jitter ? delay * (1 + Math.random()) : delay;
};
const createExponentialDelayAsyncFn = (opts) => {
  let timesCalled = 0;
  const calculateDelayInMs = () => {
    const constant = opts.initialDelay;
    const base = opts.factor;
    let delay = constant * Math.pow(base, timesCalled);
    delay = applyJitter(delay, opts.jitter);
    return Math.min(opts.maxDelayBetweenRetries || delay, delay);
  };
  return async () => {
    await sleep(calculateDelayInMs());
    timesCalled++;
  };
};
const retry = async (callback, options = {}) => {
  let iterations = 0;
  const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter, onBeforeRetry } = {
    ...defaultOptions,
    ...options
  };
  const delay = createExponentialDelayAsyncFn({
    initialDelay,
    maxDelayBetweenRetries,
    factor,
    jitter
  });
  while (true) try {
    return await callback();
  } catch (e) {
    iterations++;
    if (!shouldRetry(e, iterations)) throw e;
    if (onBeforeRetry) await onBeforeRetry(iterations);
    if (retryImmediately && iterations === 1) await sleep(applyJitter(RETRY_IMMEDIATELY_DELAY, jitter));
    else await delay();
  }
};
const NO_DOCUMENT_ERROR = "loadScript cannot be called when document does not exist";
const NO_SRC_ERROR = "loadScript cannot be called without a src";
async function loadScript(src = "", opts) {
  const { async, defer, beforeLoad, crossOrigin, nonce } = opts || {};
  const load = () => {
    return new Promise((resolve, reject) => {
      if (!src) reject(new Error(NO_SRC_ERROR));
      if (!document || !document.body) reject(new Error(NO_DOCUMENT_ERROR));
      const script = document.createElement("script");
      if (crossOrigin) script.setAttribute("crossorigin", crossOrigin);
      script.async = async || false;
      script.defer = defer || false;
      script.addEventListener("load", () => {
        script.remove();
        resolve(script);
      });
      script.addEventListener("error", (event) => {
        script.remove();
        reject(event.error ?? /* @__PURE__ */ new Error(`failed to load script: ${src}`));
      });
      script.src = src;
      script.nonce = nonce;
      beforeLoad?.(script);
      document.body.appendChild(script);
    });
  };
  return retry(load, { shouldRetry: (_2, iterations) => iterations <= 5 });
}
function isValidProxyUrl(key) {
  if (!key) return true;
  return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
function isHttpOrHttps(key) {
  return /^http(s)?:\/\//.test(key || "");
}
function isProxyUrlRelative(key) {
  return key.startsWith("/");
}
function proxyUrlToAbsoluteURL(url) {
  if (!url) return "";
  return isProxyUrlRelative(url) ? new URL(url, window.location.origin).toString() : url;
}
function addClerkPrefix(str) {
  if (!str) return "";
  let regex;
  if (str.match(/^(clerk\.)+\w*$/)) regex = /(clerk\.)*(?=clerk\.)/;
  else if (str.match(/\.clerk.accounts/)) return str;
  else regex = /^(clerk\.)*/gi;
  return `clerk.${str.replace(regex, "")}`;
}
const versionSelector = (clerkJSVersion, packageVersion = "5.125.12") => {
  if (clerkJSVersion) return clerkJSVersion;
  const prereleaseTag = getPrereleaseTag(packageVersion);
  if (prereleaseTag) {
    if (prereleaseTag === "snapshot") return "5.125.12";
    return prereleaseTag;
  }
  return getMajorVersion(packageVersion);
};
const getPrereleaseTag = (packageVersion) => packageVersion.trim().replace(/^v/, "").match(/-(.+?)(\.|$)/)?.[1];
const getMajorVersion = (packageVersion) => packageVersion.trim().replace(/^v/, "").split(".")[0];
const ERROR_CODE = "failed_to_load_clerk_js";
const ERROR_CODE_TIMEOUT = "failed_to_load_clerk_js_timeout";
const FAILED_TO_LOAD_ERROR = "Failed to load Clerk";
const { isDevOrStagingUrl } = createDevOrStagingUrlCache();
const errorThrower = buildErrorThrower({ packageName: "@clerk/shared" });
function setClerkJsLoadingErrorPackageName(packageName) {
  errorThrower.setPackageName({ packageName });
}
function isClerkProperlyLoaded() {
  if (typeof window === "undefined" || !window.Clerk) return false;
  const clerk = window.Clerk;
  return typeof clerk === "object" && typeof clerk.load === "function";
}
function hasScriptRequestError(scriptUrl) {
  if (typeof window === "undefined" || !window.performance) return false;
  const entries = performance.getEntriesByName(scriptUrl, "resource");
  if (entries.length === 0) return false;
  const scriptEntry = entries[entries.length - 1];
  if (scriptEntry.transferSize === 0 && scriptEntry.decodedBodySize === 0) {
    if (scriptEntry.responseEnd === 0) return true;
    if (scriptEntry.responseEnd > 0 && scriptEntry.responseStart > 0) return true;
    if ("responseStatus" in scriptEntry) {
      if (scriptEntry.responseStatus >= 400) return true;
      if (scriptEntry.responseStatus === 0) return true;
    }
  }
  return false;
}
function waitForClerkWithTimeout(timeoutMs, existingScript) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const cleanup = (timeoutId$1, pollInterval$1) => {
      clearTimeout(timeoutId$1);
      clearInterval(pollInterval$1);
    };
    existingScript?.addEventListener("error", () => {
      cleanup(timeoutId, pollInterval);
      reject(new ClerkRuntimeError(FAILED_TO_LOAD_ERROR, { code: ERROR_CODE }));
    });
    const checkAndResolve = () => {
      if (resolved) return;
      if (isClerkProperlyLoaded()) {
        resolved = true;
        cleanup(timeoutId, pollInterval);
        resolve(null);
      }
    };
    const handleTimeout = () => {
      if (resolved) return;
      resolved = true;
      cleanup(timeoutId, pollInterval);
      if (!isClerkProperlyLoaded()) reject(new ClerkRuntimeError(FAILED_TO_LOAD_ERROR, { code: ERROR_CODE_TIMEOUT }));
      else resolve(null);
    };
    const timeoutId = setTimeout(handleTimeout, timeoutMs);
    checkAndResolve();
    const pollInterval = setInterval(() => {
      if (resolved) {
        clearInterval(pollInterval);
        return;
      }
      checkAndResolve();
    }, 100);
  });
}
const loadClerkJsScript = async (opts) => {
  const timeout = opts?.scriptLoadTimeout ?? 15e3;
  if (isClerkProperlyLoaded()) return null;
  if (!opts?.publishableKey) {
    errorThrower.throwMissingPublishableKeyError();
    return null;
  }
  const scriptUrl = clerkJsScriptUrl(opts);
  const existingScript = document.querySelector("script[data-clerk-js-script]");
  if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
  else try {
    await waitForClerkWithTimeout(timeout, existingScript);
    return null;
  } catch {
    existingScript.remove();
  }
  const loadPromise = waitForClerkWithTimeout(timeout);
  loadScript(scriptUrl, {
    async: true,
    crossOrigin: "anonymous",
    nonce: opts.nonce,
    beforeLoad: applyClerkJsScriptAttributes(opts)
  }).catch((error) => {
    throw new ClerkRuntimeError(FAILED_TO_LOAD_ERROR + (error.message ? `, ${error.message}` : ""), {
      code: ERROR_CODE,
      cause: error
    });
  });
  return loadPromise;
};
const clerkJsScriptUrl = (opts) => {
  const { clerkJSUrl, clerkJSVariant, clerkJSVersion, proxyUrl, domain, publishableKey } = opts;
  if (clerkJSUrl) return clerkJSUrl;
  let scriptHost = "";
  if (!!proxyUrl && isValidProxyUrl(proxyUrl)) scriptHost = proxyUrlToAbsoluteURL(proxyUrl).replace(/http(s)?:\/\//, "");
  else if (domain && !isDevOrStagingUrl(parsePublishableKey(publishableKey)?.frontendApi || "")) scriptHost = addClerkPrefix(domain);
  else scriptHost = parsePublishableKey(publishableKey)?.frontendApi || "";
  const variant = clerkJSVariant ? `${clerkJSVariant.replace(/\.+$/, "")}.` : "";
  const version = versionSelector(clerkJSVersion);
  return `https://${scriptHost}/npm/@clerk/clerk-js@${version}/dist/clerk.${variant}browser.js`;
};
const buildClerkJsScriptAttributes = (options) => {
  const obj = {};
  if (options.publishableKey) obj["data-clerk-publishable-key"] = options.publishableKey;
  if (options.proxyUrl) obj["data-clerk-proxy-url"] = options.proxyUrl;
  if (options.domain) obj["data-clerk-domain"] = options.domain;
  if (options.nonce) obj.nonce = options.nonce;
  return obj;
};
const applyClerkJsScriptAttributes = (options) => (script) => {
  const attributes = buildClerkJsScriptAttributes(options);
  for (const attribute in attributes) script.setAttribute(attribute, attributes[attribute]);
};
const deriveState = (clerkOperational, state, initialState) => {
  if (!clerkOperational && initialState) return deriveFromSsrInitialState(initialState);
  return deriveFromClientSideState(state);
};
const deriveFromSsrInitialState = (initialState) => {
  const userId = initialState.userId;
  const user = initialState.user;
  const sessionId = initialState.sessionId;
  const sessionStatus = initialState.sessionStatus;
  const sessionClaims = initialState.sessionClaims;
  return {
    userId,
    user,
    sessionId,
    session: initialState.session,
    sessionStatus,
    sessionClaims,
    organization: initialState.organization,
    orgId: initialState.orgId,
    orgRole: initialState.orgRole,
    orgPermissions: initialState.orgPermissions,
    orgSlug: initialState.orgSlug,
    actor: initialState.actor,
    factorVerificationAge: initialState.factorVerificationAge
  };
};
const deriveFromClientSideState = (state) => {
  const userId = state.user ? state.user.id : state.user;
  const user = state.user;
  const sessionId = state.session ? state.session.id : state.session;
  const session = state.session;
  const sessionStatus = state.session?.status;
  const sessionClaims = state.session ? state.session.lastActiveToken?.jwt?.claims : null;
  const factorVerificationAge = state.session ? state.session.factorVerificationAge : null;
  const actor = session?.actor;
  const organization = state.organization;
  const orgId = state.organization ? state.organization.id : state.organization;
  const orgSlug = organization?.slug;
  const membership = organization ? user?.organizationMemberships?.find((om) => om.organization.id === orgId) : organization;
  const orgPermissions = membership ? membership.permissions : membership;
  return {
    userId,
    user,
    sessionId,
    session,
    sessionStatus,
    sessionClaims,
    organization,
    orgId,
    orgRole: membership ? membership.role : membership,
    orgSlug,
    orgPermissions,
    actor,
    factorVerificationAge
  };
};
function inBrowser() {
  return typeof window !== "undefined";
}
const _on = (eventToHandlersMap, latestPayloadMap, event, handler, opts) => {
  const { notify } = opts || {};
  let handlers = eventToHandlersMap.get(event);
  if (!handlers) {
    handlers = [];
    eventToHandlersMap.set(event, handlers);
  }
  handlers.push(handler);
  if (notify && latestPayloadMap.has(event)) handler(latestPayloadMap.get(event));
};
const _dispatch = (eventToHandlersMap, event, payload) => (eventToHandlersMap.get(event) || []).map((h) => h(payload));
const _off = (eventToHandlersMap, event, handler) => {
  const handlers = eventToHandlersMap.get(event);
  if (handlers) if (handler) handlers.splice(handlers.indexOf(handler) >>> 0, 1);
  else eventToHandlersMap.set(event, []);
};
const createEventBus = () => {
  const eventToHandlersMap = /* @__PURE__ */ new Map();
  const latestPayloadMap = /* @__PURE__ */ new Map();
  const eventToPredispatchHandlersMap = /* @__PURE__ */ new Map();
  const emit = (event, payload) => {
    latestPayloadMap.set(event, payload);
    _dispatch(eventToPredispatchHandlersMap, event, payload);
    _dispatch(eventToHandlersMap, event, payload);
  };
  return {
    on: (...args) => _on(eventToHandlersMap, latestPayloadMap, ...args),
    prioritizedOn: (...args) => _on(eventToPredispatchHandlersMap, latestPayloadMap, ...args),
    emit,
    off: (...args) => _off(eventToHandlersMap, ...args),
    prioritizedOff: (...args) => _off(eventToPredispatchHandlersMap, ...args),
    internal: { retrieveListeners: (event) => eventToHandlersMap.get(event) || [] }
  };
};
const clerkEvents = { Status: "status" };
const createClerkEventBus = () => {
  return createEventBus();
};
export {
  deprecated as A,
  logErrorInDevMode as B,
  ClerkError$1 as C,
  without as D,
  isDeeplyEqual as E,
  setClerkJsLoadingErrorPackageName as F,
  isPublishableKey as G,
  deriveState as H,
  ClientContext as I,
  __experimental_CheckoutProvider as J,
  createClerkEventBus as K,
  clerkEvents as L,
  inBrowser as M,
  handleValueOrFn as N,
  OrganizationProvider as O,
  loadClerkJsScript as P,
  useUser as Q,
  SessionContext as S,
  TelemetryCollector as T,
  UserContext as U,
  __experimental_JWTPayloadToAuthObjectProperties as _,
  ClerkAPIResponseError as a,
  buildErrorThrower$1 as b,
  isDevelopmentFromSecretKey as c,
  deprecated$1 as d,
  getAutoProxyUrlFromEnvironment as e,
  isLegacyDevAccountPortalOrigin as f,
  getCookieSuffix as g,
  isCurrentDevAccountPortalOrigin as h,
  isomorphicAtob$1 as i,
  buildAccountsBaseUrl as j,
  getSuffixedCookieName as k,
  logger as l,
  match as m,
  isClerkAPIResponseError as n,
  createCheckAuthorization$1 as o,
  parsePublishableKey$1 as p,
  parseError as q,
  retry$1 as r,
  eventMethodCalled as s,
  createContextAndHook as t,
  useAssertWrappedByClerkProvider as u,
  useClerkInstanceContext as v,
  createCheckAuthorization as w,
  resolveAuthState as x,
  buildErrorThrower as y,
  ClerkInstanceContext as z
};
