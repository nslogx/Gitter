const Audio = require('./lib/Audio'),
	tagsAndAttrs = require('./lib/tagsAndAttrs');

class towxml {
	constructor(option) {
		const _ts = this;
		option = option || {};

		for (let i in option) {
			_ts.config[i] = option[i];
		};

		_ts.m = {};

		let mdOption = {
			html: true,
			xhtmlOut: true,
			typographer: true,
			breaks: true,
			highlight: function (code, lang, callback) {
				return _ts.m.highlight.highlightAuto(code).value;
			}
		};
		
		_ts.m.toJson = require('./lib/toJson');
		_ts.m.highlight = require('./plugins/hljs/index');

		_ts.m.md = require('./lib/markdown-it')(mdOption);
		_ts.m.md_sub = require('./plugins/markdown-it-sub');
		_ts.m.md_sup = require('./plugins/markdown-it-sup');
		_ts.m.md_ins = require('./plugins/markdown-it-ins');
		_ts.m.md_mark = require('./plugins/markdown-it-mark');
		_ts.m.md_emoji = require('./plugins/markdown-it-emoji');
		_ts.m.md_todo = require('./plugins/markdown-it-todoList');

		_ts.m.md.use(_ts.m.md_sub);
		_ts.m.md.use(_ts.m.md_sup);
		_ts.m.md.use(_ts.m.md_ins);
		_ts.m.md.use(_ts.m.md_mark);
		_ts.m.md.use(_ts.m.md_emoji);
		_ts.m.md.use(_ts.m.md_todo);

		_ts.m.md.renderer.rules.emoji = function (token, idx) {
			return '<g-emoji class="h2w__emoji h2w__emoji--' + token[idx].markup + '">' + token[idx].content + '</g-emoji>';
		};
	}

	/**
	 * markdown转html
	 */
	md2html(mdContent) {
		const _ts = this;
		return _ts.m.md.render(mdContent);
	}

	/**
	 * html2json
	 * @param  {string} content html或markdown字符串
	 * @param  {string} type 'html'、'marddown'
	 * @param  {object} app 小程序对象
	 */
	toJson(content, type){
		const _ts = this;
		type = type || 'html';

		let json = '',
			sortOutJson;

		if (type === 'markdown') {
			json = new _ts.m.toJson(_ts.md2html(content)).getData();
		} else if (type === 'html') {
      		json = new _ts.m.toJson(content).getData();
		};

		json.theme = 'light';

		return json;
	}

	/**
	 * 初始化小程序数据
	 * @param  {object} data toJson方法解析出来的数据
	 * @param  {object} option {base:'https://xxx.com',app:pageThis}
	 */
	initData(data,option){
		option = option || {};

		const _ts = this,
			app = option.app,
			appData = app.data,
			base = option.base || '';
		
		let eachData,
			dataId = data.id;

		if(app){
			(eachData = (data)=>{
				let child = data.child;

				// 处理所有相对资源的src路径
				if(
					base &&
					data.attr && 
					data.attr.src && 
					data.attr.src.indexOf('//') < 0
				){
					data.attr.src = `${base}${data.attr.src}`;
				};

				// 处理音频
				if(data.type === 'audio'){
					// 得到音频播放选项
					let audioOption = data._e.attr,
						audioId = data._id;

					// 保存当前播放器数据
					global.__towxmldata__[dataId].audio[audioId] = data;

					//用于保存播放器对象
					appData.__audioObj__ = appData.__audioObj__ || {};
					appData.__audioObj__[audioId] = Audio({
						app:app,                            // 传入APP
						playerId:audioId,               	// 当前播放器ID
						dataId:dataId,                      // 数据ID
						option:audioOption                  // 传入音频选项
					});
				}

				// 如果有子级则对子级进行处理
				else if(child && child.length){
					for(let i=0,len=child.length; i<len; i++){
						let childItem = child[i];
						eachData(childItem);
					};
				};
			})(data);

			// 定义播放器点击时的播放与暂停方法
			if(typeof app.__audioPlayAndPause__ !== 'function'){
				app.__audioPlayAndPause__ = (event)=>{
					let currentTarget = event.currentTarget || {},
						dataset = currentTarget.dataset || {},
						_el = dataset._el || {},
						id = _el._id || {},
						player = typeof app.data.__audioObj__ === 'object' ? app.data.__audioObj__[id] : undefined;
					// 正在播放中则暂停，否则就播放
					if(player && player.status !== 'play' && player.status !== 'update'){
						player.play();
					}else{
						player.pause();
						player.status = 'pause';
					};
				};
			};


			tagsAndAttrs.binds.forEach(item => {
				let aItem = item.split(':'),
					bindType = aItem[0],		// 事件绑定类型
					evenType = aItem[1];		// 事件类型
				

				// 检查，如果有添加自定义事件，则运行该事件
				app[`__${bindType}_${evenType}`] = (event)=>{
					let funName = `event_${bindType}_${evenType}`,
						timer = `${funName}_timer`,
						runFun = app[funName];

					// 为audio标签绑定音频播放
					if(event && 
						event.type === 'tap' && 
						event.currentTarget &&
						event.currentTarget.dataset &&
						event.currentTarget.dataset._el &&
						event.currentTarget.dataset._el._e && 
						event.currentTarget.dataset._el._e.tagName === 'audio'){
						app.__audioPlayAndPause__(event);
					};

					if(typeof runFun === 'function'){

						// 由于小程序的事件绑定方式与冒泡机制问题，此处使用计时器以避免事件被同时多次调用
						clearTimeout(app[timer]);
						app[timer] = setTimeout(()=>{
							runFun(event)
						});
					};
				};
			});
			app[`__todo_checkboxChange`] = (event)=>{};
		};
		
		return data;
	}
};

module.exports = towxml;
