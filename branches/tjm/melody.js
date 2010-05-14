"use strict";

(function() {
    var THISTYPE = "melody";
    
    function ThisType() {   
      this.stemDir = "down";
      this.b = {};                  // Storage area beaming calcuations.
      this.c = {};                  // Storage area for co-ords and dimensions
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

