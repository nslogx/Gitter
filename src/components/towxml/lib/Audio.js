module.exports = (option) => {
    option = option || {};
    const app = option.app;

    class Audio {
        constructor(option) {
            const _ts = this;

            _ts.option = option.option;
            _ts.playerId = option.playerId;
            _ts.dataId = option.dataId;

            this.player = this.createPlayer();
            this.status = 'init';
        }

        // 播放
        play() {
            const _ts = this;
            _ts.player.play();
        }

        // 暂停
        pause() {
            const _ts = this;
            _ts.player.pause();
        }

        // 获取需要更新的数据键名
        getAppDataKey(id){
            for(let key in app.data){
                let item = app.data[key];

                if(item.id === id){
                    return key;
                };
            };
        }

        updateView(data){
            data = data || {};
            const _ts = this,
                option = _ts.option;

            _ts.updateKey = _ts.updateKey || _ts.getAppDataKey(_ts.dataId)

            let articleData = global.__towxmldata__[_ts.dataId].article,
                playerData = global.__towxmldata__[_ts.dataId].audio[_ts.playerId];
            
            // 检查如果数据没有被应用到页面上则中止操作
            if(!_ts.updateKey){
                return;
            };

            // 将选项和新传入的数据组合到viewData，后续更新使用
            for(let key in data){
                option[key] = data[key];
            };

            // 设置默认进的播放进度
            option.duration = _ts.duration || 0.001;
            option.currentTime = _ts.currentTime || 0;
            option.class = option.class || 'audioForH2w';

            // 设置播放器样式
            playerData.attr.class = option.class;

            // 设置封面图片
            playerData.child[1].child[0].attr.src = option.poster;
            
            // 设置进度条
            playerData.child[2].child[0].attr.style = `width:${option.currentTime / option.duration * 100}%`;

            // 设置title、歌手、播放时间
            playerData.child[2].child[1].child[0].text = option.name;
            playerData.child[2].child[2].child[0].text = option.author;
            playerData.child[2].child[3].child[0].text = `${_ts.formatTime(option.duration)} / ${_ts.formatTime(option.currentTime)}`;

            // 更新数据
            let updateData = {};
            updateData[_ts.updateKey] = articleData;

            app.setData(updateData);
        }

        // 创建播放器
        createPlayer(){
            const _ts = this;

            let option = _ts.option,

                autoplay = option.autoplay === 'true' ? true :
                            option.autoplay === 'false' ? false :
                            !!option.autoplay,
                loop = option.loop === 'true' ? true :
                        option.loop === 'false' ? false :
                        !!option.loop,
                src = option.src,
                audio = wx.createInnerAudioContext();

            audio.autoplay = autoplay;
            audio.loop = loop;
            audio.src = src;

            // 进入可播放状态时更新视图
            audio.onCanplay(() =>{
                _ts.updateView({
                    class:'audioForH2w'
                });
            });

            // 播放
            audio.onPlay(() => {
              _ts.status = 'start';

              _ts.updateView({
                  class:'audioForH2w audioForH2w--play'
              });
            });

            // 播放过程中
            let temp = 0;
            audio.onTimeUpdate(function (obj) {
                _ts.status = 'update';
                _ts.duration = audio.duration;
                _ts.currentTime = audio.currentTime;

                // 每5秒更新一次（否则内容过多会导致性能低下）
                if(_ts.currentTime - temp > 5){
                    temp = _ts.currentTime;
                    _ts.updateView({
                        class:'audioForH2w audioForH2w--play'
                    });
                };
            });

            // 暂停
            audio.onPause(obj => {
                _ts.status = 'pause';

                _ts.updateView({
                    class:'audioForH2w'
                });
            });

            // 停止
            audio.onEnded(obj => {
                _ts.status = 'end';

                _ts.updateView({
                    class:'audioForH2w audioForH2w--end'
                });
            });
            return audio;
        }

        // 数字补位
        fillIn(val) {
            return `${val < 10 ? '0' : ''}${val}`;
        }

        // 格式化时间  
        formatTime(time){
            let fillIn = this.fillIn,
                second = Math.floor(time % 60),
                minute = Math.floor(time / 60 % 60),
                hour = Math.floor(time / 60 / 60);
            return `${fillIn(hour)}:${fillIn(minute)}:${fillIn(second)}`;
        }
    };
    return new Audio(option);
};