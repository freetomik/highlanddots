"use strict";

(function() {
 var THISTYPE = "gracenote";
 
 function ThisType() {  
   this.type = THISTYPE;
   this.stemDir = "up";
   this.autoStemmed = false;
   this.paddingRight = 0;  // Override the parent
   this.b = {};                  // Storage area beaming calcuations.
   this.c = {};                  // Storage area for co-ords and dimensions
   return this;
 }
 
 ThisType.inherits(Note);
 
 ThisType.prototype.isPrintable = true;
 ThisType.prototype.scaleFactor = 0.6;
 ThisType.prototype.duration = 32;
 
 
 ThisType.prototype.autoStem = function() {
   if (arguments) {
   } else {
     return false;
   }
 };
 
 
 Score.prototype.createEmbellishment = function() {
   return new ThisType();
 };
 
}
());
