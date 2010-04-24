"use strict";

(function() {
    var THISTYPE = "melody";
    
    function ThisType() {   
      this.stemDir = "down";
      this.c = {};
      return this;
    }
    
    ThisType.inherits(Note);
    ThisType.prototype.type = THISTYPE;
    ThisType.prototype.isPrintable = true;
    ThisType.prototype.scaleFactor = 1.0;
        
    Score.prototype.createMelodyNote = function() {
      return new ThisType();
    };
}());

