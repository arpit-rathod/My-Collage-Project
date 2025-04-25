var obj = [{ name: "arpit" }];
console.log(obj);

function setObj(prev){
     var result = [...prev,{surname:"rathore"}]
     return result;
}
console.log(setObj(obj));
