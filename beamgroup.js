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
      this.calc(staff);  
      return null;

    };

    ThisType.prototype.calc = function(staff) {  
      if (this.sectionStart) return;         // 'look back' calc strategy
      var i, o, note, highest, lowest, grp;
      var sdet = staff.details;
      var c = this.c;

      function straight () {
        for (i=1; i<grp.length-1; i++) {

          note = grp[i];

          o = {};
          o.stemlen = highest.c.stemlen + Math.abs((highest.c.y - note.c.y));
          o.stemy2 = c.y - o.stemlen;
          o.topy = o.stemy2;
          o.bottomy = note.c.stemy1 + note.c.h ;
          c.upStem = o;
  
          o = {};
          o.stemlen = highest.c.stemlen + Math.abs(highest.c.y - note.c.y);
          o.stemy2 = c.y + o.stemlen;
          o.topy = o.stemy2;
          o.bottomy = note.c.stemy1 - note.c.h ;
          c.downStem = o;
         
          if (this.stemUp) {
            meldObjectToObject(c.upStem, note.c);
          } else {
            meldObjectToObject(c.downStem, note.c);
          }

          o = {};
          o.slope = 0;
          if (i == grp.length-2) {
            o.last = true;
            // FIXME : more pleasing beam/tail width for last in group
            o.width = note.width;
          } else {
            o.last = false;
            // FIXME : more pleasing beam/tail width for last in group
            o.width = grp[i+1].c.x - note.c.x;
          }
          note.c.beam = o;
          note.c.beamed = true;
        }
      }
   
      function sloped () {
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
      }

      c.rect = {};
      o = {};

      grp = score.collections.findIn(this, score.collections.beams);
      c.stemUp = (grp[1].stemDirection() == "up");
      c.sloped = (sdet.beamStyle == "sloped");

      highest = grp[1];
      for (i=1; i<grp.length-1; i++) {
        note = grp[i];
        if (note.c.y < highest.c.y) {
          highest = note;
        }
      }
      lowest = grp[1];
      for (i=1; i<grp.length-1; i++) {
        note = grp[i];
        if (note.c.y > lowest.c.y) {
          lowest = note;
        }
      }

      o.x = grp[1].c.y;
      o.y = highest.c.y;
      o.width = grp[grp.length-2].c.x - grp[1].c.x;
      o.height = lowest.c.y - highest.c.y;

      meldObjectToObject(o, c.rect);

      if (c.sloped) {
        sloped();
      } else {
        straight();
      }

    }


    ThisType.prototype.paint = function(staff) {
      if (this.sectionStart) return;         // 'look back' paint strategy
      grp = score.collections.findIn(this, score.collections.beams);
      for (i=1; i<grp.length-1; i++) {
        note = grp[i];
        note.paint(staff);
      }

    };
    
    Score.prototype.createBeamGroup = function() {
      return new ThisType();
    };
}());
