//	
//	Symbols are mapped to different font character values.  Each font map contains the font
//	character value and the symbol name that it is mapped to.  As well, the category, play function
//	and play notes and attributes are specified.
//
//	<character value>=<symbol name>,(category,note,tail,value),<play function>,<play function attributes>
//
//	symbol name=One of the defined Bagpipe Music Writer symbols, see manual
//	category	
//		CAT_MELODY_NO_TAIL		- melody note no tail
//		CAT_MELODY_RIGHT_TAIL		- melody note right facing tail
//		CAT_MELODY_LEFT_TAIL		- melody note left facing tail
//		CAT_DOTS				- dot
//		CAT_EMBELISHMENTS			- embelishment
//		CAT_GRACENOTES			- grace note
//		CAT_STRIKES				- strikes
//		CAT_RUNS_OF_3			- run's of three, old method
//		CAT_TIES				- tie, old method
//		CAT_START_TIMELINE		- time line start
//		CAT_END_TIMELINE			- time line end
//		CAT_TIME_SIGNATURE		- time signature
//		CAT_START_SECTION			- start of a section
//		CAT_END_SECTION			- end of a section
//		CAT_G_CLEF				- G clef
//		CAT_BEAT_SEPARATOR		- beat separator, not used
//		CAT_BAR				- bar symbol
//		CAT_FERMATA				- fermata
//		CAT_RUNS_OF_3_START		- run's of three, start symbol
//		CAT_RUNS_OF_3_END			- run's of three, end symbol
//		CAT_TIES_START			- tie's, start symbol
//		CAT_TIES_END			- tie's, end symbol
//		CAT_PIOB_OVERNEXT			- piobaireachd note, to be placed over next melody
//		CAT_PIOB_UNDERPREV		- piobaireachd note, to be placed under prev melody
//		CAT_PIOB_UNDERNEXT		- piobaireachd note, to be placed under next melody
//		CAT_PIOB_UNDERNEXT_CAMACH	- piobaireachd note, to be placed under next melody, melody following always played as e
//		CAT_NOTE_CHANGE			- used for sharps, flats and naturals to indicate a substitution
//		CAT_CADENCE				- for embellishments/piob with long duration.  The melody note duration following stays the same
//		CAT_SIGN				- for marking the start of a variation
//		CAT_SIGN_REPEAT			- for marking the end of a variation to be repeated
//		CAT_REST				- rests cause a pause in the play of music
//		CAT_END_TIMELINE_BIS		- marks the end of a bis time line
//
//		note
//			LG					- Low G
//			LA					- Low A
//			B					- B
//			C					- C
//			D					- D
//			E					- E
//			F					- F
//			HG					- High G
//			HA					- High A
//
//		tail
//			N					- no tail
//			L					- left facing tail
//			R					- right facing tail
//			A					- angled tail
//
//		value					- specifies the note duration
//			32					- 32'nd note
//			16					- 16'th note
//			8					- 8'th note
//			4					- quarter note
//			2					- half note
//			1					- whole note
//
//	play function				- specifies what function to process the arguments
//		no_sound					- no sounds are played
//		melody					- the melody note function is called
//		dot						- the dot note function is called
//		embellishment				- the embellishment function is called
//		run_of_3					- the run of three function is called
//
//	play function attributes	- the notes and the duration to play each note
//						the format is <note><duration> where the duration code
//						is particular to the indicated play function.
//						e.g. melody A32 specifies High A to be played as a 32nd note,
//						embellishment g specifies Low G gracenote.
//						There can be any number of note specifiers together
//						e.g. embellishment g*dc
//
//		g						- low g
//		a						- low a
//		b						- b
//		c						- c
//		d						- d
//		e						- e
//		f						- f
//		G						- High G
//		A						- High A
//		sharps have a '$' symbol infront, e.g. $A is a sharp high A
//		flats have a '#' symbol in f
//
//		1						- whole note
//		2						- half note
//		4						- quarter note
//		8						- eighth note
//		16						- sixteenth note
//		32						- thirty second note
//
//	piobaireachd, embellishment, and gracenote duration categories
//	Category        Description                                 (in milliseconds)
//	--------        -----------                                 -----------------
//	none            Standard gracenote (light music)            20
//
//	*               Extended length gracenote (light music)     40
//
//	1               Standard gracenote (piobaireachd)           30
//
//	2               Extended length gracenote (piobaireachd)    50
//
//	3               Standard 1/16th note gracenote              100
//	                in piobaireachd embellishments
//
//	4               Standard 1/8th note gracenote               200
//	                in piobaireachd embellishments
//	
//	5               E or F 1/8th note gracenote                 800
//	                in piobaireachd cadences
//	
//	6               E or F 1/8th note gracenote with fermata    1200
//	                in piobaireachd cadences
//	
//	7               E 1/16th note that is played after          250
//	                a leamluath in piobaireachd
//	                (only used in the playing of a
//	                 leamluath abbreviation)
//	
//	8               Low A 1/16th note that is played after      250
//	                a taorluath in piobaireachd
//	                (only used in the playing of a
//	                 taorluath abbreviation)
//	
//	9               E 1/16th note that is played after          250
//	                a crunluath in piobaireachd
//	                (only used in the playing of a
//	                 crunluath abbreviation)
//	
//	0               E 1/16th note that is played after          500
//	                a crunluath a mach in piobaireachd
//	                (only used in the playing of a
//	                 crunluath a mach abbreviation)
//	
//	
//	~               Reserved                                    200
//



