"use strict";

function Note() {  
  this.isPrintable = true;
  this.scaleFactor = 1.0;
  this.stemDir = "down";
  this.grouped = false;         // note is part of group
  this.beamed = false;          // note is part of group and has been beamed
  this.c = {};                  // Storage area for some commonly used calcuations.
  var self = this;
  return this;
}

Note.inherits(ScoreElement);

Note.prototype.hasStem = function() {
  return this.duration >= 2;
};

Note.prototype.countTails = function() {
  var tailLookup = {1: 0, 2: 0, 4: 0, 8: 1, 16: 2, 32: 3, 64: 4, 128: 5};
  return tailLookup[this.duration];
};


Note.prototype.stemDirection = function() {
  return this.stemDir;
};



Note.prototype.calc = function(staff) {  
  var c = this.c;
  var slMult = 3.2;       // stem length multiplier for more than 2 tails
  var w;
  var h;
  var o;
  var sdet = staff.details;
  
  // reset beamed flag
  this.beamed = false;
  
  c.width = sdet.space * this.scaleFactor;
  c.height = c.width; // what should this be? sdet.height; 

  w = c.width/2;
  h = c.height/2;

  c.w = w * 2;
  c.x = sdet.x;
  c.y = sdet.noteInfo[this.staffPosition].y;
  c.r = (sdet.space /2 ) * this.scaleFactor;

  c.endX = c.x + c.width;
  c.endY = c.y;
    
  // note head bezier control points
  c.cp1x1 = c.x + w;
  c.cp1y1 = c.y - h;
  c.cp2x1 = c.endX + w;
  c.cp2y1 = c.endY - h;
  
  c.cp1x2 = c.endX - w;
  c.cp1y2 = c.endY + h;
  c.cp2x2 = c.x - w;
  c.cp2y2 = c.y + h;

  // calc stem length and direction
  var k;// = this.countTails() - 2;
  slMult = ( ((k = this.countTails()) -2 ) > 0) ? k * (sdet.space/4) : 0;
  c.stemlen = ((sdet.space * 3.2) + slMult ) * this.scaleFactor;

  c.barthick = sdet.barthick * this.scaleFactor;
  if (c.barthick < 1) {c.barthick = 1;}
  
  o = {};
  o.stemx1 = c.x + (c.width*1.1);
  o.stemx2 = o.stemx1;
  o.stemy1 = c.y - (c.height*0.2);
  o.stemy2 = c.y - c.stemlen;
  o.topy = o.stemy2;
  o.bottomy = o.stemy1 + h ;


  // tail bezier control points
  o.tcp1x1 = c.stemx2;
  o.tcp1y1 = c.stemy2;
  o.tcp2x1 = c.stemx2+c.width;
  o.tcp2y1 = c.stemy2+(c.height/3);
  o.tcpEx1 = c.stemx2+(c.width*0.75);
  o.tcpEy1 = c.stemy2+(c.stemlen*0.75);
  
  o.tcp1x2 = c.stemx2+c.width;
  o.tcp1y2 = c.stemy2+(c.height/3);
  o.tcp2x2 = c.stemx2+c.width;
  o.tcp2y2 = c.stemy2+(c.height/2);
  o.tcpEx2 = c.stemx2;
  o.tcpEy2 = c.stemy2+(c.height/3);
  
  c.upStem = o;
  
  o = {};
  o.stemx1 = c.x - (c.r/2) + (c.width*0.1);
  o.stemx2 = o.stemx1;
  o.stemy1 = c.y + (c.height*0.2);

  o.stemy2 = c.y + c.stemlen;
  o.topy = o.stemy1 - h;
  o.bottomy = o.stemy2;

  // tail bezier control points
  o.tcp1x1 = c.stemx2;
  o.tcp1y1 = c.stemy2;
  o.tcp2x1 = c.stemx2+c.width;
  o.tcp2y1 = c.stemy2+(c.height/3);
  o.tcpEx1 = c.stemx2+(c.width*0.75);
  o.tcpEy1 = c.stemy2+(c.stemlen*0.75);
  
  o.tcp1x2 = c.stemx2+c.width;
  o.tcp1y2 = c.stemy2+(c.height/3);
  o.tcp2x2 = c.stemx2+c.width;
  o.tcp2y2 = c.stemy2+(c.height/2);
  o.tcpEx2 = c.stemx2;
  o.tcpEy2 = c.stemy2+(c.height/3);


  c.downStem = o;
  
  
  if (this.stemDir == "up") {
    meldObjectToObject(c.upStem, this.c);
  } else {
    meldObjectToObject(c.downStem, this.c);
  }
  
  c.dotGap2 = 0;
  if (this.dotCount() >= 1) {
    c.dotyOffset = 0
    if (sdet.noteInfo[this.staffPosition].drawnOnLine) {
      c.dotyOffset -= c.r*1.2
    }
    c.dotGap1 = c.barthick*3;
    c.dotGap2 = c.dotGap1;
    c.dotSize = c.r/3;  
  }
  if (this.dotCount() >= 2) {
    c.dotGap2 = c.dotGap1*2;
  }
}


