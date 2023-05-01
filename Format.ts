import {ethers} from "ethers";
import trim from "./trim.js";
import { IFormat} from "./types";
const utils = ethers.utils ;
const BigNumber = ethers.BigNumber;


/**
 * * * you can separate the number string by hipen ex. 100-000 for 100000 
 * * **/
 
 
 class Format {
    _isFormat:boolean;
    inputValue:string|number; // value provided
    wei:string; // wei the smallest value
    fixed:string; // this is the whole value
    walletReady:string;
    moneyValue:string;
    separated:string;
    moneyValueSeparated:string;
    assetValue:string;
    decimals:number;
    constructor(str:string,decimals:number){
       const value:string = str.replaceAll(/-|,/g,"");
       this._isFormat = true;
       this.decimals = decimals ? decimals : 18 ;
       this.inputValue = value || 0 ;
       this.assetValue = "0";
       // from ethers to wie
       this.wei = utils.parseUnits(value,this.decimals).toString();
       // from wei to eth
       this.fixed = trim.removedot(utils.formatUnits(this.wei,this.decimals));
       const maxSplited = this.fixed.split(".");
       const  whole = maxSplited[0];
       if(maxSplited.length > 1){
          const dec =  trim(maxSplited[1],9);
          const moneyDec = dec || "00";
          this.walletReady = `${whole}.${dec}`;
          this.moneyValue = `${whole}.${trim(trim(moneyDec,2))}`;
          const biglocale = BigInt(whole).toLocaleString();
          this.separated = `${biglocale}${dec ? "." + trim(dec) : ""}`;
          this.moneyValueSeparated = `${biglocale}.${trim(moneyDec,2)}`;
       } else {
          this.walletReady = this.fixed;
          this.moneyValue = `${this.fixed}.00`
          const biglocale = BigInt(whole).toLocaleString();
          this.separated = biglocale ;
          this.moneyValueSeparated = `${biglocale}.00`
          
       }
    }
    // returns bigNumber of wie 
    BN(){
       return BigNumber.from(this.wei);
    }
    
    // return BigNumber of fixed;
    FixedBN(){
       return BigNumber.from(this.fixed);
    }
    
    
    toString(){
       return this.wei;
    }
    // use wie to get Format Object
    
    static get  Wei(){
       class FormatWie extends Format {
          constructor(value:string,dec:number){
             const parsedValue:string = value.replaceAll(/-|,/g,"");
             const wei:string =   utils.formatUnits(parsedValue,dec);
             super(wei,dec);
             this.inputValue = value;
          }
       }
       
       return FormatWie;
    }
    
    
    // to make format parsing of eth easier 
    static Factory(dec:number){
       // generating wie from ethers 
       function parse(number:any){
          if(typeof number === "string"){
             number = number.toString();
             number = number.replaceAll(/-|,/g,"");
             return  utils.parseUnits(number, dec || 18)
          } else if(number._isFormat){
             return number.BN();
          } else {
             return number;
          }
       }
       // return FormatClass from Ether
       parse.Format = function(number:string|number){
          const newFactory = new Format(number.toString(),dec || 18);
          newFactory.inputValue = number;
          return newFactory;
       }
       
       return parse
       
    }
    
    // gerters and setters
    set value(value:any){
       this.assetValue = value;
    }
    
    get value(){
       const __value = new Format(this.assetValue,2);
       const wei = BigInt(this.wei);
       const __valueWei = BigInt(__value.wei);
       const totalValue = wei * __valueWei;
       
       
       
       const totalValueFormatFixed = new Format.Wei(totalValue.toString(), this.decimals + 2).fixed;
       const totalValueFormat = new Format(totalValueFormatFixed,2)
       return totalValueFormat;
       
    }
    
 }
 
 
 
 
 export default Format;
 
 // methods 
 // Format.operationSupport => turning Format.wei to ethers.BigNumber ;
 // Format.operationSupport => turning Format.fixed to ethers.BigNumber;
 /**
  * * * Format.Wei => this will Format wie into new Format
  * * * ex Format.Wei(1000,3) => Format {
  * * decimals: 3,
  * * inputValue: '1',
  * * wei: '1000',
  * * fixed: '1',
  * * walletReady: '1',
  * * moneyValue: '1.00',
  * * separated: '1',
  * * moneyValueSeparated: '1.00'
  * * }
  * * **/
  
  /**
   * * * Format.Factory => will help you to make easier to parse number to use in transactions 
   * * *ex 
   * * * const factory = Format.Factory(3);
   * * *factory(1) => 1 and tree decimals == 1000
   * * * factory.Format(number) // format your factory
   * * * 
   * * **/
   
   
   
   
   