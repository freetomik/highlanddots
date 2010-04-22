"use strict";

function makeImageMap(staff, score) {
  var sdet = staff.details;
  
  var el = document.getElementById("canvas");  
  var canvasPos = API.getElementPosition(el);
  var imgEl, map, area;
  
  map = document.getElementById("hDotsMap");
  
  
  imagEl = document.getElementById("mapImage");
  if (!imgEl) {
    imgEl = new Image();
    imgEl.src = "pics/transparent.png";
    imgEl.id = "mapImage";
    imgEl.style.position = "absolute";
    imgEl.useMap = "#hDotsMap";
    document.body.appendChild(imgEl);
  }
  
  API.positionElement(imgEl, canvasPos[0], canvasPos[1]);
  
  API.sizeElement(imgEl, sdet.maxX, sdet.top);
  
  domTools.removeChildren(map);
  
  score.data.forEach(function(mel) {
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
        logit(["C:", x1, y1, x2, y2]);
        area.coords = [x1, y1, x2, y2].join(",");
        
        
        //ctx.fillStyle = "red";
        //ctx.fillRect(x1, y1, 2, 2);
        
        area.title = "Element: " + JSON.stringify(mel);
        map.appendChild(area);
        
      }                         
  }
  );
}

