function primeGUI() {
  // Dunno why, but for some reason IE is being a pain and doesn't recogonize
  // the MyLibrary API functions right after 'onload'.
  //
  //HACK:
  window.setTimeout(primeGUI2,1);
}


function  primeGUI2() {
  function showPage(n) {
    function disable(el) {
      if (API.presentElement) {
        API.presentElement(el, false);
      }
    }
    function enable(el) {
      if (API.presentElement) {
        API.presentElement(el, true);
      }
    }
    
    var els = API.getEBCN("hd_page");
    var a;
    API.forEach(els, function(el, i) {
                disable(el);
                
                if (el.id === "hd_page_" + n) {
                  enable(el);
                }
    });
  }  
  
  var bar = API.getEBI("toolbarlanding");
  var b;
  
  API.emptyNode(bar);
  
  b = API.createElement("button");
  API.addElementText(b, "Preferences");
  API.attachListener(b, 'click', 
                     function() {
                     showPage(2);
                     }
                     );
  bar.appendChild(b);
  
  
  b = API.createElement("button");
  API.addElementText(b, "Score");
  
  API.attachListener(b, 'click', 
                     function() {
                     showPage(1);
                     }
                     );
  
  bar.appendChild(b);
  hdots_prefs.makeHdConfigForm();
  
  showPage(1);  
}



function testButton() {
  var f = hdots_prefs.getPluginFunction("s_engine");
  if (typeof f !== "function") {
    alert("Error, no plugin function");
  } else {
    f();
  }
}



