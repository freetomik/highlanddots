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

      var c = this.c;

      o = {};
      o.x = c.originx;
      o.y = (c.originy <= c.endy) ? c.cp1y1 : c.cp2y1;
      o.height = c.height;
      o.width = c.width;

      return o;

    };

    ThisType.prototype.getPhraseGroup = function() {
      var mel;
      var nested = 0;
      var grp = [];
      var pos = score.find(this);

      if (!pos) {
        return;
      }

      while (--pos >= 0) {
        mel = score.get(pos);
        if (mel.type === this.type) {
          if (mel.sectionStart && nested == 0) // FIXME : for completeness, test for collectionName
            this.style = mel.style;
            this.label = mel.label;
            break;
          if (mel.sectionEnd) {
            nested++;
            continue;
          } else if (mel.sectionStart) {
            nested--;
            continue;
          }
        } else {
          //if (mel.type === this.type) {
            if (nested == 0)
//alert(JSON.stringify(mel, undefined, 2));
              grp.push(mel)
            }
//        }
      }
      grp.reverse();
      return grp;
    }



    ThisType.prototype.calc = function(staff) {
      if (this.sectionStart) return;         // 'look back' calc strategy
      var i, o, first, last, grp;
      var originx, originy, endx, endy,cp1x1, cp1y1, cp2x1, cp2y1 = 0;
      var yMult = -1;
      var y, yDelta;                        // the Y adjustment needed to put over/under the notation

      var sdet = staff.details;
      var c = this.c;
      var self = this;

      function calcBoundingMels() {
        var mel;
        for (i=0; i<grp.length; i++) {
          mel = grp[i];
//alert(JSON.stringify(mel, undefined, 2));
          if (mel.type === "melody" || mel.type === "gracenote") {
            first = mel;
            break;
          }
        }
        for (i=grp.length-1; i >= 0; i--) {
          mel = grp[i];
          if (mel.type === "melody" || mel.type === "gracenote") {
            last = mel;
            break;
          }
        }
      }

      grp = this.getPhraseGroup();

      if (grp.length == 0) {
alert("Group == 0");
          logit("Error: Start : Calc cannot find mel in score.");
          logit(self);
          logit("Error: End");
          return;
      }

      calcBoundingMels();
/*
      // set up group's bounding rectangle
      c.rect = {};
      o = {};
      o.x = grp[0].c.y;
      o.y = highest.c.y;
      o.width = grp[grp.length-1].c.x - grp[0].c.x;
// FIXME : should include stems
//      o.height = lowest.getBoundingRect(staff).y +
//                   lowest.getBoundingRect(staff).height -
//                   highest.getBoundingRect(staff).y;
      o.height = lowest.c.y - highest.c.y;

      meldObjectToObject(o, c.rect);
*/




      // FIXME : Technically this is correct because gracenotes can be notatated
      //         as tied to the melody note, but in GHB notation gracenotes
      //         should not be tied.
      //         To paint correctly, the tie start X should be moved away
      //         from the gracenote head
      // FIXME : Assumes all notes in group are stemmed the same way, which
      //         may not be the case.
      if (first.stemDirection() == "up") {
       yMult = 1;
       this.over  = false;
      } else {
        if (this.collectionName == "ties") {
          this.over  = true;
        }
      }

      if (this.style == "straight") {
        y = sdet.noteInfo.a3.y - ( (first.c.height + first.c.stemlen)/1.5);
        yDelta = 0;
        for (i=0; i<grp.length; i++) {
          // TODO : check for dynamics/articulations, adjust Y accordingly
        }

        c.height = sdet.space*2;
        c.originx = first.c.x - first.c.width/2;
        c.originy = y;//+ c.height;
        c.endx = last.c.x + last.c.width;
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
        c.originx = first.c.x + last.c.width/2;
        c.originy = first.c.y + (first.c.height * yMult);
        c.endx = last.c.x + (last.c.width/2);
        c.endy = last.c.y + (last.c.height * yMult);

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

logit("phrase group :"+ this.collectionName +",start:"+ this.sectionStart+", label:"+this.label);

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
        ctx.font = "bold " + (sdet.space*1.25) + "px sans-serif";
        ctx.textAlign = 'start';
        // TODO : scale font according to staff line space
        //        The default font is 10px sans-serif.

       ctx.fillText(this.label, c.labelx, c.labely);
       ctx.font = tf;
       ctx.textAlign = ta;
     }


    ctx.lineWidth = lw;
logit("        painted");

    };

    Score.prototype.createPhraseGroup = function() {
      return new ThisType();
    };
}());
