var EXPORTED_SYMBOLS = ["TracePointFactory"];
var TracePointFactory = function (url, ln, propertyName){

   this.url = url;
   this.ln = ln;
   this.propertyName = propertyName;

   this.init = function(){

   };

   this.toString = function(){
       return url + " : " + ln + " : " + propertyName;
   };
}