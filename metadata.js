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
   return this.rect;
   
 };
 
 ThisType.prototype.calc = function(staff, location) {  
   var sdet = staff.details;
   var ctx = sdet.ctx;
   var c = this.c;
   var rect = {};
   var o;
   var self=this;
   
   function calcHeader() {
     if (self.Title) {
       o = {};
       o.width = ctx.measureText(self.Title).width;
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
     
     if (self.Genre) {
       o = {};
       o.x = sdet.leftMargin;
       o.y = rect.y + rect.height;
       o.height = sdet.space*2.5;
       o.width = ctx.measureText(self.Genre).width;
       o.size = sdet.space*2;
       o.style = "bold";
       o.font = "sans-serif";
       o.align = "left";
       c.genre = o;
       
       rect.height += c.genre.height;
       
     }
     
     if (self.Composer) {
       o = {};
       o.x = sdet.canvas.width - sdet.leftMargin;
       o.y = rect.y + rect.height;
       o.height = sdet.space*2.5;
       o.width = ctx.measureText(self.Composer).width;
       o.size = sdet.space*2;
       o.style = "bold";
       o.font = "sans-serif";
       o.align = "right";
       c.composer = o;
       
       rect.height += c.composer.height;
       
     }
     
     if (self.TuneTempo && self.beatUnit) {
       o = {};
       o.notex = sdet.leftMargin;
       o.x = o.notex + (sdet.space *2);   // this space should be note width * 2
       o.y = rect.y + rect.height;
       o.height = sdet.space*2;
       o.size = sdet.space*1.75;
       o.width = ctx.measureText(" =  " + self.TuneTempo).width;
       o.noteSize = sdet.space*0.6;
       o.style = "italic";
       o.font = "sans-serif";
       o.align = "left";
       c.tempo = o;
       
       rect.height += c.tempo.height;
       
     }
   }
   
   function calcFooter() {
     if (self.Footer) {
       o = {};
       o.width = ctx.measureText(self.Title).width;
       o.x = (rect.width/2) - (o.width/2);
       o.y = rect.y + rect.height;
       o.height = sdet.space*3;
       o.size = sdet.space*2.55;
       o.style = "bold";
       o.font = "sans-serif";
       o.align = "center";
       c.footer = o;
       
       rect.height += c.title.height;
       
     }
   }
   
   c.rect = rect;
   rect.x = sdet.x;
   rect.y = sdet.top;
   rect.height = 0;
   rect.width = sdet.canvas.width;
   
   
   if (location === "header") {
     calcHeader();
   }
   if (location === "footer") {
     calcFooter();
   }
   
   self.rect = rect;
 };
 
 
 
 
 ThisType.prototype.paint = function(staff, location) {
   var sdet = staff.details;
   var ctx = sdet.ctx;
   var c = this.c;
   var tf, ta;
   var self=this;
   
   function paintText(txt, metrics) {
     tf = ctx.font;
     ta = ctx.textAlign;
     
     ctx.font = metrics.style +" "+ metrics.size + "px " + metrics.font;
     ctx.textAlign = metrics.align;
     ctx.fillText(txt, metrics.x, metrics.y);
     ctx.font = tf;
     ctx.textAlign = ta;
     
   }
   
   function paintHeader() {
     if (self.Title) paintText(self.Title, c.title);
     if (self.Genre) paintText(self.Genre, c.genre);
     if (self.Composer) paintText(self.Composer, c.composer);
     
     if (self.TuneTempo) {
       var ts, tx;
       
       paintText(" =  " + self.TuneTempo, c.tempo);
       
       var n = score.createMelodyNote();
       n.duration = self.beatUnit;
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
   }
   
   function paintFooter() {
     if (self.Footer) paintText(self.Footer, c.footer);
   }
   if (location === "header") {
     paintHeader();
   }
   if (location === "footer") {
     paintFooter();
   }
   
   
   
 };
 
 Score.prototype.createMetadata = function() {
   return new ThisType();
 };
}());
