"use strict";

(function() {
    var THISTYPE = "phrasegroup";
    
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
      if (this.sectionStart) return;         // 'look back' calc strategy
      var c = this.c;
      var originx, originy, endx, endy,cp1x1, cp1y1, cp2x1, cp2y1 = 0;
      var yMult = -1;

      grp = score.collections.findIn(this, score.collections[this.collectionName]);

      if (grp[1].stemDirection() == "up") {
       yMult = 1;
      }

      c.originx = grp[1].c.x + grp[1].c.width/2;
      c.originy = grp[1].c.y + (grp[1].c.height * yMult);
      c.endx = grp[grp.length-2].c.x + (grp[grp.length-2].c.width/2);
      c.endy = grp[grp.length-2].c.y + (grp[grp.length-2].c.height * yMult);

      // FIXME: need proper control points!! should be proportional to tie length
      c.cp1x1 = c.originx + 10;
      c.cp1y1 = c.originy + (10 * yMult);
      c.cp2x1 = c.endx - 10;
      c.cp2y1 = c.endy + (10 * yMult);

      c.linewidth = staff.details.space/5;
      if (c.linewidth < 1) {c.linewidth = 1;}

    }

    ThisType.prototype.paint = function(staff) {
      if (this.sectionStart) return;           // 'look back' painting strategy
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
    
    Score.prototype.createPhraseGroup = function() {
      return new ThisType();
    };
}());
