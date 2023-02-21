"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function trim(value, place) {
    const removalLeading0 = value.replace(/^[0]+/g, "");
    const where = place || value.length;
    if (value.length <= where) {
        return value;
    }
    const trimmed = value.slice(0, place);
    return removedot(trimmed);
}
function removedot(value) {
    const lastIndex = /\.+$|.0+$/g;
    return value.replace(lastIndex, "");
}
function addZero(value) {
    const lastIndex = /\.$/g;
    return value.replace(lastIndex, "");
}
trim.removedot = removedot;
trim.addZero = addZero;
exports.default = trim;
