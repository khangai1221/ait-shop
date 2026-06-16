import { c as commonjsGlobal } from "./react.mjs";
var promise = { exports: {} };
var es5 = { exports: {} };
var hasRequiredEs5;
function requireEs5() {
  if (hasRequiredEs5) return es5.exports;
  hasRequiredEs5 = 1;
  var isES5 = /* @__PURE__ */ (function() {
    return this === void 0;
  })();
  if (isES5) {
    es5.exports = {
      freeze: Object.freeze,
      defineProperty: Object.defineProperty,
      getDescriptor: Object.getOwnPropertyDescriptor,
      keys: Object.keys,
      names: Object.getOwnPropertyNames,
      getPrototypeOf: Object.getPrototypeOf,
      isArray: Array.isArray,
      isES5,
      propertyIsWritable: function(obj, prop) {
        var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
        return !!(!descriptor || descriptor.writable || descriptor.set);
      }
    };
  } else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;
    var ObjectKeys = function(o) {
      var ret = [];
      for (var key in o) {
        if (has.call(o, key)) {
          ret.push(key);
        }
      }
      return ret;
    };
    var ObjectGetDescriptor = function(o, key) {
      return { value: o[key] };
    };
    var ObjectDefineProperty = function(o, key, desc) {
      o[key] = desc.value;
      return o;
    };
    var ObjectFreeze = function(obj) {
      return obj;
    };
    var ObjectGetPrototypeOf = function(obj) {
      try {
        return Object(obj).constructor.prototype;
      } catch (e) {
        return proto;
      }
    };
    var ArrayIsArray = function(obj) {
      try {
        return str.call(obj) === "[object Array]";
      } catch (e) {
        return false;
      }
    };
    es5.exports = {
      isArray: ArrayIsArray,
      keys: ObjectKeys,
      names: ObjectKeys,
      defineProperty: ObjectDefineProperty,
      getDescriptor: ObjectGetDescriptor,
      freeze: ObjectFreeze,
      getPrototypeOf: ObjectGetPrototypeOf,
      isES5,
      propertyIsWritable: function() {
        return true;
      }
    };
  }
  return es5.exports;
}
var util;
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  var es52 = requireEs5();
  var canEvaluate = typeof navigator == "undefined";
  var errorObj = { e: {} };
  var tryCatchTarget;
  var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : util !== void 0 ? util : null;
  function tryCatcher() {
    try {
      var target = tryCatchTarget;
      tryCatchTarget = null;
      return target.apply(this, arguments);
    } catch (e) {
      errorObj.e = e;
      return errorObj;
    }
  }
  function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
  }
  var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;
    function T() {
      this.constructor = Child;
      this.constructor$ = Parent;
      for (var propertyName in Parent.prototype) {
        if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
          this[propertyName + "$"] = Parent.prototype[propertyName];
        }
      }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
  };
  function isPrimitive(val) {
    return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
  }
  function isObject(value) {
    return typeof value === "function" || typeof value === "object" && value !== null;
  }
  function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;
    return new Error(safeToString(maybeError));
  }
  function withAppended(target, appendee) {
    var len = target.length;
    var ret2 = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
      ret2[i] = target[i];
    }
    ret2[i] = appendee;
    return ret2;
  }
  function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es52.isES5) {
      var desc = Object.getOwnPropertyDescriptor(obj, key);
      if (desc != null) {
        return desc.get == null && desc.set == null ? desc.value : defaultValue;
      }
    } else {
      return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;
    }
  }
  function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
      value,
      configurable: true,
      enumerable: false,
      writable: true
    };
    es52.defineProperty(obj, name, descriptor);
    return obj;
  }
  function thrower(r) {
    throw r;
  }
  var inheritedDataKeys = (function() {
    var excludedPrototypes = [
      Array.prototype,
      Object.prototype,
      Function.prototype
    ];
    var isExcludedProto = function(val) {
      for (var i = 0; i < excludedPrototypes.length; ++i) {
        if (excludedPrototypes[i] === val) {
          return true;
        }
      }
      return false;
    };
    if (es52.isES5) {
      var getKeys = Object.getOwnPropertyNames;
      return function(obj) {
        var ret2 = [];
        var visitedKeys = /* @__PURE__ */ Object.create(null);
        while (obj != null && !isExcludedProto(obj)) {
          var keys;
          try {
            keys = getKeys(obj);
          } catch (e) {
            return ret2;
          }
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (visitedKeys[key]) continue;
            visitedKeys[key] = true;
            var desc = Object.getOwnPropertyDescriptor(obj, key);
            if (desc != null && desc.get == null && desc.set == null) {
              ret2.push(key);
            }
          }
          obj = es52.getPrototypeOf(obj);
        }
        return ret2;
      };
    } else {
      var hasProp = {}.hasOwnProperty;
      return function(obj) {
        if (isExcludedProto(obj)) return [];
        var ret2 = [];
        enumeration: for (var key in obj) {
          if (hasProp.call(obj, key)) {
            ret2.push(key);
          } else {
            for (var i = 0; i < excludedPrototypes.length; ++i) {
              if (hasProp.call(excludedPrototypes[i], key)) {
                continue enumeration;
              }
            }
            ret2.push(key);
          }
        }
        return ret2;
      };
    }
  })();
  var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
  function isClass(fn) {
    try {
      if (typeof fn === "function") {
        var keys = es52.names(fn.prototype);
        var hasMethods = es52.isES5 && keys.length > 1;
        var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
        var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es52.names(fn).length > 0;
        if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  function toFastProperties(obj) {
    return obj;
  }
  var rident = /^[a-z$_][a-z$_0-9]*$/i;
  function isIdentifier(str) {
    return rident.test(str);
  }
  function filledRange(count, prefix, suffix) {
    var ret2 = new Array(count);
    for (var i = 0; i < count; ++i) {
      ret2[i] = prefix + i + suffix;
    }
    return ret2;
  }
  function safeToString(obj) {
    try {
      return obj + "";
    } catch (e) {
      return "[no string representation]";
    }
  }
  function isError(obj) {
    return obj !== null && typeof obj === "object" && typeof obj.message === "string" && typeof obj.name === "string";
  }
  function markAsOriginatingFromRejection(e) {
    try {
      notEnumerableProp(e, "isOperational", true);
    } catch (ignore) {
    }
  }
  function originatesFromRejection(e) {
    if (e == null) return false;
    return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
  }
  function canAttachTrace(obj) {
    return isError(obj) && es52.propertyIsWritable(obj, "stack");
  }
  var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
      return function(value) {
        if (canAttachTrace(value)) return value;
        try {
          throw new Error(safeToString(value));
        } catch (err) {
          return err;
        }
      };
    } else {
      return function(value) {
        if (canAttachTrace(value)) return value;
        return new Error(safeToString(value));
      };
    }
  })();
  function classString(obj) {
    return {}.toString.call(obj);
  }
  function copyDescriptors(from, to, filter2) {
    var keys = es52.names(from);
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      if (filter2(key)) {
        try {
          es52.defineProperty(to, key, es52.getDescriptor(from, key));
        } catch (ignore) {
        }
      }
    }
  }
  var asArray = function(v) {
    if (es52.isArray(v)) {
      return v;
    }
    return null;
  };
  if (typeof Symbol !== "undefined" && Symbol.iterator) {
    var ArrayFrom = typeof Array.from === "function" ? function(v) {
      return Array.from(v);
    } : function(v) {
      var ret2 = [];
      var it = v[Symbol.iterator]();
      var itResult;
      while (!(itResult = it.next()).done) {
        ret2.push(itResult.value);
      }
      return ret2;
    };
    asArray = function(v) {
      if (es52.isArray(v)) {
        return v;
      } else if (v != null && typeof v[Symbol.iterator] === "function") {
        return ArrayFrom(v);
      }
      return null;
    };
  }
  var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";
  var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";
  function env(key) {
    return hasEnvVariables ? process.env[key] : void 0;
  }
  function getNativePromise() {
    if (typeof Promise === "function") {
      try {
        var promise2 = new Promise(function() {
        });
        if ({}.toString.call(promise2) === "[object Promise]") {
          return Promise;
        }
      } catch (e) {
      }
    }
  }
  function domainBind(self2, cb) {
    return self2.bind(cb);
  }
  var ret = {
    isClass,
    isIdentifier,
    inheritedDataKeys,
    getDataPropertyOrDefault,
    thrower,
    isArray: es52.isArray,
    asArray,
    notEnumerableProp,
    isPrimitive,
    isObject,
    isError,
    canEvaluate,
    errorObj,
    tryCatch,
    inherits,
    withAppended,
    maybeWrapAsError,
    toFastProperties,
    filledRange,
    toString: safeToString,
    canAttachTrace,
    ensureErrorObject,
    originatesFromRejection,
    markAsOriginatingFromRejection,
    classString,
    copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome && typeof chrome.loadTimes === "function",
    isNode,
    hasEnvVariables,
    env,
    global: globalObject,
    getNativePromise,
    domainBind
  };
  ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return version[0] === 0 && version[1] > 10 || version[0] > 0;
  })();
  if (ret.isNode) ret.toFastProperties(process);
  try {
    throw new Error();
  } catch (e) {
    ret.lastLineError = e;
  }
  util = ret;
  return util;
}
var async = { exports: {} };
var schedule_1;
var hasRequiredSchedule;
function requireSchedule() {
  if (hasRequiredSchedule) return schedule_1;
  hasRequiredSchedule = 1;
  var util2 = requireUtil();
  var schedule;
  var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
  };
  var NativePromise = util2.getNativePromise();
  if (util2.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = commonjsGlobal.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util2.isRecentNode ? function(fn) {
      GlobalSetImmediate.call(commonjsGlobal, fn);
    } : function(fn) {
      ProcessNextTick.call(process, fn);
    };
  } else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
      nativePromise.then(fn);
    };
  } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova))) {
    schedule = (function() {
      var div = document.createElement("div");
      var opts = { attributes: true };
      var toggleScheduled = false;
      var div2 = document.createElement("div");
      var o2 = new MutationObserver(function() {
        div.classList.toggle("foo");
        toggleScheduled = false;
      });
      o2.observe(div2, opts);
      var scheduleToggle = function() {
        if (toggleScheduled) return;
        toggleScheduled = true;
        div2.classList.toggle("foo");
      };
      return function schedule2(fn) {
        var o = new MutationObserver(function() {
          o.disconnect();
          fn();
        });
        o.observe(div, opts);
        scheduleToggle();
      };
    })();
  } else if (typeof setImmediate !== "undefined") {
    schedule = function(fn) {
      setImmediate(fn);
    };
  } else if (typeof setTimeout !== "undefined") {
    schedule = function(fn) {
      setTimeout(fn, 0);
    };
  } else {
    schedule = noAsyncScheduler;
  }
  schedule_1 = schedule;
  return schedule_1;
}
var queue;
var hasRequiredQueue;
function requireQueue() {
  if (hasRequiredQueue) return queue;
  hasRequiredQueue = 1;
  function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
      dst[j + dstIndex] = src[j + srcIndex];
      src[j + srcIndex] = void 0;
    }
  }
  function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
  }
  Queue.prototype._willBeOverCapacity = function(size) {
    return this._capacity < size;
  };
  Queue.prototype._pushOne = function(arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = this._front + length & this._capacity - 1;
    this[i] = arg;
    this._length = length + 1;
  };
  Queue.prototype.push = function(fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
      this._pushOne(fn);
      this._pushOne(receiver);
      this._pushOne(arg);
      return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[j + 0 & wrapMask] = fn;
    this[j + 1 & wrapMask] = receiver;
    this[j + 2 & wrapMask] = arg;
    this._length = length;
  };
  Queue.prototype.shift = function() {
    var front = this._front, ret = this[front];
    this[front] = void 0;
    this._front = front + 1 & this._capacity - 1;
    this._length--;
    return ret;
  };
  Queue.prototype.length = function() {
    return this._length;
  };
  Queue.prototype._checkCapacity = function(size) {
    if (this._capacity < size) {
      this._resizeTo(this._capacity << 1);
    }
  };
  Queue.prototype._resizeTo = function(capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    var moveItemsCount = front + length & oldCapacity - 1;
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
  };
  queue = Queue;
  return queue;
}
var hasRequiredAsync;
function requireAsync() {
  if (hasRequiredAsync) return async.exports;
  hasRequiredAsync = 1;
  var firstLineError;
  try {
    throw new Error();
  } catch (e) {
    firstLineError = e;
  }
  var schedule = requireSchedule();
  var Queue = requireQueue();
  var util2 = requireUtil();
  function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self2 = this;
    this.drainQueues = function() {
      self2._drainQueues();
    };
    this._schedule = schedule;
  }
  Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
  };
  Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
  };
  Async.prototype.enableTrampoline = function() {
    this._trampolineEnabled = true;
  };
  Async.prototype.disableTrampolineIfNecessary = function() {
    if (util2.hasDevTools) {
      this._trampolineEnabled = false;
    }
  };
  Async.prototype.haveItemsQueued = function() {
    return this._isTickUsed || this._haveDrainedQueues;
  };
  Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
      process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
      process.exit(2);
    } else {
      this.throwLater(e);
    }
  };
  Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
      arg = fn;
      fn = function() {
        throw arg;
      };
    }
    if (typeof setTimeout !== "undefined") {
      setTimeout(function() {
        fn(arg);
      }, 0);
    } else try {
      this._schedule(function() {
        fn(arg);
      });
    } catch (e) {
      throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
    }
  };
  function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
  }
  function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
  }
  function AsyncSettlePromises(promise2) {
    this._normalQueue._pushOne(promise2);
    this._queueTick();
  }
  if (!util2.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
  } else {
    Async.prototype.invokeLater = function(fn, receiver, arg) {
      if (this._trampolineEnabled) {
        AsyncInvokeLater.call(this, fn, receiver, arg);
      } else {
        this._schedule(function() {
          setTimeout(function() {
            fn.call(receiver, arg);
          }, 100);
        });
      }
    };
    Async.prototype.invoke = function(fn, receiver, arg) {
      if (this._trampolineEnabled) {
        AsyncInvoke.call(this, fn, receiver, arg);
      } else {
        this._schedule(function() {
          fn.call(receiver, arg);
        });
      }
    };
    Async.prototype.settlePromises = function(promise2) {
      if (this._trampolineEnabled) {
        AsyncSettlePromises.call(this, promise2);
      } else {
        this._schedule(function() {
          promise2._settlePromises();
        });
      }
    };
  }
  Async.prototype._drainQueue = function(queue2) {
    while (queue2.length() > 0) {
      var fn = queue2.shift();
      if (typeof fn !== "function") {
        fn._settlePromises();
        continue;
      }
      var receiver = queue2.shift();
      var arg = queue2.shift();
      fn.call(receiver, arg);
    }
  };
  Async.prototype._drainQueues = function() {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    this._drainQueue(this._lateQueue);
  };
  Async.prototype._queueTick = function() {
    if (!this._isTickUsed) {
      this._isTickUsed = true;
      this._schedule(this.drainQueues);
    }
  };
  Async.prototype._reset = function() {
    this._isTickUsed = false;
  };
  async.exports = Async;
  async.exports.firstLineError = firstLineError;
  return async.exports;
}
var errors;
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  var es52 = requireEs5();
  var Objectfreeze = es52.freeze;
  var util2 = requireUtil();
  var inherits = util2.inherits;
  var notEnumerableProp = util2.notEnumerableProp;
  function subError(nameProperty, defaultMessage) {
    function SubError(message) {
      if (!(this instanceof SubError)) return new SubError(message);
      notEnumerableProp(
        this,
        "message",
        typeof message === "string" ? message : defaultMessage
      );
      notEnumerableProp(this, "name", nameProperty);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        Error.call(this);
      }
    }
    inherits(SubError, Error);
    return SubError;
  }
  var _TypeError, _RangeError;
  var Warning = subError("Warning", "warning");
  var CancellationError = subError("CancellationError", "cancellation error");
  var TimeoutError = subError("TimeoutError", "timeout error");
  var AggregateError = subError("AggregateError", "aggregate error");
  try {
    _TypeError = TypeError;
    _RangeError = RangeError;
  } catch (e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
  }
  var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
  for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
      AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
  }
  es52.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
  });
  AggregateError.prototype["isOperational"] = true;
  var level = 0;
  AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i2 = 0; i2 < this.length; ++i2) {
      var str = this[i2] === this ? "[Circular AggregateError]" : this[i2] + "";
      var lines = str.split("\n");
      for (var j = 0; j < lines.length; ++j) {
        lines[j] = indent + lines[j];
      }
      str = lines.join("\n");
      ret += str + "\n";
    }
    level--;
    return ret;
  };
  function OperationalError(message) {
    if (!(this instanceof OperationalError))
      return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;
    if (message instanceof Error) {
      notEnumerableProp(this, "message", message.message);
      notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  inherits(OperationalError, Error);
  var errorTypes = Error["__BluebirdErrorTypes__"];
  if (!errorTypes) {
    errorTypes = Objectfreeze({
      CancellationError,
      TimeoutError,
      OperationalError,
      RejectionError: OperationalError,
      AggregateError
    });
    es52.defineProperty(Error, "__BluebirdErrorTypes__", {
      value: errorTypes,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  errors = {
    Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning
  };
  return errors;
}
var thenables;
var hasRequiredThenables;
function requireThenables() {
  if (hasRequiredThenables) return thenables;
  hasRequiredThenables = 1;
  thenables = function(Promise2, INTERNAL) {
    var util2 = requireUtil();
    var errorObj = util2.errorObj;
    var isObject = util2.isObject;
    function tryConvertToPromise(obj, context2) {
      if (isObject(obj)) {
        if (obj instanceof Promise2) return obj;
        var then = getThen(obj);
        if (then === errorObj) {
          if (context2) context2._pushContext();
          var ret = Promise2.reject(then.e);
          if (context2) context2._popContext();
          return ret;
        } else if (typeof then === "function") {
          if (isAnyBluebirdPromise(obj)) {
            var ret = new Promise2(INTERNAL);
            obj._then(
              ret._fulfill,
              ret._reject,
              void 0,
              ret,
              null
            );
            return ret;
          }
          return doThenable(obj, then, context2);
        }
      }
      return obj;
    }
    function doGetThen(obj) {
      return obj.then;
    }
    function getThen(obj) {
      try {
        return doGetThen(obj);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    }
    var hasProp = {}.hasOwnProperty;
    function isAnyBluebirdPromise(obj) {
      try {
        return hasProp.call(obj, "_promise0");
      } catch (e) {
        return false;
      }
    }
    function doThenable(x, then, context2) {
      var promise2 = new Promise2(INTERNAL);
      var ret = promise2;
      if (context2) context2._pushContext();
      promise2._captureStackTrace();
      if (context2) context2._popContext();
      var synchronous = true;
      var result = util2.tryCatch(then).call(x, resolve, reject);
      synchronous = false;
      if (promise2 && result === errorObj) {
        promise2._rejectCallback(result.e, true, true);
        promise2 = null;
      }
      function resolve(value) {
        if (!promise2) return;
        promise2._resolveCallback(value);
        promise2 = null;
      }
      function reject(reason) {
        if (!promise2) return;
        promise2._rejectCallback(reason, synchronous, true);
        promise2 = null;
      }
      return ret;
    }
    return tryConvertToPromise;
  };
  return thenables;
}
var promise_array;
var hasRequiredPromise_array;
function requirePromise_array() {
  if (hasRequiredPromise_array) return promise_array;
  hasRequiredPromise_array = 1;
  promise_array = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
    var util2 = requireUtil();
    util2.isArray;
    function toResolutionValue(val) {
      switch (val) {
        case -2:
          return [];
        case -3:
          return {};
      }
    }
    function PromiseArray(values) {
      var promise2 = this._promise = new Promise2(INTERNAL);
      if (values instanceof Promise2) {
        promise2._propagateFrom(values, 3);
      }
      promise2._setOnCancel(this);
      this._values = values;
      this._length = 0;
      this._totalResolved = 0;
      this._init(void 0, -2);
    }
    util2.inherits(PromiseArray, Proxyable);
    PromiseArray.prototype.length = function() {
      return this._length;
    };
    PromiseArray.prototype.promise = function() {
      return this._promise;
    };
    PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
      var values = tryConvertToPromise(this._values, this._promise);
      if (values instanceof Promise2) {
        values = values._target();
        var bitField = values._bitField;
        this._values = values;
        if ((bitField & 50397184) === 0) {
          this._promise._setAsyncGuaranteed();
          return values._then(
            init,
            this._reject,
            void 0,
            this,
            resolveValueIfEmpty
          );
        } else if ((bitField & 33554432) !== 0) {
          values = values._value();
        } else if ((bitField & 16777216) !== 0) {
          return this._reject(values._reason());
        } else {
          return this._cancel();
        }
      }
      values = util2.asArray(values);
      if (values === null) {
        var err = apiRejection(
          "expecting an array or an iterable object but got " + util2.classString(values)
        ).reason();
        this._promise._rejectCallback(err, false);
        return;
      }
      if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
          this._resolveEmptyArray();
        } else {
          this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
      }
      this._iterate(values);
    };
    PromiseArray.prototype._iterate = function(values) {
      var len = this.getActualLength(values.length);
      this._length = len;
      this._values = this.shouldCopyValues() ? new Array(len) : this._values;
      var result = this._promise;
      var isResolved = false;
      var bitField = null;
      for (var i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);
        if (maybePromise instanceof Promise2) {
          maybePromise = maybePromise._target();
          bitField = maybePromise._bitField;
        } else {
          bitField = null;
        }
        if (isResolved) {
          if (bitField !== null) {
            maybePromise.suppressUnhandledRejections();
          }
        } else if (bitField !== null) {
          if ((bitField & 50397184) === 0) {
            maybePromise._proxy(this, i);
            this._values[i] = maybePromise;
          } else if ((bitField & 33554432) !== 0) {
            isResolved = this._promiseFulfilled(maybePromise._value(), i);
          } else if ((bitField & 16777216) !== 0) {
            isResolved = this._promiseRejected(maybePromise._reason(), i);
          } else {
            isResolved = this._promiseCancelled(i);
          }
        } else {
          isResolved = this._promiseFulfilled(maybePromise, i);
        }
      }
      if (!isResolved) result._setAsyncGuaranteed();
    };
    PromiseArray.prototype._isResolved = function() {
      return this._values === null;
    };
    PromiseArray.prototype._resolve = function(value) {
      this._values = null;
      this._promise._fulfill(value);
    };
    PromiseArray.prototype._cancel = function() {
      if (this._isResolved() || !this._promise._isCancellable()) return;
      this._values = null;
      this._promise._cancel();
    };
    PromiseArray.prototype._reject = function(reason) {
      this._values = null;
      this._promise._rejectCallback(reason, false);
    };
    PromiseArray.prototype._promiseFulfilled = function(value, index) {
      this._values[index] = value;
      var totalResolved = ++this._totalResolved;
      if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
      }
      return false;
    };
    PromiseArray.prototype._promiseCancelled = function() {
      this._cancel();
      return true;
    };
    PromiseArray.prototype._promiseRejected = function(reason) {
      this._totalResolved++;
      this._reject(reason);
      return true;
    };
    PromiseArray.prototype._resultCancelled = function() {
      if (this._isResolved()) return;
      var values = this._values;
      this._cancel();
      if (values instanceof Promise2) {
        values.cancel();
      } else {
        for (var i = 0; i < values.length; ++i) {
          if (values[i] instanceof Promise2) {
            values[i].cancel();
          }
        }
      }
    };
    PromiseArray.prototype.shouldCopyValues = function() {
      return true;
    };
    PromiseArray.prototype.getActualLength = function(len) {
      return len;
    };
    return PromiseArray;
  };
  return promise_array;
}
var context;
var hasRequiredContext;
function requireContext() {
  if (hasRequiredContext) return context;
  hasRequiredContext = 1;
  context = function(Promise2) {
    var longStackTraces = false;
    var contextStack = [];
    Promise2.prototype._promiseCreated = function() {
    };
    Promise2.prototype._pushContext = function() {
    };
    Promise2.prototype._popContext = function() {
      return null;
    };
    Promise2._peekContext = Promise2.prototype._peekContext = function() {
    };
    function Context() {
      this._trace = new Context.CapturedTrace(peekContext());
    }
    Context.prototype._pushContext = function() {
      if (this._trace !== void 0) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
      }
    };
    Context.prototype._popContext = function() {
      if (this._trace !== void 0) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
      }
      return null;
    };
    function createContext() {
      if (longStackTraces) return new Context();
    }
    function peekContext() {
      var lastIndex = contextStack.length - 1;
      if (lastIndex >= 0) {
        return contextStack[lastIndex];
      }
      return void 0;
    }
    Context.CapturedTrace = null;
    Context.create = createContext;
    Context.deactivateLongStackTraces = function() {
    };
    Context.activateLongStackTraces = function() {
      var Promise_pushContext = Promise2.prototype._pushContext;
      var Promise_popContext = Promise2.prototype._popContext;
      var Promise_PeekContext = Promise2._peekContext;
      var Promise_peekContext = Promise2.prototype._peekContext;
      var Promise_promiseCreated = Promise2.prototype._promiseCreated;
      Context.deactivateLongStackTraces = function() {
        Promise2.prototype._pushContext = Promise_pushContext;
        Promise2.prototype._popContext = Promise_popContext;
        Promise2._peekContext = Promise_PeekContext;
        Promise2.prototype._peekContext = Promise_peekContext;
        Promise2.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
      };
      longStackTraces = true;
      Promise2.prototype._pushContext = Context.prototype._pushContext;
      Promise2.prototype._popContext = Context.prototype._popContext;
      Promise2._peekContext = Promise2.prototype._peekContext = peekContext;
      Promise2.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
      };
    };
    return Context;
  };
  return context;
}
var debuggability;
var hasRequiredDebuggability;
function requireDebuggability() {
  if (hasRequiredDebuggability) return debuggability;
  hasRequiredDebuggability = 1;
  debuggability = function(Promise2, Context) {
    var getDomain = Promise2._getDomain;
    var async2 = Promise2._async;
    var Warning = requireErrors().Warning;
    var util2 = requireUtil();
    var canAttachTrace = util2.canAttachTrace;
    var unhandledRejectionHandled;
    var possiblyUnhandledRejection;
    var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
    var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
    var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
    var stackFramePattern = null;
    var formatStack = null;
    var indentStackFrames = false;
    var printWarning;
    var debugging = !!(util2.env("BLUEBIRD_DEBUG") != 0 && (util2.env("BLUEBIRD_DEBUG") || util2.env("NODE_ENV") === "development"));
    var warnings = !!(util2.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util2.env("BLUEBIRD_WARNINGS")));
    var longStackTraces = !!(util2.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util2.env("BLUEBIRD_LONG_STACK_TRACES")));
    var wForgottenReturn = util2.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util2.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
    Promise2.prototype.suppressUnhandledRejections = function() {
      var target = this._target();
      target._bitField = target._bitField & -1048577 | 524288;
    };
    Promise2.prototype._ensurePossibleRejectionHandled = function() {
      if ((this._bitField & 524288) !== 0) return;
      this._setRejectionIsUnhandled();
      async2.invokeLater(this._notifyUnhandledRejection, this, void 0);
    };
    Promise2.prototype._notifyUnhandledRejectionIsHandled = function() {
      fireRejectionEvent(
        "rejectionHandled",
        unhandledRejectionHandled,
        void 0,
        this
      );
    };
    Promise2.prototype._setReturnedNonUndefined = function() {
      this._bitField = this._bitField | 268435456;
    };
    Promise2.prototype._returnedNonUndefined = function() {
      return (this._bitField & 268435456) !== 0;
    };
    Promise2.prototype._notifyUnhandledRejection = function() {
      if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified();
        fireRejectionEvent(
          "unhandledRejection",
          possiblyUnhandledRejection,
          reason,
          this
        );
      }
    };
    Promise2.prototype._setUnhandledRejectionIsNotified = function() {
      this._bitField = this._bitField | 262144;
    };
    Promise2.prototype._unsetUnhandledRejectionIsNotified = function() {
      this._bitField = this._bitField & -262145;
    };
    Promise2.prototype._isUnhandledRejectionNotified = function() {
      return (this._bitField & 262144) > 0;
    };
    Promise2.prototype._setRejectionIsUnhandled = function() {
      this._bitField = this._bitField | 1048576;
    };
    Promise2.prototype._unsetRejectionIsUnhandled = function() {
      this._bitField = this._bitField & -1048577;
      if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
      }
    };
    Promise2.prototype._isRejectionUnhandled = function() {
      return (this._bitField & 1048576) > 0;
    };
    Promise2.prototype._warn = function(message, shouldUseOwnTrace, promise2) {
      return warn(message, shouldUseOwnTrace, promise2 || this);
    };
    Promise2.onPossiblyUnhandledRejection = function(fn) {
      var domain = getDomain();
      possiblyUnhandledRejection = typeof fn === "function" ? domain === null ? fn : util2.domainBind(domain, fn) : void 0;
    };
    Promise2.onUnhandledRejectionHandled = function(fn) {
      var domain = getDomain();
      unhandledRejectionHandled = typeof fn === "function" ? domain === null ? fn : util2.domainBind(domain, fn) : void 0;
    };
    var disableLongStackTraces = function() {
    };
    Promise2.longStackTraces = function() {
      if (async2.haveItemsQueued() && !config.longStackTraces) {
        throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
      }
      if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise2.prototype._captureStackTrace;
        var Promise_attachExtraTrace = Promise2.prototype._attachExtraTrace;
        config.longStackTraces = true;
        disableLongStackTraces = function() {
          if (async2.haveItemsQueued() && !config.longStackTraces) {
            throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
          }
          Promise2.prototype._captureStackTrace = Promise_captureStackTrace;
          Promise2.prototype._attachExtraTrace = Promise_attachExtraTrace;
          Context.deactivateLongStackTraces();
          async2.enableTrampoline();
          config.longStackTraces = false;
        };
        Promise2.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
        Promise2.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
        Context.activateLongStackTraces();
        async2.disableTrampolineIfNecessary();
      }
    };
    Promise2.hasLongStackTraces = function() {
      return config.longStackTraces && longStackTracesIsSupported();
    };
    var fireDomEvent = (function() {
      try {
        if (typeof CustomEvent === "function") {
          var event = new CustomEvent("CustomEvent");
          util2.global.dispatchEvent(event);
          return function(name, event2) {
            var domEvent = new CustomEvent(name.toLowerCase(), {
              detail: event2,
              cancelable: true
            });
            return !util2.global.dispatchEvent(domEvent);
          };
        } else if (typeof Event === "function") {
          var event = new Event("CustomEvent");
          util2.global.dispatchEvent(event);
          return function(name, event2) {
            var domEvent = new Event(name.toLowerCase(), {
              cancelable: true
            });
            domEvent.detail = event2;
            return !util2.global.dispatchEvent(domEvent);
          };
        } else {
          var event = document.createEvent("CustomEvent");
          event.initCustomEvent("testingtheevent", false, true, {});
          util2.global.dispatchEvent(event);
          return function(name, event2) {
            var domEvent = document.createEvent("CustomEvent");
            domEvent.initCustomEvent(
              name.toLowerCase(),
              false,
              true,
              event2
            );
            return !util2.global.dispatchEvent(domEvent);
          };
        }
      } catch (e) {
      }
      return function() {
        return false;
      };
    })();
    var fireGlobalEvent = (function() {
      if (util2.isNode) {
        return function() {
          return process.emit.apply(process, arguments);
        };
      } else {
        if (!util2.global) {
          return function() {
            return false;
          };
        }
        return function(name) {
          var methodName = "on" + name.toLowerCase();
          var method2 = util2.global[methodName];
          if (!method2) return false;
          method2.apply(util2.global, [].slice.call(arguments, 1));
          return true;
        };
      }
    })();
    function generatePromiseLifecycleEventObject(name, promise2) {
      return { promise: promise2 };
    }
    var eventToObjectGenerator = {
      promiseCreated: generatePromiseLifecycleEventObject,
      promiseFulfilled: generatePromiseLifecycleEventObject,
      promiseRejected: generatePromiseLifecycleEventObject,
      promiseResolved: generatePromiseLifecycleEventObject,
      promiseCancelled: generatePromiseLifecycleEventObject,
      promiseChained: function(name, promise2, child) {
        return { promise: promise2, child };
      },
      warning: function(name, warning) {
        return { warning };
      },
      unhandledRejection: function(name, reason, promise2) {
        return { reason, promise: promise2 };
      },
      rejectionHandled: generatePromiseLifecycleEventObject
    };
    var activeFireEvent = function(name) {
      var globalEventFired = false;
      try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
      } catch (e) {
        async2.throwLater(e);
        globalEventFired = true;
      }
      var domEventFired = false;
      try {
        domEventFired = fireDomEvent(
          name,
          eventToObjectGenerator[name].apply(null, arguments)
        );
      } catch (e) {
        async2.throwLater(e);
        domEventFired = true;
      }
      return domEventFired || globalEventFired;
    };
    Promise2.config = function(opts) {
      opts = Object(opts);
      if ("longStackTraces" in opts) {
        if (opts.longStackTraces) {
          Promise2.longStackTraces();
        } else if (!opts.longStackTraces && Promise2.hasLongStackTraces()) {
          disableLongStackTraces();
        }
      }
      if ("warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption;
        wForgottenReturn = config.warnings;
        if (util2.isObject(warningsOption)) {
          if ("wForgottenReturn" in warningsOption) {
            wForgottenReturn = !!warningsOption.wForgottenReturn;
          }
        }
      }
      if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async2.haveItemsQueued()) {
          throw new Error(
            "cannot enable cancellation after promises are in use"
          );
        }
        Promise2.prototype._clearCancellationData = cancellationClearCancellationData;
        Promise2.prototype._propagateFrom = cancellationPropagateFrom;
        Promise2.prototype._onCancel = cancellationOnCancel;
        Promise2.prototype._setOnCancel = cancellationSetOnCancel;
        Promise2.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
        Promise2.prototype._execute = cancellationExecute;
        propagateFromFunction = cancellationPropagateFrom;
        config.cancellation = true;
      }
      if ("monitoring" in opts) {
        if (opts.monitoring && !config.monitoring) {
          config.monitoring = true;
          Promise2.prototype._fireEvent = activeFireEvent;
        } else if (!opts.monitoring && config.monitoring) {
          config.monitoring = false;
          Promise2.prototype._fireEvent = defaultFireEvent;
        }
      }
      return Promise2;
    };
    function defaultFireEvent() {
      return false;
    }
    Promise2.prototype._fireEvent = defaultFireEvent;
    Promise2.prototype._execute = function(executor, resolve, reject) {
      try {
        executor(resolve, reject);
      } catch (e) {
        return e;
      }
    };
    Promise2.prototype._onCancel = function() {
    };
    Promise2.prototype._setOnCancel = function(handler) {
    };
    Promise2.prototype._attachCancellationCallback = function(onCancel) {
    };
    Promise2.prototype._captureStackTrace = function() {
    };
    Promise2.prototype._attachExtraTrace = function() {
    };
    Promise2.prototype._clearCancellationData = function() {
    };
    Promise2.prototype._propagateFrom = function(parent, flags) {
    };
    function cancellationExecute(executor, resolve, reject) {
      var promise2 = this;
      try {
        executor(resolve, reject, function(onCancel) {
          if (typeof onCancel !== "function") {
            throw new TypeError("onCancel must be a function, got: " + util2.toString(onCancel));
          }
          promise2._attachCancellationCallback(onCancel);
        });
      } catch (e) {
        return e;
      }
    }
    function cancellationAttachCancellationCallback(onCancel) {
      if (!this._isCancellable()) return this;
      var previousOnCancel = this._onCancel();
      if (previousOnCancel !== void 0) {
        if (util2.isArray(previousOnCancel)) {
          previousOnCancel.push(onCancel);
        } else {
          this._setOnCancel([previousOnCancel, onCancel]);
        }
      } else {
        this._setOnCancel(onCancel);
      }
    }
    function cancellationOnCancel() {
      return this._onCancelField;
    }
    function cancellationSetOnCancel(onCancel) {
      this._onCancelField = onCancel;
    }
    function cancellationClearCancellationData() {
      this._cancellationParent = void 0;
      this._onCancelField = void 0;
    }
    function cancellationPropagateFrom(parent, flags) {
      if ((flags & 1) !== 0) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        if (branchesRemainingToCancel === void 0) {
          branchesRemainingToCancel = 0;
        }
        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
      }
      if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
      }
    }
    function bindingPropagateFrom(parent, flags) {
      if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
      }
    }
    var propagateFromFunction = bindingPropagateFrom;
    function boundValueFunction() {
      var ret = this._boundTo;
      if (ret !== void 0) {
        if (ret instanceof Promise2) {
          if (ret.isFulfilled()) {
            return ret.value();
          } else {
            return void 0;
          }
        }
      }
      return ret;
    }
    function longStackTracesCaptureStackTrace() {
      this._trace = new CapturedTrace(this._peekContext());
    }
    function longStackTracesAttachExtraTrace(error, ignoreSelf) {
      if (canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== void 0) {
          if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== void 0) {
          trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
          var parsed = parseStackAndMessage(error);
          util2.notEnumerableProp(
            error,
            "stack",
            parsed.message + "\n" + parsed.stack.join("\n")
          );
          util2.notEnumerableProp(error, "__stackCleaned__", true);
        }
      }
    }
    function checkForgottenReturns(returnValue, promiseCreated, name, promise2, parent) {
      if (returnValue === void 0 && promiseCreated !== null && wForgottenReturn) {
        if (parent !== void 0 && parent._returnedNonUndefined()) return;
        if ((promise2._bitField & 65535) === 0) return;
        if (name) name = name + " ";
        var handlerLine = "";
        var creatorLine = "";
        if (promiseCreated._trace) {
          var traceLines = promiseCreated._trace.stack.split("\n");
          var stack = cleanStack(traceLines);
          for (var i = stack.length - 1; i >= 0; --i) {
            var line = stack[i];
            if (!nodeFramePattern.test(line)) {
              var lineMatches = line.match(parseLinePattern);
              if (lineMatches) {
                handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
              }
              break;
            }
          }
          if (stack.length > 0) {
            var firstUserLine = stack[0];
            for (var i = 0; i < traceLines.length; ++i) {
              if (traceLines[i] === firstUserLine) {
                if (i > 0) {
                  creatorLine = "\n" + traceLines[i - 1];
                }
                break;
              }
            }
          }
        }
        var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
        promise2._warn(msg, true, promiseCreated);
      }
    }
    function deprecated(name, replacement) {
      var message = name + " is deprecated and will be removed in a future version.";
      if (replacement) message += " Use " + replacement + " instead.";
      return warn(message);
    }
    function warn(message, shouldUseOwnTrace, promise2) {
      if (!config.warnings) return;
      var warning = new Warning(message);
      var ctx;
      if (shouldUseOwnTrace) {
        promise2._attachExtraTrace(warning);
      } else if (config.longStackTraces && (ctx = Promise2._peekContext())) {
        ctx.attachExtraTrace(warning);
      } else {
        var parsed = parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
      }
      if (!activeFireEvent("warning", warning)) {
        formatAndLogError(warning, "", true);
      }
    }
    function reconstructStack(message, stacks) {
      for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
      }
      if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
      }
      return message + "\n" + stacks.join("\n");
    }
    function removeDuplicateOrEmptyJumps(stacks) {
      for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
          stacks.splice(i, 1);
          i--;
        }
      }
    }
    function removeCommonRoots(stacks) {
      var current = stacks[0];
      for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;
        for (var j = prev.length - 1; j >= 0; --j) {
          if (prev[j] === currentLastLine) {
            commonRootMeetPoint = j;
            break;
          }
        }
        for (var j = commonRootMeetPoint; j >= 0; --j) {
          var line = prev[j];
          if (current[currentLastIndex] === line) {
            current.pop();
            currentLastIndex--;
          } else {
            break;
          }
        }
        current = prev;
      }
    }
    function cleanStack(stack) {
      var ret = [];
      for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
          if (indentStackFrames && line.charAt(0) !== " ") {
            line = "    " + line;
          }
          ret.push(line);
        }
      }
      return ret;
    }
    function stackFramesAsArray(error) {
      var stack = error.stack.replace(/\s+$/g, "").split("\n");
      for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
          break;
        }
      }
      if (i > 0 && error.name != "SyntaxError") {
        stack = stack.slice(i);
      }
      return stack;
    }
    function parseStackAndMessage(error) {
      var stack = error.stack;
      var message = error.toString();
      stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
      return {
        message,
        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
      };
    }
    function formatAndLogError(error, title, isSoft) {
      if (typeof console !== "undefined") {
        var message;
        if (util2.isObject(error)) {
          var stack = error.stack;
          message = title + formatStack(stack, error);
        } else {
          message = title + String(error);
        }
        if (typeof printWarning === "function") {
          printWarning(message, isSoft);
        } else if (typeof console.log === "function" || typeof console.log === "object") {
          console.log(message);
        }
      }
    }
    function fireRejectionEvent(name, localHandler, reason, promise2) {
      var localEventFired = false;
      try {
        if (typeof localHandler === "function") {
          localEventFired = true;
          if (name === "rejectionHandled") {
            localHandler(promise2);
          } else {
            localHandler(reason, promise2);
          }
        }
      } catch (e) {
        async2.throwLater(e);
      }
      if (name === "unhandledRejection") {
        if (!activeFireEvent(name, reason, promise2) && !localEventFired) {
          formatAndLogError(reason, "Unhandled rejection ");
        }
      } else {
        activeFireEvent(name, promise2);
      }
    }
    function formatNonError(obj) {
      var str;
      if (typeof obj === "function") {
        str = "[function " + (obj.name || "anonymous") + "]";
      } else {
        str = obj && typeof obj.toString === "function" ? obj.toString() : util2.toString(obj);
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
          try {
            var newStr = JSON.stringify(obj);
            str = newStr;
          } catch (e) {
          }
        }
        if (str.length === 0) {
          str = "(empty array)";
        }
      }
      return "(<" + snip(str) + ">, no stack trace)";
    }
    function snip(str) {
      var maxChars = 41;
      if (str.length < maxChars) {
        return str;
      }
      return str.substr(0, maxChars - 3) + "...";
    }
    function longStackTracesIsSupported() {
      return typeof captureStackTrace === "function";
    }
    var shouldIgnore = function() {
      return false;
    };
    var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
    function parseLineInfo(line) {
      var matches = line.match(parseLineInfoRegex);
      if (matches) {
        return {
          fileName: matches[1],
          line: parseInt(matches[2], 10)
        };
      }
    }
    function setBounds(firstLineError, lastLineError) {
      if (!longStackTracesIsSupported()) return;
      var firstStackLines = firstLineError.stack.split("\n");
      var lastStackLines = lastLineError.stack.split("\n");
      var firstIndex = -1;
      var lastIndex = -1;
      var firstFileName;
      var lastFileName;
      for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
          firstFileName = result.fileName;
          firstIndex = result.line;
          break;
        }
      }
      for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
          lastFileName = result.fileName;
          lastIndex = result.line;
          break;
        }
      }
      if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
      }
      shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
          if (info.fileName === firstFileName && (firstIndex <= info.line && info.line <= lastIndex)) {
            return true;
          }
        }
        return false;
      };
    }
    function CapturedTrace(parent) {
      this._parent = parent;
      this._promisesCreated = 0;
      var length = this._length = 1 + (parent === void 0 ? 0 : parent._length);
      captureStackTrace(this, CapturedTrace);
      if (length > 32) this.uncycle();
    }
    util2.inherits(CapturedTrace, Error);
    Context.CapturedTrace = CapturedTrace;
    CapturedTrace.prototype.uncycle = function() {
      var length = this._length;
      if (length < 2) return;
      var nodes = [];
      var stackToIndex = {};
      for (var i = 0, node = this; node !== void 0; ++i) {
        nodes.push(node);
        node = node._parent;
      }
      length = this._length = i;
      for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === void 0) {
          stackToIndex[stack] = i;
        }
      }
      for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== void 0 && index !== i) {
          if (index > 0) {
            nodes[index - 1]._parent = void 0;
            nodes[index - 1]._length = 1;
          }
          nodes[i]._parent = void 0;
          nodes[i]._length = 1;
          var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
          if (index < length - 1) {
            cycleEdgeNode._parent = nodes[index + 1];
            cycleEdgeNode._parent.uncycle();
            cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
          } else {
            cycleEdgeNode._parent = void 0;
            cycleEdgeNode._length = 1;
          }
          var currentChildLength = cycleEdgeNode._length + 1;
          for (var j = i - 2; j >= 0; --j) {
            nodes[j]._length = currentChildLength;
            currentChildLength++;
          }
          return;
        }
      }
    };
    CapturedTrace.prototype.attachExtraTrace = function(error) {
      if (error.__stackCleaned__) return;
      this.uncycle();
      var parsed = parseStackAndMessage(error);
      var message = parsed.message;
      var stacks = [parsed.stack];
      var trace = this;
      while (trace !== void 0) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
      }
      removeCommonRoots(stacks);
      removeDuplicateOrEmptyJumps(stacks);
      util2.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
      util2.notEnumerableProp(error, "__stackCleaned__", true);
    };
    var captureStackTrace = (function stackDetection() {
      var v8stackFramePattern = /^\s*at\s*/;
      var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;
        if (error.name !== void 0 && error.message !== void 0) {
          return error.toString();
        }
        return formatNonError(error);
      };
      if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit += 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace2 = Error.captureStackTrace;
        shouldIgnore = function(line) {
          return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
          Error.stackTraceLimit += 6;
          captureStackTrace2(receiver, ignoreUntil);
          Error.stackTraceLimit -= 6;
        };
      }
      var err = new Error();
      if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace3(o) {
          o.stack = new Error().stack;
        };
      }
      var hasStackAfterThrow;
      try {
        throw new Error();
      } catch (e) {
        hasStackAfterThrow = "stack" in e;
      }
      if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace3(o) {
          Error.stackTraceLimit += 6;
          try {
            throw new Error();
          } catch (e) {
            o.stack = e.stack;
          }
          Error.stackTraceLimit -= 6;
        };
      }
      formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;
        if ((typeof error === "object" || typeof error === "function") && error.name !== void 0 && error.message !== void 0) {
          return error.toString();
        }
        return formatNonError(error);
      };
      return null;
    })();
    if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
      printWarning = function(message) {
        console.warn(message);
      };
      if (util2.isNode && process.stderr.isTTY) {
        printWarning = function(message, isSoft) {
          var color = isSoft ? "\x1B[33m" : "\x1B[31m";
          console.warn(color + message + "\x1B[0m\n");
        };
      } else if (!util2.isNode && typeof new Error().stack === "string") {
        printWarning = function(message, isSoft) {
          console.warn(
            "%c" + message,
            isSoft ? "color: darkorange" : "color: red"
          );
        };
      }
    }
    var config = {
      warnings,
      longStackTraces: false,
      cancellation: false,
      monitoring: false
    };
    if (longStackTraces) Promise2.longStackTraces();
    return {
      longStackTraces: function() {
        return config.longStackTraces;
      },
      warnings: function() {
        return config.warnings;
      },
      cancellation: function() {
        return config.cancellation;
      },
      monitoring: function() {
        return config.monitoring;
      },
      propagateFromFunction: function() {
        return propagateFromFunction;
      },
      boundValueFunction: function() {
        return boundValueFunction;
      },
      checkForgottenReturns,
      setBounds,
      warn,
      deprecated,
      CapturedTrace,
      fireDomEvent,
      fireGlobalEvent
    };
  };
  return debuggability;
}
var _finally;
var hasRequired_finally;
function require_finally() {
  if (hasRequired_finally) return _finally;
  hasRequired_finally = 1;
  _finally = function(Promise2, tryConvertToPromise) {
    var util2 = requireUtil();
    var CancellationError = Promise2.CancellationError;
    var errorObj = util2.errorObj;
    function PassThroughHandlerContext(promise2, type, handler) {
      this.promise = promise2;
      this.type = type;
      this.handler = handler;
      this.called = false;
      this.cancelPromise = null;
    }
    PassThroughHandlerContext.prototype.isFinallyHandler = function() {
      return this.type === 0;
    };
    function FinallyHandlerCancelReaction(finallyHandler2) {
      this.finallyHandler = finallyHandler2;
    }
    FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
      checkCancel(this.finallyHandler);
    };
    function checkCancel(ctx, reason) {
      if (ctx.cancelPromise != null) {
        if (arguments.length > 1) {
          ctx.cancelPromise._reject(reason);
        } else {
          ctx.cancelPromise._cancel();
        }
        ctx.cancelPromise = null;
        return true;
      }
      return false;
    }
    function succeed() {
      return finallyHandler.call(this, this.promise._target()._settledValue());
    }
    function fail(reason) {
      if (checkCancel(this, reason)) return;
      errorObj.e = reason;
      return errorObj;
    }
    function finallyHandler(reasonOrValue) {
      var promise2 = this.promise;
      var handler = this.handler;
      if (!this.called) {
        this.called = true;
        var ret = this.isFinallyHandler() ? handler.call(promise2._boundValue()) : handler.call(promise2._boundValue(), reasonOrValue);
        if (ret !== void 0) {
          promise2._setReturnedNonUndefined();
          var maybePromise = tryConvertToPromise(ret, promise2);
          if (maybePromise instanceof Promise2) {
            if (this.cancelPromise != null) {
              if (maybePromise._isCancelled()) {
                var reason = new CancellationError("late cancellation observer");
                promise2._attachExtraTrace(reason);
                errorObj.e = reason;
                return errorObj;
              } else if (maybePromise.isPending()) {
                maybePromise._attachCancellationCallback(
                  new FinallyHandlerCancelReaction(this)
                );
              }
            }
            return maybePromise._then(
              succeed,
              fail,
              void 0,
              this,
              void 0
            );
          }
        }
      }
      if (promise2.isRejected()) {
        checkCancel(this);
        errorObj.e = reasonOrValue;
        return errorObj;
      } else {
        checkCancel(this);
        return reasonOrValue;
      }
    }
    Promise2.prototype._passThrough = function(handler, type, success, fail2) {
      if (typeof handler !== "function") return this.then();
      return this._then(
        success,
        fail2,
        void 0,
        new PassThroughHandlerContext(this, type, handler),
        void 0
      );
    };
    Promise2.prototype.lastly = Promise2.prototype["finally"] = function(handler) {
      return this._passThrough(
        handler,
        0,
        finallyHandler,
        finallyHandler
      );
    };
    Promise2.prototype.tap = function(handler) {
      return this._passThrough(handler, 1, finallyHandler);
    };
    return PassThroughHandlerContext;
  };
  return _finally;
}
var catch_filter;
var hasRequiredCatch_filter;
function requireCatch_filter() {
  if (hasRequiredCatch_filter) return catch_filter;
  hasRequiredCatch_filter = 1;
  catch_filter = function(NEXT_FILTER) {
    var util2 = requireUtil();
    var getKeys = requireEs5().keys;
    var tryCatch = util2.tryCatch;
    var errorObj = util2.errorObj;
    function catchFilter(instances, cb, promise2) {
      return function(e) {
        var boundTo = promise2._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
          var item = instances[i];
          if (item === Error || item != null && item.prototype instanceof Error) {
            if (e instanceof item) {
              return tryCatch(cb).call(boundTo, e);
            }
          } else if (typeof item === "function") {
            var matchesPredicate = tryCatch(item).call(boundTo, e);
            if (matchesPredicate === errorObj) {
              return matchesPredicate;
            } else if (matchesPredicate) {
              return tryCatch(cb).call(boundTo, e);
            }
          } else if (util2.isObject(e)) {
            var keys = getKeys(item);
            for (var j = 0; j < keys.length; ++j) {
              var key = keys[j];
              if (item[key] != e[key]) {
                continue predicateLoop;
              }
            }
            return tryCatch(cb).call(boundTo, e);
          }
        }
        return NEXT_FILTER;
      };
    }
    return catchFilter;
  };
  return catch_filter;
}
var nodeback;
var hasRequiredNodeback;
function requireNodeback() {
  if (hasRequiredNodeback) return nodeback;
  hasRequiredNodeback = 1;
  var util2 = requireUtil();
  var maybeWrapAsError = util2.maybeWrapAsError;
  var errors2 = requireErrors();
  var OperationalError = errors2.OperationalError;
  var es52 = requireEs5();
  function isUntypedError(obj) {
    return obj instanceof Error && es52.getPrototypeOf(obj) === Error.prototype;
  }
  var rErrorKey = /^(?:name|message|stack|cause)$/;
  function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
      ret = new OperationalError(obj);
      ret.name = obj.name;
      ret.message = obj.message;
      ret.stack = obj.stack;
      var keys = es52.keys(obj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (!rErrorKey.test(key)) {
          ret[key] = obj[key];
        }
      }
      return ret;
    }
    util2.markAsOriginatingFromRejection(obj);
    return obj;
  }
  function nodebackForPromise(promise2, multiArgs) {
    return function(err, value) {
      if (promise2 === null) return;
      if (err) {
        var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
        promise2._attachExtraTrace(wrapped);
        promise2._reject(wrapped);
      } else if (!multiArgs) {
        promise2._fulfill(value);
      } else {
        var $_len = arguments.length;
        var args = new Array(Math.max($_len - 1, 0));
        for (var $_i = 1; $_i < $_len; ++$_i) {
          args[$_i - 1] = arguments[$_i];
        }
        promise2._fulfill(args);
      }
      promise2 = null;
    };
  }
  nodeback = nodebackForPromise;
  return nodeback;
}
var method;
var hasRequiredMethod;
function requireMethod() {
  if (hasRequiredMethod) return method;
  hasRequiredMethod = 1;
  method = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, debug) {
    var util2 = requireUtil();
    var tryCatch = util2.tryCatch;
    Promise2.method = function(fn) {
      if (typeof fn !== "function") {
        throw new Promise2.TypeError("expecting a function but got " + util2.classString(fn));
      }
      return function() {
        var ret = new Promise2(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
          value,
          promiseCreated,
          "Promise.method",
          ret
        );
        ret._resolveFromSyncValue(value);
        return ret;
      };
    };
    Promise2.attempt = Promise2["try"] = function(fn) {
      if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util2.classString(fn));
      }
      var ret = new Promise2(INTERNAL);
      ret._captureStackTrace();
      ret._pushContext();
      var value;
      if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util2.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
      } else {
        value = tryCatch(fn)();
      }
      var promiseCreated = ret._popContext();
      debug.checkForgottenReturns(
        value,
        promiseCreated,
        "Promise.try",
        ret
      );
      ret._resolveFromSyncValue(value);
      return ret;
    };
    Promise2.prototype._resolveFromSyncValue = function(value) {
      if (value === util2.errorObj) {
        this._rejectCallback(value.e, false);
      } else {
        this._resolveCallback(value, true);
      }
    };
  };
  return method;
}
var bind;
var hasRequiredBind;
function requireBind() {
  if (hasRequiredBind) return bind;
  hasRequiredBind = 1;
  bind = function(Promise2, INTERNAL, tryConvertToPromise, debug) {
    var calledBind = false;
    var rejectThis = function(_, e) {
      this._reject(e);
    };
    var targetRejected = function(e, context2) {
      context2.promiseRejectionQueued = true;
      context2.bindingPromise._then(rejectThis, rejectThis, null, this, e);
    };
    var bindingResolved = function(thisArg, context2) {
      if ((this._bitField & 50397184) === 0) {
        this._resolveCallback(context2.target);
      }
    };
    var bindingRejected = function(e, context2) {
      if (!context2.promiseRejectionQueued) this._reject(e);
    };
    Promise2.prototype.bind = function(thisArg) {
      if (!calledBind) {
        calledBind = true;
        Promise2.prototype._propagateFrom = debug.propagateFromFunction();
        Promise2.prototype._boundValue = debug.boundValueFunction();
      }
      var maybePromise = tryConvertToPromise(thisArg);
      var ret = new Promise2(INTERNAL);
      ret._propagateFrom(this, 1);
      var target = this._target();
      ret._setBoundTo(maybePromise);
      if (maybePromise instanceof Promise2) {
        var context2 = {
          promiseRejectionQueued: false,
          promise: ret,
          target,
          bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, void 0, ret, context2);
        maybePromise._then(
          bindingResolved,
          bindingRejected,
          void 0,
          ret,
          context2
        );
        ret._setOnCancel(maybePromise);
      } else {
        ret._resolveCallback(target);
      }
      return ret;
    };
    Promise2.prototype._setBoundTo = function(obj) {
      if (obj !== void 0) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
      } else {
        this._bitField = this._bitField & -2097153;
      }
    };
    Promise2.prototype._isBound = function() {
      return (this._bitField & 2097152) === 2097152;
    };
    Promise2.bind = function(thisArg, value) {
      return Promise2.resolve(value).bind(thisArg);
    };
  };
  return bind;
}
var cancel;
var hasRequiredCancel;
function requireCancel() {
  if (hasRequiredCancel) return cancel;
  hasRequiredCancel = 1;
  cancel = function(Promise2, PromiseArray, apiRejection, debug) {
    var util2 = requireUtil();
    var tryCatch = util2.tryCatch;
    var errorObj = util2.errorObj;
    var async2 = Promise2._async;
    Promise2.prototype["break"] = Promise2.prototype.cancel = function() {
      if (!debug.cancellation()) return this._warn("cancellation is disabled");
      var promise2 = this;
      var child = promise2;
      while (promise2._isCancellable()) {
        if (!promise2._cancelBy(child)) {
          if (child._isFollowing()) {
            child._followee().cancel();
          } else {
            child._cancelBranched();
          }
          break;
        }
        var parent = promise2._cancellationParent;
        if (parent == null || !parent._isCancellable()) {
          if (promise2._isFollowing()) {
            promise2._followee().cancel();
          } else {
            promise2._cancelBranched();
          }
          break;
        } else {
          if (promise2._isFollowing()) promise2._followee().cancel();
          promise2._setWillBeCancelled();
          child = promise2;
          promise2 = parent;
        }
      }
    };
    Promise2.prototype._branchHasCancelled = function() {
      this._branchesRemainingToCancel--;
    };
    Promise2.prototype._enoughBranchesHaveCancelled = function() {
      return this._branchesRemainingToCancel === void 0 || this._branchesRemainingToCancel <= 0;
    };
    Promise2.prototype._cancelBy = function(canceller) {
      if (canceller === this) {
        this._branchesRemainingToCancel = 0;
        this._invokeOnCancel();
        return true;
      } else {
        this._branchHasCancelled();
        if (this._enoughBranchesHaveCancelled()) {
          this._invokeOnCancel();
          return true;
        }
      }
      return false;
    };
    Promise2.prototype._cancelBranched = function() {
      if (this._enoughBranchesHaveCancelled()) {
        this._cancel();
      }
    };
    Promise2.prototype._cancel = function() {
      if (!this._isCancellable()) return;
      this._setCancelled();
      async2.invoke(this._cancelPromises, this, void 0);
    };
    Promise2.prototype._cancelPromises = function() {
      if (this._length() > 0) this._settlePromises();
    };
    Promise2.prototype._unsetOnCancel = function() {
      this._onCancelField = void 0;
    };
    Promise2.prototype._isCancellable = function() {
      return this.isPending() && !this._isCancelled();
    };
    Promise2.prototype.isCancellable = function() {
      return this.isPending() && !this.isCancelled();
    };
    Promise2.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
      if (util2.isArray(onCancelCallback)) {
        for (var i = 0; i < onCancelCallback.length; ++i) {
          this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
        }
      } else if (onCancelCallback !== void 0) {
        if (typeof onCancelCallback === "function") {
          if (!internalOnly) {
            var e = tryCatch(onCancelCallback).call(this._boundValue());
            if (e === errorObj) {
              this._attachExtraTrace(e.e);
              async2.throwLater(e.e);
            }
          }
        } else {
          onCancelCallback._resultCancelled(this);
        }
      }
    };
    Promise2.prototype._invokeOnCancel = function() {
      var onCancelCallback = this._onCancel();
      this._unsetOnCancel();
      async2.invoke(this._doInvokeOnCancel, this, onCancelCallback);
    };
    Promise2.prototype._invokeInternalOnCancel = function() {
      if (this._isCancellable()) {
        this._doInvokeOnCancel(this._onCancel(), true);
        this._unsetOnCancel();
      }
    };
    Promise2.prototype._resultCancelled = function() {
      this.cancel();
    };
  };
  return cancel;
}
var direct_resolve;
var hasRequiredDirect_resolve;
function requireDirect_resolve() {
  if (hasRequiredDirect_resolve) return direct_resolve;
  hasRequiredDirect_resolve = 1;
  direct_resolve = function(Promise2) {
    function returner() {
      return this.value;
    }
    function thrower() {
      throw this.reason;
    }
    Promise2.prototype["return"] = Promise2.prototype.thenReturn = function(value) {
      if (value instanceof Promise2) value.suppressUnhandledRejections();
      return this._then(
        returner,
        void 0,
        void 0,
        { value },
        void 0
      );
    };
    Promise2.prototype["throw"] = Promise2.prototype.thenThrow = function(reason) {
      return this._then(
        thrower,
        void 0,
        void 0,
        { reason },
        void 0
      );
    };
    Promise2.prototype.catchThrow = function(reason) {
      if (arguments.length <= 1) {
        return this._then(
          void 0,
          thrower,
          void 0,
          { reason },
          void 0
        );
      } else {
        var _reason = arguments[1];
        var handler = function() {
          throw _reason;
        };
        return this.caught(reason, handler);
      }
    };
    Promise2.prototype.catchReturn = function(value) {
      if (arguments.length <= 1) {
        if (value instanceof Promise2) value.suppressUnhandledRejections();
        return this._then(
          void 0,
          returner,
          void 0,
          { value },
          void 0
        );
      } else {
        var _value = arguments[1];
        if (_value instanceof Promise2) _value.suppressUnhandledRejections();
        var handler = function() {
          return _value;
        };
        return this.caught(value, handler);
      }
    };
  };
  return direct_resolve;
}
var synchronous_inspection;
var hasRequiredSynchronous_inspection;
function requireSynchronous_inspection() {
  if (hasRequiredSynchronous_inspection) return synchronous_inspection;
  hasRequiredSynchronous_inspection = 1;
  synchronous_inspection = function(Promise2) {
    function PromiseInspection(promise2) {
      if (promise2 !== void 0) {
        promise2 = promise2._target();
        this._bitField = promise2._bitField;
        this._settledValueField = promise2._isFateSealed() ? promise2._settledValue() : void 0;
      } else {
        this._bitField = 0;
        this._settledValueField = void 0;
      }
    }
    PromiseInspection.prototype._settledValue = function() {
      return this._settledValueField;
    };
    var value = PromiseInspection.prototype.value = function() {
      if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
      }
      return this._settledValue();
    };
    var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
      if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
      }
      return this._settledValue();
    };
    var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
      return (this._bitField & 33554432) !== 0;
    };
    var isRejected = PromiseInspection.prototype.isRejected = function() {
      return (this._bitField & 16777216) !== 0;
    };
    var isPending = PromiseInspection.prototype.isPending = function() {
      return (this._bitField & 50397184) === 0;
    };
    var isResolved = PromiseInspection.prototype.isResolved = function() {
      return (this._bitField & 50331648) !== 0;
    };
    PromiseInspection.prototype.isCancelled = function() {
      return (this._bitField & 8454144) !== 0;
    };
    Promise2.prototype.__isCancelled = function() {
      return (this._bitField & 65536) === 65536;
    };
    Promise2.prototype._isCancelled = function() {
      return this._target().__isCancelled();
    };
    Promise2.prototype.isCancelled = function() {
      return (this._target()._bitField & 8454144) !== 0;
    };
    Promise2.prototype.isPending = function() {
      return isPending.call(this._target());
    };
    Promise2.prototype.isRejected = function() {
      return isRejected.call(this._target());
    };
    Promise2.prototype.isFulfilled = function() {
      return isFulfilled.call(this._target());
    };
    Promise2.prototype.isResolved = function() {
      return isResolved.call(this._target());
    };
    Promise2.prototype.value = function() {
      return value.call(this._target());
    };
    Promise2.prototype.reason = function() {
      var target = this._target();
      target._unsetRejectionIsUnhandled();
      return reason.call(target);
    };
    Promise2.prototype._value = function() {
      return this._settledValue();
    };
    Promise2.prototype._reason = function() {
      this._unsetRejectionIsUnhandled();
      return this._settledValue();
    };
    Promise2.PromiseInspection = PromiseInspection;
  };
  return synchronous_inspection;
}
var join;
var hasRequiredJoin;
function requireJoin() {
  if (hasRequiredJoin) return join;
  hasRequiredJoin = 1;
  join = function(Promise2, PromiseArray, tryConvertToPromise, INTERNAL, async2, getDomain) {
    var util2 = requireUtil();
    var canEvaluate = util2.canEvaluate;
    var tryCatch = util2.tryCatch;
    var errorObj = util2.errorObj;
    var reject;
    {
      if (canEvaluate) {
        var thenCallback = function(i2) {
          return new Function("value", "holder", "                             \n	            'use strict';                                                    \n	            holder.pIndex = value;                                           \n	            holder.checkFulfillment(this);                                   \n	            ".replace(/Index/g, i2));
        };
        var promiseSetter = function(i2) {
          return new Function("promise", "holder", "                           \n	            'use strict';                                                    \n	            holder.pIndex = promise;                                         \n	            ".replace(/Index/g, i2));
        };
        var generateHolderClass = function(total) {
          var props2 = new Array(total);
          for (var i2 = 0; i2 < props2.length; ++i2) {
            props2[i2] = "this.p" + (i2 + 1);
          }
          var assignment = props2.join(" = ") + " = null;";
          var cancellationCode = "var promise;\n" + props2.map(function(prop) {
            return "                                                         \n	                promise = " + prop + ";                                      \n	                if (promise instanceof Promise) {                            \n	                    promise.cancel();                                        \n	                }                                                            \n	            ";
          }).join("\n");
          var passedArguments = props2.join(", ");
          var name = "Holder$" + total;
          var code = "return function(tryCatch, errorObj, Promise, async) {    \n	            'use strict';                                                    \n	            function [TheName](fn) {                                         \n	                [TheProperties]                                              \n	                this.fn = fn;                                                \n	                this.asyncNeeded = true;                                     \n	                this.now = 0;                                                \n	            }                                                                \n	                                                                             \n	            [TheName].prototype._callFunction = function(promise) {          \n	                promise._pushContext();                                      \n	                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n	                promise._popContext();                                       \n	                if (ret === errorObj) {                                      \n	                    promise._rejectCallback(ret.e, false);                   \n	                } else {                                                     \n	                    promise._resolveCallback(ret);                           \n	                }                                                            \n	            };                                                               \n	                                                                             \n	            [TheName].prototype.checkFulfillment = function(promise) {       \n	                var now = ++this.now;                                        \n	                if (now === [TheTotal]) {                                    \n	                    if (this.asyncNeeded) {                                  \n	                        async.invoke(this._callFunction, this, promise);     \n	                    } else {                                                 \n	                        this._callFunction(promise);                         \n	                    }                                                        \n	                                                                             \n	                }                                                            \n	            };                                                               \n	                                                                             \n	            [TheName].prototype._resultCancelled = function() {              \n	                [CancellationCode]                                           \n	            };                                                               \n	                                                                             \n	            return [TheName];                                                \n	        }(tryCatch, errorObj, Promise, async);                               \n	        ";
          code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);
          return new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch, errorObj, Promise2, async2);
        };
        var holderClasses = [];
        var thenCallbacks = [];
        var promiseSetters = [];
        for (var i = 0; i < 8; ++i) {
          holderClasses.push(generateHolderClass(i + 1));
          thenCallbacks.push(thenCallback(i + 1));
          promiseSetters.push(promiseSetter(i + 1));
        }
        reject = function(reason) {
          this._reject(reason);
        };
      }
    }
    Promise2.join = function() {
      var last = arguments.length - 1;
      var fn;
      if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        {
          if (last <= 8 && canEvaluate) {
            var ret = new Promise2(INTERNAL);
            ret._captureStackTrace();
            var HolderClass = holderClasses[last - 1];
            var holder = new HolderClass(fn);
            var callbacks = thenCallbacks;
            for (var i2 = 0; i2 < last; ++i2) {
              var maybePromise = tryConvertToPromise(arguments[i2], ret);
              if (maybePromise instanceof Promise2) {
                maybePromise = maybePromise._target();
                var bitField = maybePromise._bitField;
                if ((bitField & 50397184) === 0) {
                  maybePromise._then(
                    callbacks[i2],
                    reject,
                    void 0,
                    ret,
                    holder
                  );
                  promiseSetters[i2](maybePromise, holder);
                  holder.asyncNeeded = false;
                } else if ((bitField & 33554432) !== 0) {
                  callbacks[i2].call(
                    ret,
                    maybePromise._value(),
                    holder
                  );
                } else if ((bitField & 16777216) !== 0) {
                  ret._reject(maybePromise._reason());
                } else {
                  ret._cancel();
                }
              } else {
                callbacks[i2].call(ret, maybePromise, holder);
              }
            }
            if (!ret._isFateSealed()) {
              if (holder.asyncNeeded) {
                var domain = getDomain();
                if (domain !== null) {
                  holder.fn = util2.domainBind(domain, holder.fn);
                }
              }
              ret._setAsyncGuaranteed();
              ret._setOnCancel(holder);
            }
            return ret;
          }
        }
      }
      var $_len = arguments.length;
      var args = new Array($_len);
      for (var $_i = 0; $_i < $_len; ++$_i) {
        args[$_i] = arguments[$_i];
      }
      if (fn) args.pop();
      var ret = new PromiseArray(args).promise();
      return fn !== void 0 ? ret.spread(fn) : ret;
    };
  };
  return join;
}
var map;
var hasRequiredMap;
function requireMap() {
  if (hasRequiredMap) return map;
  hasRequiredMap = 1;
  map = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
    var getDomain = Promise2._getDomain;
    var util2 = requireUtil();
    var tryCatch = util2.tryCatch;
    var errorObj = util2.errorObj;
    var async2 = Promise2._async;
    function MappingPromiseArray(promises, fn, limit, _filter) {
      this.constructor$(promises);
      this._promise._captureStackTrace();
      var domain = getDomain();
      this._callback = domain === null ? fn : util2.domainBind(domain, fn);
      this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
      this._limit = limit;
      this._inFlight = 0;
      this._queue = [];
      async2.invoke(this._asyncInit, this, void 0);
    }
    util2.inherits(MappingPromiseArray, PromiseArray);
    MappingPromiseArray.prototype._asyncInit = function() {
      this._init$(void 0, -2);
    };
    MappingPromiseArray.prototype._init = function() {
    };
    MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
      var values = this._values;
      var length = this.length();
      var preservedValues = this._preservedValues;
      var limit = this._limit;
      if (index < 0) {
        index = index * -1 - 1;
        values[index] = value;
        if (limit >= 1) {
          this._inFlight--;
          this._drainQueue();
          if (this._isResolved()) return true;
        }
      } else {
        if (limit >= 1 && this._inFlight >= limit) {
          values[index] = value;
          this._queue.push(index);
          return false;
        }
        if (preservedValues !== null) preservedValues[index] = value;
        var promise2 = this._promise;
        var callback = this._callback;
        var receiver = promise2._boundValue();
        promise2._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        var promiseCreated = promise2._popContext();
        debug.checkForgottenReturns(
          ret,
          promiseCreated,
          preservedValues !== null ? "Promise.filter" : "Promise.map",
          promise2
        );
        if (ret === errorObj) {
          this._reject(ret.e);
          return true;
        }
        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise2) {
          maybePromise = maybePromise._target();
          var bitField = maybePromise._bitField;
          if ((bitField & 50397184) === 0) {
            if (limit >= 1) this._inFlight++;
            values[index] = maybePromise;
            maybePromise._proxy(this, (index + 1) * -1);
            return false;
          } else if ((bitField & 33554432) !== 0) {
            ret = maybePromise._value();
          } else if ((bitField & 16777216) !== 0) {
            this._reject(maybePromise._reason());
            return true;
          } else {
            this._cancel();
            return true;
          }
        }
        values[index] = ret;
      }
      var totalResolved = ++this._totalResolved;
      if (totalResolved >= length) {
        if (preservedValues !== null) {
          this._filter(values, preservedValues);
        } else {
          this._resolve(values);
        }
        return true;
      }
      return false;
    };
    MappingPromiseArray.prototype._drainQueue = function() {
      var queue2 = this._queue;
      var limit = this._limit;
      var values = this._values;
      while (queue2.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue2.pop();
        this._promiseFulfilled(values[index], index);
      }
    };
    MappingPromiseArray.prototype._filter = function(booleans, values) {
      var len = values.length;
      var ret = new Array(len);
      var j = 0;
      for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
      }
      ret.length = j;
      this._resolve(ret);
    };
    MappingPromiseArray.prototype.preservedValues = function() {
      return this._preservedValues;
    };
    function map2(promises, fn, options, _filter) {
      if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util2.classString(fn));
      }
      var limit = 0;
      if (options !== void 0) {
        if (typeof options === "object" && options !== null) {
          if (typeof options.concurrency !== "number") {
            return Promise2.reject(
              new TypeError("'concurrency' must be a number but it is " + util2.classString(options.concurrency))
            );
          }
          limit = options.concurrency;
        } else {
          return Promise2.reject(new TypeError(
            "options argument must be an object but it is " + util2.classString(options)
          ));
        }
      }
      limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
      return new MappingPromiseArray(promises, fn, limit, _filter).promise();
    }
    Promise2.prototype.map = function(fn, options) {
      return map2(this, fn, options, null);
    };
    Promise2.map = function(promises, fn, options, _filter) {
      return map2(promises, fn, options, _filter);
    };
  };
  return map;
}
var call_get;
var hasRequiredCall_get;
function requireCall_get() {
  if (hasRequiredCall_get) return call_get;
  hasRequiredCall_get = 1;
  var cr = Object.create;
  if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
  }
  call_get = function(Promise2) {
    var util2 = requireUtil();
    var canEvaluate = util2.canEvaluate;
    var isIdentifier = util2.isIdentifier;
    var getMethodCaller;
    var getGetter;
    {
      var makeMethodCaller = function(methodName) {
        return new Function("ensureMethod", "                                    \n	        return function(obj) {                                               \n	            'use strict'                                                     \n	            var len = this.length;                                           \n	            ensureMethod(obj, 'methodName');                                 \n	            switch(len) {                                                    \n	                case 1: return obj.methodName(this[0]);                      \n	                case 2: return obj.methodName(this[0], this[1]);             \n	                case 3: return obj.methodName(this[0], this[1], this[2]);    \n	                case 0: return obj.methodName();                             \n	                default:                                                     \n	                    return obj.methodName.apply(obj, this);                  \n	            }                                                                \n	        };                                                                   \n	        ".replace(/methodName/g, methodName))(ensureMethod);
      };
      var makeGetter = function(propertyName) {
        return new Function("obj", "                                             \n	        'use strict';                                                        \n	        return obj.propertyName;                                             \n	        ".replace("propertyName", propertyName));
      };
      var getCompiled = function(name, compiler, cache) {
        var ret = cache[name];
        if (typeof ret !== "function") {
          if (!isIdentifier(name)) {
            return null;
          }
          ret = compiler(name);
          cache[name] = ret;
          cache[" size"]++;
          if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
          }
        }
        return ret;
      };
      getMethodCaller = function(name) {
        return getCompiled(name, makeMethodCaller, callerCache);
      };
      getGetter = function(name) {
        return getCompiled(name, makeGetter, getterCache);
      };
    }
    function ensureMethod(obj, methodName) {
      var fn;
      if (obj != null) fn = obj[methodName];
      if (typeof fn !== "function") {
        var message = "Object " + util2.classString(obj) + " has no method '" + util2.toString(methodName) + "'";
        throw new Promise2.TypeError(message);
      }
      return fn;
    }
    function caller(obj) {
      var methodName = this.pop();
      var fn = ensureMethod(obj, methodName);
      return fn.apply(obj, this);
    }
    Promise2.prototype.call = function(methodName) {
      var $_len = arguments.length;
      var args = new Array(Math.max($_len - 1, 0));
      for (var $_i = 1; $_i < $_len; ++$_i) {
        args[$_i - 1] = arguments[$_i];
      }
      {
        if (canEvaluate) {
          var maybeCaller = getMethodCaller(methodName);
          if (maybeCaller !== null) {
            return this._then(
              maybeCaller,
              void 0,
              void 0,
              args,
              void 0
            );
          }
        }
      }
      args.push(methodName);
      return this._then(caller, void 0, void 0, args, void 0);
    };
    function namedGetter(obj) {
      return obj[this];
    }
    function indexedGetter(obj) {
      var index = +this;
      if (index < 0) index = Math.max(0, index + obj.length);
      return obj[index];
    }
    Promise2.prototype.get = function(propertyName) {
      var isIndex = typeof propertyName === "number";
      var getter;
      if (!isIndex) {
        if (canEvaluate) {
          var maybeGetter = getGetter(propertyName);
          getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
          getter = namedGetter;
        }
      } else {
        getter = indexedGetter;
      }
      return this._then(getter, void 0, void 0, propertyName, void 0);
    };
  };
  return call_get;
}
var using;
var hasRequiredUsing;
function requireUsing() {
  if (hasRequiredUsing) return using;
  hasRequiredUsing = 1;
  using = function(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
    var util2 = requireUtil();
    var TypeError2 = requireErrors().TypeError;
    var inherits = requireUtil().inherits;
    var errorObj = util2.errorObj;
    var tryCatch = util2.tryCatch;
    var NULL = {};
    function thrower(e) {
      setTimeout(function() {
        throw e;
      }, 0);
    }
    function castPreservingDisposable(thenable) {
      var maybePromise = tryConvertToPromise(thenable);
      if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
        maybePromise._setDisposable(thenable._getDisposer());
      }
      return maybePromise;
    }
    function dispose(resources, inspection) {
      var i = 0;
      var len = resources.length;
      var ret = new Promise2(INTERNAL);
      function iterator() {
        if (i >= len) return ret._fulfill();
        var maybePromise = castPreservingDisposable(resources[i++]);
        if (maybePromise instanceof Promise2 && maybePromise._isDisposable()) {
          try {
            maybePromise = tryConvertToPromise(
              maybePromise._getDisposer().tryDispose(inspection),
              resources.promise
            );
          } catch (e) {
            return thrower(e);
          }
          if (maybePromise instanceof Promise2) {
            return maybePromise._then(
              iterator,
              thrower,
              null,
              null,
              null
            );
          }
        }
        iterator();
      }
      iterator();
      return ret;
    }
    function Disposer(data, promise2, context2) {
      this._data = data;
      this._promise = promise2;
      this._context = context2;
    }
    Disposer.prototype.data = function() {
      return this._data;
    };
    Disposer.prototype.promise = function() {
      return this._promise;
    };
    Disposer.prototype.resource = function() {
      if (this.promise().isFulfilled()) {
        return this.promise().value();
      }
      return NULL;
    };
    Disposer.prototype.tryDispose = function(inspection) {
      var resource = this.resource();
      var context2 = this._context;
      if (context2 !== void 0) context2._pushContext();
      var ret = resource !== NULL ? this.doDispose(resource, inspection) : null;
      if (context2 !== void 0) context2._popContext();
      this._promise._unsetDisposable();
      this._data = null;
      return ret;
    };
    Disposer.isDisposer = function(d) {
      return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
    };
    function FunctionDisposer(fn, promise2, context2) {
      this.constructor$(fn, promise2, context2);
    }
    inherits(FunctionDisposer, Disposer);
    FunctionDisposer.prototype.doDispose = function(resource, inspection) {
      var fn = this.data();
      return fn.call(resource, resource, inspection);
    };
    function maybeUnwrapDisposer(value) {
      if (Disposer.isDisposer(value)) {
        this.resources[this.index]._setDisposable(value);
        return value.promise();
      }
      return value;
    }
    function ResourceList(length) {
      this.length = length;
      this.promise = null;
      this[length - 1] = null;
    }
    ResourceList.prototype._resultCancelled = function() {
      var len = this.length;
      for (var i = 0; i < len; ++i) {
        var item = this[i];
        if (item instanceof Promise2) {
          item.cancel();
        }
      }
    };
    Promise2.using = function() {
      var len = arguments.length;
      if (len < 2) return apiRejection(
        "you must pass at least 2 arguments to Promise.using"
      );
      var fn = arguments[len - 1];
      if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util2.classString(fn));
      }
      var input;
      var spreadArgs = true;
      if (len === 2 && Array.isArray(arguments[0])) {
        input = arguments[0];
        len = input.length;
        spreadArgs = false;
      } else {
        input = arguments;
        len--;
      }
      var resources = new ResourceList(len);
      for (var i = 0; i < len; ++i) {
        var resource = input[i];
        if (Disposer.isDisposer(resource)) {
          var disposer = resource;
          resource = resource.promise();
          resource._setDisposable(disposer);
        } else {
          var maybePromise = tryConvertToPromise(resource);
          if (maybePromise instanceof Promise2) {
            resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
              resources,
              index: i
            }, void 0);
          }
        }
        resources[i] = resource;
      }
      var reflectedResources = new Array(resources.length);
      for (var i = 0; i < reflectedResources.length; ++i) {
        reflectedResources[i] = Promise2.resolve(resources[i]).reflect();
      }
      var resultPromise = Promise2.all(reflectedResources).then(function(inspections) {
        for (var i2 = 0; i2 < inspections.length; ++i2) {
          var inspection = inspections[i2];
          if (inspection.isRejected()) {
            errorObj.e = inspection.error();
            return errorObj;
          } else if (!inspection.isFulfilled()) {
            resultPromise.cancel();
            return;
          }
          inspections[i2] = inspection.value();
        }
        promise2._pushContext();
        fn = tryCatch(fn);
        var ret = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections);
        var promiseCreated = promise2._popContext();
        debug.checkForgottenReturns(
          ret,
          promiseCreated,
          "Promise.using",
          promise2
        );
        return ret;
      });
      var promise2 = resultPromise.lastly(function() {
        var inspection = new Promise2.PromiseInspection(resultPromise);
        return dispose(resources, inspection);
      });
      resources.promise = promise2;
      promise2._setOnCancel(resources);
      return promise2;
    };
    Promise2.prototype._setDisposable = function(disposer) {
      this._bitField = this._bitField | 131072;
      this._disposer = disposer;
    };
    Promise2.prototype._isDisposable = function() {
      return (this._bitField & 131072) > 0;
    };
    Promise2.prototype._getDisposer = function() {
      return this._disposer;
    };
    Promise2.prototype._unsetDisposable = function() {
      this._bitField = this._bitField & -131073;
      this._disposer = void 0;
    };
    Promise2.prototype.disposer = function(fn) {
      if (typeof fn === "function") {
        return new FunctionDisposer(fn, this, createContext());
      }
      throw new TypeError2();
    };
  };
  return using;
}
var timers;
var hasRequiredTimers;
function requireTimers() {
  if (hasRequiredTimers) return timers;
  hasRequiredTimers = 1;
  timers = function(Promise2, INTERNAL, debug) {
    var util2 = requireUtil();
    var TimeoutError = Promise2.TimeoutError;
    function HandleWrapper(handle) {
      this.handle = handle;
    }
    HandleWrapper.prototype._resultCancelled = function() {
      clearTimeout(this.handle);
    };
    var afterValue = function(value) {
      return delay(+this).thenReturn(value);
    };
    var delay = Promise2.delay = function(ms, value) {
      var ret;
      var handle;
      if (value !== void 0) {
        ret = Promise2.resolve(value)._then(afterValue, null, null, ms, void 0);
        if (debug.cancellation() && value instanceof Promise2) {
          ret._setOnCancel(value);
        }
      } else {
        ret = new Promise2(INTERNAL);
        handle = setTimeout(function() {
          ret._fulfill();
        }, +ms);
        if (debug.cancellation()) {
          ret._setOnCancel(new HandleWrapper(handle));
        }
        ret._captureStackTrace();
      }
      ret._setAsyncGuaranteed();
      return ret;
    };
    Promise2.prototype.delay = function(ms) {
      return delay(ms, this);
    };
    var afterTimeout = function(promise2, message, parent) {
      var err;
      if (typeof message !== "string") {
        if (message instanceof Error) {
          err = message;
        } else {
          err = new TimeoutError("operation timed out");
        }
      } else {
        err = new TimeoutError(message);
      }
      util2.markAsOriginatingFromRejection(err);
      promise2._attachExtraTrace(err);
      promise2._reject(err);
      if (parent != null) {
        parent.cancel();
      }
    };
    function successClear(value) {
      clearTimeout(this.handle);
      return value;
    }
    function failureClear(reason) {
      clearTimeout(this.handle);
      throw reason;
    }
    Promise2.prototype.timeout = function(ms, message) {
      ms = +ms;
      var ret, parent;
      var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
        if (ret.isPending()) {
          afterTimeout(ret, message, parent);
        }
      }, ms));
      if (debug.cancellation()) {
        parent = this.then();
        ret = parent._then(
          successClear,
          failureClear,
          void 0,
          handleWrapper,
          void 0
        );
        ret._setOnCancel(handleWrapper);
      } else {
        ret = this._then(
          successClear,
          failureClear,
          void 0,
          handleWrapper,
          void 0
        );
      }
      return ret;
    };
  };
  return timers;
}
var generators;
var hasRequiredGenerators;
function requireGenerators() {
  if (hasRequiredGenerators) return generators;
  hasRequiredGenerators = 1;
  generators = function(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
    var errors2 = requireErrors();
    var TypeError2 = errors2.TypeError;
    var util2 = requireUtil();
    var errorObj = util2.errorObj;
    var tryCatch = util2.tryCatch;
    var yieldHandlers = [];
    function promiseFromYieldHandler(value, yieldHandlers2, traceParent) {
      for (var i = 0; i < yieldHandlers2.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers2[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
          traceParent._pushContext();
          var ret = Promise2.reject(errorObj.e);
          traceParent._popContext();
          return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise2) return maybePromise;
      }
      return null;
    }
    function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
      if (debug.cancellation()) {
        var internal = new Promise2(INTERNAL);
        var _finallyPromise = this._finallyPromise = new Promise2(INTERNAL);
        this._promise = internal.lastly(function() {
          return _finallyPromise;
        });
        internal._captureStackTrace();
        internal._setOnCancel(this);
      } else {
        var promise2 = this._promise = new Promise2(INTERNAL);
        promise2._captureStackTrace();
      }
      this._stack = stack;
      this._generatorFunction = generatorFunction;
      this._receiver = receiver;
      this._generator = void 0;
      this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
      this._yieldedPromise = null;
      this._cancellationPhase = false;
    }
    util2.inherits(PromiseSpawn, Proxyable);
    PromiseSpawn.prototype._isResolved = function() {
      return this._promise === null;
    };
    PromiseSpawn.prototype._cleanup = function() {
      this._promise = this._generator = null;
      if (debug.cancellation() && this._finallyPromise !== null) {
        this._finallyPromise._fulfill();
        this._finallyPromise = null;
      }
    };
    PromiseSpawn.prototype._promiseCancelled = function() {
      if (this._isResolved()) return;
      var implementsReturn = typeof this._generator["return"] !== "undefined";
      var result;
      if (!implementsReturn) {
        var reason = new Promise2.CancellationError(
          "generator .return() sentinel"
        );
        Promise2.coroutine.returnSentinel = reason;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        result = tryCatch(this._generator["throw"]).call(
          this._generator,
          reason
        );
        this._promise._popContext();
      } else {
        this._promise._pushContext();
        result = tryCatch(this._generator["return"]).call(
          this._generator,
          void 0
        );
        this._promise._popContext();
      }
      this._cancellationPhase = true;
      this._yieldedPromise = null;
      this._continue(result);
    };
    PromiseSpawn.prototype._promiseFulfilled = function(value) {
      this._yieldedPromise = null;
      this._promise._pushContext();
      var result = tryCatch(this._generator.next).call(this._generator, value);
      this._promise._popContext();
      this._continue(result);
    };
    PromiseSpawn.prototype._promiseRejected = function(reason) {
      this._yieldedPromise = null;
      this._promise._attachExtraTrace(reason);
      this._promise._pushContext();
      var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
      this._promise._popContext();
      this._continue(result);
    };
    PromiseSpawn.prototype._resultCancelled = function() {
      if (this._yieldedPromise instanceof Promise2) {
        var promise2 = this._yieldedPromise;
        this._yieldedPromise = null;
        promise2.cancel();
      }
    };
    PromiseSpawn.prototype.promise = function() {
      return this._promise;
    };
    PromiseSpawn.prototype._run = function() {
      this._generator = this._generatorFunction.call(this._receiver);
      this._receiver = this._generatorFunction = void 0;
      this._promiseFulfilled(void 0);
    };
    PromiseSpawn.prototype._continue = function(result) {
      var promise2 = this._promise;
      if (result === errorObj) {
        this._cleanup();
        if (this._cancellationPhase) {
          return promise2.cancel();
        } else {
          return promise2._rejectCallback(result.e, false);
        }
      }
      var value = result.value;
      if (result.done === true) {
        this._cleanup();
        if (this._cancellationPhase) {
          return promise2.cancel();
        } else {
          return promise2._resolveCallback(value);
        }
      } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise2)) {
          maybePromise = promiseFromYieldHandler(
            maybePromise,
            this._yieldHandlers,
            this._promise
          );
          if (maybePromise === null) {
            this._promiseRejected(
              new TypeError2(
                "A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", value) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")
              )
            );
            return;
          }
        }
        maybePromise = maybePromise._target();
        var bitField = maybePromise._bitField;
        if ((bitField & 50397184) === 0) {
          this._yieldedPromise = maybePromise;
          maybePromise._proxy(this, null);
        } else if ((bitField & 33554432) !== 0) {
          Promise2._async.invoke(
            this._promiseFulfilled,
            this,
            maybePromise._value()
          );
        } else if ((bitField & 16777216) !== 0) {
          Promise2._async.invoke(
            this._promiseRejected,
            this,
            maybePromise._reason()
          );
        } else {
          this._promiseCancelled();
        }
      }
    };
    Promise2.coroutine = function(generatorFunction, options) {
      if (typeof generatorFunction !== "function") {
        throw new TypeError2("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
      }
      var yieldHandler = Object(options).yieldHandler;
      var PromiseSpawn$ = PromiseSpawn;
      var stack = new Error().stack;
      return function() {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(
          void 0,
          void 0,
          yieldHandler,
          stack
        );
        var ret = spawn.promise();
        spawn._generator = generator;
        spawn._promiseFulfilled(void 0);
        return ret;
      };
    };
    Promise2.coroutine.addYieldHandler = function(fn) {
      if (typeof fn !== "function") {
        throw new TypeError2("expecting a function but got " + util2.classString(fn));
      }
      yieldHandlers.push(fn);
    };
    Promise2.spawn = function(generatorFunction) {
      debug.deprecated("Promise.spawn()", "Promise.coroutine()");
      if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
      }
      var spawn = new PromiseSpawn(generatorFunction, this);
      var ret = spawn.promise();
      spawn._run(Promise2.spawn);
      return ret;
    };
  };
  return generators;
}
var nodeify;
var hasRequiredNodeify;
function requireNodeify() {
  if (hasRequiredNodeify) return nodeify;
  hasRequiredNodeify = 1;
  nodeify = function(Promise2) {
    var util2 = requireUtil();
    var async2 = Promise2._async;
    var tryCatch = util2.tryCatch;
    var errorObj = util2.errorObj;
    function spreadAdapter(val, nodeback2) {
      var promise2 = this;
      if (!util2.isArray(val)) return successAdapter.call(promise2, val, nodeback2);
      var ret = tryCatch(nodeback2).apply(promise2._boundValue(), [null].concat(val));
      if (ret === errorObj) {
        async2.throwLater(ret.e);
      }
    }
    function successAdapter(val, nodeback2) {
      var promise2 = this;
      var receiver = promise2._boundValue();
      var ret = val === void 0 ? tryCatch(nodeback2).call(receiver, null) : tryCatch(nodeback2).call(receiver, null, val);
      if (ret === errorObj) {
        async2.throwLater(ret.e);
      }
    }
    function errorAdapter(reason, nodeback2) {
      var promise2 = this;
      if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason;
        reason = newReason;
      }
      var ret = tryCatch(nodeback2).call(promise2._boundValue(), reason);
      if (ret === errorObj) {
        async2.throwLater(ret.e);
      }
    }
    Promise2.prototype.asCallback = Promise2.prototype.nodeify = function(nodeback2, options) {
      if (typeof nodeback2 == "function") {
        var adapter = successAdapter;
        if (options !== void 0 && Object(options).spread) {
          adapter = spreadAdapter;
        }
        this._then(
          adapter,
          errorAdapter,
          void 0,
          this,
          nodeback2
        );
      }
      return this;
    };
  };
  return nodeify;
}
var promisify;
var hasRequiredPromisify;
function requirePromisify() {
  if (hasRequiredPromisify) return promisify;
  hasRequiredPromisify = 1;
  promisify = function(Promise2, INTERNAL) {
    var THIS = {};
    var util2 = requireUtil();
    var nodebackForPromise = requireNodeback();
    var withAppended = util2.withAppended;
    var maybeWrapAsError = util2.maybeWrapAsError;
    var canEvaluate = util2.canEvaluate;
    var TypeError2 = requireErrors().TypeError;
    var defaultSuffix = "Async";
    var defaultPromisified = { __isPromisified__: true };
    var noCopyProps = [
      "arity",
      "length",
      "name",
      "arguments",
      "caller",
      "callee",
      "prototype",
      "__isPromisified__"
    ];
    var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");
    var defaultFilter = function(name) {
      return util2.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
    };
    function propsFilter(key) {
      return !noCopyPropsPattern.test(key);
    }
    function isPromisified(fn) {
      try {
        return fn.__isPromisified__ === true;
      } catch (e) {
        return false;
      }
    }
    function hasPromisified(obj, key, suffix) {
      var val = util2.getDataPropertyOrDefault(
        obj,
        key + suffix,
        defaultPromisified
      );
      return val ? isPromisified(val) : false;
    }
    function checkValid(ret, suffix, suffixRegexp) {
      for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
          var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
          for (var j = 0; j < ret.length; j += 2) {
            if (ret[j] === keyWithoutAsyncSuffix) {
              throw new TypeError2("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
            }
          }
        }
      }
    }
    function promisifiableMethods(obj, suffix, suffixRegexp, filter2) {
      var keys = util2.inheritedDataKeys(obj);
      var ret = [];
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter2 === defaultFilter ? true : defaultFilter(key);
        if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj, key, suffix) && filter2(key, value, obj, passesDefaultFilter)) {
          ret.push(key, value);
        }
      }
      checkValid(ret, suffix, suffixRegexp);
      return ret;
    }
    var escapeIdentRegex = function(str) {
      return str.replace(/([$])/, "\\$");
    };
    var makeNodePromisifiedEval;
    {
      var switchCaseArgumentOrder = function(likelyArgumentCount) {
        var ret = [likelyArgumentCount];
        var min = Math.max(0, likelyArgumentCount - 1 - 3);
        for (var i = likelyArgumentCount - 1; i >= min; --i) {
          ret.push(i);
        }
        for (var i = likelyArgumentCount + 1; i <= 3; ++i) {
          ret.push(i);
        }
        return ret;
      };
      var argumentSequence = function(argumentCount) {
        return util2.filledRange(argumentCount, "_arg", "");
      };
      var parameterDeclaration = function(parameterCount2) {
        return util2.filledRange(
          Math.max(parameterCount2, 3),
          "_arg",
          ""
        );
      };
      var parameterCount = function(fn) {
        if (typeof fn.length === "number") {
          return Math.max(Math.min(fn.length, 1023 + 1), 0);
        }
        return 0;
      };
      makeNodePromisifiedEval = function(callback, receiver, originalName, fn, _, multiArgs) {
        var newParameterCount = Math.max(0, parameterCount(fn) - 1);
        var argumentOrder = switchCaseArgumentOrder(newParameterCount);
        var shouldProxyThis = typeof callback === "string" || receiver === THIS;
        function generateCallForArgumentCount(count) {
          var args = argumentSequence(count).join(", ");
          var comma = count > 0 ? ", " : "";
          var ret;
          if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
          } else {
            ret = receiver === void 0 ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
          }
          return ret.replace("{{args}}", args).replace(", ", comma);
        }
        function generateArgumentSwitchCase() {
          var ret = "";
          for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
          }
          ret += "                                                             \n	        default:                                                             \n	            var args = new Array(len + 1);                                   \n	            var i = 0;                                                       \n	            for (var i = 0; i < len; ++i) {                                  \n	               args[i] = arguments[i];                                       \n	            }                                                                \n	            args[i] = nodeback;                                              \n	            [CodeForCall]                                                    \n	            break;                                                           \n	        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
          return ret;
        }
        var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
        var body = "'use strict';                                                \n	        var ret = function (Parameters) {                                    \n	            'use strict';                                                    \n	            var len = arguments.length;                                      \n	            var promise = new Promise(INTERNAL);                             \n	            promise._captureStackTrace();                                    \n	            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n	            var ret;                                                         \n	            var callback = tryCatch([GetFunctionCode]);                      \n	            switch(len) {                                                    \n	                [CodeForSwitchCase]                                          \n	            }                                                                \n	            if (ret === errorObj) {                                          \n	                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n	            }                                                                \n	            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n	            return promise;                                                  \n	        };                                                                   \n	        notEnumerableProp(ret, '__isPromisified__', true);                   \n	        return ret;                                                          \n	    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
        body = body.replace("Parameters", parameterDeclaration(newParameterCount));
        return new Function(
          "Promise",
          "fn",
          "receiver",
          "withAppended",
          "maybeWrapAsError",
          "nodebackForPromise",
          "tryCatch",
          "errorObj",
          "notEnumerableProp",
          "INTERNAL",
          body
        )(
          Promise2,
          fn,
          receiver,
          withAppended,
          maybeWrapAsError,
          nodebackForPromise,
          util2.tryCatch,
          util2.errorObj,
          util2.notEnumerableProp,
          INTERNAL
        );
      };
    }
    function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
      var defaultThis = /* @__PURE__ */ (function() {
        return this;
      })();
      var method2 = callback;
      if (typeof method2 === "string") {
        callback = fn;
      }
      function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise2 = new Promise2(INTERNAL);
        promise2._captureStackTrace();
        var cb = typeof method2 === "string" && this !== defaultThis ? this[method2] : callback;
        var fn2 = nodebackForPromise(promise2, multiArgs);
        try {
          cb.apply(_receiver, withAppended(arguments, fn2));
        } catch (e) {
          promise2._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise2._isFateSealed()) promise2._setAsyncGuaranteed();
        return promise2;
      }
      util2.notEnumerableProp(promisified, "__isPromisified__", true);
      return promisified;
    }
    var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
    function promisifyAll(obj, suffix, filter2, promisifier, multiArgs) {
      var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
      var methods = promisifiableMethods(obj, suffix, suffixRegexp, filter2);
      for (var i = 0, len = methods.length; i < len; i += 2) {
        var key = methods[i];
        var fn = methods[i + 1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
          obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
          var promisified = promisifier(fn, function() {
            return makeNodePromisified(
              key,
              THIS,
              key,
              fn,
              suffix,
              multiArgs
            );
          });
          util2.notEnumerableProp(promisified, "__isPromisified__", true);
          obj[promisifiedKey] = promisified;
        }
      }
      util2.toFastProperties(obj);
      return obj;
    }
    function promisify2(callback, receiver, multiArgs) {
      return makeNodePromisified(
        callback,
        receiver,
        void 0,
        callback,
        null,
        multiArgs
      );
    }
    Promise2.promisify = function(fn, options) {
      if (typeof fn !== "function") {
        throw new TypeError2("expecting a function but got " + util2.classString(fn));
      }
      if (isPromisified(fn)) {
        return fn;
      }
      options = Object(options);
      var receiver = options.context === void 0 ? THIS : options.context;
      var multiArgs = !!options.multiArgs;
      var ret = promisify2(fn, receiver, multiArgs);
      util2.copyDescriptors(fn, ret, propsFilter);
      return ret;
    };
    Promise2.promisifyAll = function(target, options) {
      if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError2("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
      }
      options = Object(options);
      var multiArgs = !!options.multiArgs;
      var suffix = options.suffix;
      if (typeof suffix !== "string") suffix = defaultSuffix;
      var filter2 = options.filter;
      if (typeof filter2 !== "function") filter2 = defaultFilter;
      var promisifier = options.promisifier;
      if (typeof promisifier !== "function") promisifier = makeNodePromisified;
      if (!util2.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
      }
      var keys = util2.inheritedDataKeys(target);
      for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" && util2.isClass(value)) {
          promisifyAll(
            value.prototype,
            suffix,
            filter2,
            promisifier,
            multiArgs
          );
          promisifyAll(value, suffix, filter2, promisifier, multiArgs);
        }
      }
      return promisifyAll(target, suffix, filter2, promisifier, multiArgs);
    };
  };
  return promisify;
}
var props;
var hasRequiredProps;
function requireProps() {
  if (hasRequiredProps) return props;
  hasRequiredProps = 1;
  props = function(Promise2, PromiseArray, tryConvertToPromise, apiRejection) {
    var util2 = requireUtil();
    var isObject = util2.isObject;
    var es52 = requireEs5();
    var Es6Map;
    if (typeof Map === "function") Es6Map = Map;
    var mapToEntries = /* @__PURE__ */ (function() {
      var index = 0;
      var size = 0;
      function extractEntry(value, key) {
        this[index] = value;
        this[index + size] = key;
        index++;
      }
      return function mapToEntries2(map2) {
        size = map2.size;
        index = 0;
        var ret = new Array(map2.size * 2);
        map2.forEach(extractEntry, ret);
        return ret;
      };
    })();
    var entriesToMap = function(entries) {
      var ret = new Es6Map();
      var length = entries.length / 2 | 0;
      for (var i = 0; i < length; ++i) {
        var key = entries[length + i];
        var value = entries[i];
        ret.set(key, value);
      }
      return ret;
    };
    function PropertiesPromiseArray(obj) {
      var isMap = false;
      var entries;
      if (Es6Map !== void 0 && obj instanceof Es6Map) {
        entries = mapToEntries(obj);
        isMap = true;
      } else {
        var keys = es52.keys(obj);
        var len = keys.length;
        entries = new Array(len * 2);
        for (var i = 0; i < len; ++i) {
          var key = keys[i];
          entries[i] = obj[key];
          entries[i + len] = key;
        }
      }
      this.constructor$(entries);
      this._isMap = isMap;
      this._init$(void 0, -3);
    }
    util2.inherits(PropertiesPromiseArray, PromiseArray);
    PropertiesPromiseArray.prototype._init = function() {
    };
    PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
      this._values[index] = value;
      var totalResolved = ++this._totalResolved;
      if (totalResolved >= this._length) {
        var val;
        if (this._isMap) {
          val = entriesToMap(this._values);
        } else {
          val = {};
          var keyOffset = this.length();
          for (var i = 0, len = this.length(); i < len; ++i) {
            val[this._values[i + keyOffset]] = this._values[i];
          }
        }
        this._resolve(val);
        return true;
      }
      return false;
    };
    PropertiesPromiseArray.prototype.shouldCopyValues = function() {
      return false;
    };
    PropertiesPromiseArray.prototype.getActualLength = function(len) {
      return len >> 1;
    };
    function props2(promises) {
      var ret;
      var castValue = tryConvertToPromise(promises);
      if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
      } else if (castValue instanceof Promise2) {
        ret = castValue._then(
          Promise2.props,
          void 0,
          void 0,
          void 0,
          void 0
        );
      } else {
        ret = new PropertiesPromiseArray(castValue).promise();
      }
      if (castValue instanceof Promise2) {
        ret._propagateFrom(castValue, 2);
      }
      return ret;
    }
    Promise2.prototype.props = function() {
      return props2(this);
    };
    Promise2.props = function(promises) {
      return props2(promises);
    };
  };
  return props;
}
var race;
var hasRequiredRace;
function requireRace() {
  if (hasRequiredRace) return race;
  hasRequiredRace = 1;
  race = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection) {
    var util2 = requireUtil();
    var raceLater = function(promise2) {
      return promise2.then(function(array) {
        return race2(array, promise2);
      });
    };
    function race2(promises, parent) {
      var maybePromise = tryConvertToPromise(promises);
      if (maybePromise instanceof Promise2) {
        return raceLater(maybePromise);
      } else {
        promises = util2.asArray(promises);
        if (promises === null)
          return apiRejection("expecting an array or an iterable object but got " + util2.classString(promises));
      }
      var ret = new Promise2(INTERNAL);
      if (parent !== void 0) {
        ret._propagateFrom(parent, 3);
      }
      var fulfill = ret._fulfill;
      var reject = ret._reject;
      for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];
        if (val === void 0 && !(i in promises)) {
          continue;
        }
        Promise2.cast(val)._then(fulfill, reject, void 0, ret, null);
      }
      return ret;
    }
    Promise2.race = function(promises) {
      return race2(promises, void 0);
    };
    Promise2.prototype.race = function() {
      return race2(this, void 0);
    };
  };
  return race;
}
var reduce;
var hasRequiredReduce;
function requireReduce() {
  if (hasRequiredReduce) return reduce;
  hasRequiredReduce = 1;
  reduce = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
    var getDomain = Promise2._getDomain;
    var util2 = requireUtil();
    var tryCatch = util2.tryCatch;
    function ReductionPromiseArray(promises, fn, initialValue, _each) {
      this.constructor$(promises);
      var domain = getDomain();
      this._fn = domain === null ? fn : util2.domainBind(domain, fn);
      if (initialValue !== void 0) {
        initialValue = Promise2.resolve(initialValue);
        initialValue._attachCancellationCallback(this);
      }
      this._initialValue = initialValue;
      this._currentCancellable = null;
      if (_each === INTERNAL) {
        this._eachValues = Array(this._length);
      } else if (_each === 0) {
        this._eachValues = null;
      } else {
        this._eachValues = void 0;
      }
      this._promise._captureStackTrace();
      this._init$(void 0, -5);
    }
    util2.inherits(ReductionPromiseArray, PromiseArray);
    ReductionPromiseArray.prototype._gotAccum = function(accum) {
      if (this._eachValues !== void 0 && this._eachValues !== null && accum !== INTERNAL) {
        this._eachValues.push(accum);
      }
    };
    ReductionPromiseArray.prototype._eachComplete = function(value) {
      if (this._eachValues !== null) {
        this._eachValues.push(value);
      }
      return this._eachValues;
    };
    ReductionPromiseArray.prototype._init = function() {
    };
    ReductionPromiseArray.prototype._resolveEmptyArray = function() {
      this._resolve(this._eachValues !== void 0 ? this._eachValues : this._initialValue);
    };
    ReductionPromiseArray.prototype.shouldCopyValues = function() {
      return false;
    };
    ReductionPromiseArray.prototype._resolve = function(value) {
      this._promise._resolveCallback(value);
      this._values = null;
    };
    ReductionPromiseArray.prototype._resultCancelled = function(sender) {
      if (sender === this._initialValue) return this._cancel();
      if (this._isResolved()) return;
      this._resultCancelled$();
      if (this._currentCancellable instanceof Promise2) {
        this._currentCancellable.cancel();
      }
      if (this._initialValue instanceof Promise2) {
        this._initialValue.cancel();
      }
    };
    ReductionPromiseArray.prototype._iterate = function(values) {
      this._values = values;
      var value;
      var i;
      var length = values.length;
      if (this._initialValue !== void 0) {
        value = this._initialValue;
        i = 0;
      } else {
        value = Promise2.resolve(values[0]);
        i = 1;
      }
      this._currentCancellable = value;
      if (!value.isRejected()) {
        for (; i < length; ++i) {
          var ctx = {
            accum: null,
            value: values[i],
            index: i,
            length,
            array: this
          };
          value = value._then(gotAccum, void 0, void 0, ctx, void 0);
        }
      }
      if (this._eachValues !== void 0) {
        value = value._then(this._eachComplete, void 0, void 0, this, void 0);
      }
      value._then(completed, completed, void 0, value, this);
    };
    Promise2.prototype.reduce = function(fn, initialValue) {
      return reduce2(this, fn, initialValue, null);
    };
    Promise2.reduce = function(promises, fn, initialValue, _each) {
      return reduce2(promises, fn, initialValue, _each);
    };
    function completed(valueOrReason, array) {
      if (this.isFulfilled()) {
        array._resolve(valueOrReason);
      } else {
        array._reject(valueOrReason);
      }
    }
    function reduce2(promises, fn, initialValue, _each) {
      if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util2.classString(fn));
      }
      var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
      return array.promise();
    }
    function gotAccum(accum) {
      this.accum = accum;
      this.array._gotAccum(accum);
      var value = tryConvertToPromise(this.value, this.array._promise);
      if (value instanceof Promise2) {
        this.array._currentCancellable = value;
        return value._then(gotValue, void 0, void 0, this, void 0);
      } else {
        return gotValue.call(this, value);
      }
    }
    function gotValue(value) {
      var array = this.array;
      var promise2 = array._promise;
      var fn = tryCatch(array._fn);
      promise2._pushContext();
      var ret;
      if (array._eachValues !== void 0) {
        ret = fn.call(promise2._boundValue(), value, this.index, this.length);
      } else {
        ret = fn.call(
          promise2._boundValue(),
          this.accum,
          value,
          this.index,
          this.length
        );
      }
      if (ret instanceof Promise2) {
        array._currentCancellable = ret;
      }
      var promiseCreated = promise2._popContext();
      debug.checkForgottenReturns(
        ret,
        promiseCreated,
        array._eachValues !== void 0 ? "Promise.each" : "Promise.reduce",
        promise2
      );
      return ret;
    }
  };
  return reduce;
}
var settle;
var hasRequiredSettle;
function requireSettle() {
  if (hasRequiredSettle) return settle;
  hasRequiredSettle = 1;
  settle = function(Promise2, PromiseArray, debug) {
    var PromiseInspection = Promise2.PromiseInspection;
    var util2 = requireUtil();
    function SettledPromiseArray(values) {
      this.constructor$(values);
    }
    util2.inherits(SettledPromiseArray, PromiseArray);
    SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
      this._values[index] = inspection;
      var totalResolved = ++this._totalResolved;
      if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
      }
      return false;
    };
    SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
      var ret = new PromiseInspection();
      ret._bitField = 33554432;
      ret._settledValueField = value;
      return this._promiseResolved(index, ret);
    };
    SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
      var ret = new PromiseInspection();
      ret._bitField = 16777216;
      ret._settledValueField = reason;
      return this._promiseResolved(index, ret);
    };
    Promise2.settle = function(promises) {
      debug.deprecated(".settle()", ".reflect()");
      return new SettledPromiseArray(promises).promise();
    };
    Promise2.prototype.settle = function() {
      return Promise2.settle(this);
    };
  };
  return settle;
}
var some;
var hasRequiredSome;
function requireSome() {
  if (hasRequiredSome) return some;
  hasRequiredSome = 1;
  some = function(Promise2, PromiseArray, apiRejection) {
    var util2 = requireUtil();
    var RangeError2 = requireErrors().RangeError;
    var AggregateError = requireErrors().AggregateError;
    var isArray = util2.isArray;
    var CANCELLATION = {};
    function SomePromiseArray(values) {
      this.constructor$(values);
      this._howMany = 0;
      this._unwrap = false;
      this._initialized = false;
    }
    util2.inherits(SomePromiseArray, PromiseArray);
    SomePromiseArray.prototype._init = function() {
      if (!this._initialized) {
        return;
      }
      if (this._howMany === 0) {
        this._resolve([]);
        return;
      }
      this._init$(void 0, -5);
      var isArrayResolved = isArray(this._values);
      if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
      }
    };
    SomePromiseArray.prototype.init = function() {
      this._initialized = true;
      this._init();
    };
    SomePromiseArray.prototype.setUnwrap = function() {
      this._unwrap = true;
    };
    SomePromiseArray.prototype.howMany = function() {
      return this._howMany;
    };
    SomePromiseArray.prototype.setHowMany = function(count) {
      this._howMany = count;
    };
    SomePromiseArray.prototype._promiseFulfilled = function(value) {
      this._addFulfilled(value);
      if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
          this._resolve(this._values[0]);
        } else {
          this._resolve(this._values);
        }
        return true;
      }
      return false;
    };
    SomePromiseArray.prototype._promiseRejected = function(reason) {
      this._addRejected(reason);
      return this._checkOutcome();
    };
    SomePromiseArray.prototype._promiseCancelled = function() {
      if (this._values instanceof Promise2 || this._values == null) {
        return this._cancel();
      }
      this._addRejected(CANCELLATION);
      return this._checkOutcome();
    };
    SomePromiseArray.prototype._checkOutcome = function() {
      if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
          if (this._values[i] !== CANCELLATION) {
            e.push(this._values[i]);
          }
        }
        if (e.length > 0) {
          this._reject(e);
        } else {
          this._cancel();
        }
        return true;
      }
      return false;
    };
    SomePromiseArray.prototype._fulfilled = function() {
      return this._totalResolved;
    };
    SomePromiseArray.prototype._rejected = function() {
      return this._values.length - this.length();
    };
    SomePromiseArray.prototype._addRejected = function(reason) {
      this._values.push(reason);
    };
    SomePromiseArray.prototype._addFulfilled = function(value) {
      this._values[this._totalResolved++] = value;
    };
    SomePromiseArray.prototype._canPossiblyFulfill = function() {
      return this.length() - this._rejected();
    };
    SomePromiseArray.prototype._getRangeError = function(count) {
      var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
      return new RangeError2(message);
    };
    SomePromiseArray.prototype._resolveEmptyArray = function() {
      this._reject(this._getRangeError(0));
    };
    function some2(promises, howMany) {
      if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
      }
      var ret = new SomePromiseArray(promises);
      var promise2 = ret.promise();
      ret.setHowMany(howMany);
      ret.init();
      return promise2;
    }
    Promise2.some = function(promises, howMany) {
      return some2(promises, howMany);
    };
    Promise2.prototype.some = function(howMany) {
      return some2(this, howMany);
    };
    Promise2._SomePromiseArray = SomePromiseArray;
  };
  return some;
}
var filter;
var hasRequiredFilter;
function requireFilter() {
  if (hasRequiredFilter) return filter;
  hasRequiredFilter = 1;
  filter = function(Promise2, INTERNAL) {
    var PromiseMap = Promise2.map;
    Promise2.prototype.filter = function(fn, options) {
      return PromiseMap(this, fn, options, INTERNAL);
    };
    Promise2.filter = function(promises, fn, options) {
      return PromiseMap(promises, fn, options, INTERNAL);
    };
  };
  return filter;
}
var each;
var hasRequiredEach;
function requireEach() {
  if (hasRequiredEach) return each;
  hasRequiredEach = 1;
  each = function(Promise2, INTERNAL) {
    var PromiseReduce = Promise2.reduce;
    var PromiseAll = Promise2.all;
    function promiseAllThis() {
      return PromiseAll(this);
    }
    function PromiseMapSeries(promises, fn) {
      return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
    }
    Promise2.prototype.each = function(fn) {
      return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, this, void 0);
    };
    Promise2.prototype.mapSeries = function(fn) {
      return PromiseReduce(this, fn, INTERNAL, INTERNAL);
    };
    Promise2.each = function(promises, fn) {
      return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, promises, void 0);
    };
    Promise2.mapSeries = PromiseMapSeries;
  };
  return each;
}
var any;
var hasRequiredAny;
function requireAny() {
  if (hasRequiredAny) return any;
  hasRequiredAny = 1;
  any = function(Promise2) {
    var SomePromiseArray = Promise2._SomePromiseArray;
    function any2(promises) {
      var ret = new SomePromiseArray(promises);
      var promise2 = ret.promise();
      ret.setHowMany(1);
      ret.setUnwrap();
      ret.init();
      return promise2;
    }
    Promise2.any = function(promises) {
      return any2(promises);
    };
    Promise2.prototype.any = function() {
      return any2(this);
    };
  };
  return any;
}
var hasRequiredPromise;
function requirePromise() {
  if (hasRequiredPromise) return promise.exports;
  hasRequiredPromise = 1;
  (function(module) {
    module.exports = function() {
      var makeSelfResolutionError = function() {
        return new TypeError2("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
      };
      var reflectHandler = function() {
        return new Promise2.PromiseInspection(this._target());
      };
      var apiRejection = function(msg) {
        return Promise2.reject(new TypeError2(msg));
      };
      function Proxyable() {
      }
      var UNDEFINED_BINDING = {};
      var util2 = requireUtil();
      var getDomain;
      if (util2.isNode) {
        getDomain = function() {
          var ret = process.domain;
          if (ret === void 0) ret = null;
          return ret;
        };
      } else {
        getDomain = function() {
          return null;
        };
      }
      util2.notEnumerableProp(Promise2, "_getDomain", getDomain);
      var es52 = requireEs5();
      var Async = requireAsync();
      var async2 = new Async();
      es52.defineProperty(Promise2, "_async", { value: async2 });
      var errors2 = requireErrors();
      var TypeError2 = Promise2.TypeError = errors2.TypeError;
      Promise2.RangeError = errors2.RangeError;
      var CancellationError = Promise2.CancellationError = errors2.CancellationError;
      Promise2.TimeoutError = errors2.TimeoutError;
      Promise2.OperationalError = errors2.OperationalError;
      Promise2.RejectionError = errors2.OperationalError;
      Promise2.AggregateError = errors2.AggregateError;
      var INTERNAL = function() {
      };
      var APPLY = {};
      var NEXT_FILTER = {};
      var tryConvertToPromise = requireThenables()(Promise2, INTERNAL);
      var PromiseArray = requirePromise_array()(
        Promise2,
        INTERNAL,
        tryConvertToPromise,
        apiRejection,
        Proxyable
      );
      var Context = requireContext()(Promise2);
      var createContext = Context.create;
      var debug = requireDebuggability()(Promise2, Context);
      debug.CapturedTrace;
      var PassThroughHandlerContext = require_finally()(Promise2, tryConvertToPromise);
      var catchFilter = requireCatch_filter()(NEXT_FILTER);
      var nodebackForPromise = requireNodeback();
      var errorObj = util2.errorObj;
      var tryCatch = util2.tryCatch;
      function check(self2, executor) {
        if (typeof executor !== "function") {
          throw new TypeError2("expecting a function but got " + util2.classString(executor));
        }
        if (self2.constructor !== Promise2) {
          throw new TypeError2("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
        }
      }
      function Promise2(executor) {
        this._bitField = 0;
        this._fulfillmentHandler0 = void 0;
        this._rejectionHandler0 = void 0;
        this._promise0 = void 0;
        this._receiver0 = void 0;
        if (executor !== INTERNAL) {
          check(this, executor);
          this._resolveFromExecutor(executor);
        }
        this._promiseCreated();
        this._fireEvent("promiseCreated", this);
      }
      Promise2.prototype.toString = function() {
        return "[object Promise]";
      };
      Promise2.prototype.caught = Promise2.prototype["catch"] = function(fn) {
        var len = arguments.length;
        if (len > 1) {
          var catchInstances = new Array(len - 1), j = 0, i;
          for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util2.isObject(item)) {
              catchInstances[j++] = item;
            } else {
              return apiRejection("expecting an object but got A catch statement predicate " + util2.classString(item));
            }
          }
          catchInstances.length = j;
          fn = arguments[i];
          return this.then(void 0, catchFilter(catchInstances, fn, this));
        }
        return this.then(void 0, fn);
      };
      Promise2.prototype.reflect = function() {
        return this._then(
          reflectHandler,
          reflectHandler,
          void 0,
          this,
          void 0
        );
      };
      Promise2.prototype.then = function(didFulfill, didReject) {
        if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
          var msg = ".then() only accepts functions but was passed: " + util2.classString(didFulfill);
          if (arguments.length > 1) {
            msg += ", " + util2.classString(didReject);
          }
          this._warn(msg);
        }
        return this._then(didFulfill, didReject, void 0, void 0, void 0);
      };
      Promise2.prototype.done = function(didFulfill, didReject) {
        var promise2 = this._then(didFulfill, didReject, void 0, void 0, void 0);
        promise2._setIsFinal();
      };
      Promise2.prototype.spread = function(fn) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util2.classString(fn));
        }
        return this.all()._then(fn, void 0, void 0, APPLY, void 0);
      };
      Promise2.prototype.toJSON = function() {
        var ret = {
          isFulfilled: false,
          isRejected: false,
          fulfillmentValue: void 0,
          rejectionReason: void 0
        };
        if (this.isFulfilled()) {
          ret.fulfillmentValue = this.value();
          ret.isFulfilled = true;
        } else if (this.isRejected()) {
          ret.rejectionReason = this.reason();
          ret.isRejected = true;
        }
        return ret;
      };
      Promise2.prototype.all = function() {
        if (arguments.length > 0) {
          this._warn(".all() was passed arguments but it does not take any");
        }
        return new PromiseArray(this).promise();
      };
      Promise2.prototype.error = function(fn) {
        return this.caught(util2.originatesFromRejection, fn);
      };
      Promise2.getNewLibraryCopy = module.exports;
      Promise2.is = function(val) {
        return val instanceof Promise2;
      };
      Promise2.fromNode = Promise2.fromCallback = function(fn) {
        var ret = new Promise2(INTERNAL);
        ret._captureStackTrace();
        var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
        var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
        if (result === errorObj) {
          ret._rejectCallback(result.e, true);
        }
        if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
        return ret;
      };
      Promise2.all = function(promises) {
        return new PromiseArray(promises).promise();
      };
      Promise2.cast = function(obj) {
        var ret = tryConvertToPromise(obj);
        if (!(ret instanceof Promise2)) {
          ret = new Promise2(INTERNAL);
          ret._captureStackTrace();
          ret._setFulfilled();
          ret._rejectionHandler0 = obj;
        }
        return ret;
      };
      Promise2.resolve = Promise2.fulfilled = Promise2.cast;
      Promise2.reject = Promise2.rejected = function(reason) {
        var ret = new Promise2(INTERNAL);
        ret._captureStackTrace();
        ret._rejectCallback(reason, true);
        return ret;
      };
      Promise2.setScheduler = function(fn) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util2.classString(fn));
        }
        return async2.setScheduler(fn);
      };
      Promise2.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
        var haveInternalData = internalData !== void 0;
        var promise2 = haveInternalData ? internalData : new Promise2(INTERNAL);
        var target = this._target();
        var bitField = target._bitField;
        if (!haveInternalData) {
          promise2._propagateFrom(this, 3);
          promise2._captureStackTrace();
          if (receiver === void 0 && (this._bitField & 2097152) !== 0) {
            if (!((bitField & 50397184) === 0)) {
              receiver = this._boundValue();
            } else {
              receiver = target === this ? void 0 : this._boundTo;
            }
          }
          this._fireEvent("promiseChained", this, promise2);
        }
        var domain = getDomain();
        if (!((bitField & 50397184) === 0)) {
          var handler, value, settler = target._settlePromiseCtx;
          if ((bitField & 33554432) !== 0) {
            value = target._rejectionHandler0;
            handler = didFulfill;
          } else if ((bitField & 16777216) !== 0) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
          } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
          }
          async2.invoke(settler, target, {
            handler: domain === null ? handler : typeof handler === "function" && util2.domainBind(domain, handler),
            promise: promise2,
            receiver,
            value
          });
        } else {
          target._addCallbacks(didFulfill, didReject, promise2, receiver, domain);
        }
        return promise2;
      };
      Promise2.prototype._length = function() {
        return this._bitField & 65535;
      };
      Promise2.prototype._isFateSealed = function() {
        return (this._bitField & 117506048) !== 0;
      };
      Promise2.prototype._isFollowing = function() {
        return (this._bitField & 67108864) === 67108864;
      };
      Promise2.prototype._setLength = function(len) {
        this._bitField = this._bitField & -65536 | len & 65535;
      };
      Promise2.prototype._setFulfilled = function() {
        this._bitField = this._bitField | 33554432;
        this._fireEvent("promiseFulfilled", this);
      };
      Promise2.prototype._setRejected = function() {
        this._bitField = this._bitField | 16777216;
        this._fireEvent("promiseRejected", this);
      };
      Promise2.prototype._setFollowing = function() {
        this._bitField = this._bitField | 67108864;
        this._fireEvent("promiseResolved", this);
      };
      Promise2.prototype._setIsFinal = function() {
        this._bitField = this._bitField | 4194304;
      };
      Promise2.prototype._isFinal = function() {
        return (this._bitField & 4194304) > 0;
      };
      Promise2.prototype._unsetCancelled = function() {
        this._bitField = this._bitField & -65537;
      };
      Promise2.prototype._setCancelled = function() {
        this._bitField = this._bitField | 65536;
        this._fireEvent("promiseCancelled", this);
      };
      Promise2.prototype._setWillBeCancelled = function() {
        this._bitField = this._bitField | 8388608;
      };
      Promise2.prototype._setAsyncGuaranteed = function() {
        if (async2.hasCustomScheduler()) return;
        this._bitField = this._bitField | 134217728;
      };
      Promise2.prototype._receiverAt = function(index) {
        var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
        if (ret === UNDEFINED_BINDING) {
          return void 0;
        } else if (ret === void 0 && this._isBound()) {
          return this._boundValue();
        }
        return ret;
      };
      Promise2.prototype._promiseAt = function(index) {
        return this[index * 4 - 4 + 2];
      };
      Promise2.prototype._fulfillmentHandlerAt = function(index) {
        return this[index * 4 - 4 + 0];
      };
      Promise2.prototype._rejectionHandlerAt = function(index) {
        return this[index * 4 - 4 + 1];
      };
      Promise2.prototype._boundValue = function() {
      };
      Promise2.prototype._migrateCallback0 = function(follower) {
        follower._bitField;
        var fulfill = follower._fulfillmentHandler0;
        var reject = follower._rejectionHandler0;
        var promise2 = follower._promise0;
        var receiver = follower._receiverAt(0);
        if (receiver === void 0) receiver = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise2, receiver, null);
      };
      Promise2.prototype._migrateCallbackAt = function(follower, index) {
        var fulfill = follower._fulfillmentHandlerAt(index);
        var reject = follower._rejectionHandlerAt(index);
        var promise2 = follower._promiseAt(index);
        var receiver = follower._receiverAt(index);
        if (receiver === void 0) receiver = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise2, receiver, null);
      };
      Promise2.prototype._addCallbacks = function(fulfill, reject, promise2, receiver, domain) {
        var index = this._length();
        if (index >= 65535 - 4) {
          index = 0;
          this._setLength(0);
        }
        if (index === 0) {
          this._promise0 = promise2;
          this._receiver0 = receiver;
          if (typeof fulfill === "function") {
            this._fulfillmentHandler0 = domain === null ? fulfill : util2.domainBind(domain, fulfill);
          }
          if (typeof reject === "function") {
            this._rejectionHandler0 = domain === null ? reject : util2.domainBind(domain, reject);
          }
        } else {
          var base = index * 4 - 4;
          this[base + 2] = promise2;
          this[base + 3] = receiver;
          if (typeof fulfill === "function") {
            this[base + 0] = domain === null ? fulfill : util2.domainBind(domain, fulfill);
          }
          if (typeof reject === "function") {
            this[base + 1] = domain === null ? reject : util2.domainBind(domain, reject);
          }
        }
        this._setLength(index + 1);
        return index;
      };
      Promise2.prototype._proxy = function(proxyable, arg) {
        this._addCallbacks(void 0, void 0, arg, proxyable, null);
      };
      Promise2.prototype._resolveCallback = function(value, shouldBind) {
        if ((this._bitField & 117506048) !== 0) return;
        if (value === this)
          return this._rejectCallback(makeSelfResolutionError(), false);
        var maybePromise = tryConvertToPromise(value, this);
        if (!(maybePromise instanceof Promise2)) return this._fulfill(value);
        if (shouldBind) this._propagateFrom(maybePromise, 2);
        var promise2 = maybePromise._target();
        if (promise2 === this) {
          this._reject(makeSelfResolutionError());
          return;
        }
        var bitField = promise2._bitField;
        if ((bitField & 50397184) === 0) {
          var len = this._length();
          if (len > 0) promise2._migrateCallback0(this);
          for (var i = 1; i < len; ++i) {
            promise2._migrateCallbackAt(this, i);
          }
          this._setFollowing();
          this._setLength(0);
          this._setFollowee(promise2);
        } else if ((bitField & 33554432) !== 0) {
          this._fulfill(promise2._value());
        } else if ((bitField & 16777216) !== 0) {
          this._reject(promise2._reason());
        } else {
          var reason = new CancellationError("late cancellation observer");
          promise2._attachExtraTrace(reason);
          this._reject(reason);
        }
      };
      Promise2.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
        var trace = util2.ensureErrorObject(reason);
        var hasStack = trace === reason;
        if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
          var message = "a promise was rejected with a non-error: " + util2.classString(reason);
          this._warn(message, true);
        }
        this._attachExtraTrace(trace, synchronous ? hasStack : false);
        this._reject(reason);
      };
      Promise2.prototype._resolveFromExecutor = function(executor) {
        var promise2 = this;
        this._captureStackTrace();
        this._pushContext();
        var synchronous = true;
        var r = this._execute(executor, function(value) {
          promise2._resolveCallback(value);
        }, function(reason) {
          promise2._rejectCallback(reason, synchronous);
        });
        synchronous = false;
        this._popContext();
        if (r !== void 0) {
          promise2._rejectCallback(r, true);
        }
      };
      Promise2.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise2) {
        var bitField = promise2._bitField;
        if ((bitField & 65536) !== 0) return;
        promise2._pushContext();
        var x;
        if (receiver === APPLY) {
          if (!value || typeof value.length !== "number") {
            x = errorObj;
            x.e = new TypeError2("cannot .spread() a non-array: " + util2.classString(value));
          } else {
            x = tryCatch(handler).apply(this._boundValue(), value);
          }
        } else {
          x = tryCatch(handler).call(receiver, value);
        }
        var promiseCreated = promise2._popContext();
        bitField = promise2._bitField;
        if ((bitField & 65536) !== 0) return;
        if (x === NEXT_FILTER) {
          promise2._reject(value);
        } else if (x === errorObj) {
          promise2._rejectCallback(x.e, false);
        } else {
          debug.checkForgottenReturns(x, promiseCreated, "", promise2, this);
          promise2._resolveCallback(x);
        }
      };
      Promise2.prototype._target = function() {
        var ret = this;
        while (ret._isFollowing()) ret = ret._followee();
        return ret;
      };
      Promise2.prototype._followee = function() {
        return this._rejectionHandler0;
      };
      Promise2.prototype._setFollowee = function(promise2) {
        this._rejectionHandler0 = promise2;
      };
      Promise2.prototype._settlePromise = function(promise2, handler, receiver, value) {
        var isPromise = promise2 instanceof Promise2;
        var bitField = this._bitField;
        var asyncGuaranteed = (bitField & 134217728) !== 0;
        if ((bitField & 65536) !== 0) {
          if (isPromise) promise2._invokeInternalOnCancel();
          if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise2;
            if (tryCatch(handler).call(receiver, value) === errorObj) {
              promise2._reject(errorObj.e);
            }
          } else if (handler === reflectHandler) {
            promise2._fulfill(reflectHandler.call(receiver));
          } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise2);
          } else if (isPromise || promise2 instanceof PromiseArray) {
            promise2._cancel();
          } else {
            receiver.cancel();
          }
        } else if (typeof handler === "function") {
          if (!isPromise) {
            handler.call(receiver, value, promise2);
          } else {
            if (asyncGuaranteed) promise2._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise2);
          }
        } else if (receiver instanceof Proxyable) {
          if (!receiver._isResolved()) {
            if ((bitField & 33554432) !== 0) {
              receiver._promiseFulfilled(value, promise2);
            } else {
              receiver._promiseRejected(value, promise2);
            }
          }
        } else if (isPromise) {
          if (asyncGuaranteed) promise2._setAsyncGuaranteed();
          if ((bitField & 33554432) !== 0) {
            promise2._fulfill(value);
          } else {
            promise2._reject(value);
          }
        }
      };
      Promise2.prototype._settlePromiseLateCancellationObserver = function(ctx) {
        var handler = ctx.handler;
        var promise2 = ctx.promise;
        var receiver = ctx.receiver;
        var value = ctx.value;
        if (typeof handler === "function") {
          if (!(promise2 instanceof Promise2)) {
            handler.call(receiver, value, promise2);
          } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise2);
          }
        } else if (promise2 instanceof Promise2) {
          promise2._reject(value);
        }
      };
      Promise2.prototype._settlePromiseCtx = function(ctx) {
        this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
      };
      Promise2.prototype._settlePromise0 = function(handler, value, bitField) {
        var promise2 = this._promise0;
        var receiver = this._receiverAt(0);
        this._promise0 = void 0;
        this._receiver0 = void 0;
        this._settlePromise(promise2, handler, receiver, value);
      };
      Promise2.prototype._clearCallbackDataAtIndex = function(index) {
        var base = index * 4 - 4;
        this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
      };
      Promise2.prototype._fulfill = function(value) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16) return;
        if (value === this) {
          var err = makeSelfResolutionError();
          this._attachExtraTrace(err);
          return this._reject(err);
        }
        this._setFulfilled();
        this._rejectionHandler0 = value;
        if ((bitField & 65535) > 0) {
          if ((bitField & 134217728) !== 0) {
            this._settlePromises();
          } else {
            async2.settlePromises(this);
          }
        }
      };
      Promise2.prototype._reject = function(reason) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16) return;
        this._setRejected();
        this._fulfillmentHandler0 = reason;
        if (this._isFinal()) {
          return async2.fatalError(reason, util2.isNode);
        }
        if ((bitField & 65535) > 0) {
          async2.settlePromises(this);
        } else {
          this._ensurePossibleRejectionHandled();
        }
      };
      Promise2.prototype._fulfillPromises = function(len, value) {
        for (var i = 1; i < len; i++) {
          var handler = this._fulfillmentHandlerAt(i);
          var promise2 = this._promiseAt(i);
          var receiver = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise2, handler, receiver, value);
        }
      };
      Promise2.prototype._rejectPromises = function(len, reason) {
        for (var i = 1; i < len; i++) {
          var handler = this._rejectionHandlerAt(i);
          var promise2 = this._promiseAt(i);
          var receiver = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise2, handler, receiver, reason);
        }
      };
      Promise2.prototype._settlePromises = function() {
        var bitField = this._bitField;
        var len = bitField & 65535;
        if (len > 0) {
          if ((bitField & 16842752) !== 0) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
          } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
          }
          this._setLength(0);
        }
        this._clearCancellationData();
      };
      Promise2.prototype._settledValue = function() {
        var bitField = this._bitField;
        if ((bitField & 33554432) !== 0) {
          return this._rejectionHandler0;
        } else if ((bitField & 16777216) !== 0) {
          return this._fulfillmentHandler0;
        }
      };
      function deferResolve(v) {
        this.promise._resolveCallback(v);
      }
      function deferReject(v) {
        this.promise._rejectCallback(v, false);
      }
      Promise2.defer = Promise2.pending = function() {
        debug.deprecated("Promise.defer", "new Promise");
        var promise2 = new Promise2(INTERNAL);
        return {
          promise: promise2,
          resolve: deferResolve,
          reject: deferReject
        };
      };
      util2.notEnumerableProp(
        Promise2,
        "_makeSelfResolutionError",
        makeSelfResolutionError
      );
      requireMethod()(
        Promise2,
        INTERNAL,
        tryConvertToPromise,
        apiRejection,
        debug
      );
      requireBind()(Promise2, INTERNAL, tryConvertToPromise, debug);
      requireCancel()(Promise2, PromiseArray, apiRejection, debug);
      requireDirect_resolve()(Promise2);
      requireSynchronous_inspection()(Promise2);
      requireJoin()(
        Promise2,
        PromiseArray,
        tryConvertToPromise,
        INTERNAL,
        async2,
        getDomain
      );
      Promise2.Promise = Promise2;
      Promise2.version = "3.4.7";
      requireMap()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      requireCall_get()(Promise2);
      requireUsing()(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
      requireTimers()(Promise2, INTERNAL, debug);
      requireGenerators()(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
      requireNodeify()(Promise2);
      requirePromisify()(Promise2, INTERNAL);
      requireProps()(Promise2, PromiseArray, tryConvertToPromise, apiRejection);
      requireRace()(Promise2, INTERNAL, tryConvertToPromise, apiRejection);
      requireReduce()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      requireSettle()(Promise2, PromiseArray, debug);
      requireSome()(Promise2, PromiseArray, apiRejection);
      requireFilter()(Promise2, INTERNAL);
      requireEach()(Promise2, INTERNAL);
      requireAny()(Promise2);
      util2.toFastProperties(Promise2);
      util2.toFastProperties(Promise2.prototype);
      function fillTypes(value) {
        var p = new Promise2(INTERNAL);
        p._fulfillmentHandler0 = value;
        p._rejectionHandler0 = value;
        p._promise0 = value;
        p._receiver0 = value;
      }
      fillTypes({ a: 1 });
      fillTypes({ b: 2 });
      fillTypes({ c: 3 });
      fillTypes(1);
      fillTypes(function() {
      });
      fillTypes(void 0);
      fillTypes(false);
      fillTypes(new Promise2(INTERNAL));
      debug.setBounds(Async.firstLineError, util2.lastLineError);
      return Promise2;
    };
  })(promise);
  return promise.exports;
}
export {
  requirePromise as r
};
