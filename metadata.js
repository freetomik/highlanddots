"use strict";

(function() {
    var THISTYPE = "metadata";

    function ThisType() {
      this.c = {};                  // Storage area for some commonly used calcuations.
      return this;
    }

    ThisType.inherits(ScoreElement);

    ThisType.prototype.type = THISTYPE;
    ThisType.prototype.isPrintable = true;

    ThisType.prototype.getBoundingRect = function(staff) {

      return this.c.rect;

    };

     ThisType.prototype.calc = function(staff) {
      var sdet = staff.details;
      var ctx = sdet.ctx;
      var c = this.c;
      var rect = {};
      var o;

      c.rect = rect;
      rect.x = sdet.x;
      rect.y = sdet.top;
      rect.height = 0;
      rect.width = sdet.canvas.width;

      if (this.Title) {
        o = {};
        o.width = ctx.measureText(this.Title).width;
        o.x = (rect.width/2) - (o.width/2);
        o.y = rect.y + rect.height;
        o.height = sdet.space*3;
        o.size = sdet.space*2.55;
        o.style = "bold";
        o.font = "sans-serif";
        o.align = "center";
        c.title = o;

        rect.height += c.title.height;

      }

      if (this.Genre) {
        o = {};
        o.x = sdet.leftMargin;
        o.y = rect.y + rect.height;
        o.height = sdet.space*2.5;
        o.width = ctx.measureText(this.Genre).width;
        o.size = sdet.space*2;
        o.style = "bold";
        o.font = "sans-serif";
        o.align = "left";
        c.genre = o;

        rect.height += c.genre.height;

      }

      if (this.Composer) {
        o = {};
  o.x = sdet.canvas.width - sdet.leftMargin;
        o.y = rect.y + rect.height;
        o.height = sdet.space*2.5;
        o.width = ctx.measureText(this.Composer).width;
        o.size = sdet.space*2;
        o.style = "bold";
        o.font = "sans-serif";
        o.align = "right";
        c.composer = o;

        rect.height += c.composer.height;

      }

      if (this.TuneTempo && this.beatUnit) {
        o = {};
        o.notex = sdet.leftMargin;
        o.x = o.notex + (sdet.space *2);   // this space should be note width * 2
        o.y = rect.y + rect.height;
        o.height = sdet.space*2;
        o.size = sdet.space*1.75;
        o.width = ctx.measureText(" =  " + this.TuneTempo).width;
        o.noteSize = sdet.space*0.6;
        o.style = "italic";
        o.font = "sans-serif";
        o.align = "left";
        c.tempo = o;

        rect.height += c.tempo.height;

      }

   };




    ThisType.prototype.paint = function(staff) {

      var sdet = staff.details;
      var ctx = sdet.ctx;
      var c = this.c;
      var tf, ta;

      function paintText(txt, metrics) {
        tf = ctx.font;
        ta = ctx.textAlign;

        ctx.font = metrics.style +" "+ metrics.size + "px " + metrics.font;
        ctx.textAlign = metrics.align;
        ctx.fillText(txt, metrics.x, metrics.y);
        ctx.font = tf;
        ctx.textAlign = ta;

      }

      if (this.Title) paintText(this.Title, c.title);
      if (this.Genre) paintText(this.Genre, c.genre);
      if (this.Composer) paintText(this.Composer, c.composer);

      if (this.TuneTempo) {
        var ts, tx;

        paintText(" =  " + this.TuneTempo, c.tempo);

        var n = score.createMelodyNote();
        n.duration = this.beatUnit;
        n.staffPosition = 'floating';
        n.stemDir = "up";
        tx = sdet.x;
        ts = sdet.space

        sdet.x = c.tempo.notex;
        sdet.space = c.tempo.noteSize;

        sdet.noteInfo.floating.x = c.tempo.notex;
        sdet.noteInfo.floating.y = c.tempo.y;

        n.calc(staff);
        n.paint(staff);

        sdet.x = tx;
        sdet.space = ts;

      }

    };

    Score.prototype.createMetadata = function() {
      return new ThisType();
    };
}());

