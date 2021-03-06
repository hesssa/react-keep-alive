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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import noop from './noop';
import { warn } from './debug';
import { COMMAND } from './keepAliveDecorator';
import withIdentificationContextConsumer from './withIdentificationContextConsumer';
import getDisplayName from './getDisplayName';
export var bindLifecycleTypeName = '$$bindLifecycle';
export default function bindLifecycle(Component) {
    var WrappedComponent = Component.WrappedComponent || Component.wrappedComponent || Component;
    var _a = WrappedComponent.prototype, _b = _a.componentDidMount, componentDidMount = _b === void 0 ? noop : _b, _c = _a.componentDidUpdate, componentDidUpdate = _c === void 0 ? noop : _c, _d = _a.componentDidActivate, componentDidActivate = _d === void 0 ? noop : _d, _e = _a.componentWillUnactivate, componentWillUnactivate = _e === void 0 ? noop : _e, _f = _a.componentWillUnmount, componentWillUnmount = _f === void 0 ? noop : _f, _g = _a.shouldComponentUpdate, shouldComponentUpdate = _g === void 0 ? noop : _g;
    WrappedComponent.prototype.componentDidMount = function () {
        var _this = this;
        componentDidMount.call(this);
        this._needActivate = false;
        var _a = this.props, _b = _a._container, identification = _b.identification, eventEmitter = _b.eventEmitter, activated = _b.activated, keepAlive = _a.keepAlive;
        // Determine whether to execute the componentDidActivate life cycle of the current component based on the activation state of the KeepAlive components
        if (!activated && keepAlive !== false) {
            componentDidActivate.call(this);
        }
        eventEmitter.on([identification, COMMAND.ACTIVATE], this._bindActivate = function () { return _this._needActivate = true; }, true);
        eventEmitter.on([identification, COMMAND.UNACTIVATE], this._bindUnactivate = function () {
            componentWillUnactivate.call(_this);
            _this._unmounted = false;
        }, true);
        eventEmitter.on([identification, COMMAND.UNMOUNT], this._bindUnmount = function () {
            componentWillUnmount.call(_this);
            _this._unmounted = true;
        }, true);
    };
    // In order to be able to re-update after transferring the DOM, we need to block the first update.
    WrappedComponent.prototype.shouldComponentUpdate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._needActivate) {
            this.forceUpdate();
            return false;
        }
        return shouldComponentUpdate.call.apply(shouldComponentUpdate, [this].concat(args)) || true;
    };
    WrappedComponent.prototype.componentDidUpdate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        componentDidUpdate.call.apply(componentDidUpdate, [this].concat(args));
        if (this._needActivate) {
            this._needActivate = false;
            componentDidActivate.call(this);
        }
    };
    WrappedComponent.prototype.componentWillUnmount = function () {
        if (!this._unmounted) {
            componentWillUnmount.call(this);
        }
        var _a = this.props._container, identification = _a.identification, eventEmitter = _a.eventEmitter;
        eventEmitter.off([identification, COMMAND.ACTIVATE], this._bindActivate);
        eventEmitter.off([identification, COMMAND.UNACTIVATE], this._bindUnactivate);
        eventEmitter.off([identification, COMMAND.UNMOUNT], this._bindUnmount);
    };
    var BindLifecycleHOC = withIdentificationContextConsumer(function (_a) {
        var forwardRef = _a.forwardRef, _b = _a._identificationContextProps, identification = _b.identification, eventEmitter = _b.eventEmitter, activated = _b.activated, keepAlive = _b.keepAlive, extra = _b.extra, wrapperProps = __rest(_a, ["forwardRef", "_identificationContextProps"]);
        if (!identification) {
            warn('[React Keep Alive] You should not use bindLifecycle outside a <KeepAlive>.');
            return null;
        }
        return (React.createElement(Component, __assign({}, extra, wrapperProps, { ref: forwardRef || noop, _container: {
                identification: identification,
                eventEmitter: eventEmitter,
                activated: activated,
                keepAlive: keepAlive,
            } })));
    });
    var BindLifecycle = React.forwardRef(function (props, ref) { return (React.createElement(BindLifecycleHOC, __assign({}, props, { forwardRef: ref }))); });
    BindLifecycle.WrappedComponent = WrappedComponent;
    BindLifecycle.displayName = bindLifecycleTypeName + "(" + getDisplayName(Component) + ")";
    return hoistNonReactStatics(BindLifecycle, Component);
}
