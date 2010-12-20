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
                     var uiConfig = {};
                     var uiElement;
                     
                     var cookieName = 'HighlandDots'
                     var plugInPrefClassName = 'hd_pluginPref';
                     var formContentsId = "hd_config";
                     var formId = formContentsId + "_form";
                     var formPrefix = []; // Give all the form elements a prefix to avoid collission
                     var SEP = '.';
                     var hdConfigData = [];
                     var pluginTracker = {};
                     var pluginOptions = {};
                     var allValues = {};
                     
                     
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
                     
                     
                     function getUi() {
                       if (!uiElement) {
                         makeHdConfigForm();
                         if (uiConfig.useForUi) {
                           uiConfig.useForUi.appendChild(uiElement);
                         }
                       }
                       if (!uiConfig.useForUi) {
                         return uiElement;
                       }
                     }
                     
                     
                     // Actually draw the UI -- this is a biggie.
                     function makeHdConfigForm() {
                       
                       var k, v;
                       var boxOver, formEl,elem;
                       // FIXME : use API library
                       boxOver = document.createElement('div');
                       boxOver.className = plugInPrefClassName;
                       boxOver.id = "hd_page_2";
                       
                       formEl = document.createElement('form');
                       formEl.action = "#";
                       formEl.id = formContentsId;
                       formEl.onsubmit = "return false;";
                       boxOver.appendChild(formEl);
                       
                       elem = document.createElement('div');
                       elem.id = "hd_config_plugin";
                       boxOver.childNodes[0].appendChild(elem);
                       
                       elem = document.createElement('div');
                       elem.id = "hd_config";
                       boxOver.childNodes[0].appendChild(elem);
                       
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
                         var target = formEl;
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
                                               var radioName = getFormPrefix() + v.name;
                                               var err;
                                               var s;
                                               
                                               label = makeExpandedLabel(p);
                                               
                                               try {
                                                 // This is the only way you can set the "name" attribute in IE, but it will fail in other browsers
                                                 s = "";
                                                 s += 'name="' + radioName + '" ';
                                                 s += 'type="' + "radio" + '" ';
                                                 s += 'value="' + i + '" ';
                                                 
                                                 if (i === val) {
                                                   s += 'checked="' + "true" + '" ';
                                                 }
                                                 s = '<input ' + s + '>';
                                                 //alert(s + val);
                                                 el = document.createElement(s);
                                               } catch(err) {
                                                 // The above will fail if not in IE, so try it the correct way here
                                                 
                                                 el = API.createElement("input");
                                               }
                                               el.type = "radio";
                                               //el.type = "button";
                                               el.name = radioName;
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
                                                                    setPluginPrefVis(formEl);
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
                         var s = API.HD_serializeFormUrl(formEl);
                         API.forEachProperty(s, function(v, k) {
                                             allValues[k] = v;
                                             });
                       }
                       
                       function makeAcceptButton(v, target) {
                         var target = formEl;
                         var el = API.createElement("button");
                         API.addElementText(el, "Accept");
                         API.attachListener(el, 'click', function(evt) {
                                            getDataFromForm();
                                            var c = JSON.stringify(allValues);
                                            if (API.setCookie) {
                                              API.setCookie(cookieName, c, 256);
                                            }
                                            //API.cancelPropagation(evt);
                                            
                                            uiElement.parentNode.removeChild(uiElement);
                                            uiElement = null;
                                            popupManager.close();
                                            return API.cancelDefault(evt);
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
                       makeFormFields(hdConfigData, formEl);
                       setPluginPrefVis(formEl);
                       
                       
                       makeAcceptButton(v, formEl);
                       
                       uiElement = boxOver;
                       
                     }
                     
                     
                     function setPluginPrefVis(srcForm) {
                       var innerClassName = plugInPrefClassName + "_i";
                       
                       function disable(el) {
                         API.removeClass(el, innerClassName);
                         
                         if (API.presentElement) {
                           API.presentElement(el, false); // Hide it
                         }
                       }
                       function enable(el) {
                         if (API.presentElement) {
                           API.presentElement(el, true);
                         }
                         API.addClass(el, innerClassName);
                       }
                       
                       // The form may not be added to the document yet.
                       var els = API.getEBCN(plugInPrefClassName, srcForm);
                       var a;
                       
                       var formInfo =  API.HD_serializeFormUrl(srcForm);
                       //alert(JSON.stringify(formInfo));
                       API.forEach(els, function(el, i) {
                                   disable(el);
                                   
                                   // Get the form data.
                                   var s = API.HD_serializeFormUrl(srcForm);//API.getEBI(formId));
                                   a = el.id.split(SEP); // Split up the id
                                   s = s[a[0]];          // And get the right value from the form
                                   
                                   if (s === a[1]) {     // If it matches what we are looking for
                                     enable(el);
                                   }
                       });
                     }
                     
                     return {
                       uiConfig: uiConfig,
                       allValues: allValues, // DEBUGGING
                       registerPluginPreference: registerPluginPreference,
                       registerPreference: registerPreference,
                       getPluginFunction: getPluginFunction,
                       registerPlugin: registerPlugin,
                       getValueOf: getValueOf,
                       getUi: getUi
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
          }
        }
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


var popupManagerOld = 
(
 function() {
 
 function open(props) {
   
   close(); // Make sure we clean up if there was anything left open.
   
   if (!props) props = {};
   if (!props.position) {props.position = "center";}
   
   
   var outerDiv = API.createElementWithProperties('table', { id: 'popup_outer' });
   var titleDiv = API.createElementWithProperties('div', { id: 'popup_title' });
   var contentsDiv = API.createElementWithProperties('div', { id: 'popup_contents' });
   var body = API.getBodyElement();
   var el, tr, td;
   
   var tbody = API.createElement('tbody');
   body.appendChild(outerDiv);
   outerDiv.appendChild(tbody);
   
   
   if (props.title) {
     API.setElementText(titleDiv, props.title);
     tr = API.createElement("tr");
     td = API.createElement("td");
     tbody.appendChild(tr);
     td.appendChild(titleDiv);
     tr.appendChild(td);
   }  
   
   if (props.message) {
     API.setElementText(contentsDiv, props.message);
   }
   
   if (props.element) {
     contentsDiv = props.element;
   }
   
   tr = API.createElement("tr");
   td = API.createElement("td");
   tbody.appendChild(tr);
   tr.appendChild(td);
   td.appendChild(contentsDiv);
   
   outerDiv.style.zIndex=1000;
   
   if (props.position = "center") {
     API.centerElement(outerDiv, { duration:1000, ease:API.ease.circle });
   }
   
   if (props.close)
   {
     el = API.createElementWithProperties('span', { id: 'popup_close' });
     API.setElementText(el, "[X]");
     titleDiv.appendChild(el);
     el.title = "Click here to close";
     API.attachListener(el, 'click', function() { close();   } );
   }
   
   
   if (props.dim) {
     el = API.createElementWithProperties('span', { id: 'popup_dim' });
     body.appendChild(el);
     API.setElementText(el, " ");
     el.style.zIndex=999;
     API.setOpacity(el, 0.5);
     
     API.coverDocument(el);
   }
 }
 
 function close() {
   var a = "popup_outer|popup_dim".split("|");
   
   
   API.forEach(a, 
               function(s, i) {
               var el = API.getEBI(s);
               if (el) { el.parentNode.removeChild(el); }
               }
               );
 }
 
 return {
   open: open,
   close: close
 };
 
 })();
 


var popupManager = 
(
 function() {
 var outerDiv;
   var titleDiv;
   var contentsDiv;
   var body;
 
 function open(props) {
   
   close(); // Make sure we clean up if there was anything left open.
   
   if (!props) props = {};
   if (!props.position) {props.position = "center";}
   
   body = API.getBodyElement();
   outerDiv = API.createElementWithProperties('div', { id: 'popup_outer' });
   titleDiv = API.createElementWithProperties('div', { id: 'popup_title' });
   contentsDiv = API.createElementWithProperties('div', { id: 'popup_contents' });
   var el;
   
   if (props.title) {
     API.setElementText(titleDiv, props.title);
     outerDiv.appendChild(titleDiv);
   }  
   
   if (props.message) {
     API.setElementText(contentsDiv, props.message);
   }
   
   if (props.element) {
     contentsDiv = props.element;
   }

  outerDiv.appendChild(contentsDiv);
      
  outerDiv.style.zIndex=1000;
      
   if (props.close)
   {
     el = API.createElementWithProperties('span', { id: 'popup_close' });
     API.setElementText(el, "[XX]");
     titleDiv.appendChild(el);
     el.title = "Click here to close";
     API.attachListener(el, 'click', function() { close();   } );
   }
   
   if (props.dim) {
     el = API.createElementWithProperties('span', { id: 'popup_dim' });
     body.appendChild(el);
     API.setElementText(el, " ");
     el.style.zIndex=999;
     API.setOpacity(el, 0.5);     
     API.coverDocument(el);
   }
   
   body.appendChild(outerDiv);
   if (props.position == "center") {
     API.centerElement(outerDiv);
   }
   
 }
 
 function close() {
   var a = "popup_outer|popup_dim".split("|");
   
   API.forEach(a, 
               function(s, i) {
               var el = API.getEBI(s);
               if (el) { el.parentNode.removeChild(el); }
               }
               );
 }
 
 return {
   open: open,
   close: close
 };
 
 })();



 
 ////////////////////////////////////////////////////////////////////////////
 
 /**
 * An autosuggest textbox control.
 * @class
 * @scope public
 */
 function AutoSuggestControl(oTextbox /*:HTMLInputElement*/, 
                             oProvider /*:SuggestionProvider*/) 
 {
   
   /**
   * The currently selected suggestions.
   * @scope private
   */   
   this.cur /*:int*/ = -1;
   
   /**
   * The dropdown list layer.
   * @scope private
   */
   this.layer = null;
   
   /**
   * Suggestion provider for the autosuggest feature.
   * @scope private.
   */
   this.provider /*:SuggestionProvider*/ = oProvider;
   
   /**
   * The textbox to capture.
   * @scope private
   */
   this.textbox /*:HTMLInputElement*/ = oTextbox;
   
   //initialize the control
   this.init();
   
 }
 
 /**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions An array of suggestion strings.
 * @param bTypeAhead If the control should provide a type ahead suggestion.
 */
 AutoSuggestControl.prototype.autosuggest = 
 function (aSuggestions /*:Array*/,
           
           bTypeAhead /*:boolean*/) 
 {
   
   //make sure there's at least one suggestion
   if (aSuggestions.length > 0) {
     if (bTypeAhead) {
       this.typeAhead(aSuggestions[0]);
     }
     
     this.showSuggestions(aSuggestions);
   } else {
     this.hideSuggestions();
   }
 };
 
 /**
 * Creates the dropdown layer to display multiple suggestions.
 * @scope private
 */
 AutoSuggestControl.prototype.createDropDown = function () {
   
   var oThis = this;
   
   //create the layer and assign styles
   this.layer = document.createElement("div");
   this.layer.className = "suggestions";
   this.layer.style.visibility = "hidden";
   this.layer.style.width = this.textbox.offsetWidth;
   
   //when the user clicks on the a suggestion, get the text (innerHTML)
   //and place it into a textbox
   this.layer.onmousedown = 
   this.layer.onmouseup = 
   this.layer.onmouseover = function (oEvent) {
     oEvent = oEvent || window.event;
     oTarget = oEvent.target || oEvent.srcElement;
     
     if (oEvent.type == "mousedown") {
       oThis.textbox.value = oTarget.firstChild.nodeValue;
       oThis.hideSuggestions();
     } else if (oEvent.type == "mouseover") {
       oThis.highlightSuggestion(oTarget);
     } else {
       oThis.textbox.focus();
     }
   };
   
   
   document.body.appendChild(this.layer);
 };
 
 /**
 * Gets the left coordinate of the textbox.
 * @scope private
 * @return The left coordinate of the textbox in pixels.
 */
 AutoSuggestControl.prototype.getLeft = function () /*:int*/ {
   
   var oNode = this.textbox;
   var iLeft = 0;
   
   while(oNode.tagName != "BODY") {
     iLeft += oNode.offsetLeft;
     oNode = oNode.offsetParent;        
   }
   
   return iLeft;
 };
 
 /**
 * Gets the top coordinate of the textbox.
 * @scope private
 * @return The top coordinate of the textbox in pixels.
 */
 AutoSuggestControl.prototype.getTop = function () /*:int*/ {
   
   var oNode = this.textbox;
   var iTop = 0;
   
   while(oNode.tagName != "BODY") {
     iTop += oNode.offsetTop;
     oNode = oNode.offsetParent;
   }
   
   return iTop;
 };
 
 /**
 * Handles three keydown events.
 * @scope private
 * @param oEvent The event object for the keydown event.
 */
 AutoSuggestControl.prototype.handleKeyDown = function (oEvent /*:Event*/) {
   
   switch(oEvent.keyCode) {
   case 38: //up arrow
     this.previousSuggestion();
     break;
   case 40: //down arrow 
     this.nextSuggestion();
     break;
   case 13: //enter
     this.hideSuggestions();
     break;
   }
   
 };
 
 /**
 * Handles keyup events.
 * @scope private
 * @param oEvent The event object for the keyup event.
 */
 AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {
   
   var iKeyCode = oEvent.keyCode;
   
   //for backspace (8) and delete (46), shows suggestions without typeahead
   if (iKeyCode == 8 || iKeyCode == 46) {
     this.provider.requestSuggestions(this, false);
     
     //make sure not to interfere with non-character keys
   } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
     //ignore
   } else {
     //request suggestions from the suggestion provider with typeahead
     this.provider.requestSuggestions(this, true);
   }
 };
 
 /**
 * Hides the suggestion dropdown.
 * @scope private
 */
 AutoSuggestControl.prototype.hideSuggestions = function () {
   this.layer.style.visibility = "hidden";
 };
 
 /**
 * Highlights the given node in the suggestions dropdown.
 * @scope private
 * @param oSuggestionNode The node representing a suggestion in the dropdown.
 */
 AutoSuggestControl.prototype.highlightSuggestion = function (oSuggestionNode) {
   
   for (var i=0; i < this.layer.childNodes.length; i++) {
     var oNode = this.layer.childNodes[i];
     if (oNode == oSuggestionNode) {
       oNode.className = "current"
     } else if (oNode.className == "current") {
       oNode.className = "";
     }
   }
 };
 
 /**
 * Initializes the textbox with event handlers for
 * auto suggest functionality.
 * @scope private
 */
 AutoSuggestControl.prototype.init = function () {
   
   //save a reference to this object
   var oThis = this;
   
   //assign the onkeyup event handler
   this.textbox.onkeyup = function (oEvent) {
     
     //check for the proper location of the event object
     if (!oEvent) {
       oEvent = window.event;
     }    
     
     //call the handleKeyUp() method with the event object
     oThis.handleKeyUp(oEvent);
   };
   
   //assign onkeydown event handler
   this.textbox.onkeydown = function (oEvent) {
     
     //check for the proper location of the event object
     if (!oEvent) {
       oEvent = window.event;
     }    
     
     //call the handleKeyDown() method with the event object
     oThis.handleKeyDown(oEvent);
   };
   
   //assign onblur event handler (hides suggestions)    
   this.textbox.onblur = function () {
     oThis.hideSuggestions();
   };
   
   //JJS
   if (oThis.provider.bAutoShow) {
     this.textbox.onfocus = function () {
       oThis.provider.requestSuggestions(oThis, true);
     };
     this.textbox.onclick = function () {
       oThis.provider.requestSuggestions(oThis, true);
     };
   }
   
   
   //create the suggestions dropdown
   this.createDropDown();
 };
 
 /**
 * Highlights the next suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
 AutoSuggestControl.prototype.nextSuggestion = function () {
   var cSuggestionNodes = this.layer.childNodes;
   
   if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length-1) {
     var oNode = cSuggestionNodes[++this.cur];
     this.highlightSuggestion(oNode);
     this.textbox.value = oNode.firstChild.nodeValue; 
   }
 };
 
 /**
 * Highlights the previous suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
 AutoSuggestControl.prototype.previousSuggestion = function () {
   var cSuggestionNodes = this.layer.childNodes;
   
   if (cSuggestionNodes.length > 0 && this.cur > 0) {
     var oNode = cSuggestionNodes[--this.cur];
     this.highlightSuggestion(oNode);
     this.textbox.value = oNode.firstChild.nodeValue;   
   }
 };
 
 /**
 * Selects a range of text in the textbox.
 * @scope public
 * @param iStart The start index (base 0) of the selection.
 * @param iLength The number of characters to select.
 */
 AutoSuggestControl.prototype.selectRange = function (iStart /*:int*/, iLength /*:int*/) {
   
   //use text ranges for Internet Explorer
   if (this.textbox.createTextRange) {
     var oRange = this.textbox.createTextRange(); 
     oRange.moveStart("character", iStart); 
     oRange.moveEnd("character", iLength - this.textbox.value.length);      
     oRange.select();
     
     //use setSelectionRange() for Mozilla
   } else if (this.textbox.setSelectionRange) {
     this.textbox.setSelectionRange(iStart, iLength);
   }     
   
   //set focus back to the textbox
   this.textbox.focus();      
 }; 
 
 /**
 * Builds the suggestion layer contents, moves it into position,
 * and displays the layer.
 * @scope private
 * @param aSuggestions An array of suggestions for the control.
 */
 AutoSuggestControl.prototype.showSuggestions = function (aSuggestions /*:Array*/) {
   
   var oDiv = null;
   this.layer.innerHTML = "";  //clear contents of the layer
   
   for (var i=0; i < aSuggestions.length; i++) {
     oDiv = document.createElement("div");
     oDiv.appendChild(document.createTextNode(aSuggestions[i]));
     this.layer.appendChild(oDiv);
   }
   
   this.layer.style.left = this.getLeft() + "px";
   this.layer.style.top = (this.getTop()+this.textbox.offsetHeight) + "px";
   this.layer.style.visibility = "visible";
   
 };
 
 /**
 * Inserts a suggestion into the textbox, highlighting the 
 * suggested part of the text.
 * @scope private
 * @param sSuggestion The suggestion for the textbox.
 */
 AutoSuggestControl.prototype.typeAhead = function (sSuggestion /*:String*/) {
   
   //check for support of typeahead functionality
   if (this.textbox.createTextRange || this.textbox.setSelectionRange){
     var iLen = this.textbox.value.length; 
     this.textbox.value = sSuggestion; 
     this.selectRange(iLen, sSuggestion.length);
   }
 };

 function reducingSuggestionBox(oAutoSuggestControl /*:AutoSuggestControl*/,
                                                           bTypeAhead /*:boolean*/,
                                values /*:Array*/) 
 {
   var aSuggestions = [];
   var sTextboxValue = oAutoSuggestControl.textbox.value;
   
   if (sTextboxValue.length > 0){
     //search for matching values
     for (var i=0; i < values.length; i++) { 
       if (values[i].indexOf(sTextboxValue) == 0) {
         aSuggestions.push(values[i]);
       } 
     }
   } else {
     aSuggestions = values;
   }
   
   //provide suggestions to the control
   oAutoSuggestControl.autosuggest(aSuggestions, bTypeAhead);
 };

 function nonreducingSuggestionList(oAutoSuggestControl /*:AutoSuggestControl*/,
                                                           bTypeAhead /*:boolean*/,
                                    values /*:Array */) 
 {
   var aSuggestions = [];
   var sTextboxValue = oAutoSuggestControl.textbox.value;
   
   aSuggestions = values;
   
   bTypeAhead = false;
   //provide suggestions to the control
   oAutoSuggestControl.autosuggest(aSuggestions, bTypeAhead);
 }
 
 
 /**
 * Provides suggestions for state names (USA).
 * @class
 * @scope public
 */
 function StateSuggestions() {
   this.values = [
     "Alabama", "Alaska", "Arizona", "Arkansas",
     "California", "Colorado", "Connecticut",
     "Delaware", "Florida", "Georgia", "Hawaii",
     "Idaho", "Illinois", "Indiana", "Iowa",
     "Kansas", "Kentucky", "Louisiana",
     "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
     "Mississippi", "Missouri", "Montana",
     "Nebraska", "Nevada", "New Hampshire", "New Mexico", "New York",
     "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
     "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
     "Tennessee", "Texas", "Utah", "Vermont", "Virginia", 
     "Washington", "West Virginia", "Wisconsin", "Wyoming"  
   ];
 }
 
 /**
 * Request suggestions for the given autosuggest control. 
 * @scope protected
 * @param oAutoSuggestControl The autosuggest control to provide suggestions for.
 */
 StateSuggestions.prototype.requestSuggestions = function (oAutoSuggestControl /*:AutoSuggestControl*/,
                                                           bTypeAhead /*:boolean*/) 
 {
   reducingSuggestionBox(oAutoSuggestControl, bTypeAhead, this.values);
 };

 
 
 function TempoSuggestions() {
   // From:
   // http://forums.bobdunsire.com/forums/showpost.php?p=1120801&postcount=7
   this.bAutoShow = true;
   this.values = [
"48 - Slow Air",
"104 - Hornpipe",
"110 - Hornpipe",
"120 - Jig",
"128 - Jig",
"25 - Lament",
"84 - Light March 2/4,4/4",
"94 - Light March 2/4,4/4",
"68 - Competition March",
"72 - Competition March",
"80 - 6/8 march",
"84 - 6/8 march",
"98 - March 3/4,9/8",
"132 - Strathspey",
"84 - Reel",
"120 - Reel",
"60 - Slow March",
"48 - Waltz"
   ];
 }
 
 
 /**
 * Request suggestions for the given autosuggest control. 
 * @scope protected
 * @param oAutoSuggestControl The autosuggest control to provide suggestions for.
 */
 TempoSuggestions.prototype.requestSuggestions = function (oAutoSuggestControl /*:AutoSuggestControl*/,
                                                           bTypeAhead /*:boolean*/) 
 {
   nonreducingSuggestionList(oAutoSuggestControl, bTypeAhead, this.values)
 };
 
