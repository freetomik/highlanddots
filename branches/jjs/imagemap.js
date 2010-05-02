"use strict";

function makeImageMap(staff, score) {
function getInfo(mel) {
  var o ={"Note" : mel.note,
    "Dur" : mel.duration,
    "padding" : mel.paddingRight,
    "x": mel.rect.x
  };  

  o.idx = score.data.indexOf(mel);

  if (mel.forceToX2) {
    o.forceToX2 = mel.forceToX2;
  }    
  

  if (mel.b) {  
  if (mel.b.beatWeight) {
    o.beatWeight = mel.b.beatWeight;
  }
  
  if (mel.b.beatCountOnLine) {
    o.beatCountOnLine = mel.b.beatCountOnLine;
  }

  
  if (mel.b.isLeadIn) {
    o.extra = "lead in";
  }
  if (mel.b.isLeadOut) {
    o.extra = "lead out";
  }
  }

  
  
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


