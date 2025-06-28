var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
(function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var pathStack = [];
    pathStack.push(location.href);
    var getCurrentPath = function () { var _a; return (_a = pathStack[pathStack.length - 1]) !== null && _a !== void 0 ? _a : location.href; };
    var loadScript = function (src) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var script = document.createElement("script");
                    script.src = src;
                    script.onload = function () { return resolve(); };
                    script.onerror = reject;
                    document.head.appendChild(script);
                })];
        });
    }); };
    var loadJsonRaw = function (src) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open('GET', src, true);
                    request.onreadystatechange = function () {
                        if (4 === request.readyState) {
                            if (200 <= request.status && request.status < 300) {
                                try {
                                    resolve(JSON.parse(request.responseText));
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            else {
                                reject(request);
                            }
                        }
                    };
                    request.send(null);
                })];
        });
    }); };
    var makeAbsoluteUrl = function (base, url) {
        var baseParts = base.split("?")[0].split("/");
        if (4 <= baseParts.length && "" !== baseParts[baseParts.length - 1]) {
            // ファイル名部分の除去
            baseParts = baseParts.slice(0, -1);
        }
        if (4 <= baseParts.length && "" === baseParts[baseParts.length - 1]) {
            // 末尾の空要素を除去(しておかないと結合時に余分に / が挟まる)
            baseParts = baseParts.slice(0, -1);
        }
        var urlParts = url.split("/");
        if (0 <= urlParts[0].indexOf(":")) {
            //  絶対パスなので base 側は全て破棄
            baseParts = [];
        }
        else {
            if ("" === urlParts[0]) {
                urlParts = urlParts.slice(1);
                if ("" === urlParts[0]) {
                    //  プロトコルだけ利用
                    baseParts = baseParts.slice(0, 1);
                }
                else {
                    //  サーバー名まで利用
                    baseParts = baseParts.slice(0, 3);
                }
            }
            else {
                while (true) {
                    if ("." === urlParts[0]) {
                        urlParts = urlParts.slice(1);
                        continue;
                    }
                    if (".." === urlParts[0]) {
                        urlParts = urlParts.slice(1);
                        if (4 <= baseParts.length) {
                            baseParts = baseParts.slice(0, -1);
                        }
                        continue;
                    }
                    break;
                }
            }
        }
        return baseParts.concat(urlParts).join("/");
    };
    var evil = {
        unresolved: [],
        modules: {},
        mapping: {},
        module: {
            registerMapping: function (path, mapping) { return mapping.forEach(function (i) { return evil.mapping[i] = path; }); },
            load: function (path, mapping) { return __awaiter(_this, void 0, void 0, function () {
                var absolutePath, result, _a, _b, absolutePath, result;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!/\.json(\?.*)?$/i.test(path)) return [3 /*break*/, 2];
                            if (mapping) {
                                evil.module.registerMapping(path, mapping);
                            }
                            absolutePath = makeAbsoluteUrl(getCurrentPath(), resolveMapping(path));
                            if (config.log.load) {
                                console.log("evil-commonjs: load(\"".concat(absolutePath, "\", ").concat(JSON.stringify(mapping), ")"));
                            }
                            _a = evil.modules;
                            _b = absolutePath;
                            return [4 /*yield*/, loadJsonRaw(absolutePath)];
                        case 1:
                            result = _a[_b] = _c.sent();
                            window.module.pauseCapture();
                            return [2 /*return*/, result];
                        case 2:
                            absolutePath = makeAbsoluteUrl(getCurrentPath(), resolveMapping(path));
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, , 5, 6]);
                            pathStack.push(absolutePath);
                            window.module.readyToCapture(absolutePath);
                            if (config.log.load) {
                                console.log("evil-commonjs: load(\"".concat(absolutePath, "\", ").concat(JSON.stringify(mapping), ")"));
                            }
                            return [4 /*yield*/, loadScript(absolutePath)];
                        case 4:
                            _c.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            pathStack.pop();
                            return [7 /*endfinally*/];
                        case 6:
                            result = evil.module.capture(path, mapping);
                            return [2 /*return*/, result];
                    }
                });
            }); },
            sequentialLoad: function (map) { return __awaiter(_this, void 0, void 0, function () {
                var result, _a, _b, _c, _i, i, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            result = [];
                            _a = map;
                            _b = [];
                            for (_c in _a)
                                _b.push(_c);
                            _i = 0;
                            _f.label = 1;
                        case 1:
                            if (!(_i < _b.length)) return [3 /*break*/, 4];
                            _c = _b[_i];
                            if (!(_c in _a)) return [3 /*break*/, 3];
                            i = _c;
                            _e = (_d = result).push;
                            return [4 /*yield*/, evil.module.load(map[i].path, map[i].mapping)];
                        case 2:
                            _e.apply(_d, [_f.sent()]);
                            _f.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, result];
                    }
                });
            }); },
            capture: function (path, mapping) {
                if (mapping) {
                    evil.module.registerMapping(path, mapping);
                }
                var absolutePath = makeAbsoluteUrl(getCurrentPath(), resolveMapping(path));
                window.module.exports.default = window.module.exports.default || window.module.exports;
                var result = evil.modules[absolutePath] = window.module.exports;
                window.module.pauseCapture();
                evil.unresolved = evil.unresolved.filter(function (i) { return i !== absolutePath; });
                return result;
            },
            readyToCapture: function (path) {
                if (config.log.readyToCapture) {
                    console.log("readyToCapture(\"".concat(path, "\")"));
                }
                window.module.exports = window.exports = {};
                if (path) {
                    var absolutePath = makeAbsoluteUrl(getCurrentPath(), resolveMapping(path));
                    if (evil.modules[absolutePath]) {
                        window.module.exports = window.exports = evil.modules[absolutePath];
                    }
                }
            },
            pauseCapture: function () { return window.exports = undefined; },
            exports: {},
        },
    };
    var resolveMapping = function (path) {
        return evil.mapping[path] || path;
    };
    //const gThis = globalThis;
    var gThis = ((_a = self !== null && self !== void 0 ? self : window) !== null && _a !== void 0 ? _a : global);
    try {
        evilCommonjsConfig;
    }
    catch (_l) {
        evilCommonjsConfig = undefined;
    }
    var config = {
        log: {
            config: true === ((_b = evilCommonjsConfig === null || evilCommonjsConfig === void 0 ? void 0 : evilCommonjsConfig.log) === null || _b === void 0 ? void 0 : _b.config),
            load: false !== ((_c = evilCommonjsConfig === null || evilCommonjsConfig === void 0 ? void 0 : evilCommonjsConfig.log) === null || _c === void 0 ? void 0 : _c.load),
            define: false !== ((_d = evilCommonjsConfig === null || evilCommonjsConfig === void 0 ? void 0 : evilCommonjsConfig.log) === null || _d === void 0 ? void 0 : _d.define),
            readyToCapture: false !== ((_e = evilCommonjsConfig === null || evilCommonjsConfig === void 0 ? void 0 : evilCommonjsConfig.log) === null || _e === void 0 ? void 0 : _e.readyToCapture),
            results: true === ((_f = evilCommonjsConfig === null || evilCommonjsConfig === void 0 ? void 0 : evilCommonjsConfig.log) === null || _f === void 0 ? void 0 : _f.results),
        },
        loadingTimeout: "number" === typeof (evilCommonjsConfig === null || evilCommonjsConfig === void 0 ? void 0 : evilCommonjsConfig.loadingTimeout) ? evilCommonjsConfig.loadingTimeout : 1500,
    };
    try {
        var urlConfig = (_k = (_j = (_h = (_g = location.href
            .split("#")[0]
            .split("?")[1]) === null || _g === void 0 ? void 0 : _g.split("&")) === null || _h === void 0 ? void 0 : _h.filter(function (i) { return i.startsWith("evil-commonjs="); })) === null || _j === void 0 ? void 0 : _j.map(function (i) { return JSON.parse(decodeURIComponent(i.substring("evil-commonjs=".length))); })) === null || _k === void 0 ? void 0 : _k[0];
        if (urlConfig) {
            if ("object" === typeof urlConfig) {
                if ("log" in urlConfig) {
                    if ("object" === typeof urlConfig["log"]) {
                        var urlConfigLog = urlConfig["log"];
                        if ("config" in urlConfigLog && "boolean" === typeof urlConfigLog["config"]) {
                            config.log.config = urlConfigLog["config"];
                        }
                        if ("load" in urlConfigLog && "boolean" === typeof urlConfigLog["load"]) {
                            config.log.load = urlConfigLog["load"];
                        }
                        if ("define" in urlConfigLog && "boolean" === typeof urlConfigLog["define"]) {
                            config.log.define = urlConfigLog["define"];
                        }
                        if ("results" in urlConfigLog && "boolean" === typeof urlConfigLog["results"]) {
                            config.log.results = urlConfigLog["results"];
                        }
                    }
                }
                if ("loadingTimeout" in urlConfig && "number" === typeof urlConfig["loadingTimeout"]) {
                    config.loadingTimeout = urlConfig["loadingTimeout"];
                }
            }
        }
    }
    catch (err) {
        console.error(err);
    }
    if (config.log.config) {
        console.log("evil-commonjs: evilCommonjsConfig: ".concat(JSON.stringify(config)));
    }
    gThis.require = function (path) {
        var _a;
        switch (path) {
            case "require":
                return window.require;
            case "exports":
                return evil.module.exports;
            default:
                var absolutePath = makeAbsoluteUrl(getCurrentPath(), resolveMapping(path));
                var result = (_a = evil.modules[absolutePath]) !== null && _a !== void 0 ? _a : evil.modules[path];
                if (!result) {
                    result = evil.modules[absolutePath] = {};
                    evil.unresolved.push(absolutePath);
                }
                return result;
        }
    };
    gThis.define = function (path, requires, content) {
        var absolutePath = makeAbsoluteUrl(getCurrentPath(), resolveMapping(path));
        if (evil.modules[absolutePath]) {
            if (config.log.define) {
                console.log("evil-commonjs: \"".concat(absolutePath, "\" is already defined!"));
            }
        }
        else {
            if (config.log.define) {
                console.log("evil-commonjs: define(\"".concat(absolutePath, "\", ").concat(JSON.stringify(requires), ", ...)"));
            }
            if (/\.json(\?.*)?$/i.test(path) || "function" !== typeof content) {
                return evil.modules[absolutePath] = content;
            }
            else {
                evil.module.readyToCapture(absolutePath);
                content.apply(null, requires.map(function (i) { return gThis.require(i); }));
                evil.module.capture(absolutePath);
            }
        }
    };
    setTimeout(function () {
        if (0 < evil.unresolved.length) {
            console.error("evil-commonjs: unresoled modules: ".concat(JSON.stringify(evil.unresolved)));
            // console.error(`"${path}" is not found! require() of evil-commonjs need to load() in advance.`);
            console.error("evil-commonjs: module mapping: ".concat(JSON.stringify(evil.mapping)));
            console.error("evil-commonjs: loaded modules: ".concat(JSON.stringify(Object.keys(evil.modules))));
            console.error(evil.modules);
        }
        else {
            if (config.log.results) {
                console.log("evil-commonjs: everything is OK!");
                console.log("evil-commonjs: module mapping: ".concat(JSON.stringify(evil.mapping)));
                console.log("evil-commonjs: loaded modules: ".concat(JSON.stringify(Object.keys(evil.modules))));
                console.log(evil.modules);
            }
        }
    }, config.loadingTimeout);
    window.module = evil.module;
})();
//# sourceMappingURL=index.js.map