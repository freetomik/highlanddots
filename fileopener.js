"use strict";


var fileOpener = (function() {

  var uiElement;
  var tuneTxt;
  var self = this;

  localPathToURI = function (path) {
    var uri = path;
    uri = uri.replace(/\\/g, '/');
    uri = uri.replace(/:/g, '|');
    uri = "file://" + uri;
    return uri;
  };

  toRelativePath = function (path) {
    var uri = path;
    uri = uri.replace(/\\/g, '/');
    uri = uri.replace(/:/g, '|');
    uri = "file://" + uri;
    return uri;
  };

  return function(fileOpenData) {

    var data = fileOpenData;

    openHttp = function(url) {
      var txt;
      var req;

      function reqFailed() {
        if (fileOpenData.onFailure) { fileOpenData.onFailure(); }
      }

      fileOpenData.filename = url.substring(url.lastIndexOf('/'));
      fileOpenData.fileUrl = url;

      req = API.createXmlHttpRequest();
      req.open('GET', url, false);
      req.send(null);

      if(req.status == 200) {

        txt = req.responseText;

        if (txt && txt.length > 0) {
          fileOpenData.tuneTxt = txt;
          if (fileOpenData.onSuccess) { fileOpenData.onSuccess(); }

        } else {
          reqFailed();
        }
      } else {
        reqFailed();
      }

    };

    httpFilePicker = function() {

      if (API.createXmlHttpRequest() != null) {
        return function() {
          var inputId = "httpOpenTuneUrl";
          elem = document.createElement('fieldset');
          divElem.appendChild(elem)
          elem.appendChild(document.createElement('legend'));
          elem.childNodes[0].appendChild(document.createTextNode("HTTP"));

          inputElem = document.createElement('input');
          inputElem.setAttribute('id', inputId);
          inputElem.setAttribute('type', 'text');
          inputElem.setAttribute('size', '40');
          inputElem.setAttribute('value', 'http://');
          inputElem.onChange = this.openHttp(API.getEBI(inputId).value);
          elem.appendChild(inputElem);
        }
      } else {
        return null;
      }
    };


    // test for ActiveX support
    // FIXME : should test for input[type==file].files
    //         and ActiveX
    //         and give "not supported" message content for everything else
    var useActiveX = false;
    try {
      var xhr= new ActiveXObject('Microsoft.XMLHTTP');
      if (API.isHostMethod(xhr, "open")) {
        useActiveX = true;
      }
    } catch (ex) {
    }

    if (!useActiveX) {

      return {
         uiElement: null,
         fileInput: null,


        openLocalFile: function() {
          var txt;
          var f = data.fileInput.files[0];
          data.filename = f.name;
          data.fileUrl = f.url;

          txt = f.getAsText("");
          if (txt && txt.length > 0) {
            this.tuneTxt = txt;
            if (data.useForEditor) { data.useForEditor.value = txt; }
            if (data.onSuccess) { data.onSuccess(); }
          } else {
            if (data.onFailure) { data.onFailure(); }
          }

        },

        filePicker: function() {
          var frag, divElem, elem, inputElem;

          if (self.uiElement === undefined) {
            frg = document.createDocumentFragment();
            divElem = document.createElement('div');
            frg.appendChild(divElem);

            elem = httpFilePicker();

//            if (elem !== null) { divElem.appendChild(elem); }

            elem = document.createElement('fieldset');
            divElem.appendChild(elem)
            elem.appendChild(document.createElement('legend'));
            elem.childNodes[0].appendChild(document.createTextNode("Files"));

            inputElem = document.createElement('input');
            inputElem.setAttribute('type', 'file');
            inputElem.setAttribute('size', '30');
            inputElem.addEventListener("change",this.openLocalFile, false);

            elem.appendChild(inputElem);

            this.uiElement = frg;
            data.fileInput = inputElem;

          }
          if (fileOpenData.useForUi) {
           data.useForUi.appendChild(this.uiElement);
          } else {
            return (this.uiElement);
          }

        }

      }
    } else if (useActiveX) {

      return {

        filePicker:  function() {
          var divElem, elem, inputElem;

          if (self.uiElement === undefined) {

            divElem = doc.createElement('div');

            elem = self.httpFilePicker();
            if (elem) { divElem.appendChild(elem); }

            elem = document.createElement('fieldset');
            divElem.appendChild(elem)
            elem.appendChild(document.createElement('legend'));
            elem.childNodes[0].appendChild(document.createTextNode("Files"));

            inputElem = document.createElement('button');
            inputElem.setAttribute('value', 'Browse Files');
            inputElem.onclick = open();
            inputElem.appendChild(document.createTextNode('Browse Files'));

            elem.appendChild(inputElem)

            self.uiElement = divElem;
          }

          if (fileOpenData.useForUi) {
           fileOpenData.useForUi.appendChild(self.uiElement);
          } else {
            return (self.uiElement);
          }

        },

        open: function() {
          var dialog = new ActiveXObject('UserAccounts.CommonDialog');
          dialog.Filter = 'All files (*.*)|*.*| ';
          var result = dialog.ShowOpen();
          if (result == 0 )
           return false;

          var fso = new ActiveXObject("Scripting.FileSystemObject");
          var f = fso.OpenTextFile(dialog.FileName, 1, false); // open for reading, don't create file
          var txt = f.ReadAll();

          if (txt && txt.length > 0) {
            fileOpenData.tuneTxt = txt;
            if (fileOpenData.onSuccess) { fileOpenData.onSuccess(); }
          } else {
            if (fileOpenData.onFailure) { fileOpenData.onFailure(); }
          }

        }

      }
    };

  };

}());
