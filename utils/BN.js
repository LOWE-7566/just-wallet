"use strict";
exports.__esModule = true;
var ethers_1 = require("ethers");
function BN(numberAsString) {
    return ethers_1.BigNumber.from(numberAsString);
}
exports["default"] = BN;
