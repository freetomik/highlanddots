"use strict";

(function() {
 var THISTYPE = "embellishment";

 function ThisType() {  
   this.stemDir = "up";
   
   return this;
 }
 
 ThisType.inherits(Note);
 
 ThisType.prototype.isPrintable = true;
 ThisType.prototype.scaleFactor = 0.75;
 ThisType.prototype.duration = 32;
 ThisType.prototype.type = THISTYPE;
 
 
 ThisType.prototype.paint = function(staff) {
   this.note = this.note.toUpperCase();
   this.staffPosition = GHPRef[this.note];
   this.paint2(staff);
   //staff.details.x += staff.details.space * this.scaleFactor;
 };
 
 Score.prototype.createEmbellishment = function() {
   return new ThisType();
 };
}
());



(function() {
 var THISTYPE = "egrp";

 function ThisType(mel) {  
   this.notes = [];
   this.type = THISTYPE;   
   return this;
 }

 ThisType.prototype.appendNode = function(mel) {
   this.notes.push(mel);
 };

 
 ThisType.prototype.noteCount = function() {
   return (this.notes.length);
 };
 
 ThisType.prototype.paint = function(staff) {
   
   var i,x;
   var note;
   
   x = staff.details.x;
   for (i = 0; i < this.notes.length; i++) {
     note = this.notes[i];

     note.paint(staff);
     staff.details.x += staff.details.space * note.scaleFactor;
   }
   staff.details.x = x;
 };
 
 Score.prototype.createEmbellishmentGroup = function() {
   return new ThisType();
 };
}
());
