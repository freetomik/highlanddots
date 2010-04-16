"use strict";

function Note(note) {  
  this.isPrintable = true;
  this.scaleFactor = 1.0;
  this.stemDir = "down";
  
  return this;
}

Note.inherits(ScoreElement);

Note.prototype.hasStem = function() {
  return this.duration >= 2;
};

Note.prototype.countTails = function() {
  var tailLookup = {1: 0, 2: 0, 4: 0, 8: 1, 16: 2, 32: 3};
  return tailLookup[this.duration];
};


Note.prototype.stemDirection = function() {
  return this.stemDir;
};

Note.prototype.paint2 = function(staff) {
  var x = staff.details.x;
  var y = staff.details.findNote[this.staffPosition];
  var r = (staff.details.space /2 ) * this.scaleFactor;
  var ctx = staff.details.ctx;
  var self = this;
  
  function paintStem() {
    
    var stemx1 = x - (r/2) + staff.details.thick;
    var stemy1 = y;
    var stemlen = staff.details.space * 3.2 * self.scaleFactor;
    var barthick = staff.details.barthick * self.scaleFactor;
    var tails = self.countTails();
    var i;
    
    if (self.stemDirection() == "up") {
      // TJM reset stem co-ords for 'up' stems
      stemx1 = x + (r*2) + (barthick/2);
      stemy1 = y - stemlen;      
    }
    
    if (barthick < 1) {barthick = 1;}
    
    ctx.fillRect(stemx1, stemy1, barthick, stemlen);
    
    if (tails) {
      if (self.stemDirection() == "up") {
        for (i = 0; i < tails; i++) {
          ctx.fillRect(stemx1, stemy1, r*2, barthick*3);
          stemy1 += r;
        }
      } else {
        stemy1 += stemlen;
        for (i = 0; i < tails; i++) {
          ctx.fillRect(stemx1, stemy1, r*2, barthick*3);
          stemy1 -= r;
        }
      }
    }
  }
  
  var width = staff.details.space * self.scaleFactor;
  var height = width; // what should this be? staff.details.height; 
  
  var endX = x + width;
  var endY = y;
  
  var cp1x1 = x + (width/2);
  var cp1y1 = y - (height/2);
  var cp2x1 = endX + (width/2);
  var cp2y1 = endY - (height/2);
  
  var cp1x2 = endX - (width/2);
  var cp1y2 = endY + (height/2);
  var cp2x2 = x - (width/2);
  var cp2y2 = y + (height/2);
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(cp1x1, cp1y1, cp2x1, cp2y1, endX, endY);
  ctx.bezierCurveTo(cp1x2, cp1y2, cp2x2, cp2y2, x, y);
  
  // nice thick line for note outlines :)
  var lw = ctx.lineWidth;
  ctx.lineWidth = staff.details.thick * 1.5 * this.scaleFactor;
  ctx.stroke();
  ctx.lineWidth = lw;
  
  // not filled for whole or half notes
  if (this.duration > 2 ) {
    ctx.fill();
  }
  
  if (this.dotType && this.dotType === "dot") {
    ctx.beginPath();
    // TJM     ctx.arc(x+r*1.2, y-r*1.2, r/3, 0, Math.PI*2, true);
    ctx.arc(x+r*3, y-r*1.2, r/3, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    
  }
  
  if (this.hasStem()) {
    paintStem();
  }
};

