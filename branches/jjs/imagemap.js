"use strict";

function makeImageMap(staff, score) {
  function getInfo(mel) {
    function setIfExists(src, dest, prop) {
      if (src && src[prop]) {
        dest[prop] = src[prop];
      }
    }
    
    var o = {};
    
    o.idx = score.data.indexOf(mel);
    setIfExists(mel, o, "type");
    setIfExists(mel, o, "note");
    setIfExists(mel, o, "midiName");
    setIfExists(mel, o, "midiNote");
    setIfExists(mel, o, "shortNoteName");
    
    setIfExists(mel, o, "duration");
    setIfExists(mel, o, "beatFraction");
    setIfExists(mel, o, "measureLength");
    setIfExists(mel, o, "beatsPerBar");
    
    setIfExists(mel, o, "paddingRight");
    setIfExists(mel, o, "forceToX2"); 
    setIfExists(mel, o, "noForceX");

    
    if (mel.rect) {
      setIfExists(mel.rect, o, "x");
    }
    
    setIfExists(mel, o, "isLeadIn");
    setIfExists(mel, o, "isLeadOut");
    
    return o; 
    
  }
  
  var sdet = staff.details;
  
  var el = sdet.canvas // document.getElementById("canvas");  
  var canvasPos = API.getElementPosition(el);
  var imgEl, map, area;
  
  map = document.getElementById("hDotsMap");
  
  
  imgEl = document.getElementById("mapImage");
  if (!imgEl) {
    imgEl = new Image();
    imgEl.src = "pics/transparent.png";
    imgEl.id = "mapImage";
    imgEl.style.position = "absolute";
    imgEl.useMap = "#hDotsMap";
    
    API.getEBI('hd_page_1').appendChild(imgEl);
  }
  
  API.positionElement(imgEl, canvasPos[0], canvasPos[1]);
  
  API.sizeElement(imgEl, sdet.top, sdet.maxX);
  
  domTools.removeChildren(map);
  
  score.data.forEach(function(mel) {
                     if (!mel) {return;}
                     
                     var ctx = sdet.ctx;
                     var rect = mel.rect;
                     if (rect) {
                       
                       var x1 = Math.round(rect.x);
                       var y1 = Math.round(rect.y);
                       
                       var x2 = x1 + Math.round(rect.width);
                       var y2 = y1 + Math.round(rect.height);
                       
                       area = document.createElement("area");
                       
                       area.href = "#";
                       area.shape = "rect";
                       //logit(["ImageMap", x1, y1, x2, y2]);
                       area.coords = [x1, y1, x2, y2].join(",");
                       
                       
                       //ctx.fillStyle = "red";
                       //ctx.fillRect(x1, y1, 2, 2);
                       
                       area.title = "Element: " + JSON.stringify(getInfo(mel), undefined, " ");
                       map.appendChild(area);
                       
                     }                         
  }
  );
}


