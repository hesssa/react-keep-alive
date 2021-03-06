"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var IdentificationContext_1 = __importDefault(require("../contexts/IdentificationContext"));
var getDisplayName_1 = __importDefault(require("./getDisplayName"));
exports.withIdentificationContextConsumerDisplayName = 'withIdentificationContextConsumer';
function withIdentificationContextConsumer(Component) {
    var WithIdentificationContextConsumer = function (props) { return (React.createElement(IdentificationContext_1.default.Consumer, null, function (contextProps) { return React.createElement(Component, __assign({ _identificationContextProps: contextProps }, props)); })); };
    WithIdentificationContextConsumer.displayName = exports.withIdentificationContextConsumerDisplayName + "(" + getDisplayName_1.default(Component) + ")";
    return WithIdentificationContextConsumer;
}
exports.default = withIdentificationContextConsumer;
