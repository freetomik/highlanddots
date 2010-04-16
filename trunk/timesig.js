
"use strict";

(function() {
 var THISTYPE = "timesig";
 function ThisType(note) {   
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 Score.prototype.createTimeSig = function(s) {
   return new ThisType(s);
 };
}
)();

