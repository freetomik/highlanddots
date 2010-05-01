function testButton() {
  var f = hdots_prefs.getPluginFunction("s_engine");
  if (typeof f !== "function") {
    alert("Error, no plugin function");
  } else {
    f();
  }
}


function shortTestFunction() {
  var val = hdots_prefs.getPluginPreference("s_engine", "short");

  alert("Your quest is '" + val + "'? Really?");
}

function longTestFunction() {
  alert("I am the long function!");
}


function prepConfig() {
  var pref;
  
  hdots_prefs.registerPreference( {
                                 type: "text",
                                 label: "What is your name?",
                                 name: "name1",
                                 def:  "Sir Robin"
  });
  
  hdots_prefs.registerPreference( {
                                 type: "select",
                                 label: "Note color",
                                 name: "color1",
                                 def:  "blue",
                                 options: [
                                 {"#FF0000": "red"},
                                 {"#0000FF": "blue"},
                                 {"#00FF00": "green"}
                                 ],
  });
  
  hdots_prefs.registerPreference( {
                                 type: "boolean",
                                 name: "outlines",
                                 label: "Draw outlines?",
                                 def: true
  });
  
  hdots_prefs.registerPreference( {
                                 type: "plugin",
                                 label: "Spacing Engine",
                                 name: "s_engine",
                                 def:  "",
                                 options: [],
  });
  
}



function doIt() {
  prepConfig();
  
  hdots_prefs.registerPlugin("s_engine", "short", "The short version", shortTestFunction);  
  
  hdots_prefs.registerPlugin("s_engine", "long", "The Long Version", longTestFunction);  
  
  
  hdots_prefs.registerPluginPreference("s_engine", "short",
                                       {
                                       type: "text",
                                       label: "What is your Quest?",
                                       name: "quest",
                                       def:  "To find the Grail"
                                       });
  
  
  
  
  hdots_prefs.makeHdConfigForm();
}


var hdots_prefs = 
(
 function()
 {
   var hdConfigData = [];
   var formContentsId = "hd_config";
   var formId = formContentsId + "_form"; 
   var formPrefix = ["hd"]; // Give all the form elements a prefix to avoid collission
   var SEP = '$';
   var pluginTracker = {};
   var pluginOptions = {};
   
   
   function getFormPrefix() {
     return formPrefix.join(SEP) + SEP;
   }

   function getPluginPreference(prefName, pluginName) {
     var pref = pluginOptions[prefName + SEP + pluginName];
     return getValueOfInner(prefName, pref);
   }

   
   function getPluginFunction(n) {
     var s = getValueOf(n, hdConfigData);
     if (s) {
       return pluginTracker[n + SEP + s];
     }
   }
   
   function getPreferenceByName(n, a) {
     var pref;
     for(var i = 0, l = a.length; i < l; i++) {
       pref = a[i];
       if (pref.name === n) {return pref}
     }
   }
   
   function getValueOf(n) {
     return(getValueOfInner(n, hdConfigData)); 
   }
   
   function getValueOfInner(n, a) {
     var pref = getPreferenceByName(n, a);
     if (pref) {
       if (pref.value) {return pref.value;}
       return pref.def;
     }
   }
   
   
   function registerPreference(pref) {
     hdConfigData.push(pref);
     if (pref.type === "plugin") {
       pluginTracker[pref.name] = {};
       //pluginOptions[pref.name] = {};
     }
   }
   
   function registerPluginPreference(prefName, pluginName, pref) {
     pluginOptions[prefName + SEP + pluginName].push(pref);
   }
   
   
   
   function makeHdConfigForm() {
     var k, v;
     
     /// Drawing, proxy functions
     
     function addToForm(v, el, target) {
       var label = API.createElement("label");
       API.addElementText(label, v.label + ": ");
       label.appendChild(el);
       if (typeof el.name === "string") {
         el.name = getFormPrefix() + v.name;
       }
       
       
       target.appendChild(label);
       target.appendChild(API.createElement("br"));
     }
     
     function makeBoolean(v, target) {
       var el = API.createElementWithProperties('input', { type:'checkbox', checked:v.def });
       addToForm(v, el, target);
     }
     
     function makeText(v, target) {
       var el = API.createElement("input");
       if (v.def) {el.value = v.def};
       addToForm(v, el, target);
     }                     
     
     
     function makeRadio(v, target) {
       var target = API.getEBI(formContentsId);
       var el;
       var i, l, o = {}, opt;
       var o;
       var f = API.createElement("fieldset");
       el = API.createElement("legend");
       API.addElementText(el, v.label);
       f.appendChild(el);
       API.setStyle(f, 'border', '1px solid black')
       opt = v.options;
       
       
       for (i = 0, l = opt.length; i < l; i++) {
         o = opt[i];
         API.forEachProperty(o, function(p, i) {
                             //API.addElementText(f, p);
                             f.appendChild(document.createTextNode(p));
                             
                             el = API.createElement("input");
                             el.type = "radio";
                             el.name = getFormPrefix() + v.name;
                             el.value = i;
                             if (i === v.def) { el.checked = true; }
                             f.appendChild(el);
                             //alert(pluginOptions[v.name][i].toSource());
                             
                             formPrefix.push(v.name);
                             formPrefix.push(i);
                             makeFormFields(pluginOptions[v.name + SEP + i],f);
                             formPrefix.pop();
                             formPrefix.pop();
                             
         });                         
       }
       target.appendChild(f);
     }
     
     
     
     function makeSelect(v, target) {
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
       addToForm(v, el, target);
     }
     
     
     function getDataFromForm() {
       var s = API.HD_serializeFormUrl(API.getEBI(formId));
       
       
       for(var i = 0, l = hdConfigData.length; i < l; i++) {
         v = hdConfigData[i];
         if (v.type === "boolean") {
           v.value = !!s[getFormPrefix() + v.name];  // Force value to boolean
         } else {
           v.value = s[getFormPrefix() + v.name];
         }
       }
     }                       
     function makeAcceptButton(v, target) {
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
   }
   
   function registerPlugin(prefName, pluginName, desc, fun) {
     var pref = getPreferenceByName(prefName, hdConfigData); 
     var o1 = {};
     o1[pluginName] = desc;
     pref.options.push(o1);
     pluginTracker[prefName + SEP + pluginName] = fun;
     pluginOptions[prefName + SEP + pluginName] = [];
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
     getPluginPreference: getPluginPreference,
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

