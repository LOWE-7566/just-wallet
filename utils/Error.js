"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
exports.ExecutionError = exports.ArgurmentError = exports.ErrorLogger = void 0;
var ErrorLogger = /** @class */ (function (_super) {
    __extends(ErrorLogger, _super);
    function ErrorLogger(code, message, data, suggest) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this._isError = true;
        _this.data = data;
        _this.suggestion = suggest || undefined;
        return _this;
    }
    return ErrorLogger;
}(Error));
exports.ErrorLogger = ErrorLogger;
// ArgurmentError is an error for wrong arguements 
var ArgurmentError = /** @class */ (function (_super) {
    __extends(ArgurmentError, _super);
    function ArgurmentError(ofInstance, data, parameter, value, required, suggest) {
        var _this = this;
        var code = "NOT_VALID_ARGS";
        var message = "Invalid arguments provided in ".concat(ofInstance, ".");
        var addData = data ? __assign({ parameter: parameter, value: value, required: required }, data) : { parameter: parameter, value: value, required: required };
        _this = _super.call(this, code, message, addData, suggest) || this;
        _this.message = message;
        return _this;
    }
    return ArgurmentError;
}(ErrorLogger));
exports.ArgurmentError = ArgurmentError;
// this error is called whenever when executing something throws into Error
var ExecutionError = /** @class */ (function (_super) {
    __extends(ExecutionError, _super);
    function ExecutionError(calling, data, suggest) {
        var message = "Error occured in running ".concat(calling);
        var code = "EXECUTION_ERROR";
        return _super.call(this, code, message, data, suggest) || this;
    }
    return ExecutionError;
}(ErrorLogger));
exports.ExecutionError = ExecutionError;
exports["default"] = ErrorLogger;
