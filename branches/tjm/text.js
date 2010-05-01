"use strict";

(function() {
    var THISTYPE = "text";
    
    function ThisType() { 
      this.txt = "";
      this.size = staff.details.space;
      this.style = ""; // bold|italic
      this.c = {};                  // Storage area for some commonly used calcuations.
      return this;
    }

    ThisType.inherits(ScoreElement);
    
    ThisType.prototype.type = THISTYPE;
    ThisType.prototype.isPrintable = true;
        
    ThisType.prototype.getBoundingRect = function(staff) {

      o = {};
      o.x = c.originx;
      o.y = (c.originy <= c.endy) ? c.cp1y1 : c.cp2y1;
      o.height = c.height;
      o.width = c.width;

      return o;

    };

    ThisType.prototype.calc = function(staff) {  
      var sdet = staff.details;
      var c = this.c;
    }

    ThisType.prototype.paintAt = function(staff, txt, metrics) {
      // metrics should contain x,y,font,style,size,align;
      var x,y,width;
      var txtMetrics, tx;
      var sdet = staff.details;
      var ctx = sdet.ctx;
      var tf = ctx.font;
      var ta = ctx.textAlign;

      x = metrics.x;
      y = metrics.y;
      metrics.style = (metrics.style) ? metrics.style + " " : "";
      metrics.size = (metrics.size) ? metrics.size : sdet.space;
      metrics.font = (metrics.font) ? metrics.font : "sans-serif";
      metrics.align = (metrics.align) ? metrics.align : "left";
      
      ctx.font = metrics.style + metrics.size + "px" + metrics.font;
      txtMetrics = ctx.measureText(txt);
      width = txtMetrics.width;
      if (metrics.align === "right") {
        x = x - width;
      } else if (metrics.align === "center") {
        x = x - (width/2);
      } else {
        metrics.align = "left";
      }

      ctx.font = "bold " + (sdet.space*2.55) + "px sans-serif";
      ctx.textAlign = metrics.align;
alert("["+x+","+y+"] "+txt);
      ctx.fillText(txt, x, y);
      ctx.font = tf;
      ctx.textAlign = ta;

    };
    
    Score.prototype.createText = function() {
      return new ThisType();
    };
}());