81=REST_1 (CAT_REST,,N,) melody d1
96=REST_2 (CAT_REST,,N,) melody d2
97=REST_4 (CAT_REST,,N,) melody d4
98=REST_8 (CAT_REST,,N,) melody d8
99=REST_16 (CAT_REST,,N,) melody d16


36=& (CAT_G_CLEF,,N,) no_sound

37='1 (CAT_START_TIMELINE,,N,) no_sound
38='2 (CAT_START_TIMELINE,,N,) no_sound
39='22 (CAT_START_TIMELINE,,N,) no_sound
40='224 (CAT_START_TIMELINE,,N,) no_sound
41='23 (CAT_START_TIMELINE,,N,) no_sound
42='24 (CAT_START_TIMELINE,,N,) no_sound
53=bis_' (CAT_END_TIMELINE_BIS,,N,) no_sound none
//54=bis_   The bis time line horizontal (needed internally)
55='bis (CAT_START_TIMELINE,,N,) no_sound
71=_' (CAT_END_TIMELINE,,N,) no_sound none

47='25 (CAT_START_TIMELINE,,N,) no_sound
48='26 (CAT_START_TIMELINE,,N,) no_sound
49='27 (CAT_START_TIMELINE,,N,) no_sound
50='28 (CAT_START_TIMELINE,,N,) no_sound
112='si (CAT_START_TIMELINE,,N,) no_sound
114='do (CAT_START_TIMELINE,,N,) no_sound
73='intro (CAT_START_TIMELINE,,N,) no_sound


52=^3e (CAT_RUNS_OF_3_END,,N,) run_of_3 
56=^2e (CAT_RUNS_OF_3_END,,N,) duplet 
57=^43e (CAT_RUNS_OF_3_END,,N,) quadruplet 
58=^53e (CAT_RUNS_OF_3_END,,N,) quintuplet 
59=^64e (CAT_RUNS_OF_3_END,,N,) sextuplet
60=^74e (CAT_RUNS_OF_3_END,,N,) septuplet 
85=^46e (CAT_RUNS_OF_3_END,,N,) quadsex
86=^54e (CAT_RUNS_OF_3_END,,N,) quinquad
87=^76e (CAT_RUNS_OF_3_END,,N,) septsex
127=^3s (CAT_RUNS_OF_3_START,,N,) no_sound 
128=^3b (CAT_RUNS_OF_3,,N,) run_of_3 b
129=^3c (CAT_RUNS_OF_3,,N,) run_of_3 c
130=^3d (CAT_RUNS_OF_3,,N,) run_of_3 d
131=
132=^3f (CAT_RUNS_OF_3,,N,) run_of_3 f
133=^3ha (CAT_RUNS_OF_3,,N,) run_of_3 A
134=^3hg (CAT_RUNS_OF_3,,N,) run_of_3 G
135=^3la (CAT_RUNS_OF_3,,N,) run_of_3 a
136=^3lg (CAT_RUNS_OF_3,,N,) run_of_3 g

148=^2s (CAT_RUNS_OF_3_START,,N,) no_sound
149=^43s (CAT_RUNS_OF_3_START,,N,) no_sound
150=^53s (CAT_RUNS_OF_3_START,,N,) no_sound
151=^64s (CAT_RUNS_OF_3_START,,N,) no_sound
152=^74s (CAT_RUNS_OF_3_START,,N,) no_sound
153=^46s (CAT_RUNS_OF_3_START,,N,) no_sound
154=^54s (CAT_RUNS_OF_3_START,,N,) no_sound
155=^76s (CAT_RUNS_OF_3_START,,N,) no_sound


