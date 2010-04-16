  
"use strict";

(function() {
 var i, l, s, o;
 var a = ["5_8","12_8","2_4","3_2","3_4","4_4","5_4","6_4","6_8",
"7_4","9_8","C","C_","15_8","18_8","21_8","2_2","2_8","3_8","4_8","7_8",
"8_8","10_8","11_8","2_16","3_16","4_16","5_16","6_16","7_16","8_16",
"9_16","10_16","11_16","12_16"];
 
 l = a.length;
 
 o = ScoreElement.prototype.elementList;
 for (i = 0; i < l; i++) {
   s = a[i];
   o[s] = {type: "timesig"};
 }
 
 function ThisType(mel) {  
   var p, n, s, chunk;
   
   this.timesig = mel;
   this.type = "timesig";
   this.isPrintable = true;
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 Score.prototype.createTimeSig = function(s) {
   return new ThisType(s);
 };
}
)();
  
