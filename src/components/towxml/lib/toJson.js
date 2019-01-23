const tagsAndAttrs = require('./tagsAndAttrs');
class ToJson {
    constructor(html){
        const _ts = this;

        let m = _ts.m = {};
        m.parse = require('./parse5');

        _ts.html = html;
        _ts.data = {};

        // 得到整体页面的数据
        _ts.data.document = m.parse.parse(_ts.html);

        // 得到body部分的数据
        _ts.data.body = _ts.getBodyData(_ts.data.document);

        // 生成当前的数据ID
        _ts.id  = `dataId_${+new Date}_${(Math.random()+'').slice(2)}`;

        // 将数据保存到全局
        global.__towxmldata__ = global.__towxmldata__ || {};
        global.__towxmldata__[_ts.id] = global.__towxmldata__[_ts.id] || {};
        global.__towxmldata__[_ts.id].audio = {};
    }

    getData(){
        const _ts = this,
            m = _ts.m;

        let data = _ts.data,
            outData = _ts.sortOut(data.body); 

        outData.node = 'root';
        
        // 为数据添加ID
        outData.id = _ts.id;

        
        global.__towxmldata__[_ts.id].article = outData;

        return global.__towxmldata__[_ts.id].article;
    }

    /**
     * 遍历页面数据整理成小程序想要的
     */
    sortOut(bodyData){
        const _ts = this;
        let result = {},
            arrange;  
        (arrange = (data,result)=>{  
            // 当有数据且有子元素时则遍历
            if(data && data.childNodes && data.childNodes.length){
                // 子元素数据不存在时，创建一个空的数组用以存储子元素数据
                if(!result.child){
                    result.child = [];
                };
                // 遍历子节点，处理节点的数据
                for(let i=0,len=data.childNodes.length; i<len; i++){
                    let node = data.childNodes[i],                              // 得到具体的节点
                        attrs = node.attrs,                                     // 得到节点的属性（一个数组）
                        attrsLength = attrs && attrs.length ? attrs.length : 0, // 得到节点属性的长度
                        current = {                                             // 创建一个空对象，用于存储节点属性及处理之后的属性
                            _e:{},
                            attr:{}                                             // html的原始数据
                        };                                           
                    if(node){
                        result.child.push(current);
                    };
                    // 如果有属性则处理其属性
                    if (attrsLength) {              
                        if (current._e.attr === undefined) {
                            //current.attr = {};
                            current._e.attr = {};
                        };
                        for (let i = 0; i < attrsLength; i++) {
                            let attrsItem = attrs[i],
                                key = attrsItem.name,
                                val = attrsItem.value;
                            
                            current.attr[key] = val;
                            current._e.attr[key] = val;
                        }; 
                    };

                    for(let key in node){
                        // 保留最原始的html数据，父节点数据去掉（小程序会报错）
                        if(typeof node[key] !== 'object'){
                            current._e[key] = node[key];
                        };
                        switch (node.nodeName) {
                            case 'body':
                                current['node'] = 'root';
                            break;
                            case '#text':
                                current['node'] = 'text';
                                current['text'] = node.value;
                            break;
                            default:
                                current['node'] = 'element';
                            break;
                        };
                    };

                    // 当前标签是audio的情况下
                    if(node.tagName === 'audio'){
                        current.tag = "view";
                        current.attr = {};
                        current.attr.class = 'audioForH2w';

                        current._id = `audio_${+new Date()}_${(Math.random()+'').slice(2)}`;
                        current.type = 'audio';

                        // 创建播放器子元素
                        current.child = [
                            {   
                                node:"element",
                                tag:"view",
                                attr:{
                                    class:"h2w__view audioForH2w__icon"
                                }
                            },{
                                node:"element",
                                tag:"view",
                                attr:{
                                    class:"h2w__view audioForH2w__cover"
                                },
                                child:[
                                    {
                                        node:"element",
                                        tag:"image",
                                        type:"audio",
                                        attr:{
                                            class:"h2w__img"
                                        }
                                    }
                                ]
                            },{
                                node:"element",
                                tag:"view",
                                attr:{
                                    class:"h2w__view audioForH2w__info"
                                },
                                child:[
                                    {
                                        node:"element",
                                        tag:"view",
                                        attr:{
                                            class: "h2w__view audioForH2w__schedule",
                                            style: "width:0px;"
                                        }
                                    },{
                                        node:"element",
                                        tag:"view",
                                        attr:{
                                            class:"audioForH2w__title"
                                        },
                                        child:[
                                            {
                                                node:"text",
                                                text: "--",
                                                attr: {}
                                            }
                                        ]
                                    },{
                                        node:"element",
                                        tag:"view",
                                        attr:{
                                            class:"audioForH2w__author"
                                        },
                                        child:[
                                            {
                                                node:"text",
                                                text: "佚名",
                                                attr: {}
                                            }
                                        ]
                                    },{
                                        node:"element",
                                        tag:"view",
                                        attr:{
                                            class:"audioForH2w__time"
                                        },
                                        child:[
                                            {
                                                node:"text",
                                                text: "00:00:00 / 00:00:00",
                                                attr: {}
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];
                    }else if(node.tagName){
                        current.tag = _ts.getTag(node.tagName);
                        current.attr.class = current.attr.class ? `h2w__${node.tagName} ${current.attr.class}` : `h2w__${node.tagName}`;
                    };
                    arrange(node,current);
                };
            };
        })(bodyData,result);
        return result;
    }

    /**
     * 获取属于body那部分的数据
     */
    getBodyData(documentData){
        let data,
            getBody;
        (getBody = (list)=>{
            for(let i=0,len=list.length; i<len; i++){
                let item = list[i];

                if(item.nodeName === 'body' && item.tagName === 'body'){
                    data = item;
                    break;
                }else if (item.childNodes){
                    getBody(item.childNodes);
                };
            }
        })(documentData.childNodes);
        return data;
    }

    /**
     * 得到转换对应的tag
     */
    getTag(tagName){
        let correspondTag = this.correspondTag(),
            wxmlTag = correspondTag[tagName] === undefined ? 'view' : correspondTag[tagName];
        return wxmlTag;
    }

    /**
     * 组织html与小程序的tag对应关系
     */
    correspondTag(){
        let data = {
            'a':'navigator',
            'img':'image',
            'todogroup':'checkbox-group'
        };

        // 该系列的标签都转换为text
        ['span','b','strong','i','em','code','sub','sup','g-emoji','mark','ins'].forEach(item => {
            data[item] = 'text';
        });

        // 该系列是小程序原生tag，不需要转换
        tagsAndAttrs.wxml.forEach(item => {
            data[item] = item;
        });
        return data;
    }
};

module.exports = ToJson;