137=^tb (CAT_TIES,,N,) no_sound
138=^tc (CAT_TIES,,N,) no_sound
139=^td (CAT_TIES,,N,) no_sound
140=
141=^tf (CAT_TIES,,N,) no_sound
142=^tha (CAT_TIES,,N,) no_sound
143=^thg (CAT_TIES,,N,) no_sound
144=^tla (CAT_TIES,,N,) no_sound
145=^tlg (CAT_TIES,,N,) no_sound
146=^ts (CAT_TIES_START,,N,) no_sound
147=^te (CAT_TIES_END,,N,) no_sound


86=sharplg (CAT_NOTE_CHANGE,LG,N,1) no_sound #g1
115=naturallg (CAT_NOTE_CHANGE,LG,N,1) no_sound ^g
116=naturalla (CAT_NOTE_CHANGE,LA,N,1) no_sound ^a
117=naturalb (CAT_NOTE_CHANGE,B,N,1) no_sound ^b
118=naturalc (CAT_NOTE_CHANGE,C,N,1) no_sound ^c
119=naturald (CAT_NOTE_CHANGE,D,N,1) no_sound ^d
120=naturale (CAT_NOTE_CHANGE,E,N,1) no_sound ^e
121=naturalf (CAT_NOTE_CHANGE,F,N,1) no_sound ^f
122=naturalhg (CAT_NOTE_CHANGE,HG,N,1) no_sound ^G
123=naturalha (CAT_NOTE_CHANGE,HA,N,1) no_sound ^A
67=sharpla (CAT_NOTE_CHANGE,LA,N,1) no_sound #a1
68=sharpb (CAT_NOTE_CHANGE,B,N,1) no_sound #b1
69=sharpc (CAT_NOTE_CHANGE,C,N,1) no_sound #c1
70=sharpd (CAT_NOTE_CHANGE,D,N,1) no_sound #d1
71=sharpe (CAT_NOTE_CHANGE,E,N,1) no_sound #e1
72=sharpf (CAT_NOTE_CHANGE,F,N,1) no_sound #f1
73=sharphg (CAT_NOTE_CHANGE,HG,N,1) no_sound #G1
74=sharpha (CAT_NOTE_CHANGE,HA,N,1) no_sound #A1

36=flatlg (CAT_NOTE_CHANGE,LG,N,1) no_sound $g1
37=flatla (CAT_NOTE_CHANGE,LA,N,1) no_sound $a1
38=flatb (CAT_NOTE_CHANGE,B,N,1) no_sound $b1
39=flatc (CAT_NOTE_CHANGE,C,N,1) no_sound $c1
40=flatd (CAT_NOTE_CHANGE,D,N,1) no_sound $d1
51=flate (CAT_NOTE_CHANGE,E,N,1) no_sound $e1
52=flatf (CAT_NOTE_CHANGE,F,N,1) no_sound $f1
53=flathg (CAT_NOTE_CHANGE,HG,N,1) no_sound $G1
54=flatha (CAT_NOTE_CHANGE,HA,N,1) no_sound $A1

x55=fermatlg (CAT_FERMATA,,N,) fermata g
56=fermatla (CAT_FERMATA,,N,) fermata a
62=fermatb (CAT_FERMATA,,N,) fermata b
63=fermatc (CAT_FERMATA,,N,) fermata c
64=fermatd (CAT_FERMATA,,N,) fermata d
66=fermate (CAT_FERMATA,,N,) fermata e
67=fermatf (CAT_FERMATA,,N,) fermata f
68=fermathg (CAT_FERMATA,,N,) fermata G
105=fermatha (CAT_FERMATA,,N,) fermata A



77=HA_STAFF
87=staff
80=dalsegno (CAT_SIGN_REPEAT,,N,) no_sound

79=segno (CAT_SIGN,,N,) no_sound

103=REST_32 (CAT_REST,,N,) melody d32
71=fine  (CAT_SIGN_REPEAT,,N,) no_sound
72=dacapoalfine  (CAT_SIGN_REPEAT,,N,) no_sound

105=coda (CAT_SIGN_REPEAT,,N,) no_sound
106=dacapoalcoda (CAT_SIGN_REPEAT,,N,) no_sound
107=codasection (CAT_SIGN,,N,) no_sound

119=I

//////////////////////////////////////////////////////////////


