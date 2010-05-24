var midi = (function() {
            
            var byteArray = [];
            
            function getByteArray() {
              return byteArray;
            }
            
            function sendByte(b) {
              byteArray.push(b);
            }
            
            function sendBytes(a) {
              var i, l = a.length;
              for (i = 0; i < l; i++) {
                sendByte(a[i]);
              }
            }
            
            function sendHeaderMagicNumbers() {
              sendBytes([0x4D, 0x54, 0x68, 0x64]);
              
            }

            return {
              sendHeaderMagicNumbers: sendHeaderMagicNumbers,
              sendBytes: sendBytes,
              sendByte: sendByte,
              getByteArray: getByteArray
            };
            
            
}());

//alert(midi.toSource());

