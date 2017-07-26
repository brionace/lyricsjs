/*Synchronises lyrics with music so you can easy animate in real time.
Useful for webpage based videos, karaoke etc*/

(function(){

	"use strict";


	var LyricsJs = function (song, lyrics, params) {	
		console.log(song)
		if (typeof(song['audio']) !== "undefined") {
			
			// Initialise lyricsjs	
			var song = (song['audio'] != '') ? document.querySelector(song['audio']) : console.log('No Audio Selected'),
				lyrics = lyrics;
			var options = {
				before : function(){},
				during : function(){test()},
				after : function(){}
			};
						
			//console.log(options);
			proceSSHTML5(song, lyrics, options);

		}

	}

	function proceSSHTML5(song, lyrics, options){
		
		var i = 0;
		
		song.addEventListener('timeupdate',function (){
	
			var duration = song.duration,
				currentTime = song.currentTime;	
		
			var song_time = timeInSecs(duration),
				current_time = timeInSecs(currentTime);
	
			//Sequence json
			if(lyrics.length){
				var lyrcs = [];
				var lyric_id,lyric_next,lyric_last,seq_id;

				
				lyrics.forEach(function(line,i) {
					
					var currtime = line['time'],
						content = line['content'],
						animation = line['animation'];

					  if( (current_time === currtime) ){
						  console.log(content);
						  //Lyric
						  if(typeof(content) !== "undefined"){
							  document.getElementById('lyrics').innerHTML = content; 
							  options.during();
						  };//Execute a function in time
					  }
						
								
				});				
			
			}								
		
	
		});
		
	}
	
	function test(){console.log('durinc')}

			
	var timeInSecs = function(the_time){
		
			var sec = new Number(),
				min = new Number();	
	
			sec = Math.floor( the_time );		    
			min = Math.floor( sec / 60 );
			min = min >= 10 ? min : '0' + min;  		  
			sec = Math.floor( sec % 60 );
			sec = sec >= 10 ? sec : '0' + sec;	
			
			return min+'.'+sec;
	
	}

    window.LyricsJs = LyricsJs;
})();