var hdots_prefs = (
                   function()
                   {
                     var hdConfigData = [];
                     var formContentsId = "hd_config";
                     var formId = formContentsId + "_form";   
                     var formPrefix = []; // Give all the form elements a prefix to avoid collission
                     var SEP = '.';
                     var pluginTracker = {};
                     var pluginOptions = {};
                     var allValues = {};
                     var cookieName = 'HighlandDots'
                     var plugInPrefClassName = 'hd_pluginPref';
                     
                     if (API.getCookie) {
                       (function() {
                        var c = API.getCookie(cookieName, '{}');
                        allValues = JSON.parse(c); 
                       }());
                     }
                     
                     /* API Functions */
                     /* What function should be called by this plugin preference
                     This function creates a local copy of the preferences needed by /that/
                     particular plugin and passes it as a parameter to the plugin function.
                     */
                     function getPluginFunction(n) {
                       var s = getValueOf(n);
                       var pluginName;       // The plugin name
                       var localPrefs = {};  // Local preferences.
                       var a;                // Scratch area for temp calcs
                       if (s) {              // If there is a plugin choosen
                         
                         // Walk through all the values we have and pull out just the ones that
                         // match plugin we are after.
                         pluginName = [n, s].join(SEP);
                         
                         API.forEachProperty(allValues, function(v, k) {
                                             if (k.indexOf(pluginName + SEP) === 0) {
                                             // Rip off the <prefname> <plugin name> prefix
                                             a = k.split(SEP)
                                             a.shift();
                                             a.shift();
                                             localPrefs[a.join(SEP)] = v;
                                             }
                         }); 
                         
                         // Capture those values in a closure, and create a function to pass
                         // the parameters through.
                         var r = (function(_name, _pref) {
                             return function(p1, p2, p3) {
                               pluginTracker[_name](_pref, p1, p2, p3);
                             }
                         }(pluginName,localPrefs) );
                         return r;
                       }
                     }
                     
                     /*
                     The the value of a particular preference.
                     Note: This always returns a string
                     */
                     function getValueOf(n) {
                       return "" + allValues[n];
                     }
                     
                     function registerPreference(pref) {
                       var n;
                       hdConfigData.push(pref);
                       if (pref.type === "plugin") {
                         // The default is the first plugin added,
                         // so don't specify anything here
                         pluginTracker[pref.name] = {};
                       } else {
                         setDefaultValueOf(pref.name, pref.def);
                       }
                     }
                     
                     function registerPlugin(prefName, pluginName, desc, fun) {
                       var pref = getPreferenceByName(prefName, hdConfigData); 
                       var o1 = {};
                       var n = [prefName, pluginName].join(SEP);
                       o1[pluginName] = desc;
                       pref.options.push(o1);
                       pluginTracker[n] = fun;
                       pluginOptions[n] = [];
                       setDefaultValueOf(prefName, pluginName);
                     }
                     
                     function registerPluginPreference(prefName, pluginName, pref) {
                       pluginOptions[prefName + SEP + pluginName].push(pref);
                       setDefaultValueOf([prefName, pluginName,pref.name].join(SEP), pref.def);
                     }
                     
                     // Internal functions
                     function getPreferenceByName(n, a) {
                       var pref;
                       for(var i = 0, l = a.length; i < l; i++) {
                         pref = a[i];
                         if (pref.name === n) {return pref}
                       }
                     }
                     
                     function setDefaultValueOf(n, v) {
                       if (typeof allValues[n] === 'undefined') {
                         allValues[n] = v;
                       }
                       //logit(allValues);
                     }
                     
                     
                     // Actually draw the UI -- this is a biggie.
                     function makeHdConfigForm() {
                       var k, v;
                       var boxOver = API.getEBI('hd_config_plugin');
                       
                       
                       /// Drawing, proxy functions
                       
                       function getFormPrefix() {
                         var r = formPrefix.join(SEP) + SEP;
                         // Not SEP just by itself.
                         if (r === SEP) {r = "";}
                         return r;
                       }
                       
                       function getPrefFullFormName(v) {
                         return getFormPrefix() + v.name;
                       }
                       
                       function makeExpandedLabel(text) {
                         // Certain older browsers were known to eat a label if it wasn't
                         // wrapped in a span (and you did weird things with float).
                         // Mozilla 1.x (and subsequently in Netscape 7)
                         var label, span;
                         label = API.createElement("label");
                         span = API.createElement("span");
                         API.addElementText(span, text);
                         label.appendChild(span);
                         label.clear = "both";
                         return label;
                       }
                       
                       function addToForm(v, el, target) {
                         var label = makeExpandedLabel(v.label);
                         label.appendChild(el);
                         if (typeof el.name === "string") {
                           el.name = getPrefFullFormName(v);
                         }
                         target.appendChild(label);
                         target.appendChild(API.createElementWithAttributes('div', { 'class':'breaker' }));        
                       }
                       
                       function makeBoolean(v, target) {
                         var val = getValueOf(getPrefFullFormName(v));
                         val =  ("" + val === "true" ? true: false);
                         var el = API.createElementWithProperties('input', { type:'checkbox', checked: val });
                         addToForm(v, el, target);
                       }
                       
                       function makeText(v, target) {
                         var val = getValueOf(getPrefFullFormName(v));
                         var el = API.createElement("input");
                         if (val) {el.value = val};
                         addToForm(v, el, target);
                       }
                       
                       function makeRadio(v, target) {
                         var val = getValueOf(getPrefFullFormName(v));
                         var target = API.getEBI(formContentsId);
                         var el;
                         var i, l, o = {}, opt;
                         var o;
                         var f = API.createElement("fieldset");
                         var label, innerDiv;
                         var n;
                         
                         el = API.createElement("legend");
                         API.addElementText(el, v.label);
                         f.appendChild(el);
                         API.setStyle(f, 'border', '1px solid black')
                         opt = v.options;
                         
                         
                         for (i = 0, l = opt.length; i < l; i++) {
                           o = opt[i];
                           
                           API.forEachProperty(o, function(p, i) {
                                               var doSetCheck = false;
                                               var doCheckEl;
                                               
                                               label = makeExpandedLabel(p);
                                               el = API.createElement("input");
                                               el.type = "radio";
                                               //el.type = "button";
                                               el.name = getFormPrefix() + v.name;
                                               el.value = i;
                                               
                                               
                                               if (i === val) {
                                                 // Thank you, you piece of shite IE
                                                 // browser!  Really!
                                                 // Everybody else lets you set the checked
                                                 // flag at the time of creation.  IE will let
                                                 // you set it, but won't honor it until it is 
                                                 // added to the document.
                                                 doCheckEl = el;
                                                 doSetCheck = true;
                                               }
                                               
                                               label.appendChild(el);
                                               f.appendChild(label);
                                               f.appendChild(API.createElementWithAttributes('div', { 'class':'breaker' }));
                                               innerDiv = API.createElement("div");
                                               n = [v.name, i].join(SEP);
                                               
                                               
                                               API.attachListener(el, 'click', 
                                                                  function(_n) {
                                                                  return function() { 
                                                                    setPluginPrefVis();
                                                                  };
                                                                  }(n)
                                                                  );
                                               
                                               innerDiv.id = n;
                                               API.addClass(innerDiv, plugInPrefClassName);
                                               
                                               formPrefix.push(n);
                                               makeFormFields(pluginOptions[n],innerDiv);
                                               formPrefix.pop();
                                               
                                               if (!innerDiv.firstChild) {
                                                 API.addElementText(innerDiv, "Nothing to configure");
                                               }
                                               f.appendChild(innerDiv);
                           
                                               if (doSetCheck) {
                                                 doCheckEl.checked = true;
                                               }
                                      
                           });
                         }
                         target.appendChild(f);
                       }
                       
                       function makeSelect(v, target) {
                         var val = getValueOf(getPrefFullFormName(v));
                         var el = API.createElement("select");
                         var i, l, o = {}, opt;
                         var o;
                         opt = v.options;
                         for (i = 0, l = opt.length; i < l; i++) {
                           o = opt[i];
                           API.forEachProperty(o, function(p) {
                                               API.addOptions(el, o);
                                               if (p === val) { el.selectedIndex = i; }
                           });
                         }
                         addToForm(v, el, target);
                       }
                       
                       function getDataFromForm() {
                         var s = API.HD_serializeFormUrl(API.getEBI(formId));
                         API.forEachProperty(s, function(v, k) {
                                             allValues[k] = v;
                                             });
                       }
                       
                       function makeAcceptButton(v, target) {
                         var target = API.getEBI(formContentsId);
                         var el = API.createElement("button");
                         API.addElementText(el, "Accept");
                         API.attachListener(el, 'click', function() {
                                            getDataFromForm();
                                            var c = JSON.stringify(allValues);
                                            if (API.setCookie) {
                                              API.setCookie(cookieName, c, 256);
                                            }
                                            API.cancelPropagation(el);
                                            return API.cancelDefault(el);
                         });
                         target.appendChild(el);
                       }
                       
                       function makeFormFields(data, target) {
                         for(var i = 0, l = data.length; i < l; i++) {
                           var v = data[i];
                           switch (v.type) {
                           case "select":
                             makeSelect(v, target);
                             break;
                           case "plugin":
                             makeRadio(v, target);
                             break;
                           case "text":
                             makeText(v, target);
                             break;
                           case "boolean":
                             makeBoolean(v, target);
                             break;
                           }
                         }
                       }
                       makeFormFields(hdConfigData, API.getEBI(formContentsId));
                       makeAcceptButton(v, API.getEBI(formContentsId));
                       setPluginPrefVis();
                     }
                     
                     
                     function setPluginPrefVis() {
                       function disable(el) {
                         if (API.presentElement) {
                           API.presentElement(el, false); // Hide it
                         }
                       }
                       function enable(el) {
                         if (API.presentElement) {
                           API.presentElement(el, true);
                         }
                       }
                       
                       var els = API.getEBCN(plugInPrefClassName);
                       var a;
                       API.forEach(els, function(el, i) {
                                   disable(el);
                                   
                                   // Get the form data.
                                   var s = API.HD_serializeFormUrl(API.getEBI(formId));
                                   a = el.id.split(SEP); // Split up the id
                                   s = s[a[0]];          // And get the right value from the form
                                   
                                   if (s === a[1]) {     // If it matches what we are looking for
                                     enable(el);
                                   }
                       });
                     }
                     
                     return {
                       allValues: allValues, // DEBUGGING
                       registerPluginPreference: registerPluginPreference,
                       registerPreference: registerPreference,
                       getPluginFunction: getPluginFunction,
                       registerPlugin: registerPlugin,    
                       getValueOf: getValueOf,
                       makeHdConfigForm: makeHdConfigForm
                     };
                   }
                   ()
                   );

