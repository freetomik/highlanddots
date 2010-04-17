"use strict";

(function() {
 var THISTYPE = "graphic";
 function ThisType(fname) {
//   var img = new Image();
//   img.src =  "icons/" + fname;
   
//   this.img = img;
this.fname = fname;
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 ThisType.prototype.type = THISTYPE;
 
 
ThisType.prototype.paint = function(staff) {
  return;
  this.img = document.getElementById(this.fname);
  var size = staff.details.staffHeight * 1.3;
             

  var dx = staff.details.x;
  var dy = staff.details.top;
  var ratio = this.img.heigth / size; 
  
  var dh = this.img.heigth / ratio;
  var dw = this.img.width /ratio;  
 
  logit(this.img.style);
  logit([this.img.heigth, size, ratio, this.img, dx, dy, dw, dh]);
  
  staff.details.ctx.drawImage(this.img, dx, dy, dw, dh);
}
 
 
 Score.prototype.createGraphic = function(fname) {
   return new ThisType(fname);
 };
}
)();

