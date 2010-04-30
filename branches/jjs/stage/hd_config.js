function testButton() {
  var f = hdots_prefs.getPluginFunction("s_engine");
  if (typeof f !== "function") {
    alert("Error, no plugin function");
  } else {
    f();
  }
}


function shortTestFunction() {
  alert("I am the short function!");
}

function longTestFunction() {
  alert("I am the long function!");
}


function doIt() {
  hdots_prefs.prepConfig();
  
  hdots_prefs.registerPlugin("s_engine", "short", "The short version", shortTestFunction);  
  hdots_prefs.registerPlugin("s_engine", "long", "The Long Version", longTestFunction);  
  
  hdots_prefs.makeHdConfigForm();
}


var hdots_prefs = (function() {
                   var hdConfigData = [];
                   var formContentsId = "hd_config";
                   var formId = formContentsId + "_form"; 
                   var formPrefix = "hd_"; // Give all the form elements a prefix to avoid collission
                   var pluginTracker = {};
                   
                   function getPluginFunction(n) {
                     var s = getValueOf(n);
                     if (s) {
                       return pluginTracker[n][s];
                     }
                   }
                   
                   function getOptionByName(n) {
                     var opt;
                     for(var i = 0, l = hdConfigData.length; i < l; i++) {
                       opt = hdConfigData[i];
                       if (opt.name === n) {return opt}
                     }
                   }
                   
                   function getValueOf(n) {
                     var opt = getOptionByName(n);
                     if (opt) {
                       if (opt.value) {return opt.value;}
                       return opt.def;
                     }
                   }
                   
                   
                   function addConfigOption(opt) {
                     hdConfigData.push(opt);
                     if (opt.type === "plugin") {
                         pluginTracker[opt.name] = {};
                     }

                   }
                   
                   function prepConfig() {
                     var opt;
                     
                     opt = {
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
                     
                     addConfigOption(opt);
                     
                     opt = {
                       type: "boolean",
                       name: "outlines",
                       label: "Draw outlines?",
                       def: true
                     }
                     
                     addConfigOption(opt);
                     
                     opt = {
                       type: "plugin",
                       label: "Spacing Engine",
                       name: "s_engine",
                       def:  "",
                       options: [],
                     };
                     
                     addConfigOption(opt);
                   }
                   
                   function makeHdConfigForm() {
                     var k, v;
                     
                     function addToForm(el) {
                       var target = API.getEBI(formContentsId);
                       
                       var label = API.createElement("label");
                       API.addElementText(label, v.label + ": ");
                       label.appendChild(el);
                       el.name = formPrefix + v.name;
                       
                       
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
                                             API.addOptions(el, o);
                                             if (p === v.def) { el.selectedIndex = i; }
                                             
                         });
                         
                       }
                       addToForm(el);
                     }
                     
                     
                     function getDataFromForm() {
                       var s = API.HD_serializeFormUrl(API.getEBI(formId));
                       for(var i = 0, l = hdConfigData.length; i < l; i++) {
                         v = hdConfigData[i];
                         if (v.type === "boolean") {
                           v.value = !!s[formPrefix + v.name];  // Force value to boolean
                         } else {
                           v.value = s[formPrefix + v.name];
                         }
                       }
                     }                       
                     function makeAcceptButton() {
                       var target = API.getEBI(formContentsId);
                       var el = API.createElement("button");
                       API.addElementText(el, "Accept");
                       API.attachListener(el, 'click', function() {
                                          getDataFromForm();
                                          API.cancelPropagation(el);
                                          
                                          return API.cancelDefault(el);
                       });  
                       target.appendChild(el);
                       
                     }
                     
                     for(var i = 0, l = hdConfigData.length; i < l; i++) {
                       v = hdConfigData[i];
          
                       switch (v.type) {
                       case "select":
                         makeSelect();
                         break;
                       case "plugin":
                         makeSelect();
                         break;
                       case "boolean":
                         makeBoolean();
                         break;
                       }
                     }
                     makeAcceptButton();
                   }
                   
                   function registerPlugin(optionName, pluginName, desc, fun) {
                     var opt = getOptionByName(optionName);
                     var o1 = {}
                     o1[pluginName] = desc;
                     opt.options.push(o1);
                     pluginTracker[optionName][pluginName] = fun;
                   }
                   
                   
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
                         c[n] =v;
                       }
                       
                       for (var i=0, ilen=es.length; i<ilen; i++) {
                         e = es[i];
                         n = e.name;
                         if (n && !e.disabled) {
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
                             if (e.checked) {
                               add(n, e.value || 'on');
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
                   
                   return {
                     getPluginFunction: getPluginFunction,
                     registerPlugin: registerPlugin, 
                     getValueOf: getValueOf,
                     prepConfig: prepConfig, 
                     makeHdConfigForm: makeHdConfigForm
                   };
                   
                   
}());
