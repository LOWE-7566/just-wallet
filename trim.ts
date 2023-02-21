// trim is used to trim the balance or the amount in wallet for wallet balance amount 
function trim(value:string,place?:number){
  const removalLeading0 = value.replace(/^[0]+/g,"");
  const where:number = place || value.length;
  if(value.length <= where){
    return value ;
  }
  const trimmed = value.slice(0, place);
  return removedot(trimmed) 
}
// trim => simply trim the value into length that you want
// usage 
// trim(number, place);
// trim(100,3)  // 100 ;
// trim(100, 2) // 10


// removedot 
// usage 
// removedot(number) // this will remove the last .0 in its last value

function removedot(value:any){
  
  const lastIndex= /\.+$|.0+$/g ;

  return value.replace(lastIndex,"");
}

function addZero(value:any){
  const lastIndex= /\.$/g;
  return value.replace(lastIndex,"");
}

trim.removedot = removedot ;
trim.addZero = addZero ;
export default  trim ;