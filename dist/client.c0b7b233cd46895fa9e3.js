/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/Polybius.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/chrome-promise/chrome-promise.js":
/*!*******************************************************!*\
  !*** ./node_modules/chrome-promise/chrome-promise.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*!\n * chrome-promise\n * https://github.com/tfoxy/chrome-promise\n *\n * Copyright 2015 Tomás Fox\n * Released under the MIT license\n */\n\n(function(root, factory) {\n  if (true) {\n    // Node. Does not work with strict CommonJS, but\n    // only CommonJS-like environments that support module.exports,\n    // like Node.\n    module.exports = factory(this);\n  } else { var name, script; }\n}(typeof self !== 'undefined' ? self : this, function(root) {\n  'use strict';\n  var slice = Array.prototype.slice,\n      hasOwnProperty = Object.prototype.hasOwnProperty;\n\n  // Temporary hacky fix to make TypeScript `import` work\n  ChromePromise.default = ChromePromise;\n\n  return ChromePromise;\n\n  ////////////////\n\n  function ChromePromise(options) {\n    options = options || {};\n    var chrome = options.chrome || root.chrome;\n    var Promise = options.Promise || root.Promise;\n    var runtime = chrome.runtime;\n    var self = this;\n    if (!self) throw new Error('ChromePromise must be called with new keyword');\n\n    fillProperties(chrome, self);\n\n    if (chrome.permissions) {\n      chrome.permissions.onAdded.addListener(permissionsAddedListener);\n    }\n\n    ////////////////\n\n    function setPromiseFunction(fn, thisArg) {\n\n      return function() {\n        var args = slice.call(arguments);\n\n        return new Promise(function(resolve, reject) {\n          args.push(callback);\n\n          fn.apply(thisArg, args);\n\n          function callback() {\n            var err = runtime.lastError;\n            var results = slice.call(arguments);\n            if (err) {\n              reject(err);\n            } else {\n              switch (results.length) {\n                case 0:\n                  resolve();\n                  break;\n                case 1:\n                  resolve(results[0]);\n                  break;\n                default:\n                  resolve(results);\n              }\n            }\n          }\n        });\n\n      };\n\n    }\n\n    function fillProperties(source, target) {\n      for (var key in source) {\n        if (hasOwnProperty.call(source, key)) {\n          var val = source[key];\n          var type = typeof val;\n\n          if (type === 'object' && !(val instanceof ChromePromise)) {\n            target[key] = {};\n            fillProperties(val, target[key]);\n          } else if (type === 'function') {\n            target[key] = setPromiseFunction(val, source);\n          } else {\n            target[key] = val;\n          }\n        }\n      }\n    }\n\n    function permissionsAddedListener(perms) {\n      if (perms.permissions && perms.permissions.length) {\n        var approvedPerms = {};\n        perms.permissions.forEach(function(permission) {\n          var api = /^[^.]+/.exec(permission);\n          if (api in chrome) {\n            approvedPerms[api] = chrome[api];\n          }\n        });\n        fillProperties(approvedPerms, self);\n      }\n    }\n  }\n}));\n\n\n//# sourceURL=webpack:///./node_modules/chrome-promise/chrome-promise.js?");

/***/ }),

/***/ "./node_modules/chrome-promise/index.js":
/*!**********************************************!*\
  !*** ./node_modules/chrome-promise/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ChromePromise = __webpack_require__(/*! ./chrome-promise */ \"./node_modules/chrome-promise/chrome-promise.js\");\n\nvar chromep = new ChromePromise();\n// Temporary hacky fix to make TypeScript `import` work\nchromep.default = chromep;\n\nmodule.exports = chromep;\n\n\n//# sourceURL=webpack:///./node_modules/chrome-promise/index.js?");

/***/ }),

