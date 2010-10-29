"use strict";

var GHPRef = {
  LG: "g1",
  LA: "a2",
  B: "b2",
  C: "c2",
  D: "d2",
  E: "e2",
  F: "f2",
  HG: "g2",
  HA: "a3"
};


var beamGroupDef = {
  start:  {sectionStart: true},
  end:    {sectionEnd: true}
};



function parseBWW(dots) {
  //HACK:  Fix a bad data being passed.  Would be better to keep bad data
  // from getting through in the first place though.
  dots = dots.join("\r");
  dots = dots.split(/\r|\n/);
  
  function importException (message)
  {
    this.message=message;
    this.name="BWW Import Exception";
  }
  
  
  /*
  "Layout Tester",(T,L,0,0,Times New Roman,16,700,0,0,18,0,0,0)
  "Crap",(Y,C,0,0,Times New Roman,14,400,0,0,18,0,0,0)
  "Jeremy J Starcher",(M,R,0,0,Times New Roman,14,400,0,0,18,0,0,0)
  
  "It just is",(F,R,0,0,Times New Roman,10,400,0,0,18,0,0,0)
  */
  
  var grok_metaData = (function() {
                       var a = {
                       MIDINoteMappings: {ignore: true},
                       FrequencyMappings: {ignore: true},
                       InstrumentMappings: {ignore: true},
                       GracenoteDurations: {ignore: true},
                       FontSizes: {ignore: true},
                       TuneFormat: {ignore: true},
                       TuneTempo: {ignore: false}
                       };
                       
                       function isType(s) {
                         // Look for things that start with a quote.
                         
                         //alert(typeof s);
                         //alert([s, s.substring(0,1), s.substring(0,1) === '"']); 
                         if (s.substring(0,1) === '"') {
                           return true;
                         }
                         
                         var l = s.split(",")[0];
                         // Handle the things on the list.
                         if (typeof a[l] !== "undefined") {
                           return true;
                         }
                         
                         //TODO:
                         // We really should check for this before we even
                         // begin parsing.
                         if (s == "Bagpipe Reader:1.0") {
                           return true;
                         }
                         
                         return false;
                       }
                       
                       function setData(data, s) {
                         var i, mode;
                         var l, name, val;
                         
                         // If it is one of those that starts in a quote
                         // handle it.
                         if (s.substring(0,1) === '"') {
                           i = s.indexOf(',(');
                           if (i === -1) {return; }
                           
                           mode = s.substring(i+2, i+3);
                           
                           name = {
                             T: "Title",
                             Y: "Genre",
                             M: "Composer",
                             F: "Footer"
                           }[mode];
                           
                           if (name) {
                             val = s.split(",")[0].replace(/"/g, '')
                             data[name] = val;
                           } else {
                             throw importException("Unknown type in text string");
                           }
                           return;
                         }
                         
                         l = s.split(",");
                         name = l[0];
                         
                         l.splice(0,1);
                         val = l.join(" , ");
                         
                         data[name] = val;
                       }
                       return {
                         isType: isType,
                         setData: setData
                       };
  }());
  
  
  
  var z_invalid = (function() {
                   /* 
                   This is a list of BWW symbols that we do not currently 
                   support.  When one or more of these symbols are supported,
                   make sure to remove them from this list.
                   */
                   var a = [  
                     "naturalha",
                     "naturalhg",
                     "naturalf",
                     "naturale",
                     "naturald",
                     "naturalc",
                     "naturalb",
                     "naturalla",
                     "naturallg",
                     "pdarodo16",
                     "phdarodo",
                     "plbrea",
                     "plbbrea",
                     "pcbrea",
                     "pcbbrea",
                     "phllabrea",
                     "phtlabrea",
                     "phclabrea",
                     "ptra8",
                     "phtra",
                     "pl",
                     "pt",
                     "pc",
                     "phiharin",
                     "pedre",
                     "pdare",
                     "pembari",
                     "pendari",
                     "pchedari",
                     "phedari",
                     "pdarodo",
                     "penbain",
                     "potro",
                     "podro",
                     "padeda",
                     "pgrp",
                     "ptra",
                     "pdili",
                     "phcla",
                     "phclg",
                     "pclg",
                     "pcb",
                     "pcmb",
                     "pcmc",
                     "pcmd",
                     "phtla",
                     "phtlg",
                     "ptlg",
                     "ptb",
                     "ptriplg",
                     "ptripla",
                     "ptripb",
                     "ptripc",
                     "ptmb",
                     "ptmc",
                     "ptmd",
                     "pedrelg",
                     "pedrela",
                     "pedreb",
                     "pedrec",
                     "pedred",
                     "phlla",
                     "plb",
                     "pchechere",
                     "ptblg",
                     "ptbrea",
                     "ptbbrea",
                     "phtriplg",
                     "phtripla",
                     "phtripb",
                     "phtripc",
                     "pttriplg",
                     "pttripla",
                     "pttripb",
                     "pttripc",
                     "pcblg",
                     "REST_1",
                     "REST_2",
                     "REST_4",
                     "REST_8",
                     "REST_16",
                     "REST_32",
                     "bis_'",
                     "'si",
                     "'do",
                     "^2e",
                     "^43e",
                     "^53e",
                     "^64e",
                     "^74e",
                     "^46e",
                     "^54e",
                     "^76e",
                     "=^3b",
                     "=^3c",
                     "^3d",
                     "^3f",
                     "^3ha",
                     "^3hg",
                     "^3la",
                     "^3lg",
                     "^2s",
                     "^43s",
                     "^53s",
                     "^64s",
                     "^74s",
                     "^46s",
                     "^54s",
                     "^76s",
                     "^tb",
                     "^tc",
                     "^td",
                     "^tf",
                     "^tha",
                     "^thg",
                     "^tla",
                     "^tlg",
                     "flatlg",
                     "flatla",
                     "flatb",
                     "flatc",
                     "flatd",
                     "flate",
                     "flatf",
                     "flathg",
                     "flatha",
                     "xfermatlg",
                     "fermatla",
                     "fermatb",
                     "fermatc",
                     "fermatd",
                     "fermate",
                     "fermatf",
                     "fermathg",
                     "fermatha",
                     "HA_STAFF",
                     "staff",
                     "dalsegno",
                     "segno",
                     "fine",
                     "dacapoalfine",
                     "coda",
                     "dacapoalcoda",
                     "codasection"
                   ];
                   
                   function isType(s) {
                     return (a.indexOf(s) !== -1);
                   }
                   
                   function create(s) {
                     alert("can't create an invalid type");
                   }
                   return {
                     isType: isType,
                     create: create
                   };
                   
                   
  }());
  
  // Is this a beat? Which would end a beam?
  var z_beat = (function() {
                function isType(s) {
                var mel = z_staffControl.create(s);
                
                if (s === "~") {return true;}
                if (s === "\t") {return true;}
                if (mel.newBar) {return true;}
                return false;
                };
                
                
                function create(s) {
                  // We don't need a class for this silly thing.
                  // Thats the beauty of dynamic languages.
                  var mel = new ScoreElement();
                  mel.type = "beat";
                  return mel;
                }
                return {
                  isType: isType,
                  create: create
                };
                
  }());
  
  var z_keysig = (function() {
                  
                  function isType(s) {
                  return (s === "&");
                  }
                  
                  function create(s) {
                    return score.createKeySig();
                  }
                  
                  return {
                    isType: isType,
                    create: create
                  };
                  
                  
  }());
  
  
  
  var z_graphic = (function() {
                   var a = {
                   "&":         {name: "treble-clef", staffNote: GHPRef.LG},
                   "sharpha":   {name: "sharp", staffNote: GHPRef.HA},
                   "sharphg":   {name: "sharp", staffNote: GHPRef.HG},
                   "sharpf":    {name: "sharp", staffNote: GHPRef.F},
                   "sharpe":    {name: "sharp", staffNote: GHPRef.E},
                   "sharpd":    {name: "sharp", staffNote: GHPRef.D},
                   "sharpc":    {name: "sharp", staffNote: GHPRef.C},
                   "sharpb":    {name: "sharp", staffNote: GHPRef.B},
                   "sharpla":   {name: "sharp", staffNote: GHPRef.LA},
                   "sharplg":   {name: "sharp", staffNote: GHPRef.LG},
                   "naturalha": {name: "natural", staffNote: GHPRef.HA},
                   "naturalhg": {name: "natural", staffNote: GHPRef.HG},
                   "naturalf":  {name: "natural", staffNote: GHPRef.F},
                   "naturale":  {name: "natural", staffNote: GHPRef.E},
                   "naturald":  {name: "natural", staffNote: GHPRef.D},
                   "naturalc":  {name: "natural", staffNote: GHPRef.C},
                   "naturalb":  {name: "natural", staffNote: GHPRef.B},
                   "naturalla": {name: "natural", staffNote: GHPRef.LA},
                   "naturallg": {name: "natural", staffNote: GHPRef.LG}
                   };
                   
                   function isType(s) {
                     return (typeof a[s] !== "undefined");
                   }
                   
                   function create(s) {
                     var mel = score.createGraphic(a[s].name);
                     meldObjectToObject(a[s], mel);
                     
                     // HACK: All new lines start off with a staff bar
                     if (s === '&') {
                       return [z_staffControl.create("!"), mel]; // Special handling
                     } else {
                       return mel;
                     }
                   }
                   return {
                     isType: isType,
                     create: create
                   };
                   
                   
  }());
  
  var z_timesig = (function() {
                   
                   var a = ["5_8","12_8","2_4","3_2","3_4","4_4","5_4","6_4","6_8",
                   "7_4","9_8","C","C_","15_8","18_8","21_8","2_2","2_8","3_8","4_8","7_8",
                   "8_8","10_8","11_8","2_16","3_16","4_16","5_16","6_16","7_16","8_16",
                   "9_16","10_16","11_16","12_16"];
                   
                   function isType(s) {
                     return (a.indexOf(s) !== -1);
                   }
                   
                   function create(s)
                   {
                     var mel = score.createTimeSig();
                     var s1 = s.split("_");
                     
                     mel.beatSymbol = s;
                     switch(s) {
                     case "C":
                       mel.beatsPerBar = 4;
                       mel.beatUnit = 4;
                       break;
                     case "C_":
                       mel.beatsPerBar = 2;
                       mel.beatUnit = 2;
                       break;
                     default:
                       mel.beatsPerBar = +s1[0];
                       mel.beatUnit = +s1[1];
                       break;
                     }
                     
                     // TJM don't overwrite metadata,
                     //    it should only be set once per score
                     //    as tempo changes don't effect text titles
                     if (!score.metaData.beatUnit)
                       score.metaData.beatUnit = mel.beatUnit;
                     return mel;
                     
                   }
                   return {
                     isType: isType,
                     create: create
                   };                 
  }());
  
  var z_ghbgrace = (function() {
                    var a = {   
                    "hgrpla": {category: "EMBELISHMENTS", dots: "agdg*"},
                    "hgrpd": {category: "EMBELISHMENTS", dots: "dgdg*"},
                    "hgrpdb": {category: "EMBELISHMENTS", dots: "dgbg*"},
                    "hgrpe": {category: "EMBELISHMENTS", dots: "egdg*"},
                    "hgrpf": {category: "EMBELISHMENTS", dots: "fgdg*"},
                    "hgrphg": {category: "EMBELISHMENTS", dots: "Ggdg*"},
                    "hgrpha": {category: "EMBELISHMENTS", dots: "Agdg*"},
                    "ggrpdb": {category: "EMBELISHMENTS", dots: "Gdgbg"},
                    "tgrpdb": {category: "EMBELISHMENTS", dots: "Adgbg*"},
                    "pelf": {category: "EMBELISHMENTS", dots: "GfGf*e"},
                    "tpelf": {category: "EMBELISHMENTS", dots: "AfGf*e"},
                    "tpelhg": {category: "EMBELISHMENTS", dots: "AGAG*f"},
                    "hpelf": {category: "EMBELISHMENTS", dots: "fGf*e"},
                    "hpelhg": {category: "EMBELISHMENTS", dots: "GAG*f"},
                    "hst2la": {category: "EMBELISHMENTS", dots: "agag"},
                    "hst2b": {category: "EMBELISHMENTS", dots: "bgbg"},
                    "hst2c": {category: "EMBELISHMENTS", dots: "cgcg"},
                    "hst2d": {category: "EMBELISHMENTS", dots: "dgdg"},
                    "lhst2d": {category: "EMBELISHMENTS", dots: "dcdc"},
                    "hst2e": {category: "EMBELISHMENTS", dots: "eaea"},
                    "hst2f": {category: "EMBELISHMENTS", dots: "fefe"},
                    "hst2hg": {category: "EMBELISHMENTS", dots: "GfGf"},
                    "hst2ha": {category: "EMBELISHMENTS", dots: "AGAG"},
                    "gst2la": {category: "EMBELISHMENTS", dots: "Gagag"},
                    "gst2b": {category: "EMBELISHMENTS", dots: "Gbgbg"},
                    "gst2c": {category: "EMBELISHMENTS", dots: "Gcgcg"},
                    "gst2d": {category: "EMBELISHMENTS", dots: "Gdgdg"},
                    "lgst2d": {category: "EMBELISHMENTS", dots: "Gdcdc"},
                    "gst2e": {category: "EMBELISHMENTS", dots: "Geaea"},
                    "gst2f": {category: "EMBELISHMENTS", dots: "Gfefe"},
                    "tst2la": {category: "EMBELISHMENTS", dots: "Aagag"},
                    "tst2b": {category: "EMBELISHMENTS", dots: "Abgbg"},
                    "tst2c": {category: "EMBELISHMENTS", dots: "Acgcg"},
                    "tst2d": {category: "EMBELISHMENTS", dots: "Adgdg"},
                    "ltst2d": {category: "EMBELISHMENTS", dots: "Adcdc"},
                    "tst2e": {category: "EMBELISHMENTS", dots: "Aeaea"},
                    "tst2f": {category: "EMBELISHMENTS", dots: "Afefe"},
                    "tst2hg": {category: "EMBELISHMENTS", dots: "AGfGf"},
                    "st2la": {category: "EMBELISHMENTS", dots: "gag"},
                    "st2b": {category: "EMBELISHMENTS", dots: "gbg"},
                    "st2c": {category: "EMBELISHMENTS", dots: "gcg"},
                    "st2d": {category: "EMBELISHMENTS", dots: "gdg"},
                    "lst2d": {category: "EMBELISHMENTS", dots: "cdc"},
                    "st2e": {category: "EMBELISHMENTS", dots: "aea"},
                    "st2f": {category: "EMBELISHMENTS", dots: "efe"},
                    "st2hg": {category: "EMBELISHMENTS", dots: "fGf"},
                    "st2ha": {category: "EMBELISHMENTS", dots: "GAG"},
                    "dlg": {category: "EMBELISHMENTS", dots: "dg"},
                    "dla": {category: "EMBELISHMENTS", dots: "da"},
                    "db": {category: "EMBELISHMENTS", dots: "db"},
                    "dc": {category: "EMBELISHMENTS", dots: "dc"},
                    "elg": {category: "EMBELISHMENTS", dots: "eg"},
                    "ela": {category: "EMBELISHMENTS", dots: "ea"},
                    "eb": {category: "EMBELISHMENTS", dots: "eb"},
                    "ec": {category: "EMBELISHMENTS", dots: "ec"},
                    "ed": {category: "EMBELISHMENTS", dots: "ed"},
                    "flg": {category: "EMBELISHMENTS", dots: "fg"},
                    "fla": {category: "EMBELISHMENTS", dots: "fa"},
                    "fb": {category: "EMBELISHMENTS", dots: "fb"},
                    "fc": {category: "EMBELISHMENTS", dots: "fc"},
                    "fd": {category: "EMBELISHMENTS", dots: "fd"},
                    "fe": {category: "EMBELISHMENTS", dots: "fe"},
                    "glg": {category: "EMBELISHMENTS", dots: "Gg"},
                    "gla": {category: "EMBELISHMENTS", dots: "Ga"},
                    "gb": {category: "EMBELISHMENTS", dots: "Gb"},
                    "gc": {category: "EMBELISHMENTS", dots: "Gc"},
                    "gd": {category: "EMBELISHMENTS", dots: "Gd"},
                    "gf": {category: "EMBELISHMENTS", dots: "Gf"},
                    "tlg": {category: "EMBELISHMENTS", dots: "Ag"},
                    "tla": {category: "EMBELISHMENTS", dots: "Aa"},
                    "tb": {category: "EMBELISHMENTS", dots: "Ab"},
                    "tc": {category: "EMBELISHMENTS", dots: "Ac"},
                    "td": {category: "EMBELISHMENTS", dots: "Ad"},
                    "te": {category: "EMBELISHMENTS", dots: "Ae"},
                    "tf": {category: "EMBELISHMENTS", dots: "Af"},
                    "thg": {category: "EMBELISHMENTS", dots: "AG"},
                    "ge": {category: "EMBELISHMENTS", dots: "Ge"},
                    "hst3la": {category: "EMBELISHMENTS", dots: "agagag"},
                    "hst3b": {category: "EMBELISHMENTS", dots: "bgbgbg"},
                    "hst3c": {category: "EMBELISHMENTS", dots: "cgcgcg"},
                    "hst3d": {category: "EMBELISHMENTS", dots: "dgdgdg"},
                    "lhst3d": {category: "EMBELISHMENTS", dots: "dcdcdc"},
                    "hst3e": {category: "EMBELISHMENTS", dots: "eaeaea"},
                    "hst3f": {category: "EMBELISHMENTS", dots: "fefefe"},
                    "hst3hg": {category: "EMBELISHMENTS", dots: "GfGfGf"},
                    "hst3ha": {category: "EMBELISHMENTS", dots: "AGAGAG"},
                    "gst3la": {category: "EMBELISHMENTS", dots: "Gagagag"},
                    "gst3b": {category: "EMBELISHMENTS", dots: "Gbgbgbg"},
                    "gst3c": {category: "EMBELISHMENTS", dots: "Gcgcgcg"},
                    "gst3d": {category: "EMBELISHMENTS", dots: "Gdgdgdg"},
                    "lgst3d": {category: "EMBELISHMENTS", dots: "Gdcdcdc"},
                    "gst3e": {category: "EMBELISHMENTS", dots: "Geaeaea"},
                    "gst3f": {category: "EMBELISHMENTS", dots: "Gfefefe"},
                    "tst3la": {category: "EMBELISHMENTS", dots: "Aagagag"},
                    "tst3b": {category: "EMBELISHMENTS", dots: "Abgbgbg"},
                    "tst3c": {category: "EMBELISHMENTS", dots: "Acgcgcg"},
                    "tst3d": {category: "EMBELISHMENTS", dots: "Adgdgdg"},
                    "ltst3d": {category: "EMBELISHMENTS", dots: "Adcdcdc"},
                    "tst3e": {category: "EMBELISHMENTS", dots: "Aeaeaea"},
                    "tst3f": {category: "EMBELISHMENTS", dots: "Afefefe"},
                    "tst3hg": {category: "EMBELISHMENTS", dots: "AGfGfGf"},
                    "st3la": {category: "EMBELISHMENTS", dots: "gagag"},
                    "st3b": {category: "EMBELISHMENTS", dots: "gbgbg"},
                    "st3c": {category: "EMBELISHMENTS", dots: "gcgcg"},
                    "st3d": {category: "EMBELISHMENTS", dots: "gdgdg"},
                    "lst3d": {category: "EMBELISHMENTS", dots: "cdcdc"},
                    "st3e": {category: "EMBELISHMENTS", dots: "aeaea"},
                    "st3f": {category: "EMBELISHMENTS", dots: "efefe"},
                    "st3hg": {category: "EMBELISHMENTS", dots: "fGfGf"},
                    "st3ha": {category: "EMBELISHMENTS", dots: "GAGAG"},
                    "hgrp": {category: "EMBELISHMENTS", dots: "dg*"},
                    "htar": {category: "EMBELISHMENTS", dots: "dg*e"},
                    "hcrunl": {category: "EMBELISHMENTS", dots: "dg*eafa"},
                    "hlemlg": {category: "EMBELISHMENTS", dots: "d1g2"},
                    "hcrunllgla": {category: "EMBELISHMENTS", dots: "d1g2e1a1f1a1"},
                    "darodo16": {category: "EMBELISHMENTS", dots: "g4d1g1c1g4"},
                    "pdarodo16": {category: "PIOB_OVERNEXT", dots: "g4d1g1c1g4"},
                    "hdarodo": {category: "EMBELISHMENTS", dots: "d1g1c1g3"},
                    "phdarodo": {category: "PIOB_OVERNEXT", dots: "d1g1c1g3"},
                    "lembrea": {category: "EMBELISHMENTS", dots: "g1d1g2"},
                    "lembbrea": {category: "EMBELISHMENTS", dots: "g1b1g2"},
                    "plbrea": {category: "PIOB_UNDERPREV", dots: "g1d1g2"},
                    "plbbrea": {category: "PIOB_UNDERPREV", dots: "g1b1g2"},
                    "crunlbrea": {category: "EMBELISHMENTS", dots: "g1d1g2e1a1f1a1"},
                    "crunlbbrea": {category: "EMBELISHMENTS", dots: "g1b1g2e1a1f1a1"},
                    "pcbrea": {category: "PIOB_UNDERPREV", dots: "g1d1g2e1a1f1a1"},
                    "pcbbrea": {category: "PIOB_UNDERPREV", dots: "g1b1g2e1a1f1a1"},
                    "hlemlabrea": {category: "EMBELISHMENT", dots: " d1a2"},
                    "phllabrea": {category: "PIOB_UNDERPREV", dots: " d1a2"},
                    "htarlabrea": {category: "EMBELISHMENT", dots: " d1a2e1"},
                    "phtlabrea": {category: "PIOB_UNDERPREV", dots: " d1a2e1"},
                    "hcrunllabrea": {category: "EMBELISHMENT", dots: " d1a2e1a1f1a1"},
                    "phclabrea": {category: "PIOB_UNDERPREV", dots: " d1a2e1a1f1a1"},
                    "tra8": {category: "EMBELISHMENTS", dots: "g4d1c1"},
                    "ptra8": {category: "PIOB_OVERNEXT", dots: "g4d1c1"},
                    "phtra ": {category: "PIOB_OVERNEXT", dots: "d1c1"},
                    "endarig": {category: "EMBELISHMENTS", dots: "f1e1G1e1"},
                    "gendari": {category: "EMBELISHMENTS", dots: "G1e1f1e1"},
                    "hste": {category: "EMBELISHMENTS", dots: "e1a1"},
                    "pl": {category: "PIOB_UNDERPREV", dots: "g1d1g2e7"},
                    "pt": {category: "PIOB_UNDERPREV", dots: "g1d1g2e1a8"},
                    "pc": {category: "PIOB_UNDERPREV", dots: "g1d1g2e1a1f1a1e9"},
                    "strb": {category: "EMBELISHMENTS", dots: "b"},
                    "strc": {category: "EMBELISHMENTS", dots: "c"},
                    "strd": {category: "EMBELISHMENTS", dots: "d"},
                    "stre": {category: "EMBELISHMENTS", dots: "e"},
                    "strf": {category: "EMBELISHMENTS", dots: "f"},
                    "strhg": {category: "EMBELISHMENTS", dots: "G"},
                    "strla": {category: "EMBELISHMENTS", dots: "a"},
                    "strlg": {category: "EMBELISHMENTS", dots: "g"},
                    "tstla": {category: "EMBELISHMENTS", dots: "Aag"},
                    "tg": {category: "EMBELISHMENTS", dots: "A"},
                    "hstf": {category: "EMBELISHMENTS", dots: "fe"},
                    "hstla": {category: "EMBELISHMENTS", dots: "ag"},
                    "pella": {category: "EMBELISHMENTS", dots: "Gaea*g"},
                    "tpella": {category: "EMBELISHMENTS", dots: "Aaea*g"},
                    "hpella": {category: "EMBELISHMENTS", dots: "aea*g"},
                    "ggrpla": {category: "EMBELISHMENTS", dots: "Gagdg*"},
                    "ggrpd": {category: "EMBELISHMENTS", dots: "Gdgdg*"},
                    "ggrpe": {category: "EMBELISHMENTS", dots: "Gegdg*"},
                    "ggrpf": {category: "EMBELISHMENTS", dots: "Gfgdg*"},
                    "tgrpla": {category: "EMBELISHMENTS", dots: "Aagdg*"},
                    "tgrpd": {category: "EMBELISHMENTS", dots: "Adgdg*"},
                    "tgrpe": {category: "EMBELISHMENTS", dots: "Aegdg*"},
                    "tgrpf": {category: "EMBELISHMENTS", dots: "Afgdg*"},
                    "tgrphg": {category: "EMBELISHMENTS", dots: "AGgdg*"},
                    "cadged": {category: "CADENCE", dots: "G1e5d2"},
                    "cadaed": {category: "CADENCE", dots: "A1e5d2"},
                    "cadae": {category: "CADENCE", dots: "A1e5"},
                    "cadge": {category: "CADENCE", dots: "G1e5"},
                    "caded": {category: "CADENCE", dots: "e5d2"},
                    "hiharin": {category: "EMBELISHMENTS", dots: "d3a1g1a1g1"},
                    "dare": {category: "EMBELISHMENTS", dots: "f1e1G1e1"},
                    "embari": {category: "EMBELISHMENTS", dots: "e1g1f1g1"},
                    "endari": {category: "EMBELISHMENTS", dots: "e1a1f1a1"},
                    "chedari": {category: "EMBELISHMENTS", dots: "f2e1G1e1f1e1"},
                    "hedari": {category: "EMBELISHMENTS", dots: "e3G1e1f1e1"},
                    "darodo": {category: "EMBELISHMENTS", dots: "g3d1g1c1g3"},
                    "dre": {category: "EMBELISHMENTS", dots: "a1f1a2"},
                    "deda": {category: "EMBELISHMENTS", dots: "g1e1g2"},
                    "tra": {category: "EMBELISHMENTS", dots: "g3d1c1"},
                    "gdare": {category: "EMBELISHMENTS", dots: "G1f1e1G1e1"},
                    "gedre": {category: "EMBELISHMENTS", dots: "G1e1a1f1a2"},
                    "enbain": {category: "EMBELISHMENTS", dots: "a2g1d1g2"},
                    "otro": {category: "EMBELISHMENTS", dots: "b2g1d1g2"},
                    "odro": {category: "EMBELISHMENTS", dots: "c2g1d1g2"},
                    "adeda": {category: "EMBELISHMENTS", dots: "d2g1e1g2"},
                    "chelalho": {category: "EMBELISHMENTS", dots: "f3d2e2"},
                    "phiharin": {category: "PIOB_OVERNEXT", dots: "d3a1g1a1g1"},
                    "fcadged": {category: "CADENCE", dots: "G1e6d2"},
                    "fcadge": {category: "CADENCE", dots: "G1e6"},
                    "fcaded": {category: "CADENCE", dots: "e6d2"},
                    "fcadaed": {category: "CADENCE", dots: "A1e6d2"},
                    "fcadae": {category: "CADENCE", dots: "A1e6"},
                    "pedre": {category: "PIOB_OVERNEXT", dots: "e1a1f1a2"},
                    "pdare": {category: "PIOB_OVERNEXT", dots: "f1e1G1e1"},
                    "pembari": {category: "PIOB_OVERNEXT", dots: "e1g1f1g2"},
                    "pendari": {category: "PIOB_OVERNEXT", dots: "e1a1f1a2"},
                    "pchedari": {category: "PIOB_OVERNEXT", dots: "f2e1G1e1f1e1"},
                    "phedari": {category: "PIOB_OVERNEXT", dots: "e3G1e1f1e1"},
                    "pdarodo": {category: "PIOB_OVERNEXT", dots: "g3d1g1c1g3"},
                    "penbain": {category: "PIOB_OVERNEXT", dots: "a2g1d1g2"},
                    "potro": {category: "PIOB_OVERNEXT", dots: "b2g1d1g2"},
                    "podro": {category: "PIOB_OVERNEXT", dots: "c2g1d1g2"},
                    "padeda": {category: "PIOB_OVERNEXT", dots: "d2g1e1g2"},
                    "pgrp": {category: "PIOB_OVERNEXT", dots: "g1d1g2"},
                    "ptra": {category: "PIOB_OVERNEXT", dots: "g3d1c1"},
                    "pdili": {category: "PIOB_OVERNEXT", dots: "A1G1"},
                    "hcrunlla": {category: "EMBELISHMENTS", dots: "d1a2e1a1f1a1"},
                    "phcla": {category: "PIOB_UNDERPREV", dots: "d1a2e1a1f1a1e9"},
                    "hcrunllg": {category: "EMBELISHMENTS", dots: "d1g2e1g1f1g1"},
                    "phclg": {category: "PIOB_UNDERPREV", dots: "d1g2e1g1f1g1e9"},
                    "crunllg": {category: "EMBELISHMENTS", dots: "g1d1g2e1g1f1g1"},
                    "pclg": {category: "PIOB_UNDERPREV", dots: "g1d1g2e1g1f1g1e9"},
                    "crunlb": {category: "EMBELISHMENTS", dots: "g1b1g2e1a1f1a1"},
                    "pcb": {category: "PIOB_UNDERPREV", dots: "g1b1g2e1a1f1a1e9"},
                    "pcmb": {category: "PIOB_UNDERNEXT_CAMACH", dots: "G1b1g1d1g2b3e1b1f1b1"},
                    "pcmc": {category: "PIOB_UNDERNEXT_CAMACH", dots: "G1c1g1d1g2c3e1c1f1c1"},
                    "pcmd": {category: "PIOB_UNDERNEXT_CAMACH", dots: "G1b1g2d1c1d3e1d1f1d1"},
                    "htarla": {category: "EMBELISHMENTS", dots: "d1a2e1"},
                    "phtla": {category: "PIOB_UNDERPREV", dots: "d1a2e1a8"},
                    "htarlg": {category: "EMBELISHMENTS", dots: "d1g2e1"},
                    "phtlg": {category: "PIOB_UNDERPREV", dots: "d1g2e1g8"},
                    "tarlg": {category: "EMBELISHMENTS", dots: "g1d1g2e1"},
                    "ptlg": {category: "PIOB_UNDERPREV", dots: "g1d1g2e1g8"},
                    "ptb": {category: "PIOB_UNDERPREV", dots: "g1b1g2e1a8"},
                    "ptriplg": {category: "PIOB_UNDERNEXT", dots: "G1g1d1g1e1"},
                    "ptripla": {category: "PIOB_UNDERNEXT", dots: "G1a1d1a1e1"},
                    "ptripb": {category: "PIOB_UNDERNEXT", dots: "G1b1d1b1e1"},
                    "ptripc": {category: "PIOB_UNDERNEXT", dots: "G1c1d1c1e1"},
                    "ptmb": {category: "PIOB_UNDERNEXT", dots: "G1b2g1d1g2e1"},
                    "ptmc": {category: "PIOB_UNDERNEXT", dots: "G1c2g1d1g2e1"},
                    "ptmd": {category: "PIOB_UNDERNEXT", dots: "G1b2g2d1c1d3e1"},
                    "edrelg": {category: "EMBELISHMENTS", dots: "egfg"},
                    "edrela": {category: "EMBELISHMENTS", dots: "eafa"},
                    "pedrelg": {category: "PIOB_OVERNEXT", dots: "e1g1f1g2"},
                    "pedrela": {category: "PIOB_OVERNEXT", dots: "e1a1f1a2"},
                    "pedreb": {category: "PIOB_OVERNEXT", dots: "e1b1f1b2"},
                    "pedrec": {category: "PIOB_OVERNEXT", dots: "e1c1f1c2"},
                    "pedred": {category: "PIOB_OVERNEXT", dots: "e1d1f1d2"},
                    "phlla": {category: "PIOB_UNDERPREV", dots: "d1a2e7"},
                    "plb": {category: "PIOB_UNDERPREV", dots: "g1b1g2e7"},
                    "lem": {category: "EMBELISHMENTS", dots: "g1d1g2"},
                    "lemb": {category: "EMBELISHMENTS", dots: "g1b1g2"},
                    "hlemla": {category: "EMBELISHMENTS", dots: "d1a2"},
                    "dili": {category: "EMBELISHMENTS", dots: "A1G1"},
                    "rodin": {category: "EMBELISHMENTS", dots: "g1b1g2"},
                    "fcadaf": {category: "CADENCE", dots: "A1f6"},
                    "fcadgf": {category: "CADENCE", dots: "G1f6"},
                    "cadaf": {category: "CADENCE", dots: "A1f5"},
                    "cadgf": {category: "CADENCE", dots: "G1f5"},
                    "cade ": {category: "CADENCE", dots: "e5"},
                    "fcade": {category: "CADENCE", dots: "e6"},
                    "hedale": {category: "EMBELISHMENTS", dots: "e1G1e1"},
                    "hchechere": {category: "EMBELISHMENTS", dots: "e1A1e1"},
                    "chechere": {category: "EMBELISHMENTS", dots: "G3e1A1e1"},
                    "pchechere": {category: "PIOB_OVERNEXT", dots: "G3e1A1e1"},
                    "tchechere": {category: "EMBELISHMENTS", dots: "A1G3e1A1e1"},
                    "tdare": {category: "EMBELISHMENTS", dots: "A1f1e1G1e1"},
                    "tedre": {category: "EMBELISHMENTS", dots: "A1e1a1f1a2"},
                    "htra": {category: "EMBELISHMENTS", dots: "d1c1"},
                    "genbain": {category: "EMBELISHMENTS", dots: "G1a2g1d1g2"},
                    "gotro": {category: "EMBELISHMENTS", dots: "G1b2g1d1g2"},
                    "godro": {category: "EMBELISHMENTS", dots: "G1c2g1d1g2"},
                    "gadeda": {category: "EMBELISHMENTS", dots: "G1d2g1e1g2"},
                    "tenbain": {category: "EMBELISHMENTS", dots: "A1a2g1d1g2"},
                    "totro": {category: "EMBELISHMENTS", dots: "A1b2g1d1g2"},
                    "todro": {category: "EMBELISHMENTS", dots: "A1c2g1d1g2"},
                    "tadeda": {category: "EMBELISHMENTS", dots: "A1d2g1e1g2"},
                    "din": {category: "CADENCE", dots: "g3"},
                    "echolg": {category: "CADENCE", dots: "g4"},
                    "echola": {category: "CADENCE", dots: "a4"},
                    "echob": {category: "CADENCE", dots: "b4"},
                    "echoc": {category: "CADENCE", dots: "c4"},
                    "echod": {category: "CADENCE", dots: "d4"},
                    "echoe": {category: "CADENCE", dots: "e4"},
                    "echof": {category: "CADENCE", dots: "f4"},
                    "echohg": {category: "CADENCE", dots: "G4"},
                    "echoha": {category: "CADENCE", dots: "A4"},
                    "fg": {category: "EMBELISHMENTS", dots: "f3"},
                    "tarblg": {category: "EMBELISHMENTS", dots: "g1b1g2e1"},
                    "ptblg": {category: "PIOB_UNDERPREV", dots: "g1b1g2e1g8"},
                    "tarbrea": {category: "EMBELISHMENTS", dots: "g1d1g2e1"},
                    "ptbrea": {category: "PIOB_UNDERPREV", dots: "g1d1g2e1"},
                    "tarbbrea": {category: "EMBELISHMENTS", dots: "g1b1g2e1"},
                    "ptbbrea": {category: "PIOB_UNDERPREV", dots: "g1b1g2e1"},
                    "phtriplg": {category: "PIOB_UNDERNEXT", dots: "g1d1g1e1"},
                    "phtripla": {category: "PIOB_UNDERNEXT", dots: "a1d1a1e1"},
                    "phtripb": {category: "PIOB_UNDERNEXT", dots: "b1d1b1e1"},
                    "phtripc": {category: "PIOB_UNDERNEXT", dots: "c1d1c1e1"},
                    "pttriplg": {category: "PIOB_UNDERNEXT", dots: "A1g1d1g1e1"},
                    "pttripla": {category: "PIOB_UNDERNEXT", dots: "A1a1d1a1e1"},
                    "pttripb": {category: "PIOB_UNDERNEXT", dots: "A1b1d1b1e1"},
                    "pttripc": {category: "PIOB_UNDERNEXT", dots: "A1c1d1c1e1"},
                    "crunlblg": {category: "EMBELISHMENTS", dots: "g1b1g2e1g1f1g1"},
                    "pcblg": {category: "PIOB_UNDERPREV", dots: "g1b1g2e1g1f1g1e9"},
                    "cg": {category: "EMBELISHMENTS", dots: "c"},
                    "bg": {category: "EMBELISHMENTS", dots: "b"},
                    "ag": {category: "EMBELISHMENTS", dots: "a"},
                    "hhvthrd": {category: "EMBELISHMENTS", dots: "dg2c"},
                    "hthrd": {category: "EMBELISHMENTS", dots: "dc"},
                    "hsthg": {category: "EMBELISHMENTS", dots: "Gf"},
                    "tsthg": {category: "EMBELISHMENTS", dots: "AGf"},
                    "tbr": {category: "EMBELISHMENTS", dots: "Aagag"},
                    "tar": {category: "EMBELISHMENTS", dots: "gdg*e"},
                    "tarb": {category: "EMBELISHMENTS", dots: "gbg*e"},
                    "tdbb": {category: "EMBELISHMENTS", dots: "Abd"},
                    "tdbc": {category: "EMBELISHMENTS", dots: "Acd"},
                    "tdbd": {category: "EMBELISHMENTS", dots: "Ade"},
                    "tdbe": {category: "EMBELISHMENTS", dots: "Aef"},
                    "tdbf": {category: "EMBELISHMENTS", dots: "AfG"},
                    "tdbla": {category: "EMBELISHMENTS", dots: "Aad"},
                    "tdblg": {category: "EMBELISHMENTS", dots: "Agd"},
                    "abr": {category: "EMBELISHMENTS", dots: "agag"},
                    "tstd": {category: "EMBELISHMENTS", dots: "Adg"},
                    "lgstd": {category: "EMBELISHMENTS", dots: "Gdc"},
                    "lhpeld": {category: "EMBELISHMENTS", dots: "ded*c"},
                    "lhstd": {category: "EMBELISHMENTS", dots: "dc"},
                    "lpeld": {category: "EMBELISHMENTS", dots: "Gded*c"},
                    "ltpeld": {category: "EMBELISHMENTS", dots: "Aded*c"},
                    "brl": {category: "EMBELISHMENTS", dots: "gag"},
                    "bubly": {category: "EMBELISHMENTS", dots: "gdgcg"},
                    "chedare": {category: "EMBELISHMENTS", dots: "feGe"},
                    "ltstd": {category: "EMBELISHMENTS", dots: "Adc"},
                    "pelb": {category: "EMBELISHMENTS", dots: "Gbeb*g"},
                    "pelc": {category: "EMBELISHMENTS", dots: "Gcec*g"},
                    "peld": {category: "EMBELISHMENTS", dots: "Gded*g"},
                    "pele": {category: "EMBELISHMENTS", dots: "Gefe*a"},
                    "crunl": {category: "EMBELISHMENTS", dots: "gdg*eafa"},
                    "dbb": {category: "EMBELISHMENTS", dots: "Gbd"},
                    "dbc": {category: "EMBELISHMENTS", dots: "Gcd"},
                    "dbd": {category: "EMBELISHMENTS", dots: "Gde"},
                    "dbe": {category: "EMBELISHMENTS", dots: "Gef"},
                    "dbf": {category: "EMBELISHMENTS", dots: "GfG"},
                    "dbha": {category: "EMBELISHMENTS", dots: "AG"},
                    "dbhg": {category: "EMBELISHMENTS", dots: "Gf"},
                    "dbla": {category: "EMBELISHMENTS", dots: "Gad"},
                    "dblg": {category: "EMBELISHMENTS", dots: "Ggd"},
                    "dbstf": {category: "EMBELISHMENTS", dots: "fGf"},
                    "dbsthg": {category: "EMBELISHMENTS", dots: "GAG"},
                    "dg": {category: "EMBELISHMENTS", dots: "d"},
                    "tstf": {category: "EMBELISHMENTS", dots: "Afe"},
                    "edre": {category: "EMBELISHMENTS", dots: "eafa"},
                    "edreb": {category: "EMBELISHMENTS", dots: "ebfb"},
                    "edrec": {category: "EMBELISHMENTS", dots: "ecfc"},
                    "edred": {category: "EMBELISHMENTS", dots: "edfd"},
                    "eg": {category: "EMBELISHMENTS", dots: "e"},
                    "gbr": {category: "EMBELISHMENTS", dots: "Gagag"},
                    "gg": {category: "EMBELISHMENTS", dots: "G"},
                    "ggrpb": {category: "EMBELISHMENTS", dots: "Gbgdg*"},
                    "ggrpc": {category: "EMBELISHMENTS", dots: "Gcgdg*"},
                    "grp": {category: "EMBELISHMENTS", dots: "gdg*"},
                    "grpb": {category: "EMBELISHMENTS", dots: "gbg*"},
                    "gstb": {category: "EMBELISHMENTS", dots: "Gbg"},
                    "gstc": {category: "EMBELISHMENTS", dots: "Gcg"},
                    "gstd": {category: "EMBELISHMENTS", dots: "Gdg"},
                    "tpelb": {category: "EMBELISHMENTS", dots: "Abeb*g"},
                    "tpelc": {category: "EMBELISHMENTS", dots: "Acec*g"},
                    "tpeld": {category: "EMBELISHMENTS", dots: "Aded*g"},
                    "tpele": {category: "EMBELISHMENTS", dots: "Aefe*a"},
                    "tstb": {category: "EMBELISHMENTS", dots: "Abg"},
                    "tstc": {category: "EMBELISHMENTS", dots: "Acg"},
                    "hbubly": {category: "EMBELISHMENTS", dots: "dgcg"},
                    "hdbb": {category: "EMBELISHMENTS", dots: "bd"},
                    "hdbc": {category: "EMBELISHMENTS", dots: "cd"},
                    "hdbd": {category: "EMBELISHMENTS", dots: "de"},
                    "hdbe": {category: "EMBELISHMENTS", dots: "ef"},
                    "hdbf": {category: "EMBELISHMENTS", dots: "fG"},
                    "hdbla": {category: "EMBELISHMENTS", dots: "ad"},
                    "hdblg": {category: "EMBELISHMENTS", dots: "gd"},
                    "tgrpc": {category: "EMBELISHMENTS", dots: "Acgdg*"},
                    "thrd": {category: "EMBELISHMENTS", dots: "g*dc"},
                    "tgrpb": {category: "EMBELISHMENTS", dots: "Abgdg*"},
                    "gste": {category: "EMBELISHMENTS", dots: "Gea"},
                    "gstf": {category: "EMBELISHMENTS", dots: "Gfe"},
                    "hgrpb": {category: "EMBELISHMENTS", dots: "bgdg*"},
                    "hgrpc": {category: "EMBELISHMENTS", dots: "cgdg*"},
                    "hpelb": {category: "EMBELISHMENTS", dots: "beb*g"},
                    "hpelc": {category: "EMBELISHMENTS", dots: "cec*g"},
                    "hpeld": {category: "EMBELISHMENTS", dots: "ded*g"},
                    "hpele": {category: "EMBELISHMENTS", dots: "efe*a"},
                    "hstb": {category: "EMBELISHMENTS", dots: "bg"},
                    "hstc": {category: "EMBELISHMENTS", dots: "cg"},
                    "hstd": {category: "EMBELISHMENTS", dots: "dg"},
                    "hvthrd": {category: "EMBELISHMENTS", dots: "gdg*c"},
                    "gstla": {category: "EMBELISHMENTS", dots: "Gag"},
                    "tste": {category: "EMBELISHMENTS", dots: "Aea"}
                    };
                    
                    
                    function isType(s) {
                      return (typeof a[s] !== "undefined");
                    }
                    
                    function create(s) {
                      var note;
                      var notes;
                      var b = a[s];
                      var mel, bg;
                      var mels = [];
                      var i;
                      
                      notes = b.dots.match(/[aA-zZ]/g);
                      for (i = 0; i < notes.length; i++) {
                        note = notes[i];
                        note = {
                          G: "HG",
                          A: "HA",
                          g: "LG",
                          a: "LA"
                        }[notes[i]];
                        
                        if (!note) {note =notes[i].toUpperCase();}
                        mel = score.createEmbellishment();
                        mel.note = note;
                        mel.note = note.toUpperCase();
                        mel.staffPosition = GHPRef[mel.note];
                        if (notes.length > 1) mel.grouped = true;
                        mels.push(mel);
                        
                      }
                      if (mels.length > 1) {
                        bg = score.createBeamGroup();
                        bg.elementType = "gracenote";
                        meldObjectToObject(beamGroupDef.start, bg);
                        mels.splice(0,0,bg);
                        bg = score.createBeamGroup();
                        bg.elementType = "gracenote";
                        meldObjectToObject(beamGroupDef.end, bg);
                        mels.push(bg); 
                      }
                      return (mels);
                    }
                    
                    return {
                      isType: isType,
                      create: create
                    };                  
  }());
  
  
  var z_melody = (function() {
                  
                  var a = ["B_16", "B_8", "C_16", "C_2", "C_32", "C_4", "C_8", "D_16",
                  "D_2", "D_32", "D_4", "D_8", "E_16", "E_2", "E_32", "E_4", "E_8", "F_16",
                  "F_2", "F_32", "F_4", "F_8", "HA_16", "HA_2", "HA_32", "HA_4", "HA_8",
                  "HG_16", "HG_2", "HG_32", "HG_4", "HG_8", "LA_16", "LA_2", "LA_32", "LA_4",
                  "LA_8", "LAl_8", "LAr_16", "LAr_32", "LAr_8", "LG_16", "LG_2", "LG_32", "LG_4",
                  "LG_8", "LGl_16", "LGl_32", "LGl_8", "LGr_16", "LGr_32", "LGr_8", "LG_1",
                  "LA_1", "B_1", "C_1", "D_1", "E_1", "F_1", "HG_1", "HA_1", "LAl_16","LAl_32",
                  "HGl_16", "HGl_32", "HGl_8", "HGr_16", "HGr_32", "HGr_8", "Bl_16", "Bl_32",
                  "Bl_8", "Br_16", "Br_32", "Br_8", "Cl_16", "Cl_32", "Cl_8", "Cr_16","Cr_32",
                  "Cr_8", "Dl_16", "Dl_32", "Dl_8", "Dr_16", "Dr_32", "Dr_8", "El_16", "El_32",
                  "El_8", "Er_16", "Er_32", "Er_8", "Fl_16", "Fl_32", "Fl_8", "Fr_16", "Fr_32",
                  "Fr_8", "HAl_16", "HAl_32", "HAl_8", "HAr_16", "HAr_32", "HAr_8", "B_2",
                  "B_32", "B_4"
                  ];
                  
                  function isType(s) {
                    return (a.indexOf(s) !== -1);
                  }
                  
                  function create(note)
                  {
                    
                    var s, chunk;
                    var mel = score.createMelodyNote();
                    
                    chunk = note.split("_");
                    mel.duration = +chunk[1];
                    
                    s = chunk[0].match(/^(LG|LA|B|C|D|E|F|HG|HA)/);
                    if (s) {
                      mel.note = s[0];
                      mel.staffPosition = GHPRef[mel.note];
                    } 
                    
                    s = chunk[0].match(/(l|r)$/);
                    if (s) {
                      mel.tail = s[0]; 
                      mel.grouped = true;
                    } 
                    
                    return mel;
                    
                  }
                  return {
                    isType: isType,
                    create: create
                  };
                  
  }());
  
  var z_phrasegroup = (function() {
                       
                       /* *************************************** */
                       /* * Volta, or repeated section            */
                       /* * BWW syntax '1      [music]  _'        */
                       /* *            '2      [music]  _'        */
                       /* *            '22     [music]  _'        */
                       /* *            '2x     [music]  _'        */
                       /* *            '28     [music]  _'        */
                       /* *            '224    [music]  _'        */
                       /* *            'intro  [music]  _'        */
                       /* *   can be intrepreted as               */
                       /* *        'Repeat# [of part#]'           */
                       /* *   where missing part # implies        */
                       /* *   current part                        */
                       /* *************************************** */
                       
                       var a = {
                         "^ts":    {collectionName: "ties", sectionStart: true, style: "arc"},
                         "^te":    {collectionName: "ties", sectionEnd: true},
                         "^3s":    {collectionName: "triplets", sectionStart: true, label: "3", style: "arc"},
                         "^3e":    {collectionName: "triplets", sectionEnd: true},
                         "'bis":   {collectionName: "voltas", sectionStart: true, label: "bis", style: "straight"},
                         "'1":     {collectionName: "voltas", sectionStart: true, label: "1st", style: "straight", repeatOnPasses: [1]},
                         "'2":     {collectionName: "voltas", sectionStart: true, label: "2nd", style: "straight", repeatOnPasses: [2]},
                         "'22":    {collectionName: "voltas", sectionStart: true, label: "2nd of part 2", style: "straight"},
                         "'23":    {collectionName: "voltas", sectionStart: true, label: "3rd of part 2", style: "straight"},
                         "'24":    {collectionName: "voltas", sectionStart: true, label: "4th of part 2", style: "straight"},
                         "'25":    {collectionName: "voltas", sectionStart: true, label: "5th of part 2", style: "straight"},
                         "'26":    {collectionName: "voltas", sectionStart: true, label: "6th of part 2", style: "straight"},
                         "'27":    {collectionName: "voltas", sectionStart: true, label: "7th of part 2", style: "straight"},
                         "'28":    {collectionName: "voltas", sectionStart: true, label: "8th of part 2", style: "straight"},
                         "'224":   {collectionName: "voltas", sectionStart: true, label: "2nd of parts 2 and 4", style: "straight"},
                         "'intro": {collectionName: "voltas", sectionStart: true, label: "Introduction", style: "straight"},
                         "_'":     {collectionName: "voltas", sectionEnd: true}
                       };
                       
                       function isType(s) {
                         return (typeof a[s] !== "undefined");
                       }
                       
                       function create(s)
                       {
                         var mel = score.createPhraseGroup();
                         meldObjectToObject(a[s], mel);
                         return mel;
                         
                       }
                       return {
                         isType: isType,
                         create: create
                       };
                       
  }());
  
  var z_staffControl = (function() {
                        var a = {
                        "!": {newBar: true}, 
                        "I!''": {newBar: true, sectionStart: true, repeatStart: true},
                        "I!": {newBar: true, sectionStart: true},
                        "!I": {sectionEnd: true,staffEnd: true, newBar: true},
                        "!t": {staffEnd: true, newBar: true},
                        "''!I": {sectionEnd: true, repeatEnd: true, staffEnd: true, newBar: true},
                        "!!": {sectionEnd: true, staffEnd: true, newBar: true}
                        };
                        
                        
                        function isType(s) {
                          return (typeof a[s] !== "undefined");
                        }
                        
                        function create(s) {
                          var mel = score.createStaffControl();
                          meldObjectToObject(a[s], mel);
                          return mel;
                        }
                        return {
                          isType: isType,
                          create: create
                        };
                        
                        
  }());
  
  var z_noteDot = (function() {
                   var a = {
                   "'b": {dotType: "dot"},
                   "'c": {dotType: "dot"},
                   "'d": {dotType: "dot"},
                   "'e": {dotType: "dot"},
                   "'f": {dotType: "dot"},
                   "'ha": {dotType: "dot"},
                   "'hg": {dotType: "dot"},
                   "'la": {dotType: "dot"},
                   "'lg": {dotType: "dot"},
                   "''lg": {dotType: "doubledot"},
                   "''la": {dotType: "doubledot"},
                   "''b": {dotType: "doubledot"},
                   "''c": {dotType: "doubledot"},
                   "''d": {dotType: "doubledot"},
                   "''e": {dotType: "doubledot"},
                   "''f": {dotType: "doubledot"},
                   "''hg": {dotType: "doubledot"},
                   "''ha": {dotType: "doubledot"}
                   };
                   
                   
                   function isType(s) {
                     return (typeof a[s] !== "undefined");
                   }
                   
                   function create(s) {
                     score.getLastElementByType("melody").dotType = a[s].dotType;
                     return undefined;
                   }
                   return {
                     isType: isType,
                     create: create
                   };                 
  }());
  
  
  
  // This doesn't really fix anything,
  //  it just tires to replicate the rules
  //  BP appears to use when beaming.
  //  
  function fixBeamGroups() {
    var i;
    var inBeam = false;
    var mel, bg;
    for (i = 0; i < score.data.length; i++) {
      mel = score.data[i];
      switch (mel.type) {
      case "melody":        if (mel.tail) {
          if (!inBeam) {
            inBeam = true;
            bg = score.createBeamGroup();
            bg.elementType = "melody";
            meldObjectToObject(beamGroupDef.start, bg);
            score.data.splice(i,0,bg);
          }
      } else {
        if (inBeam) {
          inBeam = false;
          bg = score.createBeamGroup();
          bg.elementType = "melody";
          meldObjectToObject(beamGroupDef.end, bg);
          score.data.splice(i,0,bg);
        }
      }
      break;
      
    case "staffControl":  if (mel.newBar && inBeam) {
        inBeam = false;
        bg.elementType = "melody";
        bg = score.createBeamGroup();
        meldObjectToObject(beamGroupDef.end, bg);
        score.data.splice(i,0,bg);
    }
    break;
    
  case "beat":          if (inBeam) {
      inBeam = false;
      bg = score.createBeamGroup();
      bg.elementType = "melody";
      meldObjectToObject(beamGroupDef.end, bg);
      score.data.splice(i,0,bg);
  }
  break;
  
      }
    }
    
    // reindex elements
    // FIXME : only reindex if a beam group was added
    for (i = 0; i < score.data.length; i++) {
      score.data[i].scoreIndex = i;
    }
    
  }
  
  function parseBits(b, errors) {
    var i, l = b.length;
    var s, mel;
    
    var wasFound;
    
    for (i = 0; i < l; i++) {
      s = b[i];
      
      // List of things to ignore for now.
      if ([""].indexOf(s) !== -1) {
        continue;
      }
      
      mel = undefined;
  
      if (z_invalid.isType(s)) {
        errors.push("Symbol `" + s + "' is known, but not supported.");
        continue;
      }
      
      
      
      // Loop through our melody element types and add it if a match is
      // found.  Don't abort the loop eary because some elements will 
      // create more than one node.
      // Order kinda matters here.
      //z_beat has to be before z_staffControl
      //z_keysig must be after z_graphic
      wasFound = false;
      [
        z_graphic,
        z_keysig,
        z_timesig,
        z_beat,
        z_phrasegroup,
        z_melody,
        z_noteDot,
        z_staffControl,
        z_ghbgrace
      ].forEach(function(f) {
                if (f.isType(s)) {
                wasFound = true;
                mel = f.create(s);
                if (mel) {
                  mel.bww = s;
                  score.appendNode(mel);
                }
                }
      });
      
      if (!wasFound) {
        errors.push("Symbol `" + s + "' is totally unknown.");        
      }
    }    
  }
  
  
  //  score.metaData = {};  
  score.metaData = score.createMetadata();
  var errors = [];
  
  var i, l = dots.length;
  var s, bits;
  for (i = 0; i < l; i++) {
    s = dots[i];
    if (s === "") {continue;}
    
    if (grok_metaData.isType(s)) {
      grok_metaData.setData(score.metaData, s)
      continue;
    }
    
    
    // DEBUGGING BLOCK.  Clean up after issue 32 is resolved.
    // To use the old behavior, change this block to if (1)
    // To use the new and correct behavior, change to if (0)
    if (0) {
      bits = s.split(/\s|~/);
    } else {
      s = s.replace(/~/g, " \t "); 
      s = s.replace(/\t+/g, " \t ");
      bits = s.split(/[ |\n|\r]/);
      //bits = bits.replace("<<<BEAT>>>", "\t");
      
    }
    
    //logit(bits);
    parseBits(bits, errors);
  }
  
    if (errors.length) {
      alert(errors.join("\r\n"));
    }
  
  // This doesn't really fix anything,
  //  it just tires to replicate the rules
  //  BP appears to use when beaming.
  //  
  fixBeamGroups();
  
  postImport(score);
  
  //alert(score.metaData.toSource());
  logit(score);
}


