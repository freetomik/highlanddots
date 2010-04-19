"use strict";

Score.prototype.graphicsList = {
  "treble-clef" : "icons/treble-clef.png"
};


function preloadGraphicsList () {
  var s;
  var img = new Image();
  var count1 = 0;
  var count2 = 0;
  
  var statusEl = document.getElementById("status");
  statusEl.innerHTML = "Preloading images";  
  
  function checkdone() {
    count2++;
    if (count2 === count1) {
      statusEl.innerHTML = "Preload complete";
    }
  }
  
  
  for(s in score.graphicsList) {
    count1++;
    img = new Image();
    img.onload = checkdone();
    img.src = score.graphicsList[s];
    //alert(s);
  }
}

(function() {
 var THISTYPE = "graphic";
 function ThisType(imgName) {
   this.imgName = imgName;
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 ThisType.prototype.type = THISTYPE;
 
 ThisType.prototype.c = {};
 
 ThisType.prototype.calc = function(staff) {
   logit([THISTYPE + ":", ""+this.fname]);

   var img = new Image();

   img.src = score.graphicsList[this.imgName];;
   if (!img.complete) {
     alert("Error loading image" + this.imgName);
   }
   
   document.body.appendChild(img);

   var width = img.clientWidth;
   var height = img.clientHeight;
      
   var size = staff.details.staffHeight * 1.8;
   
   
   var dx = staff.details.x;
   var dy = staff.details.top - (staff.details.staffHeight*1.8);
   var ratio = height / size; 
   
   var dh = height / ratio;
   var dw = width /ratio;  

   this.c.size = size;
   this.c.ratio = ratio;
   this.c.img = img;
   this.c.dx = dx;
   this.c.dy = dy;
   this.c.dw = dw;
   this.c.dh = dh;
   this.c.img = img;

   document.body.removeChild(img);
   
   logit([THISTYPE, size, ratio, img, dx, dy, dw, dh]);
   
 }

ThisType.prototype.getBoundingRect = function(staff) {
  this.calc(staff);  
  var c = this.c;
  
  var o = {
    x: c.dx,
    y: c.dy,
    width: c.dw,
    height: c.dh
  };

  return o;
}

 
 
 ThisType.prototype.paint = function(staff) {
   var c = this.c;
   this.calc(staff);
   
   staff.details.ctx.drawImage(c.img, c.dx, c.dy, c.dw, c.dh);

 }
 
 
 Score.prototype.createGraphic = function(fname) {
   return new ThisType(fname);
 };
}
)();

