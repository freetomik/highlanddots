"use strict";

(function() {
 var THISTYPE = "keysig";
 function ThisType() {
   this.type = THISTYPE;
   this.c = {};                  // Storage area for some commonly used calcuations.
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 
 ThisType.prototype.calc = function(staff) {
 };

 
 ThisType.prototype.getBoundingRect = function(staff) {
/*   this.calc(staff);
   var sdet = staff.details;
   var c = this.c;
   
   var o = {
     x: c.x,
     y: c.y,
     width: c.width,
     height: c.height
   };
   //alert(o.toSource());
   return o;
   */
 }
 
 
 ThisType.prototype.paint = function(staff) {
 }
 
 Score.prototype.createKeySig = function() {
   return new ThisType();
 };
}
)();

