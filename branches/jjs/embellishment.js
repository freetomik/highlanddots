"use strict";

(function() {
 var THISTYPE = "embellishment";

 function ThisType() {  
   this.stemDir = "up";
  this.paddingRight = 0;  // Override the parent 

   return this;
 }
 
 ThisType.inherits(Note);
 
 ThisType.prototype.isPrintable = true;
 ThisType.prototype.scaleFactor = 0.6;
 ThisType.prototype.duration = 32;
 ThisType.prototype.type = THISTYPE;
 
 ThisType.prototype.paint = function(staff) {
   this.note = this.note.toUpperCase();
   this.staffPosition = GHPRef[this.note];
   this.paint2(staff);
 };

 Score.prototype.createEmbellishment = function() {
   return new ThisType();
 };

}
());
