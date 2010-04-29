

function doIt() {
  hdots_prefs.prepConfig();
  
  hdots_prefs.registerPlugin("s_engine", "short", "The short version", undefined);  
  hdots_prefs.registerPlugin("s_engine", "long", "The Long Version", undefined);  
  
  hdots_prefs.makeHdConfigForm();
}


var hdots_prefs = (function() {
    var hdConfigData = [];
    var formContentsId = "hd_config";
    formId = formContentsId + "_form"; 
    
    function getOptionByName(n) {
      var o;
      for(var i = 0, l = hdConfigData.length; i < l; i++) {
        o = hdConfigData[i];
        if (o.name === n) {return o}
      }
    }
    
    function getValueOf(n) {
      o = getOptionByName(n);
      if (o) {
        if (o.value) {return o.value;}
        return o.def;
      }
    }
    
    
    function addConfigOption(o) {
      hdConfigData.push(o);                 
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
      
      function addToForm(el) {
        var target = API.getEBI(formContentsId);
        
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
              API.addOptions(el, o);
              if (p === v.def) { el.selectedIndex = i; }
              
          });
          
        }
        addToForm(el);
      }
      
      
      function getDataFromForm() {
        var s = API.HD_serializeFormUrl(API.getEBI(formId));
        alert(JSON.stringify(s));
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
      var o = getOptionByName(optionName);
      var o1 = {}
      o1[pluginName] = desc;
      o.options.push(o1);
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
      registerPlugin: registerPlugin, 
      getValueOf: getValueOf,
      prepConfig: prepConfig, 
      makeHdConfigForm: makeHdConfigForm
    };
    
    
}());
