let wxml = [
    // 建议保留的解析标签
    'view',
    'video',
    'text',
    'image',
    'navigator',
    'swiper',
    'swiper-item',
    'block',
    'form',
    'input',
    'textarea',
    'button',
    'checkbox-group',
    'checkbox',
    'radio-group',
    'radio',

    // 可以解析的标签（html或markdown中会很少使用）
    // 'canvas',
    // 'map',
    // 'slider',
    // 'scroll-view',
    // 'movable-area',
    // 'movable-view',
    // 'progress',
    // 'label',
    // 'switch',
    // 'picker',
    // 'picker-view',
    // 'switch',
    // // 'audio',
    // 'contact-button'
],
binds = [
    // 建议保留的事件
    'bind:touchstart',
    'bind:touchmove',
    'bind:touchcancel',
    'bind:touchend',
    'bind:tap',
    // 'bind:longpress',
    // 'bind:longtap',
    // 'bind:transitionend',
    // 'bind:animationstart',
    // 'bind:animationiteration',
    // 'bind:animationend',
    // 'bind:touchforcechange'
],
attrs = [
    'class',
    'width',
    'height',
    'data',
    'id',
    'style'
];

module.exports = {
    wxml:wxml,
    binds:binds,
    attrs:[...binds,...attrs]
};