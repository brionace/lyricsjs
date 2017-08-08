/*Synchronises lyrics with music so you can easy animate in real time.
Useful for webpage based videos, karaoke etc*/

(function(){

	"use strict";
	
	var wordsContainer,
		sourceType,
		vheight,
		vwidth,
		musicSource,
		lyricsJSON;	
		
	var totalTime, now_time;
	
	var LyricsJs = function (settings) {	
		//Init	
		wordsContainer = settings['wordsContainer']  || '',
		sourceType = settings['sourceType'] || '',
		vheight = settings['vheight'] || "100%",
		vwidth = settings['vwidth']  || "100%",
		musicSource = settings['musicSource'] || '',
		lyricsJSON = settings['lyricsJSON'] || '';
		/*if( wordsContainer!="" ){
			containr = document.querySelector(wordsContainer);
		}else{
			return false;
			//document.createElement('div').id = "lyrics";
			//document.getElementsByTagName('body')[0].appendChild(flyDiv);
			//containr = document.getElementById('#lyrics');
		}//Get the container	*/	
		
		if (typeof(sourceType) !== "undefined") {
			
			if(sourceType == 'youtube'){
				processYOUTUBE();
			}
			if(sourceType == 'html5'){	
				processHTML5();
			}						

		}
		
	}
    
	window.LyricsJs = LyricsJs;
	
	function processHTML5(){
		var song = (musicSource) ? document.querySelector(musicSource) : '';
		song.addEventListener('timeupdate',function (){
	
			var duration = song.duration,
				currentTime = song.currentTime;	
				
			totalTime = timeInSecs(duration),
			now_time = timeInSecs(currentTime);	
					
			showLyricsFunction();
	
		});
		
	}
	
	function processYOUTUBE(){
	  var song = (musicSource) ? musicSource : "PWjRMuyXl2o";
	  // This code loads the IFrame Player API code asynchronously.
	  var tag = document.createElement("script");
	  tag.src = "//www.youtube.com/iframe_api";
	  var firstScriptTag = document.getElementsByTagName("script")[0];
	  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	  // This function creates an <iframe> (and YouTube player)
	  // after the API code downloads.
	  var player,t;
	  window.onYouTubeIframeAPIReady = function() {
		player = new YT.Player("player", {
		  "height": vheight,
		  "width": vwidth,
		  "videoId": song,
		  "events": {
			"onReady": onPlayerReady,
			"onStateChange": onPlayerStateChange
		  }
		});
	  }
		
	  // 4. The API will call this function when the video player is ready.
	  function onPlayerReady(event) {
		event.target.playVideo();
	  }
	   /*function onPlayerStateChange(event){
		   function updateTime() {
			//if (event.data == YT.PlayerState.PLAYING) {
				console.log(player.getCurrentTime());		
			//}
		   }
		
			t = setInterval(updateTime,1000)
	   }*/	
	function onPlayerStateChange(event){
		if(event.data==YT.PlayerState.PLAYING) { // playing
			t =   setInterval(function(){         
				var currentTime = player.getCurrentTime();
				var minutes     = Math.floor(currentTime / 60) < 10 ? '0' + Math.floor(currentTime / 60.000) : 
				Math.floor(currentTime / 60.000);
				var seconds     = Math.floor(currentTime % 60) < 10 ? '0' + Math.floor(currentTime % 60.000) : 
				Math.floor(currentTime % 60.000);
	
				//console.log( minutes+'.'+seconds );						
				totalTime = '',
				now_time = getSeconds(minutes+':'+seconds);
					
				showLyricsFunction()
					
				}, 100); // 100 means repeat in 100 ms
			} else { // not playing
				clearInterval(t);
			}
		}
		
	}	
	
	function showLyricsFunction(){
			//console.log( wordsContainer );			
			var first_time = '',
				last_time = '',
				next_time = '',
				wordsContainr = document.querySelector(wordsContainer);	
	
			//Sequence json
			if(lyricsJSON.length){
				
				lyricsJSON.forEach(function(line,index) {
					//console.log(line);
					var content_time = (typeof line['time'] != 'undefined') ? hmsToMillisecs(line['time']) : "",
						content = (typeof line['content'] != 'undefined') ? line['content'] : "",
						animation = (typeof line['animation'] != 'undefined') ? line['animation'] : "noanimation";	
						
					first_time = hmsToMillisecs(lyricsJSON[0]['time']);
					
					if (index < lyricsJSON.length - 1) {
						//console.log("Next: " + lyricsJSON[index + 1]['time']);
						next_time = hmsToMillisecs(lyricsJSON[index + 1]['time']);
					}	
									
					if (index > 0) {
						//console.log("Previous: " + lyricsJSON[index - 1]['time']);
						last_time = hmsToMillisecs(lyricsJSON[index - 1]['time']);
					}
					
					//settings.before();//Execute a function before lyrics appear
					  console.log((now_time/2)+'-'+(content_time/2))
					  if( content && content_time ){
						//Lyrication
						if(((now_time/2) >= (content_time/2)) && now_time < next_time){
							wordsContainr.classList.add(animation);
							wordsContainr.innerHTML = '<span class="'+animation+'">'+content+'</span>'; 
							//console.log(wordsContainer);							  
						}else if(now_time < first_time || now_time > next_time){
							wordsContainr.classList.remove(animation);
							wordsContainr.innerHTML = '';
						}				  
						//Return elapsed time persentage
						document.getElementById('time').style.width = Math.floor((now_time / totalTime)*100)+'%';	
						  
						  
					  }			  
	
					//settings.after();//Execute a function after lyrics appear						
								
				});				
			
			}		
		
	}
	
			
	var timeInSecs = function(the_time){
		
			var sec = new Number(),
				min = new Number(),
				str;	
	
			sec = Math.floor( the_time );		    
			min = Math.floor( sec / 60 );
			min = min >= 10 ? min : '0' + min;  		  
			sec = Math.floor( sec % 60 );
			sec = sec >= 10 ? sec : '0' + sec;	

			return hmsToMillisecs(min+':'+sec);	
	}	
	
	function hmsToMillisecs(str) {
		var p = str.split(':'),
			s = 0, m = 1;
	
		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}
	
		//return (s % 1) * 1000;
		return (s) * 1000;
	}		
	
})();
