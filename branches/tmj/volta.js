"use strict";

(function() {
    var THISTYPE = "volta";
    
    function ThisType() {   
      this.c = {};                  // Storage area for some commonly used calcuations.
      return this;
    }
    
    ThisType.prototype.type = THISTYPE;
    ThisType.prototype.isPrintable = true;
        
    ThisType.prototype.getBoundingRect = function(staff) {
      this.calc(staff);  
    };

    ThisType.prototype.calc = function(staff) {  
      if (this.start) return;         // 'look back' calc strategy
      var c = this.c;
      var originx, originy, endx, endy,cp1x1, cp1y1, cp2x1, cp2y1 = 0;
      var yMult = -1;

      grp = score.collections[this.type+"s"][this];

staff.details.logging = true;
logit (grp.length);
staff.details.logging = false;

      if (grp[0].stemDirection() == "up") {
       yMult = 1;
      }

      c.originx = grp[0].c.x + grp[0].c.width/2;
      c.originy = grp[0].c.y + (grp[0].c.height * yMult);
      c.endx = grp[grp.length-1].c.x + (grp[grp.length-1].c.width/2);
      c.endy = grp[grp.length-1].c.y + (grp[grp.length-1].c.height * yMult);

      // FIXME: need proper control points!! should be proportional to tie length
      c.cp1x1 = c.originx + 10;
      c.cp1y1 = c.originy + (10 * yMult);
      c.cp2x1 = c.endx - 10;
      c.cp2y1 = c.endy + (10 * yMult);

      c.linewidth = staff.details.space/5;
      if (c.linewidth < 1) {c.linewidth = 1;}

    }

    ThisType.prototype.paint = function(staff) {
      if (this.start) return;           // 'look back' painting strategy
      var ctx = staff.details.ctx;
      var lw = ctx.lineWidth;
      var c = this.c;

      ctx.lineWidth = c.linewidth;
      ctx.beginPath();
      ctx.moveTo(c.originx, c.originy);
      ctx.bezierCurveTo(c.cp1x1, c.cp1y1, c.cp2x1, c.cp2y1, c.endx, c.endy);
      ctx.stroke();
      ctx.lineWidth = lw;

    };
    
    Score.prototype.createVolta = function() {
      return new ThisType();
    };
}());
