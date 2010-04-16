"use strict";

(function() {
 var THISTYPE = "staffControl";
  
 function ThisType(mel) {     
   this.type = THISTYPE;
   this.isPrintable = true;
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 Score.prototype.createStaffControl = function(s) {
   return new ThisType(s);
 };
}());
