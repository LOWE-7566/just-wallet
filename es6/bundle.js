import { ethers } from 'ethers';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}

function trim(value, place) {
    value.replace(/^[0]+/g, "");
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

const utils = ethers.utils;
const BigNumber$1 = ethers.BigNumber;
class Format {
    constructor(str, decimals) {
        const value = str.replaceAll(/-|,/g, "");
        this.decimals = decimals ? decimals : 18;
        this.inputValue = value || 0;
        this.wei = utils.parseUnits(value, this.decimals).toString();
        this.fixed = trim.removedot(utils.formatUnits(this.wei, this.decimals));
        const maxSplited = this.fixed.split(".");
        const whole = maxSplited[0];
        if (maxSplited.length > 1) {
            const dec = trim(maxSplited[1], 9);
            this.walletReady = `${whole}.${dec}`;
            this.moneyValue = `${whole}.${trim(trim(dec, 2))}`;
            const biglocale = BigInt(whole).toLocaleString();
            this.separated = `${biglocale}.${trim(dec)}`;
            this.moneyValueSeparated = `${biglocale}.${trim(dec, 2)}`;
        }
        else {
            this.walletReady = this.fixed;
            this.moneyValue = `${this.fixed}.00`;
            const biglocale = BigInt(whole).toLocaleString();
            this.separated = biglocale;
            this.moneyValueSeparated = `${biglocale}.00`;
        }
    }
    operationSupport() {
        return BigNumber$1.from(this.wei);
    }
    parseOperationSupport(number) {
        this.decimals;
        return BigNumber$1.from(this.fixed);
    }
    static get Wei() {
        class FormatWie extends Format {
            constructor(value, dec) {
                const parsedValue = value.replaceAll(/-|,/g, "");
                const wei = utils.formatUnits(parsedValue, dec);
                super(wei, dec);
                this.inputValue = value;
            }
        }
        return FormatWie;
    }
    static Factory(dec) {
        function parse(number) {
            number = number.toString().replaceAll(/-|,/g, "");
            return utils.parseUnits(number, dec || 18);
        }
        parse.Format = function (number) {
            const newFactory = new Format(number.toString(), dec || 18);
            newFactory.inputValue = number;
            return newFactory;
        };
        return parse;
    }
}

class Transaction {
    constructor(value, dec) {
        this.amount = value;
        this.stringify = value.toString();
        this.eth = ethers.utils.formatUnits(value, dec).toString();
        this.wei = ethers.utils.parseUnits(this.eth, dec).toString();
        this.decimals = dec;
    }
}

var _TokenStaticGasFormat_estimatedGas, _TokenGasFormat_methods;
class TokenStaticGasFormat {
    constructor(tx, estimatedGas, dec) {
        _TokenStaticGasFormat_estimatedGas.set(this, void 0);
        __classPrivateFieldSet(this, _TokenStaticGasFormat_estimatedGas, estimatedGas, "f");
        this.estimatedGasInEther = ethers.utils.formatUnits(this.estimatedGas.toString(), dec).toString();
        this.estimatedGasInWei = ethers.utils.parseUnits(this.estimatedGasInEther, dec).toString();
        this.toSpend = tx.value.toString();
        this.toSpendEtherFormat = ethers.utils.formatUnits(this.toSpend, dec).toString();
        this.transactionInfo = tx;
        this.totalToken = ethers.utils.formatUnits(this.toSpend, dec).toString(),
            this.totalTokenWei = ethers.utils.parseUnits(ethers.utils.formatUnits(this.toSpend, dec).toString()).toString();
        this.totalEthers = ethers.utils.formatEther(this.estimatedGas.toString()).toString();
        this.totalWei = ethers.utils.parseEther(ethers.utils.formatEther(this.estimatedGas.toString()).toString()).toString();
    }
    get total() {
        return `${this.estimatedGas.toString()} ${this.toSpend}`;
    }
    get estimatedGas() {
        return __classPrivateFieldGet(this, _TokenStaticGasFormat_estimatedGas, "f");
    }
}
_TokenStaticGasFormat_estimatedGas = new WeakMap();
class TokenGasFormat extends TokenStaticGasFormat {
    constructor(tx, contract, estimatedGas, dec) {
        super(tx, estimatedGas, dec);
        _TokenGasFormat_methods.set(this, void 0);
        __classPrivateFieldSet(this, _TokenGasFormat_methods, contract, "f");
    }
    send() {
        const gas = this.estimatedGasInWei;
        const Gas = ethers.BigNumber.from(gas);
        const gasLimit = Gas.toString();
        const transactionInfo = this.transactionInfo;
        const methods = __classPrivateFieldGet(this, _TokenGasFormat_methods, "f");
        if (gas) {
            return new Promise((resolves, rejects) => {
                methods.transfer(transactionInfo.to, transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.value, { gasLimit: `${gasLimit}` }).then(function (res) {
                    res.Transaction = new Transaction(transactionInfo.value, 18);
                    resolves(res);
                })
                    .catch(function (err) { rejects(err); });
            });
        }
        else {
            return new Promise((resolves, rejects) => {
                const tx = transactionInfo;
                methods.transfer(tx.to, tx.value).then(function (res) {
                    res.Transaction = new Transaction(tx.value, 18);
                    resolves(res);
                })
                    .catch(function (err) { rejects(err); });
            });
        }
    }
    static get Static() {
        return TokenStaticGasFormat;
    }
}
_TokenGasFormat_methods = new WeakMap();

var _ERCTokenManeger_wallet, _ERCTokenManeger_contract;
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`;
class ERCTokenManeger {
    constructor(provider, wallet, address) {
        _ERCTokenManeger_wallet.set(this, void 0);
        _ERCTokenManeger_contract.set(this, void 0);
        __classPrivateFieldSet(this, _ERCTokenManeger_wallet, new ethers.Wallet(wallet.privateKey, provider), "f");
        __classPrivateFieldSet(this, _ERCTokenManeger_contract, new ethers.Contract(address, abi, __classPrivateFieldGet(this, _ERCTokenManeger_wallet, "f") || provider), "f");
        this.defaultMethods = {
            address: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").address,
            allowance: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").allowance,
            approve: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").approve,
            balanceOf: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").balanceOf,
            decimals: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals,
            name: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").name,
            symbol: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").symbol,
            totalSupply: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").totalSupply,
            getMetadata: () => __awaiter(this, void 0, void 0, function* () {
                const name = yield __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").name();
                const symbol = yield __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").symbol();
                const decimals = yield __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
                const totalSupply = yield __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").totalSupply();
                return { name, symbol, decimals, totalSupply };
            })
        };
    }
    get address() {
        return __classPrivateFieldGet(this, _ERCTokenManeger_wallet, "f").address;
    }
    get metadata() {
        return new Promise((resolve, reject) => {
            this.getMetadata().then((data) => {
                resolve(data);
            });
        });
    }
    get balance() {
        const address = __classPrivateFieldGet(this, _ERCTokenManeger_wallet, "f").address;
        const decimals = this.defaultMethods.decimals;
        const balanceOf = this.defaultMethods.balanceOf;
        return new Promise((resolve, reject) => {
            try {
                decimals().then((decimal) => {
                    balanceOf(address).then((bal) => resolve(new Format.Wei(bal.toString(), decimal.toString())));
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    send(amount, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const decimals = yield __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
            const factory = Format.Factory(parseInt(decimals));
            if (typeof amount === "object") {
                const config = amount;
                amount = factory(config.amount);
                to = config.to;
            }
            else {
                to = to;
                amount = factory(amount);
            }
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").transfer(to, amount).then((c) => {
                    const Transaction$1 = new Transaction(amount, decimals);
                    resolve(Object.assign(Object.assign({}, c), { Transaction: Transaction$1 }));
                }).catch((err) => reject(err));
            });
        });
    }
    estimateGas(amount, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const decimals = yield __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
            const factory = Format.Factory(parseInt(decimals));
            const tx = {
                to: to,
                value: factory(amount)
            };
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").estimateGas.transfer(tx.to, tx.value)
                    .then((res) => {
                    resolve(new TokenGasFormat.Static(tx, res, decimals));
                });
            });
        });
    }
    estimateBeforeSend(amount, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const decimals = yield __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
            const factory = Format.Factory(parseInt(decimals));
            const tx = {
                to: to,
                value: factory(amount)
            };
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").estimateGas.transfer(tx.to, tx.value)
                    .then((res) => {
                    resolve(new TokenGasFormat(tx, this.defaultMethods, res, decimals));
                });
            });
        });
    }
}
_ERCTokenManeger_wallet = new WeakMap(), _ERCTokenManeger_contract = new WeakMap();

var _StaticGasFormat_estimatedGas, _GasFormat_Wallet;
const BigNumber = ethers.BigNumber;
class StaticGasFormat {
    constructor(tx, estimatedGas) {
        _StaticGasFormat_estimatedGas.set(this, void 0);
        __classPrivateFieldSet(this, _StaticGasFormat_estimatedGas, estimatedGas, "f");
        this.estimatedGasInEther = ethers.utils.formatEther(__classPrivateFieldGet(this, _StaticGasFormat_estimatedGas, "f").toString()).toString();
        this.estimatedGasInWei = ethers.utils.parseEther(this.estimatedGasInEther).toString();
        this.toSpend = tx.value.toString();
        this.transactionInfo = tx;
        this.totalEthers = ethers.utils.formatEther(this.total.toString());
        this.totalWei = this.total.toString();
    }
    get total() {
        return BigNumber.from(this.estimatedGas).add(this.toSpend).toString();
    }
    get estimatedGas() {
        return __classPrivateFieldGet(this, _StaticGasFormat_estimatedGas, "f");
    }
}
_StaticGasFormat_estimatedGas = new WeakMap();
class GasFormat extends StaticGasFormat {
    constructor(tx, estimatedGas, wallet) {
        super(tx, estimatedGas);
        _GasFormat_Wallet.set(this, void 0);
        __classPrivateFieldSet(this, _GasFormat_Wallet, wallet, "f");
    }
    send() {
        const tx = this.transactionInfo;
        tx.gasLimit = BigNumber.from(this.estimatedGasInWei);
        const Wallet = __classPrivateFieldGet(this, _GasFormat_Wallet, "f");
        return new Promise((resolves, rejects) => {
            Wallet.sendTransaction(tx).then((res) => {
                res.Transaction = new Transaction(tx.value, 18);
                resolves(res);
            })
                .catch((err) => rejects(err));
        });
    }
    static get Static() {
        return StaticGasFormat;
    }
}
_GasFormat_Wallet = new WeakMap();

const JsonRpcProvider = ethers.providers.JsonRpcProvider;
class Provider extends JsonRpcProvider {
    constructor(provider) {
        super(provider);
    }
}

ethers.Wallet;
const EthContract$1 = ethers.ContractFactory;
class ContractDeployer extends EthContract$1 {
    constructor(abi, bin, signer) {
        super(abi, bin, signer);
    }
    get Deploy() {
        return this.deploy;
    }
}

var _Contract_contract;
const EthContract = ethers.Contract;
class Contract {
    constructor(address, abi, signer) {
        _Contract_contract.set(this, void 0);
        const contract = new EthContract(address, abi, signer);
        __classPrivateFieldSet(this, _Contract_contract, contract, "f");
        const Keys = Object.keys(contract);
        Keys.forEach((key) => {
            const value = contract[key];
            if (key != "signer") {
                this[key] = value;
            }
        });
        this.interface = contract.interface;
        this.signer = new Wallet$1(signer.provider || signer, signer.privateKey);
        this.callStatic = contract.callStatic;
        this.estimateGas = contract.estimateGas;
        this.functions = contract.functions;
        this.populate = contract.populateTransaction;
        this.filters = contract.filters;
        this._runningEvents = contract._runningEvents;
        this._wrappedEmits = contract._wrappedEmits;
        this.address = contract.address;
        this.resolvedAddress = contract.resolvedAddress;
        const keys = Object.keys(contract.functions);
        this.call = {};
        for (var i = 0; i < keys.length; i++) {
            contract.functions;
            const key = keys[i];
            this.call[key] = contract[key];
        }
    }
    static get Deployer() {
        return ContractDeployer;
    }
}
_Contract_contract = new WeakMap();

var _Wallet_mnemonic;
const privatekeyRegExp = /^0x[0-9a-fA-F]/g;
class Wallet {
    constructor(wallet, provider) {
        _Wallet_mnemonic.set(this, void 0);
        if (wallet === undefined) {
            console.log(wallet);
            throw new Error("Wallet is Emty");
        }
        this.Wallet = wallet;
        const walletLength = 66;
        provider = new Provider(provider || `http://localhost:8545`);
        this.provider = provider;
        this.decimals = 18;
        if (typeof wallet === "string") {
            const isPrivate = wallet.match(privatekeyRegExp);
            const isValidPrivateKey = !!isPrivate;
            if (isValidPrivateKey && (wallet === null || wallet === void 0 ? void 0 : wallet.length) === walletLength) {
                this.Wallet = new ethers.Wallet(wallet, provider);
            }
            else {
                this.Wallet = ethers.Wallet.fromMnemonic(wallet);
                __classPrivateFieldSet(this, _Wallet_mnemonic, wallet, "f");
            }
        }
        else {
            this.Wallet = wallet;
        }
    }
    get address() {
        return this.Wallet.address;
    }
    get privateKey() {
        return this.Wallet.privateKey;
    }
    get balance() {
        return new Promise((resolve, reject) => {
            this.provider.getBalance(this.address).then((bal) => {
                resolve(new Format.Wei(bal.toString(), 18));
            });
        });
    }
    send(amount, to) {
        return new Promise((resolve, reject) => {
            const factory = Format.Factory(this.decimals);
            var tx = {};
            if (typeof amount === "object") {
                amount.amount = factory(amount);
                tx.to = amount.to;
            }
            else {
                tx.to = to;
                tx.value = factory(amount);
            }
            this.Wallet.sendTransaction(tx).then((result) => {
                result.Transaction = new Transaction(tx.value, 18);
                resolve(result);
            })
                .catch((err) => reject(err));
        });
    }
    estimateBeforeSend(amount, to) {
        const wallet = this.Wallet;
        return new Promise((resolve, reject) => {
            const factory = Format.Factory(18);
            const tx = {
                to: to,
                value: factory(amount)
            };
            this.Wallet.estimateGas(tx).then((c) => {
                const estimatedGas = new Promise((resolve1, reject1) => {
                    resolve1(new GasFormat(tx, c, wallet));
                });
                resolve(estimatedGas);
            });
        });
    }
    estimateGas(amount, to) {
        const factory = Format.Factory(this.decimals);
        const tx = {
            to: to,
            value: factory(amount)
        };
        return new Promise((resolve, reject) => {
            this.Wallet.estimateGas(tx).then((res) => {
                resolve(new GasFormat.Static(tx, res));
            });
        });
    }
    Token(addr) {
        return new ERCTokenManeger(this.provider, this.Wallet, addr);
    }
    static get Contract() {
        return Contract;
    }
    static get Format() {
        return Format;
    }
}
_Wallet_mnemonic = new WeakMap();
var Wallet$1 = Wallet;

export { Wallet, Wallet$1 as default };
