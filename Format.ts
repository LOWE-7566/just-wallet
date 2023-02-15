import {ethers} from "ethers";
import trim from "./trim.js";
const utils = ethers.utils ;
const BigNumber = ethers.BigNumber ;

/**
 * you can separate the number string by hipen ex. 100-000 for 100000 
**/


class Format {
  decimals:string|number; // decimal count 
  inputValue:string|number; // value provided
  wei:string; // wei the smallest value
  fixed:string; // this is the whole value
  walletReady:string;
  moneyValue:string;
  separated:string;
  moneyValueSeparated:string;
  constructor(str:string,decimals:number|string){
    const value:string = str.replaceAll(/-|,/g,"");
    this.decimals = decimals ? decimals : 18 ;
    this.inputValue = value || 0 ;
    this.wei = utils.parseUnits(value,this.decimals).toString();
    this.fixed = trim.removedot(utils.formatUnits(this.wei,this.decimals));
      const maxSplited = this.fixed.split(".");
      const  whole = maxSplited[0];
      if(maxSplited.length > 1){
      const dec =  trim(maxSplited[1],9);
        this.walletReady = `${whole}.${dec}`;
        this.moneyValue = `${whole}.${trim(trim(dec,2))}`;
        const biglocale = BigInt(whole).toLocaleString();
        this.separated = `${biglocale}.${trim(dec)}`;
        this.moneyValueSeparated = `${biglocale}.${trim(dec,2)}`;
      } else {
        this.walletReady = this.fixed;
        this.moneyValue = `${this.fixed}.00`
        const biglocale = BigInt(whole).toLocaleString();
        this.separated = biglocale ;
        this.moneyValueSeparated = `${biglocale}.00`
        
      }
  }
  operationSupport(){
    return BigNumber.from(this.wei);
  }
  
  parseOperationSupport(number?:string){
    // number = number.replaceAll(/-|,/g,"");
    const decimal = this.decimals;
    return BigNumber.from(this.fixed);
  }
  
  static get  Wei(){
    class FormatWie extends Format {
        inputValue:string;
      constructor(value:string,dec:number){
        const parsedValue:string = value.replaceAll(/-|,/g,"");
        const wei:string =   utils.formatUnits(parsedValue,dec);
        super(wei,dec);
        this.inputValue = value;
      }
    }
    
    return FormatWie;
  }
  
  static Factory(dec:number){
  
    function parse(number:string|number){
      number = number.toString().replaceAll(/-|,/g,"");
     return  utils.parseUnits(number, dec || 18)
   }
   parse.Format = function(number:string|number){
     const newFactory = new Format(number.toString(),dec || 18);
     newFactory.inputValue = number;
     return newFactory;
   }

   return parse
  
 }
}




export default Format;

// console.log(Format.Wei("1000",5))
// console.log(Format.Factory(3).Format(100))

// methods 
// Format.operationSupport => turning Format.wei to ethers.BigNumber ;
// Format.operationSupport => turning Format.fixed to ethers.BigNumber;
/**
 * Format.Wei => this will Format wie into new Format
 * ex Format.Wei(1000,3) => Format {
  decimals: 3,
  inputValue: '1',
  wei: '1000',
  fixed: '1',
  walletReady: '1',
  moneyValue: '1.00',
  separated: '1',
  moneyValueSeparated: '1.00'
}
**/

/**
 * Format.Factory => will help you to make easier to parse number to use in transactions 
 *ex 
 * const factory = Format.Factory(3);
 *factory(1) => 1 and tree decimals == 1000
 * factory.Format(number) // format your factory
 * 
**/
// console.log(new Format("100-000",3).parseOperationSupport());
// console.log(new Format("100-000",3).operationSupport())
// console.log(new Format("1",3))




