"use strict";

(function() {
    var THISTYPE = "phrasegroup";
    
    function ThisType() {   
      this.over = true;
      this.c = {};                  // Storage area for some commonly used calcuations.
      return this;
    }

    ThisType.inherits(ScoreElement);
    
    ThisType.prototype.type = THISTYPE;
    ThisType.prototype.isPrintable = true;
        
    ThisType.prototype.getBoundingRect = function(staff) {
      if (this.sectionStart) return null;           // 'look back' bounding box strategy

      this.calc(staff);  
      var c = this.c;

      o = {};
      o.x = c.originx;
      o.y = (c.originy <= c.endy) ? c.cp1y1 : c.cp2y1;
      o.height = c.height;
      o.width = c.width;

      return o;

    };

    ThisType.prototype.calc = function(staff) {  
      if (this.sectionStart) return;         // 'look back' calc strategy
      var sdet = staff.details;
      var c = this.c;
      var originx, originy, endx, endy,cp1x1, cp1y1, cp2x1, cp2y1 = 0;
      var yMult = -1;
      var i;
      var y, yDelta;                        // the Y adjustment needed to put over/under the notation

      grp = score.collections.findIn(this, score.collections[this.collectionName]);
      this.style = grp[0].style;

      if(grp[0].label) this.label = grp[0].label;
      
      // FIXME : Technically this is correct because gracenotes can be notatated
      //         as tied to the melody note, but in GHB notation gracenotes
      //         should not be tied. 
      //         To paint correctly, the tie start X should be moved away 
      //         from the gracenote head
      if (grp[grp.length-2].stemDirection() == "up") {
       yMult = 1;
       this.over  = false;
      } else {
        if (this.collectionName == "ties") {
          this.over  = true;
        }
      }

      if (this.style == "straight") {
        y = sdet.noteInfo.a3.y - ( (grp[1].c.height + grp[1].c.stemlen)/1.5);
        yDelta = 0;
        for (i=1; i<grp.length-1; i++) {
          // TODO : check for dynamics/articulations, adjust Y accordingly
        }

        c.height = sdet.space*2;
        c.originx = grp[1].c.x - grp[1].c.width/2;
        c.originy = y;//+ c.height;
        c.endx = grp[grp.length-2].c.x + grp[grp.length-2].c.width;
        c.endy = y;
	c.width = c.endx - c.originx;

        if (this.label) {
          if (this.collectionName == "voltas") {
            c.labelx = c.originx + (c.width/5);
          } else {
            c.labelx = c.originx + (c.width/2);
          }
          c.labely = c.originy + (c.height*.75);
        }


      } else {
        c.originx = grp[1].c.x + grp[1].c.width/2;
        c.originy = grp[1].c.y + (grp[1].c.height * yMult);
        c.endx = grp[grp.length-2].c.x + (grp[grp.length-2].c.width/2);
        c.endy = grp[grp.length-2].c.y + (grp[grp.length-2].c.height * yMult);

      // FIXME: need proper control points!! should be proportional to tie length
        c.cp1x1 = c.originx + 10;
        c.cp1y1 = c.originy + (10 * yMult);
        c.cp2x1 = c.endx - 10;
        c.cp2y1 = c.endy + (10 * yMult);

        if (this.over) {
          c.height = (c.originy <= c.endy) ? c.endy - c.cp1y1 : c.originy - c.cp2y1;
        } else {
          c.height = (c.originy <= c.endy) ? c.endy + c.cp1y1 : c.originy + c.cp2y1;

        }
 
        c.width = c.endx - c.originx;

        if (this.label) {
          if (this.collectionName == "voltas") {
            c.labelx = c.originx + (c.width/5);
            c.labely = c.originy - (c.height);
          } else {
            c.labelx = c.originx + (c.width/2);
            c.labely = c.originy - (c.height/4);
          }
        }
      }

      c.linewidth = staff.details.space/5;
      if (c.linewidth < 1) {c.linewidth = 1;}

    }

    ThisType.prototype.paint = function(staff) {
      if (this.sectionStart) return;           // 'look back' painting strategy
      var sdet = staff.details; 
      var ctx = sdet.ctx;
      var lw = ctx.lineWidth;
      var c = this.c;

      ctx.lineWidth = c.linewidth;

      if (this.style == "straight") {
        ctx.beginPath();
        ctx.moveTo(c.originx, c.originy+c.height);
        ctx.lineTo(c.originx, c.originy);
        ctx.lineTo(c.endx, c.endy);
        ctx.lineTo(c.endx, c.endy+c.height);
        ctx.stroke();
        ctx.closePath();

      } else {
        ctx.beginPath();
        ctx.moveTo(c.originx, c.originy);
        ctx.bezierCurveTo(c.cp1x1, c.cp1y1, c.cp2x1, c.cp2y1, c.endx, c.endy);
        ctx.stroke();
      }

        if (this.label) {
          var tf = ctx.font;
          var ta = ctx.textAlign;
          ctx.font = "" + (sdet.space*1.25) + "px sans-serif bold";
	  ctx.textAlign = 'start';
          // TODO : scale font according to staff line space 
          //        The default font is 10px sans-serif.

   	  ctx.fillText(this.label, c.labelx, c.labely);
	  ctx.font = tf;
	  ctx.textAlign = ta;
	}


      ctx.lineWidth = lw;

    };
    
    Score.prototype.createPhraseGroup = function() {
      return new ThisType();
    };
}());
