"use strict";

function Note() {  
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


// Storage area for some commonly used calcuations.
Note.prototype.c = {};

Note.prototype.calc = function(staff) {  
  var c = Note.prototype.c;
  var w;
  var h;

  
  c.width = staff.details.space * this.scaleFactor;
  c.height = c.width; // what should this be? staff.details.height; 

  w = c.width/2;
  h = c.height/2;

  c.x = staff.details.x;
  c.y = staff.details.findNote[this.staffPosition];
  c.r = (staff.details.space /2 ) * this.scaleFactor;

  c.endX = c.x + c.width;
  c.endY = c.y;
    
  c.cp1x1 = c.x + w;
  c.cp1y1 = c.y - h;
  c.cp2x1 = c.endX + w;
  c.cp2y1 = c.endY - h;
  
  c.cp1x2 = c.endX - w;
  c.cp1y2 = c.endY + h;
  c.cp2x2 = c.x - w;
  c.cp2y2 = c.y + h;
}


Note.prototype.getBoundingRect = function(staff) {
  var ctx = staff.details.ctx;
  var strokeStyle = ctx.strokeStyle; 
  var c = this.c;
  
  ctx.strokeStyle = "rgba(0, 0, 200, 0.5)";
  this.calc(staff);  

  
  var o = {
    x: c.x,
    y: c.y-(c.height/2),
    width: c.width,
    height: c.height
  };
  
  ctx.strokeRect(o.x, o.y, o.width, o.height);
  ctx.strokeStyle = strokeStyle;

  return o;
}


Note.prototype.paint2 = function(staff) {
  var c = this.c;

  var ctx = staff.details.ctx;
  var self = this;
  
  function paintStem() {
    
    var stemx1 = c.x - (c.r/2) + staff.details.thick;
    var stemy1 = c.y;
    var stemlen = staff.details.space * 3.2 * self.scaleFactor;
    var barthick = staff.details.barthick * self.scaleFactor;

    var tails = self.countTails();
    var i;
    
    if (self.stemDirection() == "up") {
      // TJM reset stem co-ords for 'up' stems
      stemx1 = c.x + (c.r*2) + (barthick/2);
      stemy1 = c.y - stemlen;      
    }
    
    if (barthick < 1) {barthick = 1;}
    
    ctx.fillRect(stemx1, stemy1, barthick, stemlen);
    
    if (tails) {
      if (self.stemDirection() == "up") {
        for (i = 0; i < tails; i++) {
          ctx.fillRect(stemx1, stemy1, c.r*2, barthick*3);
          stemy1 += c.r;
        }
      } else {
        stemy1 += stemlen;
        for (i = 0; i < tails; i++) {
          ctx.fillRect(stemx1, stemy1, c.r*2, barthick*3);
          stemy1 -= c.r;
        }
      }
    }
  }
  

  this.calc(staff);  
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.bezierCurveTo(c.cp1x1, c.cp1y1, c.cp2x1, c.cp2y1, c.endX, c.endY);
  ctx.bezierCurveTo(c.cp1x2, c.cp1y2, c.cp2x2, c.cp2y2, c.x, c.y);
  
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
    ctx.arc(c.x+c.r*3, c.y-c.r*1.2, c.r/3, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    
  }
  
  if (this.hasStem()) {
    paintStem();
  }

};

