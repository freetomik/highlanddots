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
      var mel, pos;
      var grp = [];
      var self = this;

      function getVolta() {
        var nested = 0;
        while (--pos >= 0) {
          mel = score.get(pos);
          if (mel.type === self.type && mel.collectionName === self.collectionName) {
            if (mel.sectionStart && nested == 0 ) {
              self.style = mel.style;
              self.label = mel.label;
              self.c.originy = mel.c.originy;
              break;

            } else if (mel.sectionStart) {
              nested--;
              continue;

            } else if (mel.sectionEnd) {
              nested++;
              continue;
           }
          } else {
            if (nested == 0 && mel.getBoundingRect) // only add elements that have bounding boxes
              grp.push(mel);
          }
        }
      }

      function getTie() {
        var j = 0;
        while (--pos >= 0) {
          if (j > 2) {
            grp = [];
            break;
          }

          mel = score.get(pos);

          if (j == 2) {
            if (mel.sectionStart && mel.type === self.type && mel.collectionName === self.collectionName) {

alert(JSON.stringify(mel, undefined, 2));
              self.style = mel.style;
              self.label = mel.label;
              self.c.originy = mel.c.originy;
              break;
            }

          } else if (mel.getBoundingRect) {
            grp.push(mel);
            if (mel.type === "melody")
              j++;
          }
        }
      }

      function getTriplet() {
        var inTriplet = true;
        while (--pos >= 0) {
          mel = score.get(pos);
          if (mel.sectionStart && mel.collectionName === "triplets") {
            self.style = mel.style;
            self.label = mel.label;
            self.c.originy = mel.c.originy;
            break;

          } else {
            if (mel.getBoundingRect) //mel.type === "melody")// || mel.type === "gracenote")
              grp.push(mel);

          }
        }
      }



      pos = score.find(this);

      if (!pos) {
        return;
      }

      switch (this.collectionName) {
        case "voltas":   getVolta();
                         break;
        case "ties":     getTie();
                         break;
        case "triplets": getTriplet();
                         break;
      }

      grp.reverse();
      return grp;
    }



    ThisType.prototype.calc = function(staff) {
      // in case this turns out to be a 'broken' volta spanning
      // staff lines, we need a current staff Y co-ord.
      // In other respects use a 'look back' calc strategy
      this.c.originy = staff.details.noteInfo.a3.y - (staff.details.space * 3.2); // ( (first.c.height + first.c.stemlen)/1.5);

      if (this.sectionStart) {
        return;
      }

      var i, o, first, last, grp;
      var originx, originy, endx, endy,cp1x1, cp1y1, cp2x1, cp2y1 = 0;
      var yMult = -1;
      var y, yDelta;                        // the Y adjustment needed to put over/under the notation

      var sdet = staff.details;
      var c = this.c;
      var self = this;

      function calcBoundingMels() {
        var brokenAt;
       // FIXME : this needs to be rethought to get non-note elements
       //          determine first, last, highest, lowest, and
       //          (for ties/slurs) note stem direction

        first = grp[0].getBoundingRect(staff);
        last = grp[grp.length-1].getBoundingRect(staff);

        var mel;
        for (i=0; i<grp.length; i++) {
          mel = grp[i];
          if (mel.type === "melody" || mel.type === "gracenote") {
            first = mel.getBoundingRect(staff);
            firstNote = mel;
            break;
          }
        }
        for (i=grp.length-1; i >= 0; i--) {
          mel = grp[i];
          if (mel.isPrintable) {
//          if (mel.type === "melody" || mel.type === "gracenote") {
            last = mel.getBoundingRect(staff);
            break;
          }
        }

        for (i=0; i< grp.length; i++) {
          mel = grp[i];
          if (mel.type === "graphic" && mel.name === "treble-clef") {
            // if we get here we've encountered a volta that spans staff lines
            var br = {};
            var j=i;
            while (--j > 0) {
              // go back to the previous staff line end bar and get it's X co-ord
              if (grp[j].type === "staffControl" && grp[j].staffEnd) {
                br.x1 = grp[j].c.x;
                br.x2 = grp[i].c.dx;
                c.break = br;

                break;
              }
            }
          }
        }

      }


      grp = this.getPhraseGroup();

      if (grp.length == 0) {
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
      if (firstNote.stemDirection() == "up") {
       yMult = 1;
       this.over  = false;
      } else {
        if (this.collectionName == "ties") {
          this.over  = true;
        }
      }

      if (this.style == "straight") {
        yDelta = 0;

        c.height = sdet.space*2;
        c.originx = first.x - first.width/2;
        // originy set at start of calc function
        c.endx = last.x + last.width;
        c.endy = sdet.noteInfo.a3.y - (sdet.space * 3.2);

        for (i=0; i<grp.length; i++) {
          // TODO : check for dynamics/articulations, adjust Y accordingly
          // NOTE: this probably won't work for broken volta Y adjustment
        }

        c.width = c.endx - c.originx;

        if (this.label) {
          if (this.collectionName == "voltas") {
            c.labelx = c.originx + sdet.space;
          } else {
            c.labelx = c.originx + (c.width/2);
          }
          c.labely = c.originy + (c.height*.75);
        }

      } else {
        c.originx = first.x + last.width/2;
        c.originy = first.y + (first.height * yMult);
        c.endx = last.x + (last.width/2);
        c.endy = last.y + (last.height * yMult);

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
            c.labelx = c.originx + (sdet.space);
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

      if (this.style == "straight") {
        ctx.beginPath();
        ctx.moveTo(c.originx, c.originy+c.height);
        ctx.lineTo(c.originx, c.originy);

        if (c.break) {
          ctx.lineTo(c.break.x1, c.originy);
          ctx.stroke();
          ctx.closePath();
          ctx.beginPath();
          ctx.moveTo(c.break.x2, c.endy);

        }
        ctx.lineTo(c.endx, c.endy);
        ctx.lineTo(c.endx, c.endy+c.height);
        ctx.stroke();
        ctx.closePath();

      } else {
        ctx.beginPath();
        ctx.moveTo(c.originx, c.originy);
        ctx.bezierCurveTo(c.cp1x1, c.cp1y1, c.cp2x1, c.cp2y1, c.endx, c.endy);
        ctx.stroke();
        ctx.closePath();
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

    };

    Score.prototype.createPhraseGroup = function() {
      return new ThisType();
    };
}());
