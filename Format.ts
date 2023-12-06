import {ethers} from "ethers";
import trim from "./trim.js";
import { IFormat} from "./types";
const utils = ethers.utils ;
const BigNumber = ethers.BigNumber;



 /**
  * A class that formats any number into ethers or a whole into different properties that is suitable for displays 
  */
 class Format implements IFormat {
    _isFormat:boolean; // indicates that it is a formaat
    inputValue:string|number; // value provided
    wei:string; // wei the smallest value
    fixed:string; // this is the whole value
    walletReady:string; // will cut give a modified balance reprecentation and good enough to display as a balance 
    moneyValue:string; // will trim the decimal point into .00 
    separated:string; // will display it as ethers and will put , every 3 digits or .toLocale 
    moneyValueSeparated:string; // money value but on locale
    assetValue:string; // the value of current asset to other assets
    decimals: number; // the decimal count of the represented assets
    
    /**
     * 
     * @param str the value of ethers the user can put - to separe the numbers like 9.123-456-789 
     * @param decimals  // how many decimals {useful for using tokens} default to `18`
     * 
     */
    constructor(str: string, decimals?: number) {
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
          this.walletReady = `${whole}.${moneyDec}`;
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
    /**
     * 
     * @returns will create a wei bignumber representation 
     */
    BN(){
       return BigNumber.from(this.wei) as any;
    }
    
    // will make ethers bignumber representation
    FixedBN(){
       return BigNumber.from(this.fixed) as any;
    }
    
    /** will give the wiw of any balance */
    toString(){
       return this.wei;
    }
    
    
    
    static get  Wei(){
       class FormatWie extends Format {
          
   /**
    * accepts wei rather than wrgwea 
    * @param value the wei 
    * @param _decimals how many decimals it s 
    */
          constructor(value: string, _decimals?: number) {
             const dec = _decimals || 18;
             const parsedValue:string = value.toString().replaceAll(/-|,/g,"");
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
    
    // set the value of the tokens
    set value(value:any){
       this.assetValue = value;
    }
    
   //  calculate the value of the tokens
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
   
   
   
   
   