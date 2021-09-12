const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'VIK_PLAYER';
const MUSIC_STORAGE_KEY = 'VIK_MUSIC';
const SONG_STORAGE_KEY = 'VIK_SONG';
const VOLUME_STORAGE_KEY = 'VIK_VOLUME';



const player = $('.player');
const playList = $('.playlist');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const heading = $('header h2');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const progressBlock = $('.progress-block');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const optionBtn = $('.option');
const volumeBtn = $('.volume')
const volume = $('.volume__range')
const dashboard = $('.dashboard') 
console.log([dashboard.offsetWidth, dashboard.offsetHeight])



const app = {

    currentIndex: JSON.parse(localStorage.getItem(SONG_STORAGE_KEY)) ||0,
    indexArray: [],
    currentVolume: JSON.parse(localStorage.getItem(VOLUME_STORAGE_KEY)) || 1,

    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isSeeking: false,
    isVolumeChange: false,

    songs: JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY)) || [],
    

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setSetting: function() {
        localStorage.setItem(SONG_STORAGE_KEY, JSON.stringify(this.currentIndex));
        localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(data));
    },

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    
    render : function() {
        const htmls = this.songs.map(function(song,index){
            return `
                        <div class="song ${app.currentIndex === index ? 'active' : ''}" data-index="${index}">
                            <div class="thumb" style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                                <div class="option__block">
                                <ul class="option__download">
                                    <div class="option__download-list">
                                        <button class="option__download-btn">
                                            <i class="ti-download"></i>
                                            <span>Tải xuống</span>
                                        </button>
                                        <button class="option__download-btn">
                                            <i class="ti-write"></i>
                                            <span>Lời bài hát</span>
                                        </button>
                                        <button class="option__download-btn">
                                            <i class="ti-help"></i>
                                            <span>Trợ giúp</span>
                                        </button>
                                    </div>
                                </ul>
                                <ul class="option__list">
                                    <li class="option__item">
                                        <div class="option__item-block">
                                            <i class="ti-plus option__item-icon"></i>
                                            <p class="option__item-content">Thêm vào playlist</p>
                                        </div>
                                        <i class="ti-angle-right option__item-icon"></i>
                                    </li>
                                    <li class="option__item">
                                        <div class="option__item-block">
                                            <i class="ti-microphone-alt option__item-icon"></i>
                                            <p class="option__item-content">Phát cùng lời bài hát</p>
                                        </div>
                                    </li>
                                    <li class="option__item">
                                        <div class="option__item-block">
                                            <i class="ti-comments-smiley option__item-icon"></i>
                                            <p class="option__item-content">Bình luận</p>
                                        </div>
                                    </li>
                                    <li class="option__item">
                                        <div class="option__item-block">
                                            <i class="ti-link option__item-icon"></i>
                                            <p class="option__item-content">Sao chép link</p>
                                        </div>
                                    </li>
                                    <li class="option__item">
                                        <div class="option__item-block">
                                            <i class="ti-share option__item-icon"></i>
                                            <p class="option__item-content">Chia sẻ</p>
                                        </div>
                                        <i class="ti-angle-right option__item-icon"></i>
                                    </li>
                                </ul>
                                </div>
                            </div>
                        </div>
            `;
        })
        
        playList.innerHTML = htmls.join('');
        this.scrollToActiveSong();


    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },



    handleEvents: function() {
        const _this = this;
        // Handles CD enlargement / reduction
        document.onscroll = function() {
            const cdWidth = 200;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            newCdWidth = cdWidth - scrollTop;
            Object.assign(cd.style,  {
                    width: newCdWidth > 0 ? newCdWidth + 'px' : 0,
                    opacity: newCdWidth / cdWidth
                });
            console.log( newCdWidth > 0 ? 331 - newCdWidth + 'px' : 32 + '', cdWidth);
            if(newCdWidth < cdWidth) {
                volume.classList.add('horizontal');
            } else {
                volume.classList.remove('horizontal');
            }
        }


        // Handle when click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // When the song is played
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // When the song is paused
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Handle next song when audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
            } else {
                nextBtn.click();
            }
            audio.play();
        }

        // When the song progress changes
        audio.ontimeupdate = function() {
            if (!_this.isSeeking && audio.duration) {
                
                progress.value = Math.floor(audio.currentTime / audio.duration * 100);

            } else {
                // Handling when seek
                progress.onchange = function(e) {
                    const seekTime = e.target.value * audio.duration / 100;
                    audio.currentTime = seekTime;
                    _this.isSeeking = false;
                }
            }
        }

        function seekStart() {
            _this.isSeeking = true;
        }

        
        progressBlock.ontouchstart = seekStart;


        progressBlock.onmousedown = seekStart;

        

        //  Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10000 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()


        // When next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong();
        }

        // When prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong();
        };

        // Handling on / off random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            this.classList.toggle('active', _this.isRandom)
        }

        // Single-parallel repeat processing
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active', _this.isRepeat)
        }

        // Listen to playlist clicks
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option')
            const activeOption = $('.option.active');
            if( songNode || optionNode) {
                // Handle when clicking on the song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    $('.song.active').classList.remove('active');
                    songNode.classList.add('active');
                    audio.play();
                }

                // Handle when clicking on the song option
                if(optionNode) {
                    optionNode.classList.add('active');
                }
            }

            if(activeOption && !e.target.closest('.option__block')) {
                activeOption.classList.remove('active');
            }
        }

        //Handle adjust volume change
        volumeBtn.onmousedown =function() {
            _this.isVolumeChange = true;
        }
        volumeBtn.ontouchstart = function() {
            _this.isVolumeChange = true;
        }
        
        function changeVolume() {
            if(_this.isVolumeChange) {
                audio.volume = volume.value / 100;
                localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify(audio.volume))
                if (!audio.volume) {
                    volumeBtn.classList.remove('ti-volume');
                    volumeBtn.classList.add('fas', 'fa-volume-mute')
                } else {
                    volumeBtn.classList.add('ti-volume');
                    volumeBtn.classList.remove('fas', 'fa-volume-mute')
                }
            }
        }

        volumeBtn.onmousemove = function(e) {
            e.stopPropagation();
            changeVolume();
        }

        volumeBtn.ontouchmove = function(e) {
            e.stopPropagation();
            changeVolume();
        }


    },


    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = `${this.currentSong.path}`;
        this.setSetting();
    },

    
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        audio.volume = this.currentVolume;
        volume.value = this.currentVolume * 100;
        console.log(audio.volume)
    },

    nextSong: function() {
        this.currentIndex++;
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex || this.indexArray.includes(newIndex))
        this.indexArray.push(newIndex);
        console.log(this.indexArray);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        if(this.indexArray.length === this.songs.length) {
            this.indexArray = [];
        }
},

    scrollToActiveSong: function() {
        setTimeout(function() {
            if(app.currentIndex <= 6) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }
        }, 200)
    },

    start: function() {
        
        // Assign configuration from config to application
        this.loadConfig();
        
        
        // Define properties for the object
        this.defineProperties();

        
        // Listening / handling events (DOM events)
        this.handleEvents();
        

        // Render playlist
        this.render();
        
        
        // Load the first song information into the UI when running the app
        this.loadCurrentSong();
        
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }

}


app.start();