/*
Augment the standard 'My Library' .. eventually, this code should go into the
tools section to be re-used later.
*/

if (API.getOptionValue) {
  var serializeFormUrl = function(f) {
    var e, // form element
    n, // form element's name
    t, // form element's type
    o, // option element
    es = f.elements,
    c = {}; // Hold the values from the form.
    var reCheck = new RegExp('^(checkbox|radio)$');
    var reText = new RegExp('^(text|password|hidden|textarea)$');
    function add(n, v) {
      c[n]=v;
    }
    for (var i=0, ilen=es.length; i<ilen; i++) {
      e = es[i];
      n = e.name;
      if (n /* && !e.disabled */) {
        t = e.type;
        if (!t.indexOf('select')) {
          // The 'select-one' case could reuse 'select-multiple' case
          // The 'select-one' case code is an optimization for
          // serialization processing time.
          if (t == 'select-one' || e.multiple === false) {
            if (e.selectedIndex >= 0) {
              add(n, API.getOptionValue(e.options[e.selectedIndex]));
            }
          }
          else {
            for (var j = 0, jlen = e.options.length; j < jlen; j++) {
              o = e.options[j];
              if (o.selected) {
                add(n, API.getOptionValue(o));
              }
            }
        }         }
        else if (reCheck.test(t)) {
          if (t === "radio") {
            if (e.checked) { add(n, e.value || "true"); }
          } else {
            if (e.checked) { add(n, /* e.value ||*/ "true"); }
            if (!e.checked) { add(n, "false"); }
          }
        }
        else if (reText.test(t)) {
          add(n, e.value);
        }
      }
    }
    return c; //.join('&');
  };
  API.HD_serializeFormUrl = serializeFormUrl;
}



function prepConfig() {
  var pref;
    
  hdots_prefs.registerPreference( {
                                 type: "boolean",
                                 name: "boundingbox",
                                 label: "Draw bounding boxes?",
                                 def: false
  });
  
  hdots_prefs.registerPreference( {
                                 type: "boolean",
                                 name: "logging",
                                 label: "Enable logging?",
                                 def: false
  });
  
  
  hdots_prefs.registerPreference( {
                                 type: "plugin",
                                 label: "Score Beautify Engine",
                                 name: "beauty_engine",
                                 options: []
  });
}
prepConfig();

