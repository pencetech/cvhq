"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.edEach = exports.expEach = void 0;
function expEach(context, options) {
    var ret = '';
    for (var i = 0, j = context.length; i < j; i++) {
        if (i === j - 1) {
            ret = ret + '<div class="job last">' + options.fn(context[i]) + '</div>';
        }
        else {
            ret = ret + '<div class="job">' + options.fn(context[i]) + '</div>';
        }
    }
    return ret;
}
exports.expEach = expEach;
function edEach(context, options) {
    var ret = '';
    for (var i = 0, j = context.length; i < j; i++) {
        ret = ret + options.fn(context[i]);
    }
    return ret;
}
exports.edEach = edEach;
