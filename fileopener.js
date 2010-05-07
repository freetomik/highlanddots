"use strict";


var fileOpener = (function() {

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

  return (function (fileOpenData) {

    var uiElement, fileInput, tuneTxt;
    var httpElemId = "httpOpenTuneUrl";
    var data = fileOpenData;

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

        openLocalFile: function() {
          var f = data.fileInput.files[0];
          data.filename = f.name;
          data.fileUrl = f.url;

          tuneTxt = f.getAsText("");
          if (tuneTxt && tuneTxt.length > 0) {
            if (data.useForEditor) { data.useForEditor.value = tuneTxt; }
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

            if (elem !== null) { divElem.appendChild(elem); }

            elem = document.createElement('fieldset');
            divElem.appendChild(elem)
            elem.appendChild(document.createElement('legend'));
            elem.childNodes[0].appendChild(document.createTextNode("Files"));

            inputElem = document.createElement('input');
            inputElem.setAttribute('type', 'file');
            inputElem.setAttribute('size', '30');
            if (data.fileFilter) { inputElem.setAttribute('filter', data.fileFilter); }
            // using 'this' makes no sense here, but it't the only
            //    thing that seemed to work!
            API.attachListener(inputElem, "change", this.openLocalFile);
            elem.appendChild(inputElem);

            uiElement = frg;
            data.fileInput = inputElem;

          }
          if (data.useForUi) {
           data.useForUi.appendChild(frg);
          } else {
            return (uiElement);
          }

        }

      }
    } else if (useActiveX) {

      return {

        openLocalFile: function() {
          var dialog = new ActiveXObject('UserAccounts.CommonDialog');
          dialog.Filter = 'All files (*.*)|*.*| ';
          var result = dialog.ShowOpen();
          if (result == 0 )
           return false;

          var fso = new ActiveXObject("Scripting.FileSystemObject");
          var f = fso.OpenTextFile(dialog.FileName, 1, false); // open for reading, don't create file
          tuneTxt = f.ReadAll();

          if (tuneTxt && tuneTxt.length > 0) {
            if (data.useForEditor) { data.useForEditor.value = tuneTxt; }
            if (data.onSuccess) { data.onSuccess(); }
          } else {
            if (data.onFailure) { data.onFailure(); }
          }

        },

        filePicker:  function() {
          var frag, divElem, elem, inputElem;

          if (uiElement === undefined) {
            frg = document.createDocumentFragment();
            divElem = document.createElement('div');
            frg.appendChild(divElem);

            elem = httpFilePicker();

            if (elem !== null) { divElem.appendChild(elem); }

            elem = document.createElement('fieldset');
            divElem.appendChild(elem)
            elem.appendChild(document.createElement('legend'));
            elem.childNodes[0].appendChild(document.createTextNode("Files"));

            inputElem = document.createElement('button');
            inputElem.setAttribute('value', 'Browse Files');
            // using 'this' makes no sense here, but it't the only
            //    thing that seemed to work!
            API.attachListener(inputElem, "click", this.openLocalFile);
            elem.appendChild(inputElem)

            uiElement = frg;

          }
          if (data.useForUi) {
           data.useForUi.appendChild(frg);
          } else {
            return (uiElement);
          }

        }

      }
    };

  });

}());
