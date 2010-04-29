

function doIt() {
  hdots_prefs.prepConfig();
  
  hdots_prefs.registerPlugin("s_engine", "short", "The short version", undefined);  
  hdots_prefs.registerPlugin("s_engine", "long", "The Long Version", undefined);  
  
  hdots_prefs.makeHdConfigForm();
  alert(hdots_prefs.getValueOf("color1"));
}


var hdots_prefs = (function() {
                   var hdConfigData = [];
                   
                   
                   function getValueOf(n) {
                     var o = hdConfigData[n];
                     if (o) {
                       if (o.value) {return o.value;}
                       return o.def;
                     }
                   }
                   
                   
                   function addConfigOption(o) {
                     var n = o.name;
                     hdConfigData[n] = o;                 
                   }
                   
                   function prepConfig() {
                     var o;
                     
                     o = {
                       type: "select",
                       label: "Note color",
                       name: "color1",
                       def:  "blue",
                       options: [
                         {"#FF0000": "red"},
                         {"#0000FF": "blue"},
                         {"#00FF00": "green"}
                       ],
                     };
                     
                     addConfigOption(o);
                     
                     o = {
                       type: "boolean",
                       name: "outlines",
                       label: "Draw outlines?",
                       def: true
                     }
                     
                     addConfigOption(o);
                     
                     o = {
                       type: "plugin",
                       label: "Spacing Engine",
                       name: "s_engine",
                       def:  "",
                       options: [],
                     };
                     
                     addConfigOption(o);
                     
                     
                     
                   }
                   
                   function makeHdConfigForm() {
                     var k, v;
                     var FORMNAME = "hd_config";
                     
                     function addToForm(el) {
                       var target = API.getEBI(FORMNAME);
                       
                       var label = API.createElement("label");
                       API.addElementText(label, v.label + ": ");
                       label.appendChild(el);
                       el.name = "hd_" + v.name;
                       
                       
                       target.appendChild(label);
                       target.appendChild(API.createElement("br"));
                     }
                     
                     function makeBoolean() {
                       var el = API.createElementWithProperties('input', { type:'checkbox', checked:v.def });
                       addToForm(el);    
                     }
                     
                     function makeSelect() {
                       var el = API.createElement("select");
                       var i, l, o = {}, opt;
                       var o;
                       opt = v.options;
                       
                       
                       for (i = 0, l = opt.length; i < l; i++) {
                         o = opt[i];
                         API.forEachProperty(o, function(p) {
                                             API.addOption(el, p, o[p]);
                                             if (p === v.def) { el.selectedIndex = i; }
                                             
                         });
                         
                       }
                       addToForm(el);
                     }
                     
                     
                     function getDataFromForm() {
                       
                     }
                     
                     function makeAcceptButton() {
                       var target = API.getEBI(FORMNAME);
                       var el = API.createElement("button");
                       API.addElementText(el, "Accept");
                       API.attachListener(el, 'click', function() {
                                          window.alert('Clicked!');
                                          API.cancelPropagation(el);
                                          
                                          return API.cancelDefault(el);
                       });  
                       target.appendChild(el);
                       
                     }
                     
                     for (k in hdConfigData) {
                       if (hdConfigData.hasOwnProperty(k)) {
                         v = hdConfigData[k];
                         switch (v.type) {
                         case "select":
                         case "plugin":
                           makeSelect();
                           break;
                         case "boolean":
                           makeBoolean();
                           break;
                         }
                       }
                     }
                     
                     makeAcceptButton();
                     
                   }
                   
                   function registerPlugin(optionName, pluginName, desc, fun) {
                   var o = hdConfigData[optionName];
                   var o1 = {}
                   o1[pluginName] = desc;
                   o.options.push(o1);
                   }
                   
                   return {
                     registerPlugin: registerPlugin, 
                     getValueOf: getValueOf,
                     prepConfig: prepConfig, 
                     makeHdConfigForm: makeHdConfigForm
                   };
}());


/**
*
*  URL encode / decode
*  http://www.webtoolkit.info/
*
**/

var Url = {
  
  // public method for url encoding
  encode : function (string) {
    return escape(this._utf8_encode(string));
  },
  
  // public method for url decoding
  decode : function (string) {
    return this._utf8_decode(unescape(string));
  },
  
  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    
    for (var n = 0; n < string.length; n++) {
      
      var c = string.charCodeAt(n);
      
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      
    }
    
    return utftext;
  },
  
  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    
    while ( i < utftext.length ) {
      
      c = utftext.charCodeAt(i);
      
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
      
    }
    
    return string;
  }
  
}