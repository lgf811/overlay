

// (function( global, factory ) {
//     typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//     typeof define === 'function' && define.amd ? define(factory) :
//     window.Overlay = factory();
// })(this, function() {
//
//     function handy( elem ) {
//         return new handy.init( elem );
//     }
//
//     handy.prototype.init = function( elem ) {
//
//     }
//
//     return handy;
//
// });

/*
* Overlay.js v1.0.1
*/

(function( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    window.Overlay = factory();
})(this, function() {

    var isIE8 = document.documentMode === 8,
        undef = undefined,
        _slice = Array.prototype.slice,
        toArr = function( val, index ) {
            if( index === undef ) index = 0;
            return isIE8 ? Array.prototype.concat.apply([], val).slice( index ) : _slice.call( val, index );
        },
        zIndex = parseInt(Math.random() * 100000),
        serialNumber = 0,
        sheets, rules,
        urlPattern = new RegExp('^\\.\\.?\\/|^https?:\\/\\/|\\/$|[a-z0-9-_=\\?]\/[a-z0-9-_=\\?]', 'i'),
        windowKey,
        domPrototype,
        getStyle,
        currCss,
        isInteger = function( val ) {
            return val%1 === 0;
        },
        offsetPattern = /width|height|top|right|bottom|left/,
        //hasUnitPattern = /\d?\.?\d+?(\%|px|em|rem)$/g,
        numPattern = /(^\d?\.?\d+?$)/,
        pixelPattern = /^([^0]\d{0,})px$/,
        percentPattern = /^(([^0]\d{0,})|(\d+\.\d+))%$/,
        getContentPattern = /^\$\.([\w-]+)\.?([\w-]+)?/i,
        getContentType = [ 'attr', 'html', 'text' ],
        docBody = document.body;

    if( Function.prototype.bind === undef ) {
        Function.prototype.bind = function( oThis ) {
            if( typeof this !== 'function' ) {
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var fToBind = this,
                argus = toArr( arguments, 1 ),
                fNOP = function() {},
                fBound = function( e ) {
                    return fToBind.apply( this instanceof fNOP && oThis ? this : oThis || window, [].concat( argus, e ) );
                };

            fNOP.prototype = fToBind.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        }
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function( val, start ) {

            var index = -1,
                self = this,
                len = this.length, i = 0;

            if( start !== undef && start !== 0 && !isInteger( start ) || !len || start > len - 1 || start < 0 ) return index;
            if( start !== undef && start > index && start < len - 1 ) i = start;

            for( ; i < len; i++ ) {
                if( self[i] === val ) return i;
            }

            return index;
        };

    }

    if( ~location.protocol.indexOf('http')) {
        sheets = toArr(document.styleSheets);

        for( i1 = 0; i1 < sheets.length; i1++ ) {
            rules = toArr( sheets[i1].rules );

            for( i2 in rules) {
                if( rules[i2].style && rules[i2].style.zIndex > zIndex && rules[i2].selectorText === '.overlay-container' ) zIndex = Number(rules[i2].style.zIndex);
            }
        }
    }

    if( window.getComputedStyle ) {
        getStyle = function( elem ) {
            return window.getComputedStyle( elem );
        };

        currCss = function( elem, key ) {
            return getStyle( elem ).getPropertyValue( key );
        }
    } else if( document.documentElement.currentStyle ) {
        getStyle = function( elem ) {
            return elem.currentStyle;
        };

        currCss = function( elem, key ) {
            var val = getStyle( elem )[ key ],
                style = elem.style,
                _val = style[ key ];

            return offsetPattern.test( key ) && !_val && isNaN(parseInt(val)) && val !== 'auto' ? '0px' : _val && !val ? _val : val;
        }
    }

    var extend = function() {
            var argus = toArr(arguments),
                newFlag, baseObj, mergeObjGroup, mergeObj,
                i1, i2;

            if( typeof argus[0] !== 'boolean' && typeof argus[0] !== 'object' ) return argus[0];

            if( typeof argus[0] === 'boolean' && argus[0] ) {
                newFlag = argus.splice(0, 1)[0];
                baseObj = argus.splice(0, 1)[0];
            } else {
                baseObj = argus.splice(0, 1)[0];
            }
            mergeObjGroup = argus;

            for( i1 = 0; i1 < mergeObjGroup.length; i1++ ) {
                mergeObj = mergeObjGroup[i1];

                if( easy.type( mergeObj ) !== 'object' && !easy.isArray( mergeObj ) ) continue;

                for( i2 in mergeObj ) {
                    if( newFlag && ( easy.type( mergeObj[i2] ) === 'object' || easy.isArray( mergeObj[i2] ) ) && mergeObj[i2] ) {
                        if( !(i2 in baseObj) ) baseObj[i2] = easy.isArray( mergeObj[i2] ) ? [] : {};
                        baseObj[i2] = extend( newFlag, baseObj[i2], mergeObj[i2] );

                    } else {
                        baseObj[i2] = mergeObj[i2];

                    }
                }
            }

            return baseObj;
        }, i1, i2,
        // Judgment type
        judgmentType = {},
        toString = judgmentType.toString,
        typePattern = /\[object (array|object|number|string|boolean|function|date|regexp|error|html)[a-z]{0,}]/i;
        easy = {
            type: function( obj ) {
                return typeof obj === 'object' || typeof obj === 'function' ? typePattern.test( toString.call( obj ) ) ? RegExp.$1.toLowerCase() : 'object' : typeof obj;
            },

            isArray: function( obj ) {
                return easy.type( obj ) === 'array';
            },

            each: function( arr, fn ) {
                var i, result, isArray = easy.isArray( arr );

                if( !easy.isArray( arr ) ) arr = [ arr ];

                for( i in arr ) {
                    result = fn.call( arr[i], isArray ? Number(i) : i, arr[i] );

                    if( result ) {
                        continue;
                    } else if( result !== undef ) {
                        break;
                    }
                }
            },
            addClass: function( elem, cls ) {
                var clsn = elem.className, i, len;

                if( !cls || cls && easy.hasClass( elem, cls ) || !easy.trim( cls ) ) return;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];

                cls = easy.trim( cls );
                cls = ~cls.indexOf(' ') ? cls.split(' ') : [ cls ];

                if( cls.length > 1 ) {
                    for( i = 0, len = clsn.length; i < len; i++ ) {
                        if( ~cls.indexOf( clsn[i] ) ) cls.splice( cls.indexOf( clsn[i] ), 1 );
                    }
                }

                clsn = clsn.concat(cls);

                elem.className = easy.trim( clsn.join(' ') );
            },
            removeClass: function( elem, cls ) {
                var clsn = elem.className,
                    i = 0;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];

                if( !cls ) return elem;

                if( ~cls.indexOf(' ') ) cls = cls.split(' ');

                if( typeof cls === 'string' && ~clsn.indexOf( cls ) ) {
                    clsn.splice(clsn.indexOf( cls ), 1);
                } else {
                    for( ; i < cls.length; i++ ) {
                        if( ~clsn.indexOf( cls[i] ) && cls[i] ) {
                            clsn.splice(clsn.indexOf( cls[i] ), 1);
                        }
                    }
                }

                elem.className = clsn.join(' ');
            },
            hasClass: function( elem, cls ) {
                var clsn = elem.className,
                    i = 0, flag = false;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];
                cls = ~cls.indexOf(' ') ? cls.split(' ') : [ cls ]

                for( ; i < cls.length; i++ ) {

                    if( ~clsn.indexOf( cls[i] ) ) {
                        flag = true;
                    } else {
                        return false;
                    }
                }

                return flag;
            },
            parents: function( elem, cls ) {
                var self = elem,
                    parent = self.parentNode;


                while( !easy.hasClass( parent, cls ) ) {
                    if(parent.parentNode) {
                        parent = parent.parentNode
                    } else {
                        return null;
                    }
                }

                return parent;
            },
            trigger: function( elem, eventName ) {

                var e;

                if( document.createEvent ) {

                    e = document.createEvent('HTMLEvents');
                    e.initEvent(eventName, false, true);
                    document.dispatchEvent(e);

                } else if( document.createEventObject ) {
                    e = document.createEventObject();
                    elem.fireEvent('on' + eventName, e);
                } else if( typeof elem['on' + eventName] === 'function' ) {
                    elem['on' + eventName]();
                }
            },
            on: function( elem, eventName, handler ) {

                if( !elem ) return;

                if( document.all ) {
                    elem.attachEvent( 'on' + eventName, handler );
                } else {
                    elem.addEventListener( eventName, handler, false );
                }
            },
            off: function( elem, eventName, handler ) {
                if( document.all ) {
                    elem.detachEvent( 'on' + eventName, handler );
                } else {
                    elem.removeEventListener( eventName, handler, false );
                }
            },
            css: function( elem, key, val ) {
                var i;

                if( typeof key === 'string' ) {
                    if( val === undef ) {
                        return currCss( elem, key );
                    } else if( elem.style ) {
                        elem.style[ key ] = correctValue( val, ~key.indexOf('opacity') ? '' : undef );
                    }
                } else if( typeof key === 'object' ) {
                    for( i in key ) {
                        val = key[i];
                        elem.style[ i ] = correctValue( val, ~i.indexOf('opacity') ? '' : undef );
                    }
                }

            },

            offset: function( elem ) {
                var rect = elem.getBoundingClientRect();

                return {
                    top: rect.top + window.pageYOffset,
                    left: rect.left + window.pageXOffset
                }
            },

            trim: function( val ) {
                return val ? val.replace(/^\s+|\s$/, '') : val;
            },

            width: function( elem ) {

                if( elem === window || elem === document ) elem = document.documentElement;

                return elem.clientWidth - ( elem.nodeType === 1 ? parseInt(easy.css( elem, 'padding-right' )) + parseInt(easy.css( elem, 'padding-left' )) + parseInt(easy.css( elem, 'border-right-width' )) + parseInt(easy.css( elem, 'border-left-width' )) : 0 );

            },

            height: function( elem ) {

                if( elem === window || elem === document ) elem = document.documentElement;

                return elem.clientHeight - ( elem.nodeType === 1 ? parseInt(easy.css( elem, 'padding-top' )) + parseInt(easy.css( elem, 'padding-bottom' )) + parseInt(easy.css( elem, 'border-top-width' )) + parseInt(easy.css( elem, 'border-bottom-width' )) : 0 )

            },

            outerWidth: function( elem, flag ) {
                return elem.offsetWidth;
            },

            outerHeight: function( elem, flag ) {
                return elem.offsetHeight;
            },

            attr: function( elem, key, val ) {
                if( val !== undef ) {
                    elem.setAttribute(key, val)
                    return elem;
                }
                return elem.getAttribute(key);
            },

            removeAttr: function( elem, key ) {
                if( key === undef ) return elem;
                elem.removeAttribute(key);
                return elem;
            },

            html: function( elem, html ) {
                if( typeof html !== undef ) {
                    elem.innerHTML = html;
                    return;
                }
                return elem.innerHTML;
            },

            text: function( elem, text ) {
                if( typeof text !== undef ) {
                    elem.innerText = text;
                    return;
                }
                return elem.innerText;
            }

        },


        returnStorage = {},                             // 数据存储区
        resizeStorage = {},                             // 实例位置重置函数存储区
        dragMoveStorage = {},                           // 实例拖拽移动函数存储区
        handlersStorage = {},                           // 实例回调函数存储区
        adjustStorage = {},                             // 实例调整大小函数存储区
        adjustUpStorage = {},                           // 实例调整大小按键离开函数存储区

        supportAnim = 'onanimationend' in window,
        //defaultCallbackHandlerName = [ 'once', 'ready' ],

        dragInit = { x: 0, y: 0 },
        dragCurr = { x: 0, y: 0 },
        dragD = { x: 0, y: 0 },
        dragFlag = false,

        adjustInit = { x: 0, y: 0 },
        adjustCurr = { x: 0, y: 0 },
        adjustD = { x: 0, y: 0 },
        adjustFlag = false,

        triggerResizeEndSpeed = 200,
        tipsTriggerKey = {
            click: 'click',
            hover: [ 'mouseover', 'mouseleave' ]
        };

    // Overlay 构造函数
    function Overlay( options ) {

        var $el = options.el ? document.querySelector(options.el) : '';

        if( $el && $el.overlay && $el.overlay instanceof Overlay ) return $el.overlay


        var self = this,
            defOpts = extend({}, Overlay.defaultOptions, options );

        self.options = defOpts;

        if( !defOpts.el && !('content' in defOpts) && defOpts.content !== null ) return;

        if( !self.options.zIndex && !Overlay.config.zIndex || Overlay.config.zIndex && Overlay.config.zIndex < zIndex || self.options.zIndex && self.options.zIndex < zIndex && !Overlay.config.zIndex) {
            self.options.zIndex = ++zIndex;
        } else if( self.options.zIndex && self.options.zIndex > zIndex && !Overlay.config.zIndex ) {
            zIndex = self.options.zIndex;
        } else if ( Overlay.config.zIndex && Overlay.config.zIndex > zIndex ) {
            self.options.zIndex = zIndex = Overlay.config.zIndex + 1;
        }

        setContainerSizeNumber( self.options, 'width' );
        setContainerSizeNumber( self.options, 'height' );

        if( self.options.offset && typeof self.options.offset.x === 'string' ) {
            setContainerOffsetNumber( self.options, 'x' );
        }

        if( self.options.offset && typeof self.options.offset.y === 'string' ) {
            setContainerOffsetNumber( self.options, 'y' );
        }


        // if( 'defineProperty' in Object ) {
        //     Object.defineProperty( self.options, 'serialNumber', {
        //         value: ++serialNumber,
        //         configurable: true
        //     } );
        // } else {
        //     self.options.serialNumber = ++serialNumber;
        // }

        self.options.serialNumber = ++serialNumber;

        return self.init();
    }

    // Overlay 默认属性
    Overlay.defaultOptions = {
        title: null,                                                                // 标题
        width: null,                                                                // 宽度
        height: null,                                                               // 高度
        minWidth: 200,
        minHeight: 20,
        content: null,                                                              // 被包含的字符串或是地址
        el: null,                                                                   // 被包含的元素
        defOpen: false,
        anim: 'scale',
        position: 'center',
        offset: null,
        drag: true,
        footAlign: 'center',
        close: true,
        bodyClass: null,
        containerClass: null,
        mask: 0.4,
        maskClose: true,
        full: false,
        tips: false,
        originWidth: null,
        originHeight: null,
        resize: true,
        skin: null,
        outBound: false,
        buttons: null,
        tipsSpace: 8
    };

    // Overlay 默认配置
    Overlay.config = {
        urlPattern: urlPattern,                                                     // url正则匹配规则
        duration: 300,                                                              // 动画过程时间
        zIndex: null,
        skin: null,
        defaultCallbackHandlerName: [
            'once',
            'ready',

            'beforeOpen',
            'opened',
            'closed',

            'movestart',
            'moveing',
            'moveend',

            'destroyed',

            'fullBefore',
            'fullAfter',

            'cancelFullBefore',
            'cancelFullAfter',

            'resizeStart',
            'resizing',
            'resizeEnd'

        ],        // 默认的执行回调函数方法

        keyframes: {                                                                // 默认动画配置，可在创建实例前，追加新的动画名称
            fade: {
                enter: {
                    "0%": "opacity: 0;",
                    "100%": "opacity: 1;"
                },
                leave: {
                    "0%": "opacity: 1;",
                    "100%": "opacity: 0;"
                }
            },

            scale: {
                enter: {
                    "0%": "opacity: 0; transform: scale(0.6)",
                    "100%": "opacity: 1; transform: scale(1)"
                },
                leave: {
                    "0%": "opacity: 1; transform: scale(1)",
                    "100%": "opacity: 0; transform: scale(0.6)"
                }
            },

            spring: {
                enter: {
                    "0%": "opacity: 0; transform: scale(0.6)",
                    "70%": "opacity: 0.8; transform: scale(1.05)",
                    "100%": "opacity: 1; transform: scale(1)"
                },
                leave: {
                    "0%": "opacity: 1; transform: scale(1)",
                    "30%": "opacity: 0.8; transform: scale(1.05)",
                    "100%": "opacity: 0; transform: scale(0.6)"
                }
            },

            fadeSlideUp: {
                enter: {
                    "0%": "opacity: 0; transform: translateY(10%)",
                    "100%": "opacity: 1; transform: translateY(0)"
                },
                leave: {
                    "0%": "opacity: 1; transform: translateY(0)",
                    "100%": "opacity: 0; transform: translateY(10%)"
                }
            },

            fadeSlideDown: {
                enter: {
                    "0%": "opacity: 0; transform: translateY(-10%)",
                    "100%": "opacity: 1; transform: translateY(0)"
                },
                leave: {
                    "0%": "opacity: 1; transform: translateY(0)",
                    "100%": "opacity: 0; transform: translateY(-10%)"
                }
            }
        }
    };

    Overlay.prototype.init = function() {

        if( this.eles ) return this;

        var self = this,
            opts = self.options,
            sn = opts.serialNumber,
            eles,
            el, content, $mask,
            $el, $container,
            config, animClassName;

        if( !(sn in handlersStorage) ) {
            handlersStorage[ sn ] = {};
        }

        if( !self.ready ) self.defaultCallbackInit();
        if( supportAnim && !document.querySelector('#overlay-keyframes') ) keyFramesInit.call( self );

        if( !opts.animClass && supportAnim ) {
            config = Overlay.config;
            opts.animClass = {};

            opts.animClass.enter = 'overlay-' + config.anim[opts.anim].enter;
            opts.animClass.leave = 'overlay-' + config.anim[opts.anim].leave;
        }

        if( !('eles' in self) ) self.eles = {};
        eles = self.eles;

        if( easy.type(opts.mask) === 'number' || numPattern.test(opts.mask) ) $mask = self.maskInit();

        el = opts.el;
        content = opts.content;

        if( el ) {
            // 找到核心元素 并将遮罩层插入到dom节点中
            eles.el = $el = easy.type( el ) === 'string' ? document.querySelector(el) : el;

            if( $mask ) $el.parentNode.insertBefore( $mask, $el );


        } else if( typeof content === 'string' ) {
            if( $mask ) docBody.appendChild($mask);

            // 如果没有指定dom 则使用渲染内容的形式
            eles.el = $el = self.elInit();
        }

        // 将实例绑到dom对象上，方便查找调用
        $el.$overlay = self;

        if( easy.css( $el, 'display' ) === 'none' ) {
            easy.css( $el, 'display', 'block' );
        }

        // 创建包含元素，将核心元素放到包含元素内
        $container = self.containerInit();

        $el.parentNode.insertBefore( $container, $el );
        if( opts.title ) {
            $container.appendChild( self.headerInit() );
        }
        $container.appendChild( self.bodyInit() );
        if( opts.buttons ) {
            $container.appendChild( self.footerInit() );
        }

        if( opts.resize && !opts.tips ) $container.appendChild( self.resizeInit() );

        if( opts.tips ) $container.appendChild( self.arrowInit() );

        if( eles.el.tagName.toLowerCase() === 'iframe' ) easy.addClass(eles.body, 'overlay-iframe loading');

        // 根据配置，操作 header内的元素
        if( opts.title ) {
            eles.title.innerText = opts.title;
        }
        //  else {
        //     easy.css( eles.header, 'display', 'none' );
        // }

        // if( !opts.footer ) {
        //     easy.css( eles.footer, 'display', 'none' );
        // }

        if( !opts.close && opts.title ) easy.css( eles.close, 'display', 'none' );

        if( !opts.full && opts.title ) easy.css( eles.full, 'display', 'none' );

        // 根据配置，操作footer内的元素
        if( opts.buttons && typeof opts.buttons === 'object' ) {
            this.parseButtons();
        }

        // 初始化事件
        self.eventInit();

        // 如果默认初始化就打开，则执行open方法
        if( opts.defOpen ) self.open();

        return self;
    };



    // 初始化内置回调方法
    Overlay.prototype.defaultCallbackInit = function() {
        var self = this,
            opts = self.options,
            sn = self.options.serialNumber,
            hasUrl = Overlay.config.urlPattern.test(opts.content),
            dchn = Overlay.config.defaultCallbackHandlerName,
            dchni = 0;

        // 将默认的回调方法输出
        for( ; dchni < dchn.length; dchni++ ) {
            (function( hn, sn ) {

                if( hn in self ) return;

                self[hn] = function( fn ) {

                    var self = this,
                        opts = self.options,
                        handlers = handlersStorage[ sn ];

                    if( !(hn in handlers) ) handlers[ hn ] = [];

                    // once 在打开界面后，执行一次即可
                    if( hn === 'once' && handlers[ hn ].length === 1 || typeof fn !== 'function' ) return self;

                    handlers[ hn ].push(fn);

                    // 如果是静态元素或是普通自符串，并且执行方法是ready的话，直接调用函数即可实现ready方法
                    if( ( self.options.el || !hasUrl ) && hn === 'ready' ) {
                        triggerEventHandler.call( self, 'ready', null, null, handlers[ hn ].length - 1 );
                    }

                    return self;
                };

                //consoe
            })( dchn[dchni], sn );

        }

    }

    // 初始化遮罩
    Overlay.prototype.maskInit = function() {
        var self = this,
            opts = self.options,
            $mask;

        $mask = document.createElement('div');
        self.eles.mask = $mask;
        easy.addClass( $mask, 'overlay-mask' );

        easy.css( $mask, 'opacity', opts.mask );
        easy.css( $mask, 'filter', 'alpha(opacity=' + ( opts.mask * 100 ) + ')' );

        return $mask;
    };

    // 在元素 el 未有的情况下，初始化 el
    Overlay.prototype.elInit = function() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            $el, loadedCallback,
            name = 'overlay-frame-' + opts.serialNumber,
            hasUrl = opts.content.match(opts.urlPattern || Overlay.config.urlPattern);

        // 如果 content 是链接，则装入iframe中
        if( hasUrl && hasUrl.length && hasUrl[0] ) {
            $el = document.createElement('iframe');
            $el.setAttribute('name', name);
            $el.setAttribute('id', name);
            $el.src = opts.content;

            elemsBindEvent.call( self, $el, 'ready', 'load', function() {

                self.iframeWindow = window.frames[name];
                easy.removeClass(eles.body, 'loading');
                elemsUnbindEvent.call( self, $el, 'load' );
            } );

        } else {
            $el = document.createElement('div');
            easy.addClass( $el, 'overlay-custom-wrapper' );
            // $el.className += 'overlay-custom-wrapper';
            $el.innerHTML = opts.content;
        }

        docBody.appendChild($el);

        return $el;
    };

    // 初始化外包含
    Overlay.prototype.containerInit = function() {
        var self = this,
            opts = self.options,
            $container = document.createElement('div'),
            config = Overlay.config;

        self.eles.container = $container;
        easy.addClass( $container, 'overlay-container' + ( opts.containerClass ? ( ' ' + opts.containerClass ) : '' ) );

        easy.addClass( $container, opts.skin || config.skin );
        // $container.className += 'overlay-container';

        return $container;
    };

    // 初始化头部
    Overlay.prototype.headerInit = function() {
        var self = this,
            opts = self.options,
            $header = document.createElement('div'),
            $title = document.createElement('span'),
            $close = document.createElement('a'),
            $full = document.createElement('a'),
            $tool = document.createElement('div');

        self.eles.header = $header;
        easy.addClass( $header, 'overlay-header' );
        // $header.className += 'overlay-header';

        self.eles.title = $title;
        easy.addClass( $title, 'overlay-title' );
        // $title.className += 'overlay-title';

        self.eles.tool = $tool;
        easy.addClass( $tool, 'overlay-head-tool' );

        self.eles.full = $full;
        easy.addClass( $full, 'overlay-full-btn' );
        $tool.appendChild( $full );

        self.eles.close = $close;
        easy.addClass( $close, 'overlay-close-btn' );
        $tool.appendChild( $close );

        $header.appendChild( $title );
        $header.appendChild( $tool );

        return $header;
    };

    // 初始化内容包围
    Overlay.prototype.bodyInit = function() {
        var self = this,
            opts = self.options,
            $body = document.createElement('div');

        self.eles.body = $body;
        easy.addClass( $body, 'overlay-body' + ( opts.bodyClass ? ( ' ' + opts.bodyClass ) : '' ) );
        // $body.className += 'overlay-body';

        $body.appendChild( self.eles.el );

        return $body;
    };

    // 初始化底部
    Overlay.prototype.footerInit = function() {
        var self = this,
            opts = self.options,
            $footer = document.createElement('div'),
            $title = document.createElement('div');

        self.eles.footer = $footer;
        easy.addClass( $footer, 'overlay-footer overlay-footer-' + ( opts.footAlign ) );
        if( !opts.buttons ) {
            easy.css( $footer, 'display', 'none' );
        }

        return $footer;
    };

    Overlay.prototype.resizeInit = function() {
        var self = this,
            opts = self.options,
            $resize = document.createElement('a');

        self.eles.resize = $resize;
        easy.addClass( $resize, 'overlay-resize-btn');

        return $resize;
    };

    Overlay.prototype.arrowInit = function() {
        var self = this,
            opts = self.options,
            $arrow = document.createElement('span');

        self.eles.resize = $arrow;
        easy.addClass( $arrow, 'overlay-tips-arrow');

        return $arrow;
    };

    //.overlay-tips-arrow

    // 初始化按钮
    Overlay.prototype.buttonInit = function( className, fnName, text, i ) {
        var self = this,
            opts = self.options,
            btn = document.createElement('a');

        btn.appendChild( document.createTextNode(text) );

        easy.addClass( btn, 'overlay-btn overlay-btn-' + i + ( className.length ? (' ' + className.join(' ')) : '' ) );

        self.eles[fnName] = btn;

        return btn;
    };


    // 解析按钮
    Overlay.prototype.parseButtons = function() {
        var self = this,
            opts = self.options,
            sn = opts.serialNumber,
            handlers = handlersStorage[ sn ],
            buttons = opts.buttons,
            key, fnName, className, text, i = 0,
            $btn, group;

        if( !self.buttonsGroup ) self.buttonsGroup = {};

        for( key in buttons ) {
            className = ~key.indexOf('.') ? key.split('.') : [ key ];
            text = buttons[key];
            fnName = className.splice(0, 1)[0];

            if( !(fnName in handlers) ) {
                handlers[ fnName ] = [];
            }

            (function( fnName ) {
                self[ fnName ] = function( fn ) {

                    if( typeof fn === 'function' ) handlers[ fnName ].push(fn);

                    return self;
                }
            })( fnName, group );

            $btn = self.eles.footer.appendChild( self.buttonInit( className, fnName, text, i++ ) );
            self.buttonsGroup[ fnName ] = $btn;
        }

        return self;
    };


    // 事件初始化
    Overlay.prototype.eventInit = function() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            btnGroup = self.buttonsGroup,
            fnName, fnGroup,
            $btn;

        // 将初始化好的按钮绑定事件
        for( fnName in btnGroup ) {
            $btn = btnGroup[fnName];
            elemsBindEvent.call( self, $btn, fnName );
        }

        // 监听窗口动画事件
        if( supportAnim ) {
            easy.on( eles.container, 'webkitAnimationEnd', animationEndHandler.bind(self) );
            easy.on( eles.container, 'animationend', animationEndHandler.bind(self) );
        }

        if( opts.close ) {
            easy.on( eles.close, 'click', closeHandler.bind( self ) );
        }

        if( opts.full ) {
            easy.on( eles.full, 'click', fullHandler.bind( self ) );
        }

        if( opts.maskClose && eles.mask ) {
            easy.on( eles.mask, 'click', closeHandler.bind( self ) );
        }

        if( opts.drag ) {
            easy.on( eles.header, 'mousedown', dragDownOrUpHandler.bind( self ) );

            dragMoveStorage[ opts.serialNumber ] = function( e ) {
                if( !dragFlag ) return;
                var opts = self.options,
                    eles = self.eles,
                    windowWidth, windowHeight,
                    cWidth, cHeight,
                    setX = e.clientX - dragD.x,
                    setY = e.clientY - dragD.y;


                if( !opts.outBound ) {
                    windowWidth = easy.width( window );
                    windowHeight = easy.height( window );
                    cWidth = easy.outerWidth( eles.container );
                    cHeight = easy.outerHeight( eles.container );

                    setX = setX < 0 ? 0 : setX + cWidth > windowWidth ? windowWidth - cWidth : setX;
                    setY = setY < 0 ? 0 : setY + cHeight > windowHeight ? windowHeight - cHeight : setY;

                }

                easy.css( eles.container, 'top', setY + 'px' );
                easy.css( eles.container, 'left', setX + 'px' );

                triggerEventHandler.call( self, 'moveing' );

            }

            easy.on( eles.header, 'mouseup', dragDownOrUpHandler.bind( self ) );

        } else {
            easy.addClass( eles.header, 'not-drag' );
        }

        if( opts.resize ) {
            easy.on( eles.resize, 'mousedown', adjustDownHandler.bind( self ) );

            adjustStorage[ opts.serialNumber ] = function( e ) {
                if( !adjustFlag ) return;
                var opts = self.options,
                    eles = self.eles;

                e = e || window.event;

                if( opts.originWidth === null ) opts.originWidth = opts.width;
                if( opts.originHeight === null ) opts.originHeight = opts.height;

                opts.width = adjustD.x + ( e.clientX - eles.container.offsetLeft );
                opts.height = adjustD.y + ( e.clientY - eles.container.offsetTop );

                setSize.call( self );

                triggerEventHandler.call( self, 'resizing' );

            }

            adjustUpStorage[ opts.serialNumber ] = function() {

                triggerEventHandler.call( self, 'moveend' );

                adjustFlag = 0;
            };

        }

        return self;
    };


    // 打开窗口方法
    Overlay.prototype.open = function() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            config = Overlay.config;

        if( eles.mask ) easy.addClass( eles.mask, 'open');

        if( easy.hasClass( eles.container, 'open') ) return self;

        if( supportAnim ) {
            easy.addClass( eles.container, 'open overlay-anim ' + opts.animClass.enter);
            setTimeout(function() {
                if( opts.defFull ) self.full();
                triggerEventHandler.call( self, 'once' );
                triggerEventHandler.call( self, 'beforeOpen' );
            }, 0);
        } else {
            easy.addClass( eles.container, 'open');
            setTimeout(function() {
                if( opts.defFull ) self.full();
                triggerEventHandler.call( self, 'once' );
                triggerEventHandler.call( self, 'beforeOpen' );
                triggerEventHandler.call( self, 'opened' );
            }, 0);

        }

        if( !opts.defFull ) {
            setStyle.call( self );
        } else {
            setZIndex.call( self );
        }


        return self;
    };

    // 关闭窗口方法
    Overlay.prototype.close = function() {
        var self = this,
            opts = self.options,
            eles = self.eles;

        if( !easy.hasClass( eles.container, 'open') ) return self;

        if( eles.mask ) easy.removeClass( eles.mask, 'open');

        if( supportAnim ) {
            easy.addClass( eles.container, opts.animClass.leave);
        } else {
            easy.removeClass( eles.container, 'open');
            triggerEventHandler.call( self, 'closed' );
            if( opts.closedDestroy ) self.destroy();
        }

        return self;
    };

    // 窗口全屏方法
    Overlay.prototype.full = function() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            windowWidth = easy.width( window ),
            windowHeight = easy.height( window ),
            containerWidth = easy.width( eles.container ),
            containerHeight = easy.height( eles.container );

        if( easy.hasClass( eles.full, 'fullscreen' ) || !opts.full || !easy.hasClass( self.eles.container, 'open' ) ) return self;

        triggerEventHandler.call( self, 'fullBefore' );

        if( !opts.originWidth ) opts.originWidth = containerWidth;
        if( !opts.originHeight ) opts.originHeight = containerHeight;

        opts.width = windowWidth;
        opts.height = windowHeight;

        setSize.call( self );
        setOffset.call( self );

        easy.addClass( eles.full, 'fullscreen' );

        triggerEventHandler.call( self, 'fullAfter' );

        return self;
    };

    // 取消全屏方法
    Overlay.prototype.cancelFull = function() {
        var self = this,
            opts = self.options,
            eles = self.eles;


        if( !easy.hasClass( eles.full, 'fullscreen' ) || !opts.full || !easy.hasClass( self.eles.container, 'open' ) ) return self;

        triggerEventHandler.call( self, 'cancelFullBefore' );

        easy.removeClass( eles.full, 'fullscreen' );

        self.restore();

        setOffset.call( self );

        triggerEventHandler.call( self, 'cancelFullAfter' );

        return self;
    }


    // 恢复初始宽度与高度
    Overlay.prototype.restore = function() {
        var self = this,
            opts = self.options;

        if( ( opts.originWidth === null && opts.originHeight === null && 'originOffset' in opts && opts.originOffset.x === null && opts.originOffset.y === null && !resizeStorage[ '_' + opts.serialNumber ] ) || !easy.hasClass( self.eles.container, 'open' ) || easy.hasClass( self.eles.full, 'fullscreen' ) ) return self;

        if( opts.originWidth !== null ) {
            opts.width = opts.originWidth;
            opts.originWidth = null;
        }

        if( opts.originHeight !== null ) {
            opts.height = opts.originHeight;
            opts.originHeight = null;
        }

        if( opts.originOffset && opts.originOffset.x !== null ) {
            opts.offset.x = opts.originOffset.x;
            opts.originOffset.x = null;
        }

        if( opts.originOffset && opts.originOffset.y !== null ) {
            opts.offset.y = opts.originOffset.y;
            opts.originOffset.y = null;
        }

        if( resizeStorage[ '_' + opts.serialNumber ] ) {
            resizeStorage[ opts.serialNumber ] = resizeStorage[ '_' + opts.serialNumber ];
            delete resizeStorage[ '_' + opts.serialNumber ];
            if( !opts.originOffset || opts.originOffset.x === null && opts.originOffset.y === null ) opts.offset = null;
        }

        if( typeof opts.width !== 'function' && typeof opts.height !== 'function' ) setSize.call( self );
        setOffset.call( self );

        return self;
    }

    // 设置窗口尺寸
    Overlay.prototype.setSize = function( obj ) {
        var self = this,
            opts = self.options,
            width, height;

        if( !obj.width && !obj.height ) return self;

        if( obj.width && opts.originWidth === null ) opts.originWidth = opts.width;
        if( obj.height && opts.originHeight === null ) opts.originHeight = opts.height;

        if( obj.width ) {
            opts.width = obj.width;
            if( typeof opts.width === 'string' ) setContainerSizeNumber( opts, 'width' );
        }

        if( obj.height ) {
            opts.height = obj.height;
            if( typeof opts.height === 'string' ) setContainerSizeNumber( opts, 'height' );
        }

        if( !easy.hasClass( self.eles.container, 'open' ) ) return self;

        if( typeof opts.width !== 'function' && typeof opts.height !== 'function' ) setSize.call( self );
        setOffset.call( self );

        return self;
    };

    // 设置窗口尺寸
    Overlay.prototype.setOffset = function( obj ) {
        var self = this,
            opts = self.options,
            eles = self.eles,
            x, y;

        if( !obj.x && !obj.y ) return self;

        if( !( 'originOffset' in opts ) ) {
            opts.originOffset = {
                x: null,
                y: null
            }
        }

        if( obj.x && opts.offset && !resizeStorage[ '_' + opts.serialNumber ] && opts.originOffset.x === null ) opts.originOffset.x = opts.offset.x;
        if( obj.y && opts.offset && !resizeStorage[ '_' + opts.serialNumber ] && opts.originOffset.y === null ) opts.originOffset.y = opts.offset.y;

        if( opts.offset === null ) opts.offset = {};

        if( obj.x ) {
            opts.offset.x = obj.x;
            if( typeof opts.offset.x === 'string' ) setContainerOffsetNumber( opts, 'x' );
        }

        if( obj.y ) {
            opts.offset.y = obj.y;
            if( typeof opts.offset.y === 'string' ) setContainerOffsetNumber( opts, 'y' );
        }

        if( typeof opts.offset.x === 'function' || percentPattern.test(opts.offset.x) || typeof opts.offset.y === 'function' || percentPattern.test(opts.offset.y) ) {

            if( !resizeStorage[ '_' + opts.serialNumber ] ) {
                resizeStorage[ '_' + opts.serialNumber ] = resizeStorage[ opts.serialNumber ];
                delete resizeStorage[ opts.serialNumber ];
            }

            resizeStorage[ opts.serialNumber ] = function() {

                if( !easy.hasClass( eles.container, 'open' ) ) return self;

                x = typeof opts.offset.x === 'function' ? opts.offset.x.call( self ) : ( opts.offset.x || 0 );
                y = typeof opts.offset.y === 'function' ? opts.offset.y.call( self ) : ( opts.offset.y || 0 );

                easy.css( eles.container, {
                    top: y,
                    left: x
                } );
            }
        }

        // if( !easy.hasClass( self.eles.container, 'open' ) ) return self;
        setOffset.call( self );

        return self;
    };

    // 将弹出框置顶
    Overlay.prototype.setTop = function() {
        var self = this,
            opts = self.options;

        if( opts.zIndex < zIndex ) opts.zIndex = ++zIndex;

        if( !easy.hasClass( self.eles.container, 'open' ) ) return self;

        setZIndex.call( self );

        return self;
    }

    // 设置显示内容
    Overlay.prototype.setContent = function( content ) {
        var self = this,
            opts = self.options,
            eles = self.eles;

        easy.html( eles.el, content );

        return self;
    }


    // 解绑事件回调函数
    Overlay.prototype.off = function( key ) {
        var self = this,
            opts = self.options,
            sn = opts.serialNumber,
            handlers = handlersStorage[ sn ],
            handler,
            i, j;

        if( typeof key !== 'string' && typeof key !== 'function' || ( handlers[ key ] && !handlers[ key ].length ) ) return self;

        if( typeof key === 'function' ) {
            for( i in handlers ) {
                if( handlers[ i ] && handlers[ i ].length && ~handlers[ i ].indexOf( key ) ) {
                    handlers[ i ].splice( handlers[ i ].indexOf( key ), 1 );
                }
            }
            return self;
        }

        handlers[ key ].splice( 0, handlers[ key ].length );
        return self;
    }


    // 将需要存的值存到当前对象内 可以在回调方法内被取到
    Overlay.prototype.push = function( key, val ) {
        var self = this,
            sn = self.options.serialNumber;

        if( key === undef && val === undef ) return self;

        if( key && val === undef ) {
            val = key;
            returnStorage[ sn ] = val;
        } else if( key && val !== undef ) {
            if( !returnStorage[ sn ] ) returnStorage[ sn ] = {};
            returnStorage[ sn ][ key ] = val;
        }

        return self;
    }

    // 将存储的值拿出来
    Overlay.prototype.pull = function( key ) {
        var self = this,
            sn = self.options.serialNumber;

        return key ? returnStorage[ sn ][ key ] : returnStorage[ sn ];
    }


    // 组件销毁
    Overlay.prototype.destroy = function() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            sn = opts.serialNumber,
            handlers = handlersStorage[sn],
            i,
            dchn = Overlay.config.defaultCallbackHandlerName;

        triggerEventHandler.call( self, 'destroyed' );

        delete returnStorage[ sn ]; // 移除存储的当前实例的数据
        delete resizeStorage[ sn ]; // 移除存储的当前实例的重置函数
        delete dragMoveStorage[ sn ]; // 移除存储的当前实例的拖拽函数
        delete adjustStorage[ sn ]; // 移除存储的当前实例的调整函数
        delete adjustUpStorage[ sn ]; // 移除存储的当前调整大小按键离开函数存储区

        // 移除按钮集合内的dom节点与对象
        for( i in self.buttonsGroup ) {
            if( self.buttonsGroup[i] ) {
                self.buttonsGroup[i].parentNode.removeChild( self.buttonsGroup[i] );
                delete self.buttonsGroup[i];
            }
        }
        // 移除按钮集合对象
        delete self.buttonsGroup;

        // 解除对实例的引用
        delete eles.el.$overlay;

        // 判断el是否为原本就存在的dom节点，是的话，则还原到原来的位置
        if( opts.el ) {
            eles.container.parentNode.insertBefore( eles.el, eles.container );
            easy.removeAttr( eles.el, 'style' );
        }

        // 解除对主元素的引用
        delete eles.el;

        // 将所有实例创建的dom节点移除
        for( i in eles ) {
            if( eles[i] && eles[i].parentNode ) {
                eles[i].parentNode.removeChild( eles[i] );
                delete eles[i];
            }
        }
        // 删除元素集合对象
        delete self.eles;

        // 移除所有实例监听的事件函数
        for( i in handlers ) {
            if( self[i] ) {
                delete handlers[i];
                delete self[i];
            }
        }
        // 移除事件存储对象内对应的存储对象
        delete handlersStorage[sn];

        // 移除所有存储的数据
        delete returnStorage[sn];

        // 移除内置回调函数对象
        for( i = 0; i < dchn.length; i++ ) {
            if( self[ dchn[i] ] ) {
                delete self[ dchn[i] ];
            }
        }

        if( self.iframeWindow ) delete self.iframeWindow;

        // 移除dom节点存储对象
        delete self.eles;

        // 移除options对象
        delete self.options;

        return self;
    };


    ////////
    //////// 常用类型弹出框代码块
    ////////

    Overlay.alert = function( options ) {

        if( !options ) options = {};

        return new Overlay(extend( true, {
            title: '提示',
            content: '',
            closedDestroy: true,
            close: false,
            defOpen: true,
            width: 280,
            bodyClass: 'overlay-alert-body',
            maskClose: false,
            buttons: {
                'enter.enter-btn': '确定'
            }
        }, options )).enter(function() {
            this.close();
        });
    };

    Overlay.confirm = function( options ) {

        if( !options ) options = {};

        return new Overlay(extend( true, {
            title: '提示',
            content: '',
            closedDestroy: true,
            close: false,
            defOpen: true,
            width: 280,
            maskClose: false,
            bodyClass: 'overlay-confirm-body',
            buttons: {
                'enter.enter-btn': '确定',
                'cancel.cancel-btn': '取消'
            }
        }, options )).cancel(function() {
            this.close();
        });
    };


    Overlay.tips = function( options ) {
        if( !options.tips ) return;

        var el,
            $els,
            tipsOptions = {
                position: 't',
                containerClass: 'overlay-tips-container',
                closedDestroy: true,
                close: false,
                defOpen: false,
                minWidth: 0,
                mask: false,
                bodyClass: 'overlay-tips-body',
                trigger: 'hover'
            },
            content,
            key, attr,
            matchResult,
            i, tips;

        if( options.el && 'content' in options ) delete options.el;

        if( options.tips && !('trigger' in options) ) {
            el = options.tips;
            $els = toArr( document.querySelectorAll(el), 0 );
        }

        // 查看内容是否是属性还是普通文本
        if( getContentPattern.test( options.content ) ) {
            matchResult = options.content.match(getContentPattern);
            key = matchResult[1];
            attr = matchResult[2];

            options.content = '';
        }

        // 如果不需要触发事件，则返回一个实例
        // options.trigger in tipsTriggerKey
        if( 'trigger' in options && !options.trigger ) {
            tipsOptions.closedDestroy = false;
            options.tips = document.querySelector(options.tips);

            tips = new Overlay(extend( true, {}, tipsOptions, options ));

            return tips;
        }

        if( $els.length ) {

            easy.each( $els, function( i ) {
                var tips;

                if( this.$overlay && this.$overlay instanceof Overlay ) return true;

                easy.on( this, 'mouseover', function() {
                    if( ( options.closedDestroy && tipsOptions.closedDestroy || !('closedDestroy' in options) && tipsOptions.closedDestroy ) || easy.type( options.closedDestroy ) === 'boolean' && !options.closedDestroy && !tips ) {
                        tips = new Overlay(extend( true, {}, tipsOptions, options, { tips: this } ));

                        if( key || tips.options.content ) tips.setContent( key ? easy[ key ]( this, attr ) : options.content );
                    }

                    tips.open();
                } );

                easy.on( this, 'mouseout', function() {
                    tips.close();

                    if( tips.closedDestroy ) tips = null;

                } );
            } );
        }

        if( options.title ) delete options.title;
        if( options.buttons ) delete options.buttons;

    }


    ////////
    ////////  事件绑定与监听事件函数代码块
    ////////

    // 为元素绑定事件
    function elemsBindEvent( $elem, handlerName, eventName, callback ) {
        var self = this,
            i = 0, j = i;

        if( typeof eventName === 'function' ) {
            callback = eventName;
            eventName = 'click';
        }

        if( eventName === undef ) eventName = 'click';
        if( typeof eventName === 'string' ) eventName = [ eventName ];
        if( typeof handlerName === 'string' ) handlerName = [ handlerName ];


        for( ; i < eventName.length; i++ ) {
            for( ; j < handlerName.length; j++ ) {
                easy.on( $elem, eventName[i], triggerEventHandler.bind( self, handlerName[j], callback ) );
            }
        }

        return self;
    }

    // 为元素移除事件
    function elemsUnbindEvent( $elem, eventName ) {
        var self = this;

        eventName = eventName ? eventName : 'click';
        $elem.removeEventListener(eventName, triggerEventHandler, false );

        return self;
    }

    // 所有调用方法的回调，全部在这里被执行
    function triggerEventHandler( handlerName, callback, e, i ) {
        var self = this,
            opts = self.options,
            sn = opts.serialNumber,
            handlers = handlersStorage[ sn ][ handlerName ],
            onceFlag,
            returnTemp, i = 0, j;


        e = e || window.event;
        if( !e ) e = {};

        e.handlerName = handlerName;

        if( !handlers || !handlers.length ) {
            typeof callback === 'function' && callback();
            return;
        };

        // 循环已经装载好的所有可执行回调函数
        for( ; i < handlers.length; i++ ) {
            returnStorage[ sn ] = handlers[ i ].call(
                self,
                e,
                returnStorage[ sn ] ? returnStorage[ sn ] : undef
            ) || returnStorage[ sn ];
        }

        if( handlerName === 'once' ) {
            handlersStorage[ sn ][ handlerName ] = null;
        }
        // 执行补充的回调函数

        typeof callback === 'function' && callback();
        return self;
    }

    function triggerResizeEndHandler( triggerHandler, self, handlerName ) {
        triggerHandler.call( self, handlerName );
    }


    // 支持css延时动画的，会在这里执行
    function animationEndHandler( e ) {
        var self = this,
            opts = self.options,
            eles = self.eles;

        // e = window.event || e;

        if( e.target !== eles.container ) return;

        if( easy.hasClass( eles.container, opts.animClass.enter ) && !easy.hasClass( eles.container, opts.animClass.leave ) ) {
            triggerEventHandler.call( self, 'opened' );
            easy.removeClass( eles.container, opts.animClass.enter);
        } else if( easy.hasClass( eles.container, opts.animClass.leave ) ) {
            triggerEventHandler.call( self, 'closed' );
            easy.removeClass( eles.container, opts.animClass.leave + ' open');
            if( eles.mask ) easy.removeClass( eles.mask, 'open');
            if( opts.closedDestroy ) self.destroy();
        }

    }

    // 关闭事件监听函数
    function closeHandler() {
        this.close();
    }

    // 全屏事件监听函数
    function fullHandler() {
        var self = this,
            eles = self.eles;

        if( easy.hasClass( eles.full, 'fullscreen' ) ) {
            return self.cancelFull();;
        }

        return self.full();;
    }

    // 拖拽事件监听函数
    function dragDownOrUpHandler( e ) {
        var self = this,
            opts = self.options,
            eles = self.eles,
            target;

        e = e || window.event;

        target = e.target || e.srcElement;
        // mousedown

        if( target !== eles.title && target !== eles.header ) return;

        if( e.type === 'mousedown' ) {

            triggerEventHandler.call( self, 'movestart' );

            dragInit.x = e.clientX;
            dragInit.y = e.clientY;
            dragCurr.x = eles.container.offsetLeft;
            dragCurr.y = eles.container.offsetTop;
            dragD.x = dragInit.x - dragCurr.x;
            dragD.y = dragInit.y - dragCurr.y;

            if( ( !( 'originOffset' in opts ) || ( !opts.originOffset.x && !opts.originOffset.y ) ) && opts.offset ) {

                if( !( 'originOffset' in opts ) ) opts.originOffset = {};

                opts.originOffset.x = opts.offset.x;
                opts.originOffset.y = opts.offset.y;
            }

            dragFlag = opts.serialNumber;

            return self;
        }

        triggerEventHandler.call( self, 'moveend' );

        dragFlag = 0;
        // mouseup

        return self;
    }

    // 实例调整大小事件监听函数
    function adjustDownHandler( e ) {
        var self = this,
            opts = self.options,
            eles = self.eles,
            target,
            rect;

        e = e || window.event;

        target = e.target || e.srcElement;

        if( e.type === 'mousedown' ) {

            triggerEventHandler.call( self, 'resizestart' );

            adjustInit.x = e.clientX;
            adjustInit.y = e.clientY;

            rect = eles.resize.getBoundingClientRect();

            adjustCurr.x = rect.left;
            adjustCurr.y = rect.top;

            adjustD.x = ( !( 'width' in rect ) ? easy.width( eles.resize ) : rect.width ) - ( adjustInit.x - adjustCurr.x );
            adjustD.y = ( !( 'height' in rect ) ? easy.height( eles.resize ) : rect.height ) - ( adjustInit.y - adjustCurr.y );

            adjustFlag = opts.serialNumber;

            return self;
        }

        triggerEventHandler.call( self, 'resizeend' );

        adjustFlag = 0;
        // mouseup

        return self;
    }


    ////////
    ////////  设置组件样式代码块
    ////////

    // 设置弹出框位置
    function setStyle() {
        var self = this,
            opts = self.options;

        setZIndex.call( self );
        if( typeof opts.width !== 'function' && typeof opts.height !== 'function' ) setSize.call( self );
        setOffset.call( self );

    }

    // 设置 z-index 层顺序
    function setZIndex() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            mask = eles.mask,
            container = eles.container,
            cStyle = container.style;

        if( mask ) easy.css( mask, 'z-index', opts.zIndex );
        easy.css( container, 'z-index', opts.zIndex );

    }

    // 设置组件位置
    function setOffset() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            position = opts.position,
            container = self.eles.container,
            windowWidth = easy.width( window ),
            windowHeight = easy.height( window ),
            resizeEndTimer = null,
            x = opts.offset && typeof opts.offset.x === 'function' ? opts.offset.x.call( self ) : opts.offset ? opts.offset.x : null,
            y = opts.offset && typeof opts.offset.y === 'function' ? opts.offset.y.call( self ) : opts.offset ? opts.offset.y : null,
            tipsOffset,
            scrollTop;

        if( opts.offset && x && y && !opts.tips ) {
            if( (typeof opts.offset.x === 'function' || typeof opts.offset.y === 'function') && !resizeStorage[ opts.serialNumber ] ) {

                resizeStorage[ opts.serialNumber ] = function() {

                    if( !easy.hasClass( container, 'open' ) ) return self;

                    x = typeof opts.offset.x === 'function' ? opts.offset.x.call( self ) : opts.offset.x;
                    y = typeof opts.offset.y === 'function' ? opts.offset.y.call( self ) : opts.offset.y;
                    easy.css( container, {
                        top: y,
                        left: x
                    } );
                }

            } else {
                easy.css( container, {
                    top: y,
                    left: x
                } );
            }


        } else if( opts.tips ) { // 判断是否是提示组件

            if( !easy.hasClass( container, 'open' ) || !opts.tips ) return;

            tipsOffset = easy.offset( opts.tips );

            x = tipsOffset.left;
            y = tipsOffset.top;

            scrollTop = window.scrollTop;

            switch( position ) {
                case 'top':
                case 't':
                //
                easy.css( container, {
                    top: y - easy.height( container ) - opts.tipsSpace,
                    left: x
                } );
                break;

                case 'right':
                case 'r':
                //
                easy.css( container, {
                    top: y,
                    left: x + easy.width( opts.tips ) + opts.tipsSpace
                } );

                break;

                case 'bottom':
                case 'b':
                //
                easy.css( container, {
                    top: y + easy.height( opts.tips ) + opts.tipsSpace,
                    left: x
                } );

                break;

                case 'left':
                case 'l':
                //
                easy.css( container, {
                    top: y,
                    left: x - easy.width( container ) - opts.tipsSpace
                } );

                break;

                default:
                //
                if( easy.type(position) !== 'function' ) {
                    easy.css( container, {
                        top: y - easy.height( opts.tips ) - tipsSpace,
                        left: x
                    } );
                } else {
                    position.call( self, opts.tips, container );
                }
            }

        } else if( 'position' in opts && !(opts.serialNumber in resizeStorage) ) {

            resizeStorage[ opts.serialNumber ] = function() {

                if( !easy.hasClass( container, 'open' ) ) return;

                windowWidth = easy.width( window );
                windowHeight = easy.height( window );

                // 如果是全屏，则重置弹出窗口的尺寸
                if( opts.title && easy.hasClass( eles.full, 'fullscreen' ) && opts.full ) {
                    opts.width = windowWidth;
                    opts.height = windowHeight;
                    setSize.call( self );
                    triggerEventHandler.call( self, 'resizing' );

                    clearTimeout( resizeEndTimer );
                    resizeEndTimer = setTimeout(triggerResizeEndHandler, triggerResizeEndSpeed, triggerEventHandler, self, 'resizeEnd');

                } else if( typeof opts.width === 'function' || typeof opts.height === 'function' ) {

                    setSize.call( self );
                }

                switch( position ) {
                    case 'center' :
                    case 'c' :
                    //
                    easy.css( container, {
                        top: ( windowHeight - easy.height(container) ) / 2,
                        left: ( windowWidth - easy.width(container) ) / 2
                    } );

                    break;

                    case 'top-left' :
                    case 'tl' :
                    case 't-l' :
                    case 'left-top' :
                    case 'lt' :
                    case 'l-t' :
                    //
                    easy.css( container, {
                        top: 0,
                        left: 0
                    } );
                    break;

                    case 'top-center' :
                    case 'tc' :
                    case 't-c' :
                    case 'center-top' :
                    case 'ct' :
                    case 'c-t' :
                    //
                    easy.css( container, {
                        top: 0,
                        left: ( windowWidth - easy.width(container) ) / 2
                    } );
                    break;

                    case 'top-right' :
                    case 'tr' :
                    case 't-r' :
                    case 'right-top' :
                    case 'rt' :
                    case 'r-t' :
                    //
                    easy.css( container, {
                        top: 0,
                        left: ( windowWidth - easy.width(container) )
                    } );
                    break;

                    case 'center-right' :
                    case 'cr' :
                    case 'c-r' :
                    case 'right-center' :
                    case 'rc' :
                    case 'r-c' :
                    //
                    easy.css( container, {
                        top: ( windowHeight - easy.height(container) ) / 2,
                        left: ( windowWidth - easy.width(container) )
                    } );
                    break;

                    case 'bottom-right' :
                    case 'br' :
                    case 'b-r' :
                    case 'right-bottom' :
                    case 'rb' :
                    case 'r-b' :
                    //
                    easy.css( container, {
                        top: ( windowHeight - easy.height(container) ),
                        left: ( windowWidth - easy.width(container) )
                    } );

                    break;

                    case 'bottom-center' :
                    case 'bc' :
                    case 'b-c' :
                    case 'center-bottom' :
                    case 'cb' :
                    case 'c-b' :
                    //
                    easy.css( container, {
                        top: ( windowHeight - easy.height(container) ),
                        left: ( windowWidth - easy.width(container) ) / 2
                    } );

                    break;

                    case 'bottom-left' :
                    case 'bl' :
                    case 'b-l' :
                    case 'left-bottom' :
                    case 'lb' :
                    case 'l-b' :
                    //
                    easy.css( container, {
                        top: ( windowHeight - easy.height(container) ),
                        left: 0
                    } );
                    break;

                    case 'center-left' :
                    case 'cl' :
                    case 'c-l' :
                    case 'left-center' :
                    case 'lc' :
                    case 'l-c' :
                    //
                    easy.css( container, {
                        top: ( windowHeight - easy.height(container) ) / 2,
                        left: 0
                    } );
                    break;

                    default :
                    if( easy.type(position) !== 'function' ) {
                        easy.css( container, {
                            top: ( windowHeight - easy.height(container) ) / 2,
                            left: ( windowWidth - easy.width(container) ) / 2
                        } );
                    } else {
                        position.call( self, container );
                    }

                }

            };

        }

        if( resizeStorage[ opts.serialNumber ] ) resizeStorage[ opts.serialNumber ]();

    }



    // 设置组件尺寸
    function setSize() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            container = eles.container,
            windowWidth = document.documentElement.clientWidth,
            windowHeight = document.documentElement.clientHeight,
            containerWidth, containerHeight,
            bodyHeight,
            headerHeight = eles.header ? easy.outerHeight( eles.header ) : 0,
            footerHeight = eles.footer ? easy.outerHeight( eles.footer ) : 0,
            cRect,
            extraLR = parseInt( easy.css( eles.body, 'padding-right' ) ) + parseInt( easy.css( eles.body, 'padding-left' ) ) + parseInt( easy.css( eles.body, 'border-right-width' ) ) + parseInt( easy.css( eles.body, 'border-left-width' ) ),
            extraTB = parseInt( easy.css( eles.body, 'padding-top' ) ) + parseInt( easy.css( eles.body, 'padding-bottom' ) ) + parseInt( easy.css( eles.body, 'border-top-width' ) ) + parseInt( easy.css( eles.body, 'border-bottom-width' ) ),
            cExtraLR = parseInt( easy.css( container, 'padding-right' ) ) + parseInt( easy.css( container, 'padding-left' ) ) + parseInt( easy.css( container, 'border-right-width' ) ) + parseInt( easy.css( container, 'border-left-width' ) ),
            cExtraTB = parseInt( easy.css( container, 'padding-top' ) ) + parseInt( easy.css( container, 'padding-bottom' ) ) + parseInt( easy.css( container, 'border-top-width' ) ) + parseInt( easy.css( container, 'border-bottom-width' ) ),
            width = typeof opts.width === 'function' ? opts.width.call( self ) : opts.width,
            height = typeof opts.height === 'function' ? opts.height.call( self ) : opts.height;

        if( width > opts.minWidth + extraLR ) {
            containerWidth = width - extraLR;
        } else if( width ) {
            containerWidth = opts.minWidth + extraLR;
        }

        easy.css( container, 'width', containerWidth );

        if( height > opts.minHeight + headerHeight + footerHeight + extraTB ) {
            containerHeight = height - extraTB;
        } else if( height ) {
            containerHeight = opts.minHeight + headerHeight + footerHeight + extraTB;
        }

        easy.css( container, 'height', containerHeight );

        // 如果组件的宽度或高度大于了窗口的高或宽，则让组件的宽或高等于窗口的宽或高
        cRect = {
            width: easy.outerWidth( container ),
            height: easy.outerHeight( container ),
        };

        if( cRect.width > windowWidth ) {
            containerWidth = windowWidth - cExtraLR;
            easy.css( container, 'width', containerWidth );
        }

        if( cRect.height > windowHeight ) {
            containerHeight = windowHeight - cExtraTB;
            easy.css( container, 'height', containerHeight );
        }

        bodyHeight = containerHeight - headerHeight - footerHeight - parseInt(easy.css( eles.body, 'padding-top' )) - parseInt(easy.css( eles.body, 'padding-bottom' )) - parseInt(easy.css( eles.body, 'border-top-width' )) - parseInt(easy.css( eles.body, 'border-bottom-width' ));

        bodyHeight = bodyHeight < opts.minHeight ? opts.minHeight : bodyHeight;

        easy.css( eles.body, 'height', bodyHeight );

        if( eles.el.tagName.toLowerCase() === 'iframe' ) {
            // easy.css( eles.el, 'width', containerWidth );
            easy.css( eles.el, 'height', bodyHeight );
        }

    }

    function setContainerSizeNumber( opts, key ) {
        if( typeof opts[ key ] === 'string' ) {
            opts[ key ] = getRectNumber( opts, opts[ key ], key );
        }
    }

    function setContainerOffsetNumber( opts, key ) {

        if( typeof opts.offset[ key ] === 'string' ) {
            opts.offset[ key ] = getRectNumber( opts, opts.offset[ key ], key );
        }
    }

    // 获取上或左值或宽度或高度值
    function getRectNumber( opts, val, key ) {

        var $1,
            relative = {
                y: 'height',
                x: 'width'
            };

        //console.log( val, numPattern.test( val ), pixelPattern.test( val ) )

        if( numPattern.test( val ) || pixelPattern.test( val ) ) {
            $1 = RegExp.$1;
            return Number( $1 );
        } else if ( percentPattern.test( val ) ) {
            $1 = RegExp.$1;
            return function() {
                return Number( $1 ) * 0.01 * easy[key in relative ? relative[key] : key]( window );
            }
        }

        if( !(key in relative) ) {
            key = key.charAt(0).toUpperCase() + key.substr(1, key.length);
            key = opts[ 'min' + key ];
        } else {
            key = 0;
        }

        return key;
    }


    // 修正返回值
    function correctValue( num, unit ) {

        if( unit === undef ) unit = 'px';
        return typeof num === 'number' || typeof num === 'string' && numPattern.test(num) ? ( num + unit ) : num;

    }

    // 帧动画样式初始化到head内
    function keyFramesInit() {
        var self = this,
            head = document.querySelector('head'),
            style = document.querySelector('#overlay-keyframes') ? document.querySelector('#overlay-keyframes') : document.createElement('style'),
            animNames = [],
            sheetText = '',
            keyframesText = '',
            keyframes = Overlay.config.keyframes,
            keyframe, animName, key1, key2, key3, rules, rule, ruleText;

        if( !style ) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
        }

        if( !('anim' in Overlay.config) ) {
            Overlay.config.anim = {};
        }

        for( key1 in keyframes ) {

            keyframe = keyframes[key1];

            if( !( key1 in Overlay.config.anim ) ) Overlay.config.anim[key1] = {};

            for( key2 in keyframe ) {
                keyframesText = '';
                animName = key1 + ( key2.charAt(0).toUpperCase() + key2.split(/^\w/)[1] );
                rules = keyframe[key2];
                animNames.push( key1 + '-' + key2 );

                if( !( key2 in Overlay.config.anim[key1] ) ) {
                    Overlay.config.anim[key1][key2] = animNames[ animNames.length - 1 ];
                }

                keyframesText += animName + ' {\n';

                ruleText = '';

                for( key3 in rules ) {
                    rule = rules[key3];
                    ruleText += '   ' + key3 + ' { ' + rules[key3] + ' }\n';
                }
                keyframesText += ruleText + '}\n';

                sheetText += '@-webkit-keyframes ' + keyframesText;
                sheetText += '@keyframes ' + keyframesText;

            }
        }

        if( animNames.length ) sheetText = createAnimationSelector.call( self, animNames ) + sheetText;


        if( !style.id ) {
            style.id = 'overlay-keyframes';
            style.innerHTML = sheetText;
        } else {
            style.innerHTML += sheetText;
        }

        head.appendChild( style );

    }

    // 创建动画选择器
    function createAnimationSelector( selectorGroup ) {

        var self = this,
            opts = self.options,
            duration = opts.duration || Overlay.config.duration,
            selectorFirst = '.overlay-container.overlay-',
            sheet = '',

            selectorLast, animName, animPattern = /-[a-z]/,
            i = 0;

        for( ; i < selectorGroup.length; i++ ) {
            selectorLast = selectorGroup[i];
            animName = selectorLast.replace(/-[a-z]/, function( $1 ) {
                return $1 ? $1.split('-')[1].toUpperCase() : '';
            });
            sheet += selectorFirst + selectorLast + ' { ' +
                '-webkit-animation-name: ' + animName + '; animation-name: ' + animName +
                '; -webkit-animation-duration: ' + duration + 'ms' + '; animation-duration: ' + duration + 'ms' +
                 ' }\n';
        }

        return sheet;
    }


    // 监听窗口调整事件 用于窗口位置调整
    easy.on( window, 'resize', function() {
        var i;
        // 查看序号是否是原始值，是的话，则说明没有创建过组件
        if(!serialNumber) return;

        for( i in resizeStorage ) {
            if( !resizeStorage ) return;

            if( !~i.indexOf('_') && typeof resizeStorage[ i ] === 'function' ) resizeStorage[ i ]();

        }

    } );

    easy.on( docBody, 'mousemove', function( e ) {
        var i;

        e = e || window.event;
        // 查看序号是否是原始值，是的话，则说明没有创建过组件

        if(!serialNumber || ( !dragMoveStorage[ dragFlag ] && !adjustStorage[ adjustFlag ] ) ) return;

        if( e.preventDefault ) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        if( typeof dragMoveStorage[ dragFlag ] === 'function' ) {
            dragMoveStorage[ dragFlag ]( e );
        }

        if( typeof adjustStorage[ adjustFlag ] === 'function' ) {
            easy.css( this, 'cursor', 'se-resize' );
            adjustStorage[ adjustFlag ]( e );
        }

    } );

    easy.on( docBody, 'mouseup', function( e ) {
        var i;

        e = e || window.event;
        // 查看序号是否是原始值，是的话，则说明没有创建过组件
        if(!serialNumber && ( !dragMoveStorage[ dragFlag ] || !adjustStorage[ adjustFlag ] ) ) return;

        if( e.preventDefault ) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        if( typeof adjustUpStorage[ adjustFlag ] === 'function' ) {
            easy.css( this, 'cursor', 'auto' );
            adjustUpStorage[ adjustFlag ]( e );
        }

    } );


    return Overlay;

});
