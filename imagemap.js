"use strict";

function makeImageMap(staff, score) {
  //HACK:
  //return;
  
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
    
    if (mel.c && mel.c.staffCounter) {
      setIfExists(mel.c, o, "staffCounter");
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
    if (API.setOpacity) {
      imgEl.src = "pics/black.gif";
      imgEl.src = "pics/transparent-gif.gif";
      API.setOpacity(imgEl, 0.10);
      
    } else {
      imgEl.src = "pics/transparent-gif.gif";
      
    }
    API.setAttribute(imgEl, 'style', 'border: 1px solid green');
    
    imgEl.id = "mapImage";
    imgEl.useMap = "#hDotsMap";
    
    API.getEBI('imagemap_div').appendChild(imgEl);
  }
  
  API.overlayElement(imgEl, el, true);
  
  domTools.removeChildren(map);
  
  var babble = hdots_prefs.getValueOf("fill_image_map") === "true";
  var areaProto = document.createElement("area");
  areaProto.nohref = 'nohref'; 
  areaProto.className = 'hand';                       
  areaProto.shape = "rect";
  
  score.data.forEach(function(mel) {
                     if (!mel) {return;}
                     
                     var ctx = sdet.ctx;
                     var rect = mel.rect;
                     if (rect) {
                       
                       var x1 = Math.round(rect.x);
                       var y1 = Math.round(rect.y);
                       
                       var x2 = x1 + Math.round(rect.width);
                       var y2 = y1 + Math.round(rect.height);
                       
                       area = areaProto.cloneNode(true);
                       
                       //logit(["ImageMap", x1, y1, x2, y2]);
                       area.coords = [x1, y1, x2, y2].join(",");
                       
                       //ctx.fillStyle = "red";
                       //ctx.fillRect(x1, y1, 2, 2);
                       
                       if (babble) {
                       area.title = "Element: " + JSON.stringify(getInfo(mel), undefined, " ");
                       }
                       map.appendChild(area);
                       
                     }                         
  }
  );
}


