"use strict";

Score.graphicsList = {
  "treble-clef" : "trebleclef",
  "natural" : "natural",
  "flat" : "flat",
  "sharp" : "sharp",
  "rest1" : "rest1",
  "rest2" : "rest2",
  "rest4" : "rest4",
  "rest8" : "rest8",
  "rest16" : "rest16",
  "rest32" : "rest32",
  "rest64" : "rest64",
  "rest128" : "rest128"
};

(function() {
 var THISTYPE = "graphic";
 function ThisType(name) {
   this.name = name;
   this.c = {};                  // Storage area for some commonly used calcuations.
   return this;
 }
 
 ThisType.inherits(ScoreElement);
 ThisType.prototype.type = THISTYPE;
 
 
 /* Glyph info:
 *   width = glyph width
 *   height = ascender height + decender height
 *   font height = total ascent+decent,
 */
 ThisType.prototype.glyphInfo  =   {
   "treble-clef" : {width : 480, height : 1200, fontHeight: 1200},
   "natural" : {width : 160, height : 480, fontHeight: 1200},
   "sharp" : {width : 180, height : 480, fontHeight: 1200},
   "flat" : {width : 180, height : 480, fontHeight: 1200},
   "rest1" : {width : 180, height : 480, fontHeight: 1200},
   "rest2" : {width : 180, height : 480, fontHeight: 1200},
   "rest4" : {width : 180, height : 480, fontHeight: 1200},
   "rest8" : {width : 180, height : 480, fontHeight: 1200},
   "rest16" : {width : 180, height : 480, fontHeight: 1200},
   "rest32" : {width : 180, height : 480, fontHeight: 1200},
   "rest64" : {width : 180, height : 480, fontHeight: 1200},
   "rest128" : {width : 180, height : 480, fontHeight: 1200}
 };
 
 ThisType.prototype.c = {};
 
 ThisType.prototype.calc = function(staff) {
   var sdet = staff.details;
   var dx = sdet.x;
   
   // FIXME : this works but really shouldn't be hardcoded!
   var dy = sdet.top - (sdet.staffHeight*1.8);
   var origin = sdet.noteInfo[this.staffNote].y;
   
   var scale, size, width, height;
   size = sdet.staffHeight * 1.8;
   
   if (this.glyphInfo[this.name]) {
     scale = this.glyphInfo[this.name].fontHeight / size;
     width = this.glyphInfo[this.name].width;
     height = this.glyphInfo[this.name].height;
   } else {
     alert("Glyph `" + this.name + "' is not found.");
     width = 1;
     height = 1;
     scale = 1;
   }
   
   
   var dh = height /  scale;
   var dw = width / scale;  
   
   this.c.size = size;
   this.c.scale = scale;
   this.c.dx = dx;
   this.c.originx = dx;
   this.c.dy = dy;
   this.c.originy = origin;
   this.c.dw = dw;
   this.c.dh = dh;
   
   //logit([THISTYPE, size, scale, dx, dy, dw, dh]);
 }
 
 ThisType.prototype.getBoundingRect = function(staff) {
   var c = this.c;
   
   var o = {
     x: c.dx,
     y: c.dy,
     width: c.dw,
     height: c.dh
   };
   
   return o;
 }
 
 
 
 /*
 DATA FORMAT
 --------------
 new path, fill previous path  []   
 move to    [X,Y]
 line to    [sX,sY], [eX,eY]
 quadratic curve to  [sX,sY], [cpX,cpY], [eX,eY]
 bezier curve to   [sX,sY], [cp1X,cp1Y], [cp2X,cp2Y] [eX,eY]
 
 WHERE
 --------------
 sX == start X co-ord
 sY == start Y co-ord
 eX == end X co-ord
 eY == end Y co-ord
 cpX == control point X co-ord
 cpY == control point Y co-ord
 cp1X == 1st control point X co-ord
 cp1Y == 1st control point Y co-ord
 cp2X == 2nd control point X co-ord
 cp2Y == 2nd control point Y co-ord
 
 NOTES
 --------------
 Reduction scale of 15 is based on Stave line spacing of 10px and the
 following Glyph information:
 G Clef Glyph is 1101px high
 419px wide
 Co-ordinates are relative to the G note's staff line
 and go clockwise from left to right. this means that all
 Y co-ordinates need to be multiplied by -1 to correct
 for expecting absolute co-ords for drawing. 
 The Glyph starts at X=-1;
 
 */
 
 
 ThisType.prototype.sharp = 
 [[[1, 26], [1, 93]],
   [[1, 93], [27, 103]],
   [[27.103], [27, 211]],
   [[27, 211], [45, 211]],
   [[45, 211], [45, 110]],
   [[45, 110], [88, 127]],
   [[88, 127], [88, 238]],
   [[88, 238], [106, 238]],
   [[106, 238], [106, 134]],
   [[106, 134], [132, 145]],
   [[132, 145], [132, 79]],
   [[132, 79], [106, 68]],
   [[106, 68], [106, -38]],
   [[106, -38], [132, -26]],
   [[132, -26], [132, -92]],
   [[132, -92], [106, -103]],
   [[106, -103], [106, -211]],
   [[106, -211], [88, -211]],
   [[88, -211], [88, -110]],
   [[88, -110], [45, -128]],
   [[45, -128], [45, -237]],
   [[45, -237], [27, -237]],
   [[27, -237], [27, -135]],
   [[27, -135], [1, -145]],
   [[1, -145], [1, -79]],
   [[1, -79], [27, -69]],
   [[27, -69], [27, 37]],
   [[27, 37], [1, 26]],
   [[45, 44]],
   [[45, 44], [45, -62]],
   [[45, -62], [88, -44]],
   [[88, -44], [88, 61]],
 [[88, 61], [45, 44]]];
 
 
 
 ThisType.prototype.flat =  [
   [ [2,304],    [20,304]  ],
   [ [20,304],    [20,54]   ],
   [ [20,54], [34,62],  [42,66]   ],
   [ [42,66], [69,78],  [90,78]   ],
   [ [90,78], [105,78], [128,63], [134,45]  ],
   [ [134,45], [137,36],  [137,27]  ],
   [ [137,27], [137,-2],  [108,-33] ],
   [ [108,-33], [87,-55],  [59,-72]  ],
   [ [59,-72], [47,-79],  [27,-98]  ],
   [ [27,-98], [14,-110],  [2,-123]  ],
   [ [2,-123],    [2,304]   ],
   // inside counter clockwise
   [ [20,38]       ],
   [ [20,38],    [20,-86]  ],
   [ [20,-86], [39,-67],  [58,-48]  ],
   [ [58,-48], [95,-3],  [95,26]   ],
   [ [95,26], [95,46],  [77,56]   ],
   [ [77,56],    [73,58]   ],
   [ [73,58], [68,60],  [64,60]   ],
   [ [64,60], [56,60], [36,51], [20,38]   ]
 ];
 
 ThisType.prototype.natural = [
   // outside, clockwise co-ords
   [ [27,37], [27,211]  ],
   [ [27,211], [45,211]   ],
   [ [45,211], [45,110]   ],
   [ [45,110], [88,127]   ],
   [ [88,127], [106,134]  ],
   [ [106,134], [106,68]   ],
   [ [106,68], [106,-38]  ],
   [ [106,-38], [106,-103] ],
   [ [106,-103], [106,-211] ],
   [ [106,-211], [88,-211]  ],
   [ [88,-211], [88,-110]  ],
   [ [88,-110], [45,-128]  ],
   [ [45,-128], [27,-135]  ],
   [ [27,-135], [27,-69]   ],
   [ [27,-69], [27,37]    ],
   // inside, counter-clockwise co-ords
   [ [45,44],     ],
   [ [45,44],  [45,-62]   ],
   [ [45,-62], [88,-44]   ],
   [ [88,-44], [88,61]    ],
   [ [88,61], [45,44]    ]
 ];
 
 
 ThisType.prototype.trebleclef = [[[-1, 52]], [[-1, 52], [-1, 103], [45, 176]], 
   [[45, 176], [76, 226], [133, 288]],
   [[133, 228], [175, 334], [183, 339]],
   [[183, 339], [178, 349], [161, 439]],
   [[161, 439], [157, 468], [157, 483]],
   [[157, 483], [157, 545], [214, 673], [251, 673]],
   [[251, 673], [276, 673], [321, 552], [321, 505]],
   [[321, 505], [321, 441], [302, 385]],
   [[302, 385], [275, 306], [214, 256]],
   [[214, 256], [202, 246]],
   [[202, 246], [191, 238], [135, 176], [119, 155]],
   [[119, 155], [90, 118], [75, 87]],
   [[75, 87], [55, 46], [55, 7]],
   [[55, 7], [55, -14], [61, -35]],
   [[61, -35], [74, -79], [131, -119]],
   [[131, -119], [177, -151], [288, -151]],
   [[288, -151], [244, -151], [258, -147], [276, -141]],
   [[276, -141], [289, -134]],
   [[289, -134], [331, -124], [380, -63], [380, -22]],
   [[380, -22], [379, -14], [379, -10]],
   [[379, -10], [374, 37], [306, 96], [261, 96]],
   [[261, 96], [250, 96], [244, 95]],
   [[244, 95], [228, 95]],
   [[228, 95], [181, 89], [157, 51]],
   [[157, 51], [138, 21], [138, -14]],
   [[138, -14], [138, -52], [180, -86]],
   [[180, -86], [216, -115], [238, -115]],
   [[238, -115], [237, -122]],
   [[237, -122], [209, -118], [173, -93]],
   [[173, -93], [124, -58], [114, -9]],
   [[114, -9], [111, 6], [111, 20]],
   [[111, 20], [111, 69], [170, 146], [219, 158]],
   [[219, 158], [233, 159]],
   [[233, 159], [251, 162], [267, 162]],
   [[267, 162], [342, 162], [383, 104]],
   [[383, 104], [418, 55], [418, -15]],
   [[418, -15], [418, -69], [349, -146], [294, -159]],
   [[294, -159], [320, -302]],
   [[320, -302], [322, -314], [322, -319]],
   [[322, -319], [322, -359], [265, -416], [222, -426]],
   [[222, -426], [215, -420], [203, -428]],
   [[203, -428], [162, -428], [98, -362], [98, -328]],
   [[-230], [98, -322], [99, -319]],
   [[99, -319], [104, -291], [142, -258], [170, -258]],
   [[-88], [197, -258], [237, -294], [237, -320]],
   [[237, -320], [237, -348], [200, -389], [171, -389]],
   [[171, -389], [164, -388], [161, -388]],
   [[161, -388], [172, -398], [182, -403]],
   [[182, -403], [201, -413], [219, -413]],
   [[219, -413], [249, -413], [282, -380]],
   [[282, -380], [308, -354], [308, -319]],
   [[308, -319], [308, -314], [306, -300]],
   [[306, -300], [282, -164]],
   [[282, -164], [269, -167], [237, -169], [220, -169]],
   [[220, -169], [131, -169], [-1, -39], [-1, 52]],
   [[196, 348]],
   [[196, 348], [219, 368]],
   [[219, 368], [243, 380], [274, 437]],
   [[274, 437], [297, 479], [297, 518]],
   [[297, 518], [297, 525], [295, 539]],
   [[295, 539], [290, 572], [287, 579]],
   [[287, 579], [278, 599], [257, 599]],
   [[257, 599], [237, 599], [193, 512], [184, 461]],
   [[184, 461], [182, 448], [192, 361], [196, 348]], [],
   [[202, 246]],
   [[202, 246], [214, 256]],
   [[214, 256], [233, 159]],
   [[233, 159], [244, 95]],
   [[244, 95], [289, -134]],
   [[289, -134], [276, -141]],
   [[276, -141], [228, 95]],
   [[228, 95], [219, 158]],
 [[219, 158], [202, 246]]];
 
 
 
 
 ThisType.prototype.rest1 =  [
   [[0,80], [0,159]],
   [[0,159], [185,159]],
   [[185,159], [185,80]],
   [[185,80], [0,80]]
 ];
 
 ThisType.prototype.rest2 =  [
   [[0,0], [0,79]],
   [[0,79], [185,79]],
   [[185,79], [185,0]],
   [[185,0], [0,0]]
 ];
 
 
 ThisType.prototype.rest4 =  [
   [[18,34],    [32,42],    [73,105],   [84,134]],
   [[84,134],   [86,138],   [86,148]],
   [[86,148],   [86,172],   [63,209]],
   [[63,209],   [44,239],   [38,243]],
   [[38,243],   [60,243]],
   [[60,243],   [182,102]],
   [[182,102],  [168,96],   [139,55]],
   [[139,55],   [106,9],    [106,-15]],
   [[106,-15],  [106,-44],  [144,-104], [170,-121]],
   [[170,-121], [164,-135]],
   [[164,-135], [158,-134], [135,-132], [130,-132]],
   [[130,-132], [103,-132], [76,-142],  [70,-151]],
   [[70,151],   [65,-159],  [65,-170]],
   [[65,-170],  [65,-191],  [87,-219]],
   [[87,-219],  [105,-242], [111,-244]],
   [[111,-244], [106,-252]],
   [[106,-252], [99,-254],  [56,-216]],
   [[56,-216],  [8,-174],   [8,-145]],
   [[8,-145],   [8,-121],   [45,-91],   [72,-91]],
   [[72,-91],   [86,-91],   [115,-99],  [129,-109]],
   [[129,-109], [18,34]]
 ];
 
 
 ////////////////////////// 
 ThisType.prototype.paint = function(staff) {
   var i, startx, starty, scale, points;
   var sdet = staff.details;
   var ctx = sdet.ctx;
   var c = this.c;
   
   startx = c.originx;
   starty = c.originy;
   scale = c.scale;
   
   points = this[Score.graphicsList[this.name]];
   
   
   // FIXME: set correct glyph point set based on clef type
   
   ctx.beginPath();
   
   for (i=0; i<points.length;i++) {
     if (points[i].length == 1) {
       ctx.moveTo(startx+(points[i][0][0])/scale, starty+(points[i][0][1]*-1)/scale );
       
     } else if (points[i].length == 2) {
       // draw line
       ctx.lineTo(startx+(points[i][1][0])/scale, starty+(points[i][1][1]*-1)/scale );
       
     } else if (points[i].length == 3) {
       ctx.quadraticCurveTo(   startx+(points[i][1][0])/scale, starty+(points[i][1][1]*-1)/scale, // CP1 XY
                            startx+(points[i][2][0])/scale, starty+(points[i][2][1]*-1)/scale); // end XY
       
     } else if (points[i].length == 4) {
       ctx.bezierCurveTo(      startx+(points[i][1][0])/scale, starty+(points[i][1][1]*-1)/scale, // CP1 XY
                         startx+(points[i][2][0])/scale, starty+(points[i][2][1]*-1)/scale, // CP2 XY
                         startx+(points[i][3][0])/scale, starty+(points[i][3][1]*-1)/scale); // end XY
       
     } else if (points[i].length == 0) {
       ctx.fill();
       ctx.beginPath();
     }
     
   }
   ctx.fill();
 };
 
 Score.prototype.createGraphic = function(fname) {
   return new ThisType(fname);
 };
}
)();

