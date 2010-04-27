"use strict";

(function() {
 var THISTYPE = "embellishment";
 
 function ThisType() {  
   this.type = THISTYPE;
   this.stemDir = "up";
  this.paddingRight = 0;  // Override the parent 
   this.c = {};
   return this;
 }
 
 ThisType.inherits(Note);
 
 ThisType.prototype.isPrintable = true;
 ThisType.prototype.scaleFactor = 0.6;
 ThisType.prototype.duration = 32;
 
 Score.prototype.createEmbellishment = function() {
   return new ThisType();
 };
 
}
());
