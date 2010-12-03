"use strict";

var FileErrorText = {
  4: "Google Chrome won't read local files when the web page is run locally.",
  8: "File not found.",
  24: "File could not be read.",
  18: "The file could not be accessed for security reasons.",
  20: "The file operation was aborted, probably due to a call to the FileReader abort() method.",
  26: "The file data cannot be accurately represented in a data URL."
};

function loadFile() {
  var div = document.createElement("div");
  div.className = 'fileOpen';
  
  var loadSuccess = function(s) {
    s = s.replace(/\t/g, '~');
    API.getEBI("editor").value = s;
    
    popupManager.open({
                      close: true,
                      dim: true,
                      message: "File loaded successfully - Translating."
    });
    
    
    window.setTimeout(function() {
                      uiLoadTune("bww", s);
                      }, 1);
  }
  
  var loadFailure = function(err) {
    popupManager.close();
    alert("Unable to load file:\n" + err);
  }
  
  
  function makeExampleDiv() {
    var elem = document.createDocumentFragment();
    var select = document.createElement('select');
    bwwExamples.makeOptions(select);
    
    function load(el) {
      var s = bwwExamples.loadData(select);
      loadSuccess(s);
    }    
    
    graft(elem,
          ['fieldset',
          /* */ ['legend', 'Built in examples'],
          /* */ [select],
          /* */ ["input", {type: 'button', value: 'Load the selected file', onclick: load}]
          ]);
    return elem;
  }
  
  function makeFileReaderDiv() {
    var elem = document.createElement("div");
    
    function load(input) {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = function() { loadSuccess(fr.result); }
      fr.onerror = function() {var c = this.error.code; alert(c + ":" + FileErrorText[c]); }
      
      fr.readAsText(file, "");
    }        
    
    graft(elem,
          ['fieldset',
          /* */ ['legend', 'Load a local file'],
          /* */ ["input", {type: 'file',  onchange: function () {load(this);} }]
          ]);
    return elem;    
  }
  
  function makeActiveXDiv() {
    var elem = document.createElement("div");
    
    function promptForFile() {
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
        if (fileItem.path != "") { path = fileItem.path; }
      } catch (ex) {
        // Win XP
        dialog = new ActiveXObject('UserAccounts.CommonDialog');
        
        dialog.Filter = 'All files (*.*)|*.*| ';
        var result = dialog.ShowOpen();
        if (result != 0 ) {path = dialog.FileName; }
      }
      
      if (!path) {
        loadFailure("Unable to find that path/file");
        return false;
      }
      
      var fso = new ActiveXObject("Scripting.FileSystemObject");
      var f = fso.OpenTextFile(path, 1, false); // open for reading, don't create file
      var tuneTxt = f.ReadAll();
      loadSuccess(tuneTxt);
    }        
    
    graft(elem,
          ['fieldset',
          /* */ ['legend', 'Load a local file (ActiveX)'],
          /* */ ["input", {type: 'button',  onclick: function () {promptForFile()}, value: "Load a local file" }]
          ]);
    return elem;    
  }
  
  graft(div,
        ["div",
        /* */ makeExampleDiv()
        ]
        );
  
  if (API.isHostMethod(window, 'FileReader')) {
    graft(div, makeFileReaderDiv());
  }
  
  if (API.isHostMethod(window, "ActiveXObject")) {
    graft(div, makeActiveXDiv());
  }
   
  //div.appendChild(makeExampleDiv());
  
  popupManager.open({
                    close: true,
                    dim: true,
                    title: "Open a file",
                    element: div
  }
  );
    
}  
