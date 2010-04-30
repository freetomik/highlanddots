"use strict";

(function() {
    var THISTYPE = "beamgroup";
    
    function ThisType() {   
      this.c = {};
      return this;
    }

    ThisType.inherits(ScoreElement);
    
    ThisType.prototype.type = THISTYPE;
    ThisType.prototype.isPrintable = true;
        
    ThisType.prototype.getBoundingRect = function(staff) {
      return null;

    };

    ThisType.prototype.getNoteGroup = function() {
      var mel;
      var grp = [];
      var pos = score.find(this);
      if (!pos) {
        return;
      }
        
      while (--pos >= 0) {
        mel = score.get(pos);
// FIXME : nested groups; endSection
        if (mel.type === this.type) {
          break;
        } else {
          if (mel.type === this.elementType) {
            grp.push(mel);
          }
        }
      }
      grp.reverse();
      return grp;
    }



    ThisType.prototype.calc = function(staff) {  
      if (this.sectionStart) return;         // 'look back' calc strategy

      var i, o, note, highest, lowest, grp;
      var sdet = staff.details;
      var c = this.c;
      var self = this;


      function calcBoundingNotes() {
        highest = grp[0];
        for (i=0; i<grp.length; i++) {
          note = grp[i];
          if (note.c.y < highest.c.y) {
            highest = note;
          }
        }
        lowest = grp[0];
        for (i=0; i<grp.length; i++) {
          note = grp[i];
          if (note.c.y > lowest.c.y) {
            lowest = note;
          }
        }
      }

      function beamStraight () {
        var hd = 0;
        var ld = 0;
        if (arguments.length == 2) {
          hd = arguments[0];
          ld = arguments[1];
        }

        // set stem lengths
        for (i=0; i<grp.length; i++) {
          note = grp[i];

          o = {};
          o.stemlen = highest.c.stemlen + Math.abs((highest.c.y - note.c.y)) + hd;
          o.stemy2 = note.c.y - o.stemlen;
          o.topy = o.stemy2;
          o.bottomy = note.c.stemy1 + note.c.h ;
          c.upStem = o;
  
          o = {};
          o.stemlen = highest.c.stemlen + Math.abs(lowest.c.y - note.c.y) + ld;
          o.stemy2 = note.c.y + o.stemlen;
          o.topy = o.stemy2;
          o.bottomy = note.c.stemy1 - note.c.h ;
          c.downStem = o;
         
          if (note.stemDirection() === "up") {
            meldObjectToObject(c.upStem, note.c);
          } else {
            meldObjectToObject(c.downStem, note.c);
          }
        }
      }
      
      function beamBww () {
      	var deltas = [0, 0];
//      	deltas[0] = highest.c.y - sdet.noteInfo.a3.y;
//      	deltas[1] = sdet.noteInfo.g1.y - lowest.c.y;
      
      	beamStraight(deltas[0],deltas[1]);
      
      }

      function beamSloped () {
/*
        var pivot, slope, pivoty, firsty, lasty, xspan;
        var first = grp[1];
        var last = grp[grp.length-2];
     
        if (c.stemUp) {
          pivot = highest;
        } else {
          pivot = lowest;
        }
     
        if (c.rect.height < 1 ) {
          slope = 0;
        } else {
          slope = c.rect.height / c.rect.width;
        }
	
        o = {};
        for (i=1; i<grp.length-1; i++) {
          note = grp[i];
          o.slope = slope;
          if (i == grp.length-2) {
            o.last = true;
            // FIXME : more pleasing beam/tail width for last in group
            o.width = note.width;
          } else {
            o.last = false;
            // FIXME : more pleasing beam/tail width for last in group
            o.width = grp[i+1].c.x - note.c.x;
          }
          
          xspan = note.c.x - pivot.c.x;

          note.c.stemlen = note.c.stemlen + 
                           Math.abs(pivot.c.y - note.c.y) +
                           Math.abs(pivot.c.y - (xspan * slope));
          note.c.beam = o;
          note.c.beamed = true;
        }
*/
      }


      if (this.sectionStart) return;         // 'look back' paint strategy
      
      grp = this.getNoteGroup();

      if (grp.length == 0) {
          logit("Error: Start : Calc cannot find mel in score.");
          logit(self);
          logit("Error: End");
          return;
      }

      calcBoundingNotes();

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


      if (sdet.beamStyle == "straight") {
        beamStraight();
      } else if (sdet.beamStyle == "bww") {
        beamBww();
      } else {
        beamSloped();
      }

      // request each note calc it's own beams
      //   once again this is a 'look back' strategy
      for (i=0; i<grp.length; i++) {
        note = grp[i];

        if (i == grp.length-1) {
          note.c.lastInGroup = true;
          note.calcBeams(grp[grp.length-2]);

        } else {
          if (i == 0) {
            note.c.firstInGroup = true;
          } else {
            note.c.firstInGroup = false;
          }

          note.c.lastInGroup = false;
          note.calcBeams(grp[i+1]);
        }
      
      }
    };


    ThisType.prototype.paint = function(staff) {
      if (this.sectionStart) return;         // 'look back' paint strategy
      var i;
      var grp = this.getNoteGroup();
      for (i=0; i < grp.length; i++) {
        grp[i].paint2(staff);
      }
    };
    
    Score.prototype.createBeamGroup = function() {
      return new ThisType();
    };
}());
