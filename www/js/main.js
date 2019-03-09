var app = {
    pages: null,
    index:-1,
    track: [
        {
        id:0,
        src: 'file:///android_asset/www/media/Stuck.mp3',
        song: 'Stuck',
        singer: 'Imagine Dragons',
        volume: 0.5,
        img: './img/ImagineDragons.png'
        },
        {
        id:1,
        src: 'file:///android_asset/www/media/KillerQueen.mp3',
        song: 'Killer Queen',
        singer: '5sos',
        volume: 0.5,
        img: './img/5sos.jpg'
        },
        {
        id:2,
        src: 'file:///android_asset/www/media/MeuAbrigo.mp3',
        song: 'Meu Abrigo',
        singer: 'Melim',
        volume: 0.5,
        img: './img/melim.jpg'
        },
        {
        id:3,
        src: 'file:///android_asset/www/media/ThroughGlass.mp3',
        song: 'Through Glass',
        singer: 'Stone Sour',
        volume: 0.5,
        img: './img/stoneSour.jpg'
        },
    ],
    media:null,
    stt:-2,
    status:{
        '0':'MEDIA_NONE',
        '1':'MEDIA_STARTING',
        '2':'MEDIA_RUNNING',
        '3':'MEDIA_PAUSED',
        '4':'MEDIA_STOPPED'
    },
    err:{
        '1':'MEDIA_ERR_ABORTED',
        '2':'MEDIA_ERR_NETWORK',
        '3':'MEDIA_ERR_DECODE',
        '4':'MEDIA_ERR_NONE_SUPPORTED'
    },

    init: function () {
        let isReady = (window.hasOwnProperty("cordova"))?'deviceready':'DOMContentLoaded';
        document.addEventListener(isReady, ()=>{
            app.buildList();
            app.addListeners();
           
        })
    },
    buildList: ()=>{
       app.track.forEach(tracks => {
           let li = document.createElement("li");
           let img = document.createElement("img");
           let h3 = document.createElement("h3");
           let sh3 = document.createElement("h3");
           
           li.classList.add("music-item");
           li.dataset.target = "playnow";

           li.setAttribute("data-id", tracks.id);
                      
           img.setAttribute("src", tracks.img);
           img.classList.add("music-img");
           li.appendChild(img);

           h3.textContent=tracks.song;
           h3.classList.add("music-artist");
           li.appendChild(h3);

           sh3.textContent=tracks.singer;
           sh3.classList.add("music-title");
           li.appendChild(sh3);

           document.querySelector(".music-list").appendChild(li);  
   
       });

       app.pages = document.querySelectorAll('.page');
                app.pages[0].classList.add('active');

        
        
         let item = document.querySelectorAll(".music-item");
                 item.forEach( i => { 
            i.addEventListener('click', app.navigate);
            i.addEventListener('click', app.play)
            });
        
    },

    song: function(ev){
        let id = ev.currentTarget.getAttribute('data-id');
        
        app.index= id;
        
        if(app.stt == 1 || app.stt == 2) {
            
             app.media.pause();
        } 
        
        
            let mytrack = app.track[id];
            
            let image = document.getElementById("cover");
            image.src = mytrack.img;

            let singer = document.getElementById("singer");
            singer.textContent = mytrack.singer;

            let songs = document.getElementById("songs");
            songs.textContent = mytrack.song;
        
            app.media = new Media(mytrack.src, app.ftw, app.wtf, app.statusChange);

            app.media.play();

            

    },
    
    //navigate through pages
    navigate: function(ev){
        ev.preventDefault();
        document.querySelector('.active').classList.remove('active');
        let target = ev.currentTarget.getAttribute('data-target');
        document.getElementById(target).classList.add('active');  
    },

    //sucess music
    ftw: function(){
        //success creating the media object and playing, stopping, or recording
        console.log('success doing something');
    },

    //fail music
    wtf: function(err){
        //failure of playback of media object
        console.warn('failure');
        console.error(err);
    },
    //music
    statusChange: function(status){
        console.log('media status is now ' + app.status[status] );

        app.stt = status;
        console.log(app.stt);

        if(status === Media.MEDIA_STOPPED) {
            
            let novo = app.index;
            novo++;

            if(novo >= app.track.length){
                novo = 0;
            }
            document.querySelector(`.music-item[data-id="${novo}"]`).click();
        }
        
        
    },
    addListeners: function(){
        document.querySelector('#play-btn').addEventListener('click', app.playe);
        document.querySelector('#pause-btn').addEventListener('click', app.pause);
        document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
        document.querySelector('#down-btn').addEventListener('click', app.volumeDown);
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        document.addEventListener('pause', ()=>{
            app.media.release();
        });
        document.addEventListener('menubutton', ()=>{
            console.log('clicked the menu button');
        });
        document.addEventListener('resume', ()=>{
            app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        });
        
    },

    //play music
    play: function(ev){
              
            app.song(ev);  
    },

    playe: function(){
        app.media.play();
    },

    //pause music
    pause: function(){
        app.media.pause();
    },

    //volume up music
    volumeUp: function(){
        let id = app.index;
        vol = parseFloat(app.track[id].volume);
        console.log('current volume', vol);
        vol += 0.1;
        if(vol > 1){
            vol = 1.0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.track[id].volume = vol;
    },

    //volume down music
    volumeDown: function(){
        let id = app.index;
        vol = app.track[id].volume;
        console.log('current volume', vol);
        vol -= 0.1;
        if(vol < 0){
            vol = 0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.track[id].volume = vol;
    },

    //foward music
    ff: function(){
        let pos = app.media.getCurrentPosition((pos)=>{
            let dur = app.media.getDuration();
            console.log('current position', pos);
            console.log('duration', dur);
            pos += 10;
            if(pos < dur){
                app.media.seekTo( pos * 1000 );
            }
        });
    },

    //rewind music
    rew: function(){
        let pos = app.media.getCurrentPosition((pos)=>{
            pos -= 10;
            if( pos > 0){
                app.media.seekTo( pos * 1000 );
            }else{
                app.media.seekTo(0);
            }
        });
    },

    

};

app.init();