Note.prototype.getBoundingRect = function(staff) {
  var sdet = staff.details;
  var ctx = sdet.ctx;
  var c = this.c;
  this.calc(staff);  

  //alert(c.w);
  
  var o = {
    x: c.downStem.stemx1,
    y: c.topy,
    width: (c.upStem.stemx1 - c.downStem.stemx1),
    height: (c.bottomy - c.topy)
  };

  if (this.dotCount() !== 0) {
    o.width += c.dotGap2 + c.r;
    o.y += c.dotyOffset;
    o.height -= c.dotyOffset;
  }
  
  return o;
}


Note.prototype.dotCount = function() {
    var i = {
      dot:1,
      doubledot:2
    }[this.dotType];
    if (typeof i === "undefined") {i = 0;}
    return i;
};


Note.prototype.paint = function(staff) {
  var c = this.c;
  var sdet = staff.details;
  var ctx = sdet.ctx;
  var self = this;

  function drawExtendedStaff() {
    var lw = ctx.lineWidth;
    // FIXME : scale factor on line width?
    ctx.lineWidth = sdet.thick; 
    ctx.beginPath();
    ctx.moveTo(c.x - (c.width*0.75), c.y);
    ctx.lineTo(c.x + (c.width*1.5), c.y);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = lw; 
    
  }


  function drawDot() {
    var y = c.y + c.dotyOffset;
    var x = c.upStem.stemx1
    
    ctx.beginPath();
    ctx.arc(x+c.dotGap1, y, c.dotSize, 0, Math.PI*2, true);
    if (self.dotCount() === 2) {
      ctx.arc(x+c.dotGap2, y, c.dotSize, 0, Math.PI*2, true);
    }
    ctx.closePath();
    ctx.fill();
  }
    

  
  function paintStem() {
    
    var tails = self.countTails();
    var lw = ctx.lineWidth;
    var i,tailx,taily;
    var yMult = 1;
    
    if (self.stemDirection() == "up")
      yMult = -1;

    // FIXME : scale factor on line width?
    ctx.lineWidth = sdet.thick; 
    ctx.beginPath();
    ctx.moveTo(c.stemx1, c.stemy1);
//    if (self.grouped && self.beamed) {
//     ctx.lineTo(c.stemx2, c.stemy2 + (c.beam.stemlen*yMult));
//    } else {
     ctx.lineTo(c.stemx2, c.stemy2);
//    }
    ctx.stroke();
    ctx.closePath();
  }


  function paintTail() {
/* TAIL co-ords at 0,0 based on note.width == 10

   Short Top line, up stem
   START:0,   0
   CP1:  0,   10
   CP2:  10,  5
   END:  10,  15

   Short Bottom line, up stem
   START:10,  15
   CP1:  8.3, 8.3
   CP2:  3.3, 8.3
   END:  0,   6.6


   Long Top line, up stem
   START:0,   0
   CP1:  0,   10
   CP2:  15,  5
   END:  8.3, 23.3

   Long Bottom line, up stem
   START:8.3, 23.3
   CP1:  13.3,6.3
   CP2:  5,   10
   END:  0,   6.3

*/


    
    var tails = self.countTails();
    var lw = ctx.lineWidth;
    var i,tailx,taily;
    var yInc, yMult = -1;

    if (tails < 1) return;

    yInc = (c.height/2) + c.barthick;		// amount to increment Y between tails
    if (self.stemDirection() == "up") {
      yMult = 1;
    }


    if (self.grouped && self.c.beam.last) {
      tailx = c.stemx1 - c.width;
    } else if (self.grouped) {

    // lookahead to next note
    // IF next note has fewer tails && current tail count > next tail count
    //    THEN tails are 1/2 width
    // ELSE tail is as wide as the gap between notes

    //Note.groupUtils.lookahead(self, grp, "countTails");

      tailx = c.stemx1 + (c.width*2); // twice width to bridge to next note stem
    } else {
      tailx = c.stemx1 + c.width;
    }

    taily = c.stemy2;

    // FIXME : line width should be 1/2 ... but 1/3 looks better
    ctx.lineWidth = c.height/3;

    for (i = 0; i < tails; i++) {
      ctx.beginPath();
      ctx.moveTo(c.stemx2, taily);
      if (self.stemDir === "up") {

	if (i == tails-1) {
          ctx.bezierCurveTo(c.stemx2, taily+(c.width), 
                            c.stemx2+(c.width*1.5), taily+(c.width*0.5),
                            c.stemx2+(c.width*0.83), taily+(c.width*2.33));

          ctx.bezierCurveTo(c.stemx2+(c.width*0.83), taily+(c.width*2.3), 
                            c.stemx2+(c.width*1.33), taily+(c.width*0.83),
                            c.stemx2, taily+(c.width*0.63));
        
        } else {
          ctx.bezierCurveTo(c.stemx2, taily+(c.width),
                            c.stemx2+(c.width), taily+(c.width*0.5),
                            c.stemx2+(c.width), taily+(c.width*1.5));

          ctx.bezierCurveTo(c.stemx2+(c.width*0.83), taily+(c.width*0.83),
                            c.stemx2+(c.width*0.33), taily+(c.width*0.83),
                            c.stemx2, taily+(c.width*0.66));
        }

      } else {

	if (i == tails-1) {
          ctx.bezierCurveTo(c.stemx2, taily-(c.width), 
                            c.stemx2+(c.width*1.5), taily-(c.width*0.5),
                            c.stemx2+(c.width*0.83), taily-(c.width*2.33));

          ctx.bezierCurveTo(c.stemx2+(c.width*0.83), taily-(c.width*2.3), 
                            c.stemx2+(c.width*1.33), taily-(c.width*0.83),
                            c.stemx2, taily-(c.width*0.63));
        
        } else {
          ctx.bezierCurveTo(c.stemx2, taily-(c.width),
                            c.stemx2+(c.width), taily-(c.width*0.5),
                            c.stemx2+(c.width), taily-(c.width*1.5));

          ctx.bezierCurveTo(c.stemx2+(c.width*0.83), taily-(c.width*0.83),
                            c.stemx2+(c.width*0.33), taily-(c.width*0.83),
                            c.stemx2, taily-(c.width*0.66));
        }

      }
      ctx.closePath();
      ctx.fill();
      taily += yInc * yMult;
    }
  }
  

  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.bezierCurveTo(c.cp1x1, c.cp1y1, c.cp2x1, c.cp2y1, c.endX, c.endY);
  ctx.bezierCurveTo(c.cp1x2, c.cp1y2, c.cp2x2, c.cp2y2, c.x, c.y);
  
  // nice thick line for note outlines :)
  var lw = ctx.lineWidth;
  ctx.lineWidth = sdet.thick * 1.5 * this.scaleFactor;
  ctx.stroke();
  ctx.lineWidth = lw;

  // not filled for whole or half notes
  if (this.duration > 2 ) {
    ctx.fill();
  }
  
  if (this.c.y <= sdet.noteInfo.a3.y) {
    drawExtendedStaff();
  }

  if (this.dotType) {
    drawDot();
  }
  
  if (this.hasStem()) {
    if (!this.grouped || (this.grouped && this.c.beamed) ) {
      paintStem();
      paintTail();
    }
  }
};