//////////////////////////////////////////////////////////////////////////////// 
 
 
 function graft (parent, t, doc) {
   function complaining (s) { alert(s); return new Error(s); }
   
   // graft() function
   // Originally by Sean M. Burke from interglacial.com
   // Closure support added by Maciek Adwent
   // Updated again by Jeremy J Starcher (2009)
   //   * Removed all use of attributes and set properties directly.
   //   * Removed implied class names
   //   * Text nodes have a psudeo element called "#".  This got rid of
   //     regular expression testing and speeded up the resulting code
   //     by a rough 10% per the profiler.
   
   //logit("Grafting -" + t + "- to " + parent.nodeName));
   
   //console.group("start");
   //console.log("Grafting -" + t + "- to " + parent.nodeName);
   //console.dir(t)
   //console.groupEnd();
   
   // Usage: graft( somenode, [ "I like ", ['em',
   //               { 'class':"stuff" },"stuff"], " oboy!"] )
   
   doc = (doc || parent.ownerDocument || document);
   var e;
   var propertyValue;
   var tLength = t.length;
   
   if(t.nodeType) { parent.appendChild(t); return; }
   if(typeof t == 'object' && t[0].nodeType) { parent.appendChild(t[0]); return; }
   
   
   if(t == undefined) {
     throw complaining( "Can't graft an undefined value");
   } else if(typeof t === 'string') {
     e = doc.createTextNode( t );
   } else if(tLength == 0) {
     e = doc.createElement( "span" );
   } else {
     if (t[0] === "#") {
       e = doc.createElement( "span" );
       //e = document.createDocumentFragment();
     } else {
       e = doc.createElement(t[0]);
     }
     
     for(var i = 1; i < tLength; i++) {
       if( i === 0 && t[i].constructor == String ) {
         //console.log(t[i]);
         e = doc.createElement(   t[i] );
         continue;
       }
       
       
       
       
       if( t[i] == undefined ) {
         throw complaining("Can't graft an undefined value in a list!");
       } else if(  t[i].constructor == String ||  t[i].constructor == Array ) {
         graft( e, t[i], doc );
       } else if(  t[i].constructor == Number ) {
         graft( e, t[i].toString(), doc );
       } else if(  t[i].nodeType ) {  // Let us pass HTML elements directly too
         e.appendChild(t[i]);
       } else if(  t[i].constructor == Object ) {
         // hash's properties => element's attributes
         for(var k in t[i]) {
           // support for attaching closures to DOM objects
           propertyValue = t[i][k];
           
           switch(k) {
           case 'class':
             e.className = propertyValue;
             break;
           case 'id':
           case 'name':
           case 'type':
           case 'size':
           case 'value':
           case 'title':
           case 'src':
           case 'className':
           case 'alt':
           case 'rows':
           case 'cols':
           case 'checked':
           case 'colSpan':
             e[k] = propertyValue;
             break;
           case 'onclick':
           case 'onchange':
           case 'onfocus':
             if (typeof propertyValue === "function") {
               e[k] = propertyValue;
             } else {
               throw complaining( "Property " + k + " must take a function" );
             }
             break;
           default:
             throw complaining( "Property " + k + " is unknown." );                        
           }
         }
       } else {
         throw complaining( "Object " + t[i] +
                           " is inscrutable as an graft arglet." );
       }
     }
   }
   
   parent.appendChild( e );
   return e; // return the topmost created node
 }
