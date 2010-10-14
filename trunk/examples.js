var bwwExamples = (function() 
                    {
                    var tunes = {};
                    var tune = [];
                    
                    // Tabs have been changed to ~ to prevent mangling by
                    // editors.  They are changed back when needed.
                    
                    tune.push("Bagpipe Reader:1.0");
                    tune.push("MIDINoteMappings,(54,56,58,59,61,63,64,66,68,56,58,60,61,63,65,66,68,70,55,57,59,60,62,64,65,67,69)");
                    tune.push("FrequencyMappings,(370,415,466,494,554,622,659,740,831,415,466,523,554,622,699,740,831,932,392,440,494,523,587,659,699,784,880)");
                    tune.push("InstrumentMappings,(71,71,45,33,1000,60,70)");
                    tune.push("GracenoteDurations,(30,40,30,50,100,200,800,1200,250,250,250,500,200)");
                    tune.push("FontSizes,(90,100,88,80,250)");
                    tune.push("TuneFormat,(1,0,M,L,500,500,500,500,P,0,0)");
                    tune.push("");
                    tune.push("TuneTempo,80");
                    tune.push("");
                    tune.push("\"The 10th H.L.I. Crossing The Rhine\",(T,L,0,0,Times New Roman,16,700,0,0,18,0,0,0)");
                    tune.push("\"March\",(Y,C,0,0,Times New Roman,14,400,0,0,18,0,0,0)");
                    tune.push("\"\",(M,R,0,0,Times New Roman,14,400,0,0,18,0,0,0)");
                    tune.push("\"Highalnd Dots unit test\",(F,R,0,0,Times New Roman,12,400,0,0,18,0,0,0)");
                    tune.push("");
                    tune.push("");
                    tune.push("& sharpf sharpc 6_8 I!'' gg LA_8");
                    tune.push("!       thrd Dr_8 'd Fl_16 gg LAl_8             thrd D_4        F_8"); 
                    tune.push("!       gg Fr_8 'f HGl_16 HAl_8~~~hdbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                  grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       gg Er_8 'e Fl_16 HGl_8~~        hdbf Fr_8 'f El_16 Dl_8         !t");
                    tune.push("");
                    tune.push("& sharpf sharpc '22");
                    tune.push("!       lgstd Dr_8 'd Fl_16 gg LAl_8             thrd D_4        F_8");
                    tune.push("!       gg Fr_8 'f HGl_16 HAl_8  ~               hdbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                  grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       thrd D_4 'd                             lgstd D_4 _'                     ''!I");
                    tune.push("");
                    tune.push("& sharpf sharpc I!'' dbhg HG_8");
                    tune.push("!        dbha HA_4                    F_8             thrd D_4                F_8");
                    tune.push("!       gg Fr_16 HAl_8 'ha Fl_8  ~         dbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                  grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       gg Er_8 'e Fl_16 HGl_8      ~        hdbf Fr_8 'f El_16 Dl_8         !t");
                    tune.push("");
                    tune.push("& sharpf sharpc '1");
                    tune.push("!       dbha HA_4                    F_8             thrd D_4                F_8");
                    tune.push("!       gg Fr_16 HAl_8 'ha Fl_8    ~        dbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                  grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       thrd D_4 'd                             ~lgstd D_4 _'                     ''!I");
                    tune.push("");
                    tune.push("& sharpf sharpc I!'' gg LA_8");
                    tune.push("!       thrd D_4 'd                             gg LAr_8 'la Dl_16 Fl_8");
                    tune.push("!       gg Fr_16 HAl_8 'ha Fl_8~~dbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       dbc C_4 'c                              gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       gg Er_8 'e Fl_16 HGl_8  ~~ hdbf Fr_8 'f El_16 Dl_8         !t");
                    tune.push("");
                    tune.push("& sharpf sharpc"); 
                    tune.push("!       lgstd D_4 'd                             gg LAr_8 'la Dl_16 Fl_8");
                    tune.push("!       gg Fr_16 HAl_8 'ha Fl_8 ~~dbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                 grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       thrd D_4 'd                             lgstd D_4                     ''!I");
                    tune.push("");
                    tune.push("& sharpf sharpc I!'' dbhg HG_8");
                    tune.push("!       HA_4                    grp HA_8        LAr_8 'la Dl_16 Fl_8");
                    tune.push("!       gg Fr_16 HAl_8 'ha Fl_8  ~dbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                  grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       gg Er_8 'e Fl_16 HGl_8~     hdbf Fr_8 'f El_16 Dl_8         !t");
                    tune.push("");
                    tune.push("& sharpf sharpc '1");
                    tune.push("!       dbha HA_4                    grp HA_8        LAr_8 'la Dl_16 Fl_8");
                    tune.push("!       gg Fr_16 HAl_8 'ha Fl_8 ~~dbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                  grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       thrd D_4 'd                             lgstd D_4 _'                     ''!I");
                    tune.push("");
                    tune.push("");
                    tune.push("& sharpf sharpc '2");
                    tune.push("!       lgstd Dr_8 'd Fl_16 gg LAl_8             thrd D_4        F_8");
                    tune.push("!       gg Fr_8 'f HGl_16 HAl_8  ~               hdbf Fr_8 'f El_16 Dl_8");
                    tune.push("!       gg C_4                  grp E_8         gg LAr_8 'la dg Cl_16 El_8");
                    tune.push("!       thrd D_4 'd                             lgstd D_4 _'                     ''!I");
                    tune.push("");
                    tunes["The 10th H.L.I. Crossing The Rhine"] = tune;
                    
                    
                    tune=[];
                    tune.push("Bagpipe Reader:1.0");
                    tune.push("MIDINoteMappings,(55,57,59,60,62,64,65,67,69,57,59,61,62,64,66,67,69,71,56,58,60,61,63,65,66,68,70)");
                    tune.push("FrequencyMappings,(392,440,494,523,587,659,699,784,880,440,494,554,587,659,740,784,880,988,415,466,523,554,622,699,740,831,932)");
                    tune.push("InstrumentMappings,(71,71,46,34,1000,60,70)");
                    tune.push("GracenoteDurations,(30,40,30,50,100,200,800,1200,250,250,250,500,200)");
                    tune.push("FontSizes,(90,100,100,80,250)");
                    tune.push("TuneFormat,(1,0,M,L,500,500,500,500,P,0,0)");
                    tune.push("");
                    tune.push("TuneTempo,84");
                    tune.push("");
                    tune.push("\"Mairi's Wedding\",(T,L,0,0,Times New Roman,16,700,0,0,18,0,0,0)");
                    tune.push("\"March\",(Y,C,0,0,Times New Roman,14,400,0,0,18,0,0,0)");
                    tune.push("\"Traditional\",(M,R,0,0,Times New Roman,14,400,0,0,18,0,0,0)");
                    tune.push("\"Highland Dots unit test\",(F,R,0,0,Times New Roman,12,400,0,0,18,0,0,0)");
                    tune.push("");
                    tune.push("");
                    tune.push("& sharpf sharpc  2_4~");
                    tune.push("I!~gg LA_4  brl~LAr_8 'la Bl_16");
                    tune.push("!~thrd Dr_8  El_8~dbf F_4");
                    tune.push("!~dbe Er_8 Dl_8~~dbb Br_8 Dl_8");
                    tune.push("! ~dbf Fr_8 El_8 ~~dbf Fr_8 HAl_8");
                    tune.push("!t");
                    tune.push("");
                    tune.push("& sharpf sharpc~ !~gg LA_4  brl~LAr_8 'la Bl_16");
                    tune.push("!~thrd Dr_8  El_8~dbf F_4");
                    tune.push("!~dbe Er_8 Dl_8~~dbb Br_8 eg LGl_8");
                    tune.push("!~gg LA_4~~~brl LA_4"); 
                    tune.push("''!I");
                    tune.push("");
                    tune.push("& sharpf sharpc~");
                    tune.push("I!~gg Fr_8 HAl_8~~gg HA_4");
                    tune.push("!~grp HAr_8 'ha HGl_16~dbf F_4");
                    tune.push("!~dbe Er_8 Dl_8~~dbb Br_8 Dl_8");
                    tune.push("! ~dbf Fr_8 El_8 ~    '1~dbf F_4");
                    tune.push("!t");
                    tune.push("");
                    tune.push("& sharpf sharpc   !~ gg Fr_8 HAl_8~gg HA_4");
                    tune.push("!~grp HAr_8 'ha HGl_16~dbf F_4");
                    tune.push("!~dbe Er_8 Dl_8~~dbb Br_8 eg LGl_8");
                    tune.push("!~gg LA_4~~~brl LA_4 _'");
                    tune.push("''!I");
                    tune.push("");
                    tune.push("& sharpf sharpc  '2~dbf Fr_8 HAl_8");
                    tune.push("! gg LA_4  brl~LAr_8 'la Bl_16");
                    tune.push("!~thrd Dr_8  El_8~dbf F_4");
                    tune.push("!~dbe Er_8 Dl_8~~dbb Br_8 eg LGl_8");
                    tune.push("!~gg LA_4~~~brl LA_4 _'");
                    tune.push("''!I");
                    tune.push("");
                    tunes["Mairi's Wedding"] = tune;
                    
                    function makeOptions(element) {
                      var size = 0;
                      API.forEachProperty(tunes, function(el, i) {
                                          API.addOption(element, i);
                                          size++;
                                          });
                      element.size = size;
                      
                    }
                    
                    function loadData(el) {
                      
                      var idx = el.selectedIndex;
                      var o = el.options[idx].text;
                      var s = tunes[o].join("\r\n");
                      s = s.replace("~", "\t", "g");
                      return s;
                    }
                    
                    return {
                      makeOptions: makeOptions,
                      loadData: loadData
                    };
                    
                    }
                    )
();

