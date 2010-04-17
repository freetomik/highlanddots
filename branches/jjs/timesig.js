
"use strict";

(function() {
 var THISTYPE = "timesig";
 function ThisType() {   
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 
 Score.prototype.createTimeSig = function() {
   return new ThisType();
 };
}
)();

