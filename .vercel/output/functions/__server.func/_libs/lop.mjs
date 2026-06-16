import { r as requireUnderscoreNode } from "./underscore.mjs";
import { r as requireOption } from "./option.mjs";
var lop = {};
var parser = {};
var TokenIterator = { exports: {} };
var hasRequiredTokenIterator;
function requireTokenIterator() {
  if (hasRequiredTokenIterator) return TokenIterator.exports;
  hasRequiredTokenIterator = 1;
  var TokenIterator$1 = TokenIterator.exports = function(tokens, startIndex) {
    this._tokens = tokens;
    this._startIndex = startIndex || 0;
  };
  TokenIterator$1.prototype.head = function() {
    return this._tokens[this._startIndex];
  };
  TokenIterator$1.prototype.tail = function(startIndex) {
    return new TokenIterator$1(this._tokens, this._startIndex + 1);
  };
  TokenIterator$1.prototype.toArray = function() {
    return this._tokens.slice(this._startIndex);
  };
  TokenIterator$1.prototype.end = function() {
    return this._tokens[this._tokens.length - 1];
  };
  TokenIterator$1.prototype.to = function(end) {
    var start = this.head().source;
    var endToken = end.head() || end.end();
    return start.to(endToken.source);
  };
  return TokenIterator.exports;
}
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser) return parser;
  hasRequiredParser = 1;
  var TokenIterator2 = requireTokenIterator();
  parser.Parser = function(options) {
    var parseTokens = function(parser2, tokens) {
      return parser2(new TokenIterator2(tokens));
    };
    return {
      parseTokens
    };
  };
  return parser;
}
var rules = {};
var parsingResults;
var hasRequiredParsingResults;
function requireParsingResults() {
  if (hasRequiredParsingResults) return parsingResults;
  hasRequiredParsingResults = 1;
  parsingResults = {
    failure: function(errors2, remaining) {
      if (errors2.length < 1) {
        throw new Error("Failure must have errors");
      }
      return new Result({
        status: "failure",
        remaining,
        errors: errors2
      });
    },
    error: function(errors2, remaining) {
      if (errors2.length < 1) {
        throw new Error("Failure must have errors");
      }
      return new Result({
        status: "error",
        remaining,
        errors: errors2
      });
    },
    success: function(value, remaining, source) {
      return new Result({
        status: "success",
        value,
        source,
        remaining,
        errors: []
      });
    },
    cut: function(remaining) {
      return new Result({
        status: "cut",
        remaining,
        errors: []
      });
    }
  };
  var Result = function(options) {
    this._value = options.value;
    this._status = options.status;
    this._hasValue = options.value !== void 0;
    this._remaining = options.remaining;
    this._source = options.source;
    this._errors = options.errors;
  };
  Result.prototype.map = function(func) {
    if (this._hasValue) {
      return new Result({
        value: func(this._value, this._source),
        status: this._status,
        remaining: this._remaining,
        source: this._source,
        errors: this._errors
      });
    } else {
      return this;
    }
  };
  Result.prototype.changeRemaining = function(remaining) {
    return new Result({
      value: this._value,
      status: this._status,
      remaining,
      source: this._source,
      errors: this._errors
    });
  };
  Result.prototype.isSuccess = function() {
    return this._status === "success" || this._status === "cut";
  };
  Result.prototype.isFailure = function() {
    return this._status === "failure";
  };
  Result.prototype.isError = function() {
    return this._status === "error";
  };
  Result.prototype.isCut = function() {
    return this._status === "cut";
  };
  Result.prototype.value = function() {
    return this._value;
  };
  Result.prototype.remaining = function() {
    return this._remaining;
  };
  Result.prototype.source = function() {
    return this._source;
  };
  Result.prototype.errors = function() {
    return this._errors;
  };
  return parsingResults;
}
var errors = {};
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  errors.error = function(options) {
    return new Error2(options);
  };
  var Error2 = function(options) {
    this.expected = options.expected;
    this.actual = options.actual;
    this._location = options.location;
  };
  Error2.prototype.describe = function() {
    var locationDescription = this._location ? this._location.describe() + ":\n" : "";
    return locationDescription + "Expected " + this.expected + "\nbut got " + this.actual;
  };
  Error2.prototype.lineNumber = function() {
    return this._location.lineNumber();
  };
  Error2.prototype.characterNumber = function() {
    return this._location.characterNumber();
  };
  return errors;
}
var lazyIterators = {};
var hasRequiredLazyIterators;
function requireLazyIterators() {
  if (hasRequiredLazyIterators) return lazyIterators;
  hasRequiredLazyIterators = 1;
  lazyIterators.fromArray = function(array) {
    var index = 0;
    var hasNext = function() {
      return index < array.length;
    };
    return new LazyIterator({
      hasNext,
      next: function() {
        if (!hasNext()) {
          throw new Error("No more elements");
        } else {
          return array[index++];
        }
      }
    });
  };
  var LazyIterator = function(iterator) {
    this._iterator = iterator;
  };
  LazyIterator.prototype.map = function(func) {
    var iterator = this._iterator;
    return new LazyIterator({
      hasNext: function() {
        return iterator.hasNext();
      },
      next: function() {
        return func(iterator.next());
      }
    });
  };
  LazyIterator.prototype.filter = function(condition) {
    var iterator = this._iterator;
    var moved = false;
    var hasNext = false;
    var next;
    var moveIfNecessary = function() {
      if (moved) {
        return;
      }
      moved = true;
      hasNext = false;
      while (iterator.hasNext() && !hasNext) {
        next = iterator.next();
        hasNext = condition(next);
      }
    };
    return new LazyIterator({
      hasNext: function() {
        moveIfNecessary();
        return hasNext;
      },
      next: function() {
        moveIfNecessary();
        var toReturn = next;
        moved = false;
        return toReturn;
      }
    });
  };
  LazyIterator.prototype.first = function() {
    var iterator = this._iterator;
    if (this._iterator.hasNext()) {
      return iterator.next();
    } else {
      return null;
    }
  };
  LazyIterator.prototype.toArray = function() {
    var result = [];
    while (this._iterator.hasNext()) {
      result.push(this._iterator.next());
    }
    return result;
  };
  return lazyIterators;
}
var hasRequiredRules;
function requireRules() {
  if (hasRequiredRules) return rules;
  hasRequiredRules = 1;
  (function(exports) {
    var _ = requireUnderscoreNode();
    var options = requireOption();
    var results = requireParsingResults();
    var errors2 = requireErrors();
    var lazyIterators2 = requireLazyIterators();
    exports.token = function(tokenType, value) {
      var matchValue = value !== void 0;
      return function(input) {
        var token = input.head();
        if (token && token.name === tokenType && (!matchValue || token.value === value)) {
          return results.success(token.value, input.tail(), token.source);
        } else {
          var expected = describeToken({ name: tokenType, value });
          return describeTokenMismatch(input, expected);
        }
      };
    };
    exports.tokenOfType = function(tokenType) {
      return exports.token(tokenType);
    };
    exports.firstOf = function(name, parsers) {
      if (!_.isArray(parsers)) {
        parsers = Array.prototype.slice.call(arguments, 1);
      }
      return function(input) {
        return lazyIterators2.fromArray(parsers).map(function(parser2) {
          return parser2(input);
        }).filter(function(result) {
          return result.isSuccess() || result.isError();
        }).first() || describeTokenMismatch(input, name);
      };
    };
    exports.then = function(parser2, func) {
      return function(input) {
        var result = parser2(input);
        if (!result.map) {
          console.log(result);
        }
        return result.map(func);
      };
    };
    exports.sequence = function() {
      var parsers = Array.prototype.slice.call(arguments, 0);
      var rule = function(input) {
        var result = _.foldl(parsers, function(memo, parser2) {
          var result2 = memo.result;
          var hasCut = memo.hasCut;
          if (!result2.isSuccess()) {
            return { result: result2, hasCut };
          }
          var subResult = parser2(result2.remaining());
          if (subResult.isCut()) {
            return { result: result2, hasCut: true };
          } else if (subResult.isSuccess()) {
            var values;
            if (parser2.isCaptured) {
              values = result2.value().withValue(parser2, subResult.value());
            } else {
              values = result2.value();
            }
            var remaining = subResult.remaining();
            var source2 = input.to(remaining);
            return {
              result: results.success(values, remaining, source2),
              hasCut
            };
          } else if (hasCut) {
            return { result: results.error(subResult.errors(), subResult.remaining()), hasCut };
          } else {
            return { result: subResult, hasCut };
          }
        }, { result: results.success(new SequenceValues(), input), hasCut: false }).result;
        var source = input.to(result.remaining());
        return result.map(function(values) {
          return values.withValue(exports.sequence.source, source);
        });
      };
      rule.head = function() {
        var firstCapture = _.find(parsers, isCapturedRule);
        return exports.then(
          rule,
          exports.sequence.extract(firstCapture)
        );
      };
      rule.map = function(func) {
        return exports.then(
          rule,
          function(result) {
            return func.apply(this, result.toArray());
          }
        );
      };
      function isCapturedRule(subRule) {
        return subRule.isCaptured;
      }
      return rule;
    };
    var SequenceValues = function(values, valuesArray) {
      this._values = values || {};
      this._valuesArray = valuesArray || [];
    };
    SequenceValues.prototype.withValue = function(rule, value) {
      if (rule.captureName && rule.captureName in this._values) {
        throw new Error('Cannot add second value for capture "' + rule.captureName + '"');
      } else {
        var newValues = _.clone(this._values);
        newValues[rule.captureName] = value;
        var newValuesArray = this._valuesArray.concat([value]);
        return new SequenceValues(newValues, newValuesArray);
      }
    };
    SequenceValues.prototype.get = function(rule) {
      if (rule.captureName in this._values) {
        return this._values[rule.captureName];
      } else {
        throw new Error('No value for capture "' + rule.captureName + '"');
      }
    };
    SequenceValues.prototype.toArray = function() {
      return this._valuesArray;
    };
    exports.sequence.capture = function(rule, name) {
      var captureRule = function() {
        return rule.apply(this, arguments);
      };
      captureRule.captureName = name;
      captureRule.isCaptured = true;
      return captureRule;
    };
    exports.sequence.extract = function(rule) {
      return function(result) {
        return result.get(rule);
      };
    };
    exports.sequence.applyValues = function(func) {
      var rules2 = Array.prototype.slice.call(arguments, 1);
      return function(result) {
        var values = rules2.map(function(rule) {
          return result.get(rule);
        });
        return func.apply(this, values);
      };
    };
    exports.sequence.source = {
      captureName: "☃source☃"
    };
    exports.sequence.cut = function() {
      return function(input) {
        return results.cut(input);
      };
    };
    exports.optional = function(rule) {
      return function(input) {
        var result = rule(input);
        if (result.isSuccess()) {
          return result.map(options.some);
        } else if (result.isFailure()) {
          return results.success(options.none, input);
        } else {
          return result;
        }
      };
    };
    exports.zeroOrMoreWithSeparator = function(rule, separator) {
      return repeatedWithSeparator(rule, separator, false);
    };
    exports.oneOrMoreWithSeparator = function(rule, separator) {
      return repeatedWithSeparator(rule, separator, true);
    };
    var zeroOrMore = exports.zeroOrMore = function(rule) {
      return function(input) {
        var values = [];
        var result;
        while ((result = rule(input)) && result.isSuccess()) {
          input = result.remaining();
          values.push(result.value());
        }
        if (result.isError()) {
          return result;
        } else {
          return results.success(values, input);
        }
      };
    };
    exports.oneOrMore = function(rule) {
      return exports.oneOrMoreWithSeparator(rule, noOpRule);
    };
    function noOpRule(input) {
      return results.success(null, input);
    }
    var repeatedWithSeparator = function(rule, separator, isOneOrMore) {
      return function(input) {
        var result = rule(input);
        if (result.isSuccess()) {
          var mainRule = exports.sequence.capture(rule, "main");
          var remainingRule = zeroOrMore(exports.then(
            exports.sequence(separator, mainRule),
            exports.sequence.extract(mainRule)
          ));
          var remainingResult = remainingRule(result.remaining());
          return results.success([result.value()].concat(remainingResult.value()), remainingResult.remaining());
        } else if (isOneOrMore || result.isError()) {
          return result;
        } else {
          return results.success([], input);
        }
      };
    };
    exports.leftAssociative = function(leftRule, rightRule, func) {
      var rights;
      if (func) {
        rights = [{ func, rule: rightRule }];
      } else {
        rights = rightRule;
      }
      rights = rights.map(function(right) {
        return exports.then(right.rule, function(rightValue) {
          return function(leftValue, source) {
            return right.func(leftValue, rightValue, source);
          };
        });
      });
      var repeatedRule = exports.firstOf.apply(null, ["rules"].concat(rights));
      return function(input) {
        var start = input;
        var leftResult = leftRule(input);
        if (!leftResult.isSuccess()) {
          return leftResult;
        }
        var repeatedResult = repeatedRule(leftResult.remaining());
        while (repeatedResult.isSuccess()) {
          var remaining = repeatedResult.remaining();
          var source = start.to(repeatedResult.remaining());
          var right = repeatedResult.value();
          leftResult = results.success(
            right(leftResult.value(), source),
            remaining,
            source
          );
          repeatedResult = repeatedRule(leftResult.remaining());
        }
        if (repeatedResult.isError()) {
          return repeatedResult;
        }
        return leftResult;
      };
    };
    exports.leftAssociative.firstOf = function() {
      return Array.prototype.slice.call(arguments, 0);
    };
    exports.nonConsuming = function(rule) {
      return function(input) {
        return rule(input).changeRemaining(input);
      };
    };
    var describeToken = function(token) {
      if (token.value) {
        return token.name + ' "' + token.value + '"';
      } else {
        return token.name;
      }
    };
    function describeTokenMismatch(input, expected) {
      var error;
      var token = input.head();
      if (token) {
        error = errors2.error({
          expected,
          actual: describeToken(token),
          location: token.source
        });
      } else {
        error = errors2.error({
          expected,
          actual: "end of tokens"
        });
      }
      return results.failure([error], input);
    }
  })(rules);
  return rules;
}
var StringSource = { exports: {} };
var hasRequiredStringSource;
function requireStringSource() {
  if (hasRequiredStringSource) return StringSource.exports;
  hasRequiredStringSource = 1;
  StringSource.exports = function(string, description) {
    var self = {
      asString: function() {
        return string;
      },
      range: function(startIndex, endIndex) {
        return new StringSourceRange(string, description, startIndex, endIndex);
      }
    };
    return self;
  };
  var StringSourceRange = function(string, description, startIndex, endIndex) {
    this._string = string;
    this._description = description;
    this._startIndex = startIndex;
    this._endIndex = endIndex;
  };
  StringSourceRange.prototype.to = function(otherRange) {
    return new StringSourceRange(this._string, this._description, this._startIndex, otherRange._endIndex);
  };
  StringSourceRange.prototype.describe = function() {
    var position = this._position();
    var description = this._description ? this._description + "\n" : "";
    return description + "Line number: " + position.lineNumber + "\nCharacter number: " + position.characterNumber;
  };
  StringSourceRange.prototype.lineNumber = function() {
    return this._position().lineNumber;
  };
  StringSourceRange.prototype.characterNumber = function() {
    return this._position().characterNumber;
  };
  StringSourceRange.prototype._position = function() {
    var self = this;
    var index = 0;
    var nextNewLine = function() {
      return self._string.indexOf("\n", index);
    };
    var lineNumber = 1;
    while (nextNewLine() !== -1 && nextNewLine() < this._startIndex) {
      index = nextNewLine() + 1;
      lineNumber += 1;
    }
    var characterNumber = this._startIndex - index + 1;
    return { lineNumber, characterNumber };
  };
  return StringSource.exports;
}
var Token;
var hasRequiredToken;
function requireToken() {
  if (hasRequiredToken) return Token;
  hasRequiredToken = 1;
  Token = function(name, value, source) {
    this.name = name;
    this.value = value;
    if (source) {
      this.source = source;
    }
  };
  return Token;
}
var bottomUp = {};
var hasRequiredBottomUp;
function requireBottomUp() {
  if (hasRequiredBottomUp) return bottomUp;
  hasRequiredBottomUp = 1;
  (function(exports) {
    var rules2 = requireRules();
    var results = requireParsingResults();
    exports.parser = function(name, prefixRules, infixRuleBuilders) {
      var self = {
        rule,
        leftAssociative,
        rightAssociative
      };
      var infixRules = new InfixRules(infixRuleBuilders.map(createInfixRule));
      var prefixRule = rules2.firstOf(name, prefixRules);
      function createInfixRule(infixRuleBuilder) {
        return {
          name: infixRuleBuilder.name,
          rule: lazyRule(infixRuleBuilder.ruleBuilder.bind(null, self))
        };
      }
      function rule() {
        return createRule(infixRules);
      }
      function leftAssociative(name2) {
        return createRule(infixRules.untilExclusive(name2));
      }
      function rightAssociative(name2) {
        return createRule(infixRules.untilInclusive(name2));
      }
      function createRule(infixRules2) {
        return apply.bind(null, infixRules2);
      }
      function apply(infixRules2, tokens) {
        var leftResult = prefixRule(tokens);
        if (leftResult.isSuccess()) {
          return infixRules2.apply(leftResult);
        } else {
          return leftResult;
        }
      }
      return self;
    };
    function InfixRules(infixRules) {
      function untilExclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name)));
      }
      function untilInclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name) + 1));
      }
      function ruleNames() {
        return infixRules.map(function(rule) {
          return rule.name;
        });
      }
      function apply(leftResult) {
        var currentResult;
        var source;
        while (true) {
          currentResult = applyToTokens(leftResult.remaining());
          if (currentResult.isSuccess()) {
            source = leftResult.source().to(currentResult.source());
            leftResult = results.success(
              currentResult.value()(leftResult.value(), source),
              currentResult.remaining(),
              source
            );
          } else if (currentResult.isFailure()) {
            return leftResult;
          } else {
            return currentResult;
          }
        }
      }
      function applyToTokens(tokens) {
        return rules2.firstOf("infix", infixRules.map(function(infix) {
          return infix.rule;
        }))(tokens);
      }
      return {
        apply,
        untilExclusive,
        untilInclusive
      };
    }
    exports.infix = function(name, ruleBuilder) {
      function map(func) {
        return exports.infix(name, function(parser2) {
          var rule = ruleBuilder(parser2);
          return function(tokens) {
            var result = rule(tokens);
            return result.map(function(right) {
              return function(left, source) {
                return func(left, right, source);
              };
            });
          };
        });
      }
      return {
        name,
        ruleBuilder,
        map
      };
    };
    var lazyRule = function(ruleBuilder) {
      var rule;
      return function(input) {
        if (!rule) {
          rule = ruleBuilder();
        }
        return rule(input);
      };
    };
  })(bottomUp);
  return bottomUp;
}
var regexTokeniser = {};
var hasRequiredRegexTokeniser;
function requireRegexTokeniser() {
  if (hasRequiredRegexTokeniser) return regexTokeniser;
  hasRequiredRegexTokeniser = 1;
  var Token2 = requireToken();
  var StringSource2 = requireStringSource();
  regexTokeniser.RegexTokeniser = RegexTokeniser;
  function RegexTokeniser(rules2) {
    rules2 = rules2.map(function(rule) {
      return {
        name: rule.name,
        regex: new RegExp(rule.regex.source, "g")
      };
    });
    function tokenise(input, description) {
      var source = new StringSource2(input, description);
      var index = 0;
      var tokens = [];
      while (index < input.length) {
        var result = readNextToken(input, index, source);
        index = result.endIndex;
        tokens.push(result.token);
      }
      tokens.push(endToken(input, source));
      return tokens;
    }
    function readNextToken(string, startIndex, source) {
      for (var i = 0; i < rules2.length; i++) {
        var regex = rules2[i].regex;
        regex.lastIndex = startIndex;
        var result = regex.exec(string);
        if (result) {
          var endIndex = startIndex + result[0].length;
          if (result.index === startIndex && endIndex > startIndex) {
            var value = result[1];
            var token = new Token2(
              rules2[i].name,
              value,
              source.range(startIndex, endIndex)
            );
            return { token, endIndex };
          }
        }
      }
      var endIndex = startIndex + 1;
      var token = new Token2(
        "unrecognisedCharacter",
        string.substring(startIndex, endIndex),
        source.range(startIndex, endIndex)
      );
      return { token, endIndex };
    }
    function endToken(input, source) {
      return new Token2(
        "end",
        null,
        source.range(input.length, input.length)
      );
    }
    return {
      tokenise
    };
  }
  return regexTokeniser;
}
var hasRequiredLop;
function requireLop() {
  if (hasRequiredLop) return lop;
  hasRequiredLop = 1;
  lop.Parser = requireParser().Parser;
  lop.rules = requireRules();
  lop.errors = requireErrors();
  lop.results = requireParsingResults();
  lop.StringSource = requireStringSource();
  lop.Token = requireToken();
  lop.bottomUp = requireBottomUp();
  lop.RegexTokeniser = requireRegexTokeniser().RegexTokeniser;
  lop.rule = function(ruleBuilder) {
    var rule;
    return function(input) {
      if (!rule) {
        rule = ruleBuilder();
      }
      return rule(input);
    };
  };
  return lop;
}
export {
  requireLop as r
};
