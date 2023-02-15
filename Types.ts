import Type from "@validitor/main/type";
export const alphanumeric:typeof Type = new Type("alphanumeric", "number|string");
alphanumeric.setComparason((variable:any) => {
  return  typeof variable === "string" || typeof variable ===  "number" ;
});


