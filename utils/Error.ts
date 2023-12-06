
export class ErrorLogger extends Error{
   data:any
   suggestion?:string;
   _isError:boolean;
   code:string;
   constructor(code:string,message:string,data:any,suggest?:string) {
      super(message);
      this.code = code;
      this._isError = true;
      this.data = data;
      this.suggestion = suggest || undefined;
   }
   
}


// ArgurmentError is an error for wrong arguements 
export class ArgurmentError extends ErrorLogger {
   constructor(ofInstance: string,
      data: any, parameter: string, value: any, required: string, suggest?: string) {
      const code = "NOT_VALID_ARGS";
      const message = `Invalid arguments provided in ${ ofInstance }.`;
      const addData = data ? {parameter,value,required,...data} : {parameter,value,required,};
      super(code,message,addData,suggest);
      this.message = message;
   }
}


// this error is called whenever when executing something throws into Error
export class ExecutionError extends ErrorLogger {
   constructor(calling:string,  data:any,suggest?:string) {
   const message  =`Error occured in running ${calling}`
   const code = "EXECUTION_ERROR"
      super(code,message,data,suggest);
   }
}


export default ErrorLogger;