/***/ "./src/ts/Polybius.ts":
/*!****************************!*\
  !*** ./src/ts/Polybius.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst chrome_promise_1 = __webpack_require__(/*! chrome-promise */ \"./node_modules/chrome-promise/index.js\");\nfunction matches(rule, item) {\n    if (rule.matcher == \"js\") {\n        return eval(rule.match_param);\n    }\n    if (rule.matcher == \"hostname\") {\n        const link = document.createElement(\"a\");\n        link.href = item.url.toLowerCase();\n        const host = (rule.match_param.indexOf(\":\") < 0) ? link.hostname : link.host;\n        return (host.indexOf(rule.match_param.toLowerCase()) ==\n            (host.length - rule.match_param.length));\n    }\n    if (rule.matcher == \"default\") {\n        return item.filename == rule.match_param;\n    }\n    if (rule.matcher == \"url-regex\") {\n        return (new RegExp(rule.match_param)).test(item.url);\n    }\n    if (rule.matcher == \"default-regex\") {\n        return (new RegExp(rule.match_param)).test(item.filename);\n    }\n    return false;\n}\nchrome_promise_1.default.downloads.onDeterminingFilename.addListener(function (item, __suggest) {\n    function suggest(filename, conflictAction) {\n        __suggest({\n            filename: filename,\n            conflictAction: conflictAction,\n        });\n        // conflict_action was renamed to conflictAction in\n        // https://chromium.googlesource.com/chromium/src/+/f1d784d6938b8fe8e0d257e41b26341992c2552c\n        // which was first picked up in branch 1580.\n    }\n    let rules = localStorage.rules;\n    try {\n        rules = JSON.parse(rules);\n    }\n    catch (e) {\n        localStorage.rules = JSON.stringify([]);\n    }\n    for (let index = 0; index < rules.length; ++index) {\n        const rule = rules[index];\n        if (rule.enabled && matches(rule, item)) {\n            if (rule.action == \"overwrite\") {\n                suggest(item.filename, \"overwrite\");\n            }\n            else if (rule.action == \"prompt\") {\n                suggest(item.filename, \"prompt\");\n            }\n            else if (rule.action == \"js\") {\n                eval(rule.action_js);\n            }\n            break;\n        }\n    }\n});\nconst Rule = function (data) {\n    var rules = document.getElementById(\"rules\");\n    this.node = document.getElementById(\"rule-template\").cloneNode(true);\n    this.node.id = \"rule\" + (Rule.next_id++);\n    this.node.rule = this;\n    rules.appendChild(this.node);\n    this.node.hidden = false;\n    if (data) {\n        this.getElement(\"matcher\").value = data.matcher;\n        this.getElement(\"match-param\").value = data.match_param;\n        this.getElement(\"action\").value = data.action;\n        this.getElement(\"action-js\").value = data.action_js;\n        this.getElement(\"enabled\").checked = data.enabled;\n    }\n    this.getElement(\"enabled-label\").htmlFor = this.getElement(\"enabled\").id =\n        this.node.id + \"-enabled\";\n    this.render();\n    this.getElement(\"matcher\").onchange = storeRules;\n    this.getElement(\"match-param\").onkeyup = storeRules;\n    this.getElement(\"action\").onchange = storeRules;\n    this.getElement(\"action-js\").onkeyup = storeRules;\n    this.getElement(\"enabled\").onchange = storeRules;\n    var rule = this;\n    this.getElement(\"move-up\").onclick = function () {\n        var sib = rule.node.previousSibling;\n        rule.node.parentNode.removeChild(rule.node);\n        sib.parentNode.insertBefore(rule.node, sib);\n        storeRules();\n    };\n    this.getElement(\"move-down\").onclick = function () {\n        var parentNode = rule.node.parentNode;\n        var sib = rule.node.nextSibling.nextSibling;\n        parentNode.removeChild(rule.node);\n        if (sib) {\n            parentNode.insertBefore(rule.node, sib);\n        }\n        else {\n            parentNode.appendChild(rule.node);\n        }\n        storeRules();\n    };\n    this.getElement(\"remove\").onclick = function () {\n        rule.node.parentNode.removeChild(rule.node);\n        storeRules();\n    };\n    storeRules();\n};\nRule.prototype.getElement = function (name) {\n    return document.querySelector(\"#\" + this.node.id + \" .\" + name);\n};\nRule.prototype.render = function () {\n    this.getElement(\"move-up\").disabled = !this.node.previousSibling;\n    this.getElement(\"move-down\").disabled = !this.node.nextSibling;\n    this.getElement(\"action-js\").style.display =\n        (this.getElement(\"action\").value == \"js\") ? \"block\" : \"none\";\n};\nRule.next_id = 0;\nfunction loadRules() {\n    var rules = localStorage.rules;\n    try {\n        JSON.parse(rules).forEach(function (rule) {\n            new Rule(rule);\n        });\n    }\n    catch (e) {\n        localStorage.rules = JSON.stringify([]);\n    }\n}\nfunction storeRules() {\n    const rules = document.getElementById(\"rules\");\n    if (rules) {\n        localStorage.rules = JSON.stringify(Array.prototype.slice.apply(rules.childNodes).map(function (node) {\n            node.rule.render();\n            return {\n                matcher: node.rule.getElement(\"matcher\").value,\n                match_param: node.rule.getElement(\"match-param\").value,\n                action: node.rule.getElement(\"action\").value,\n                action_js: node.rule.getElement(\"action-js\").value,\n                enabled: node.rule.getElement(\"enabled\").checked\n            };\n        }));\n    }\n}\nwindow.onload = function () {\n    loadRules();\n    const addRule = document.getElementById(\"new\");\n    if (addRule) {\n        addRule.onclick = function () {\n            new Rule();\n        };\n    }\n};\nconst main = function () {\n};\nmain();\n\n\n//# sourceURL=webpack:///./src/ts/Polybius.ts?");

/***/ })

/******/ });