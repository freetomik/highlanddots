"use strict";

(function() {
 var THISTYPE = "embellishment";

 function ThisType() {  
   this.stemDir = "up";
   this.b = {};                  // Storage area beaming calcuations.
   this.c = {};                  // Storage area for co-ords and dimensions
   return this;
 }
 
 ThisType.inherits(Note);
 
 ThisType.prototype.isPrintable = true;
 ThisType.prototype.scaleFactor = 0.6;
 ThisType.prototype.duration = 32;
 ThisType.prototype.type = THISTYPE;
 
 Score.prototype.createEmbellishment = function() {
   return new ThisType();
 };

}
());
