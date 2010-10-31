"use strict";

var fileOpener = (
                  function() {
                  
                  var self = this;
                  
                  var localPathToURI = function (path) {
                    var uri = path;
                    uri = uri.replace(/\\/g, '/');
                    uri = uri.replace(/:/g, '|');
                    uri = "file://" + uri;
                    return uri;
                  };
                  
                  var toRelativePath = function (path) {
                    var uri = path;
                    uri = uri.replace(/\\/g, '/');
                    uri = uri.replace(/:/g, '|');
                    uri = "file://" + uri;
                    return uri;
                  };
                  
                  var uiElement, fileInput, tuneTxt;
                  var httpElemId = "httpOpenTuneUrl";
                  var data;                  
                  
                  var openHttpFile = function() {
                    var url, req, txt;
                    
                    function reqFailed() {
                      if (data.onFailure) { data.onFailure(); }
                    }
                    
                    url = API.getEBI(httpElemId).value;
                    data.filename = url.substring(url.lastIndexOf('/'));
                    data.fileUrl = url;
                    
                    req = API.createXmlHttpRequest();
                    req.open("GET", "http://malcolmbagpipes.com/index.html", false);
                    req.send(null);
                    
                    if(req.status == 200) {
                      txt = req.responseText;
                      
                      if (txt && txt.length > 0) {
                        tuneTxt = txt;
                        if (data.useForEditor) { data.useForEditor.value = txt; }
                        if (data.onSuccess) { data.onSuccess(); }
                      } else {
                        reqFailed();
                      }
                    } else {
                      reqFailed();
                    }
                    
                  };
                  
                  var httpFilePicker = function() {
                    if (API.createXmlHttpRequest() != null) {
                      var elem, inputElem;
                      elem = document.createElement('fieldset');
                      
                      elem.appendChild(document.createElement('legend'));
                      elem.childNodes[0].appendChild(document.createTextNode("HTTP"));
                      
                      inputElem = document.createElement('input');
                      inputElem.setAttribute('id', httpElemId);
                      inputElem.setAttribute('type', 'text');
                      inputElem.setAttribute('size', '40');
                      inputElem.setAttribute('value', 'http://');
                      elem.appendChild(inputElem);
                      data.httpInput = inputElem;
                      
                      inputElem = document.createElement('input');
                      inputElem.setAttribute('type', 'button');
                      inputElem.setAttribute('value', 'Open');
                      API.attachListener(inputElem, "click", openHttpFile);
                      elem.appendChild(inputElem);
                      
                      return (elem);
                      
                    } else {
                      return null;
                    }
                  };
                  
                  var builtinFilePicker = function () {
                    elem = document.createElement('fieldset');
                    elem.appendChild(document.createElement('legend'));
                    elem.childNodes[0].appendChild(document.createTextNode("Built in examples"));
                    
                    inputElem = document.createElement('select');
                    //inputElem.setAttribute('type', 'button');
                    //inputElem.setAttribute('value', 'Open');
                    elem.appendChild(inputElem);
                    bwwExamples.makeOptions(inputElem);
                    
                    
                    elem.appendChild(document.createElement('br'));
                    
                    var s = inputElem;
                    inputElem = document.createElement('input');
                    inputElem.setAttribute('type', 'button');
                    inputElem.setAttribute('value', 'Load the selected file');
                    elem.appendChild(inputElem);
                    API.attachListener(inputElem, "click", function() {
                                       var txt = bwwExamples.loadData(s);
                                       if (data.useForEditor) { data.useForEditor.value = txt; }
                                       if (data.onSuccess) { data.onSuccess(); }
                    });
                    
                    return (elem);  
                  };
                  
                  var ieOpenFile =  {
                    openLocalFile: function() {
                      var dialog,path;
                      try {
                        /*
                        // Vista/Win7 ? needs testing
                        From: http://www.databaseforum.info/11/1059402.aspx
                        The documentation  for System.Shell.chooseFile seems to be wrong:
                        oShellItem = System.Shell.chooseFile( [bForOpen], strFilter [, strInitialDirectory] [, strFileInit])
                        should in fact be:
                        oShellItem = System.Shell.chooseFile( bForOpen, strFilter , strInitialDirectory , strFileInit)
                        If you don't have all four parameters, you get an object error.
                        EDIT:  The System.Shell.Item it returns doesn't support System.Shell.Item.isFile as per the documentation either!
                        
                        
                        From: http://social.msdn.microsoft.com/Forums/en/sidebargadfetdevelopment/thread/71011dc5-e4df-4c86-9706-26af3af7c82a
                        Can you not use the Sidebar file dialogue?
                        var cfItem = System.Shell.chooseFile(true, "All Files:*.*::", "", "");
                        if (cfItem.path != "")
                        {
                        //do something with cfItem.path
                        }
                        
                        */
                        // FIXME : set proper filters based on what parsers are installed
                        
                        
                        dialog = new ActiveXObject('System.Shell');
                        var fileItem = dialog.chooseFile(true, "All Files:*.*::", "", "");
                        if (fileItem.path != "")
                          path = fileItem.path;
                      } catch (ex) {
                        // Win XP
                        dialog = new ActiveXObject('UserAccounts.CommonDialog');
                        if (data.fileFilter) { inputElem.setAttribute('filter', data.fileFilter); }
                        
                        dialog.Filter = 'All files (*.*)|*.*| ';
                        var result = dialog.ShowOpen();
                        if (result != 0 )
                          path = dialog.FileName;
                      }
                      
                      if (!path)
                        return false;
                      
                      var fso = new ActiveXObject("Scripting.FileSystemObject");
                      var f = fso.OpenTextFile(path, 1, false); // open for reading, don't create file
                      tuneTxt = f.ReadAll();
                      
                      if (tuneTxt && tuneTxt.length > 0) {
                        if (data.useForEditor) { data.useForEditor.value = tuneTxt; }
                        if (data.onSuccess) { data.onSuccess(); }
                      } else {
                        if (data.onFailure) { data.onFailure(); }
                      }
                      
                    },
                    
                    filePicker:  function(divElem) {
                      var  elem, inputElem;
                      
                      
                      elem = document.createElement('fieldset');
                      divElem.appendChild(elem)
                      elem.appendChild(document.createElement('legend'));
                      elem.childNodes[0].appendChild(document.createTextNode("Load a file"));
                      
                      inputElem = document.createElement('button');
                      inputElem.setAttribute('value', 'Browse Files');
                      
                      API.attachListener(inputElem, "click", ieOpenFile.openLocalFile);
                      elem.appendChild(inputElem)
                      
                      uiElement = frg;   
                    }
                  };
                  
                  
                  var w3cOpenFile = {    
                    openLocalFile: function() {
                      var f = data.fileInput.files[0];
                      data.filename = f.name;
                      data.fileUrl = f.url;
                      
                      
                      if (API.isHostMethod(f, "getAsText")) {
                        tuneTxt = f.getAsText("");
                      } else {
                        alert("I'm sorry!\r\nThis browser doesn't support loading " +
                              "local files.\r\nTry Firefox 3.6+ or IE6+.");
                        return;
                      }
                      if (tuneTxt && tuneTxt.length > 0) {
                        if (data.useForEditor) { data.tuneTxt = tuneTxt;data.useForEditor.value = tuneTxt; }
                        if (data.onSuccess) { data.onSuccess(); }
                      } else {
                        if (data.onFailure) { data.onFailure(); }
                      }
                    },
                    
                    filePicker: function(divElem) {
                      var divElem, elem, inputElem;
                      
                      elem = document.createElement('fieldset');
                      divElem.appendChild(elem)
                      elem.appendChild(document.createElement('legend'));
                      elem.childNodes[0].appendChild(document.createTextNode("Files"));
                      
                      
                      // FIXME : set proper filters based on what parsers are installed
                      
                      inputElem = document.createElement('input');
                      inputElem.setAttribute('type', 'file');
                      inputElem.setAttribute('size', '30');
                      
                      if (data.fileFilter) { inputElem.setAttribute('filter', data.fileFilter); }
                      
                      API.attachListener(inputElem, "change", w3cOpenFile.openLocalFile);
                      elem.appendChild(inputElem);
                      
                      uiElement = frg;
                      data.fileInput = inputElem;
                      
                    }
                  };
                  
                  var comboFilePicker = function() {
                    var frag, elem;
                    var useActiveX = false;
                    try {
                      var xhr= new ActiveXObject('Microsoft.XMLHTTP');
                      if (API.isHostMethod(xhr, "open")) {
                        useActiveX = true;
                      }
                    } catch (ex) {
                    }
                    
                    if (self.uiElement === undefined) {
                      frg = document.createDocumentFragment();
                      divElem = document.createElement('div');
                      frg.appendChild(divElem);
                      
                      //elem = httpFilePicker();       
                      //if (elem !== null) { divElem.appendChild(elem); }
                      
                      elem = builtinFilePicker();
                      if (elem !== null) {
                        divElem.appendChild(elem); 
                        divElem.appendChild(document.createElement("br"));
                      }
                      
                      elem = document.createElement('input');
                      elem.setAttribute('type', 'file');
                      elem.setAttribute('size', '30');
                      
                      
                      if (API.isHostObjectProperty(elem, "files")) {
                        w3cOpenFile.filePicker(divElem);
                        divElem.appendChild(document.createElement("br"));
                      }
                      
                      
                      if (useActiveX) {
                        ieOpenFile.filePicker(divElem);
                        divElem.appendChild(document.createElement("br"));
                      }
                      
                      if (data.useForUi) {
                        data.useForUi.appendChild(frg);
                      } else {
                        return (uiElement);
                      }
                    }     
                  }
                  
                  return (function (fileOpenData) {   
                          data = fileOpenData;         
                          // test for ActiveX support
                          // FIXME : should test for input[type==file].files
                          //         and ActiveX
                          //         and give "not supported" message content for everything else
                          
                          var o = {};
                          o.filePicker = comboFilePicker;
                          
                          return o;         
                  });
                  
                  }
                  ()
                  );

