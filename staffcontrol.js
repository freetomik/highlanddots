"use strict";

(function() {
 var THISTYPE = "staffControl";
  
 function ThisType() {     
   this.type = THISTYPE;
   this.isPrintable = true;
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 Score.prototype.createStaffControl = function() {
   return new ThisType();
 };
}());
