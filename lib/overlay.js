

/*
* Overlay.js v1.0.1
*/

(function( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    window.Overlay = factory();
})(this, function() {

    var isIE8 = document.documentMode === 8,
        undef,
        _slice = Array.prototype.slice,
        toArr = function( val, index ) {
            if( !val ) return;

            if( index === undef ) index = 0;

            return isIE8 ? Array.prototype.concat.apply([], val).slice( index ) : _slice.call( val, index );
        },
        zIndex = 100000,
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
        docBody,
        isTipsDirectionPattern = /t|r|b|l/,

        correctionTipsDirectionOrder = function( direction ) {
            var order = 'trbl', pattern, first;

            if( direction === 't' ) return order;

            pattern = new RegExp( direction + '[a-z]+');
            first = order.match( pattern )[0];

            return first + order.replace( first, '' );

        };

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
            rules = toArr( 'cssRules' in sheets[i1] ? sheets[i1].cssRules : sheets[i1].rules );

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

                    if( newFlag && ( easy.type( mergeObj[i2] ) === 'object' || easy.isArray( mergeObj[i2] ) ) && mergeObj[i2] && ( easy.type( baseObj ) === 'object' || easy.isArray( baseObj ) ) && !mergeObj[i2].nodeType ) {
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

            query: function( selector ) {
                if( easy.type(selector) === 'string' ) {
                    return document.querySelector( selector );
                } else {
                    return selector;
                }
            },

            queryAll: function( selector ) {
                if( easy.type(selector) === 'string' ) {
                    return document.querySelectorAll( selector );
                } else {
                    return selector;
                }
            },

            type: function( obj ) {
                return typeof obj === 'object' || typeof obj === 'function' ? typePattern.test( toString.call( obj ) ) ? RegExp.$1.toLowerCase() : 'object' : typeof obj;
            },

            isArray: function( obj ) {
                return easy.type( obj ) === 'array';
            },

            each: function( arr, fn ) {
                var i, result, isArray = easy.isArray( arr );

                if( !easy.isArray( arr ) && easy.type(arr) !== 'object' ) arr = [ arr ];

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

				if( !elem ) return;
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

				if( !elem ) return;

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

				if( !elem ) return;

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
                var handerName;

                if( !elem ) return;

                if( window.attachEvent ) {
                    handlerName = eventName + '_handler';
                    if( !elem.handler ) {
                        elem[handlerName] = function() {
                            handler.apply( elem, toArr(arguments) );
                        }
                    }
                    elem.attachEvent( 'on' + eventName, elem[handlerName] );
                } else if( window.addEventListener ) {
                    elem.addEventListener( eventName, handler, false );
                }
            },
            off: function( elem, eventName, handler ) {
                var handlerName;
                if( window.detachEvent ) {
                    handlerName = eventName + '_handler';

                    elem.detachEvent( 'on' + eventName, elem[handlerName] );
                    delete elem[handlerName];
                } else if( window.removeEventListener ) {
                    elem.removeEventListener( eventName, handler, false );
                }
            },
            css: function( elem, key, val ) {
                var i;

                if( typeof key === 'string' ) {
                    if( val === undef ) {
                        return currCss( elem, key );
                    } else if( elem.style ) {
                        elem.style[ key ] = correctionValue( val, ~key.indexOf('opacity') || ~key.indexOf('z-index') ? '' : undef );
                    }
                } else if( typeof key === 'object' ) {
                    for( i in key ) {
                        val = key[i];
                        elem.style[ i ] = correctionValue( val, ~i.indexOf('opacity') || ~i.indexOf('z-index') ? '' : undef );
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
                if( html !== undef && html !== null ) {
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
            },

            scrollTop: function( elem ) {
                if( elem === undef ) elem = document.documentElement;

                return elem.scrollTop;
            },

            scrollLeft: function( elem ) {
                if( elem === undef ) elem = document.documentElement;

                return elem.scrollLeft;
            }

        },


        returnStorage = {},                             // 数据存储区
        resizeStorage = {},                             // 实例位置重置函数存储区
        dragMoveStorage = {},                           // 实例拖拽移动函数存储区
        handlersStorage = {},                           // 实例回调函数存储区
        adjustStorage = {},                             // 实例调整大小函数存储区
        adjustUpStorage = {},                           // 实例调整大小按键离开函数存储区
		caseStorage = [],								// 实例初始化存储区

        supportAnim = 'onanimationend' in window,
        //defaultCallbackHandlerName = [ 'once', '$ready' ],

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

        var $el = options.el ? easy.query(options.el) : '';

        if( $el && $el.overlay && $el.overlay instanceof Overlay ) return $el.$overlay

        var self = this,
            defOpts = extend({}, Overlay.defaultOptions, options );

        self.options = defOpts;

        if( !defOpts.el && !('content' in defOpts) && defOpts.content !== null ) return;

        if( 
            !self.options.zIndex && !Overlay.config.zIndex || 
            Overlay.config.zIndex && Overlay.config.zIndex < zIndex || 
            self.options.zIndex && self.options.zIndex < zIndex && !Overlay.config.zIndex
        ) {
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

        self.options.serialNumber = ++serialNumber;

		if( !~caseStorage.indexOf( self ) ) {
			caseStorage.push( self );
		}

        return self._init();
    }

    // Overlay 默认属性
    Overlay.defaultOptions = {
        title: null,                                                                // 标题
        width: 'auto',                                                                // 宽度
        height: 'auto',                                                               // 高度
        minWidth: 200,
        minHeight: null,
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
		defFull: false,
        tips: false,
        tipsSpace: 8,
        tipsOffset: [0, 0],
        originWidth: null,
        originHeight: null,
        resize: true,
        skin: null,
        outBound: false,
        buttons: null,
		closedDestroy: false
    };

    // Overlay 默认配置
    Overlay.config = {
        urlPattern: urlPattern,                                                     // url正则匹配规则
        duration: 300,                                                              // 动画过程时间
        zIndex: null,
        skin: null,
        defaultCallbackHandlerName: [
            'once',
            'init',
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

    Overlay.prototype._init = function() {

        var self = this;
        // 还没改完

        if( self.options.el &&
            (
                easy.type( self.options.el ) === 'string' &&
                easy.query( self.options.el ).$overlay ||
                self.options.el.$overlay
            )  ) {
            if( easy.type( self.options.el ) === 'string' ) {

                return easy.query( self.options.el ).$overlay;

            } else {
                return self.options.el.$overlay;
            }
        }

        if( ( 'name' in self.options ) && Overlay[ '$' + self.options.name ] ) {
            self = Overlay[ '$' + self.options.name ];
            if( self.options.defOpen ) {
                self.open();
            }
            return self;
        }

        var opts = self.options,
            sn = opts.serialNumber,
            eles,
            el, content, $mask,
            $el, $container,
            config, animClassName;

        if( !(sn in handlersStorage) ) {
            handlersStorage[ sn ] = {};
        }

        if( !(sn in returnStorage) ) {
            returnStorage[ sn ] = {};
        }

        if( 'name' in opts ) {
            Overlay[ '$' + opts.name ] = self;
        }

        if( !self.ready ) self.defaultCallbackInit();
        if( supportAnim && !easy.query('#overlay-keyframes') ) keyFramesInit.call( self );

        if( !opts.animClass && supportAnim ) {
            config = Overlay.config;
            opts.animClass = {};

            opts.animClass.enter = ( config.anim[opts.anim] ? config.anim[opts.anim].enter : ( opts.anim + '-enter' ) );
            opts.animClass.leave = ( config.anim[opts.anim] ? config.anim[opts.anim].leave : ( opts.anim + '-leave' ) );
        }

        if( !('eles' in self) ) self.eles = {};
        eles = self.eles;

        if( easy.type(opts.mask) === 'number' || numPattern.test(opts.mask) ) $mask = self.maskInit();

        el = opts.el;
        content = opts.content;

        if( el ) {
            // 找到核心元素 并将遮罩层插入到dom节点中
            eles.el = $el = easy.type( el ) === 'string' ? easy.query(el) : el;

            if( $mask ) $el.parentNode.insertBefore( $mask, $el );


        } else if( typeof content === 'string' ) {
            if( $mask ) docBody.appendChild($mask);

            // 如果没有指定dom 则使用渲染内容的形式
            eles.el = $el = self.elInit();

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

        if( eles.frame ) easy.addClass(eles.body, 'overlay-iframe loading');

        // 将实例绑到dom对象上，方便查找调用
        $el.$overlay = self;

        if( easy.css( $el, 'display' ) === 'none' ) {
            easy.css( $el, 'display', 'block' );
        }

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
                    if( ( hn === 'once' || hn === 'init' ) && handlers[ hn ].length === 1 || typeof fn !== 'function' ) return self;

                    handlers[ hn ].push(fn);

                    // 如果是静态元素或是普通自符串，并且执行方法是ready的话，直接调用函数即可实现ready方法
                    if( ( self.options.el || !hasUrl ) && hn === '$ready' ) {
                        triggerEventHandler.call( self, 'ready', null, null, handlers[ hn ].length - 1 );
                    }

                    return self;
                };

                //console
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
            $frame,
            name = 'overlay-frame-' + opts.serialNumber,
            hasUrl = opts.content.match(opts.urlPattern || Overlay.config.urlPattern);

        $el = document.createElement('div');
        easy.addClass( $el, 'overlay-custom-wrapper' );

        // 如果 content 是链接，则装入iframe中
        if( hasUrl && hasUrl.length && hasUrl[0] ) {
            eles.frame = !0;
        } else {
            $el.innerHTML = opts.content;
        }

        docBody.appendChild($el);

        return $el;
    };

    // 初始化外包围
    Overlay.prototype.containerInit = function() {
        var self = this,
            opts = self.options,
            $container = document.createElement('div'),
            config = Overlay.config;

        self.eles.container = $container;

        easy.addClass( $container, 'overlay-container' + ( opts.containerClass ? ( ' ' + opts.containerClass ) : '' ) );

		if( opts.skin || config.skin ) {
			easy.addClass( $container, opts.skin || config.skin );
		}

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
            eles = self.eles,
            $body = document.createElement('div'),
            $frame, $el = eles.el;

        self.eles.body = $body;
        easy.addClass( $body, 'overlay-body' + ( opts.bodyClass ? ( ' ' + opts.bodyClass ) : '' ) );
        // $body.className += 'overlay-body';
        if( eles.frame ) {
            $frame = document.createElement('iframe');
            eles.frame = $frame;
            $el.appendChild($frame);
            $frame.setAttribute('name', name);
            $frame.setAttribute('id', name);
            $frame.src = opts.content;

            elemsBindEvent.call( self, $frame, 'ready', 'load', function() {
                self.iframeWindow = window.frames[name];
                if( eles.body ) easy.removeClass(eles.body, 'loading');
                elemsUnbindEvent.call( self, $frame, 'load' );
            } );
        }
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

        self.eles.arrow = $arrow;
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
            handlerSerialNumber = 0,
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
                    fn.s__n = sn + handlerSerialNumber;
                    if( typeof fn === 'function' ) handlers[ fnName ].push(fn);

                    ++handlerSerialNumber;

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
                triggerEventHandler.call( self, 'init' );
                triggerEventHandler.call( self, 'once' );
                triggerEventHandler.call( self, 'beforeOpen' );
            }, 0);
        } else {
            easy.addClass( eles.container, 'open');
            setTimeout(function() {
                if( opts.defFull ) self.full();
                triggerEventHandler.call( self, 'once' );
                triggerEventHandler.call( self, 'init' );
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

    // Overlay.prototype.pakcUp = function() {

    //     var self = this,
    //         opts = self.options,
    //         eles = self.eles;



    // };

    // 窗口全屏方法
    Overlay.prototype.full = function() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            windowWidth = easy.width( window ),
            windowHeight = easy.height( window ),
            containerWidth = easy.width( eles.container ),
            containerHeight = easy.height( eles.container );

        if( easy.hasClass( eles.full, 'fullscreen' ) || !easy.hasClass( self.eles.container, 'open' ) ) return self;

        triggerEventHandler.call( self, 'fullBefore' );

        if( !opts.originWidth ) opts.originWidth = opts.width;

        if( !opts.originHeight ) opts.originHeight = opts.height;

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

        if( !easy.hasClass( eles.full, 'fullscreen' ) || !easy.hasClass( self.eles.container, 'open' ) ) return self;

        triggerEventHandler.call( self, 'cancelFullBefore' );

        easy.removeClass( eles.full, 'fullscreen' );

        self.restore();

        setOffset.call( self );

        triggerEventHandler.call( self, 'cancelFullAfter' );

        return self;
    }


	Overlay.prototype.autoAdjust = function() {
		var self = this,
			opts = self.options,
			eles = self.eles;

		if( easy.hasClass( eles.full, 'fullscreen' ) || !easy.hasClass( self.eles.container, 'open' ) ) return self;

		setOffset.call( self );

	};


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

    // 设置实例相对root的偏移值
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
        } else if( easy.type( key ) === 'object' ) {
            extend( true, returnStorage[ sn ], key );
        }

        return self;
    }

    // 将存储的值拿出来
    Overlay.prototype.pull = function( key ) {
        var self = this,
            sn = self.options.serialNumber;

        return key ? returnStorage[ sn ][ key ] : returnStorage[ sn ];
    }

	// 判断当前实例是否是显示状态
	Overlay.prototype.isShow = function() {
		var self = this,
			eles = self.eles;

		return easy.hasClass( eles.container, 'open' );
    };
    
    Overlay.prototype.isOpen = function() {
        var self = this;

        return easy.hasClass( self.eles.container, 'open' );
    }

    Overlay.prototype.setRefer = function( elem ) {

        var self = this,
            opts = self.options;

        if( !opts.tips || easy.type( elem ) !== 'html' ) return self;

        opts.tips = elem;

        return self;

    };

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

        if( 'name' in opts ) {
            delete Overlay[ '$' + opts.name ];
        }

        delete returnStorage[ sn ]; // 移除存储的当前实例的数据
        delete resizeStorage[ sn ]; // 移除存储的当前实例的重置函数
        delete dragMoveStorage[ sn ]; // 移除存储的当前实例的拖拽函数
        delete adjustStorage[ sn ]; // 移除存储的当前实例的调整函数
        delete adjustUpStorage[ sn ]; // 移除存储的当前调整大小按键离开函数存储区
		if( ~caseStorage.indexOf( self ) ) {
			caseStorage.splice( caseStorage.indexOf( self ), 1 );
		}

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
    //////// 子级组件代码块
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
                minWidth: 'auto',
                mask: false,
                bodyClass: 'overlay-tips-body',
                trigger: 'hover'
            },
            content,
            key, attr,
            matchResult,
            i, tips;

        // el 与 conetnt 只能二选一
        if( options.el && 'content' in options ) delete options.el;
        
        // 如果有 el，也没有设置trigger 则设置一下 trigger 为false
        if( options.el && !('trigger' in options) ) {
            options.trigger = false;
        }

        // 查看内容是属性还是普通文本
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
            options.tips = easy.query(options.tips);

            tips = new Overlay(extend( true, {}, tipsOptions, options ));

            return tips;
        }

        // 如果有tips、并且没有设置trigger，则将元素找到并赋值，等待添加监听事件
        if( options.tips && !('trigger' in options) ) {
            el = options.tips;
            $els = toArr( easy.queryAll(el), 0 );
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
	//////// 全局功能代码块
	////////

	// 关闭所有已打开的组件
	Overlay.closeAll = function() {

		if( !caseStorage.length ) return;

		var i = 0;

		for( ; i < caseStorage.length; i++ ) {
			if( caseStorage[i].isShow() ) {
				caseStorage[i].close();
			}
		}

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
        easy.off( $elem, eventName, triggerEventHandler );

        return self;
    }

    // 所有调用方法的回调，全部在这里被执行
    function triggerEventHandler( handlerName, callback, e, i ) {
        var self = this,
            opts = self.options,
            sn = opts.serialNumber,
            allHandlers = handlersStorage[ sn ],
            handlers = handlersStorage[ sn ][ handlerName ],
            handler,
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
            handler = handlers[ i ];

            returnTemp = handler.call(
                self,
                e,
                returnStorage[ sn ] ? returnStorage[ sn ] : undef
            );

            if( returnTemp instanceof Overlay && !returnTemp.hasHandOver ) {
                // 避免同一实例重复被交予回调函数
                returnTemp.hasHandOver = true;
                handOver.call( self, returnTemp, handler.s__n );

                break;
            } else if( returnTemp ) {
                returnStorage[ sn ] = returnTemp;
            }
        }

        if( handlerName === 'once' || handlerName === 'init' ) {
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

            triggerEventHandler.call( self, 'resizeStart' );

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

        triggerEventHandler.call( self, 'resizeEnd' );

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
            x = opts.offset && typeof opts.offset.x === 'function' ? opts.offset.x.call( self ) : opts.offset ? opts.offset.x : null,
            y = opts.offset && typeof opts.offset.y === 'function' ? opts.offset.y.call( self ) : opts.offset ? opts.offset.y : null;

        if( opts.offset && x && y && !opts.tips ) {
            if( (easy.type(opts.offset.x) === 'function' || easy.type(opts.offset.y) === 'function') && !resizeStorage[ opts.serialNumber ] ) {

                resizeStorage[ opts.serialNumber ] = function() {

                    if( !easy.hasClass( container, 'open' ) ) return self;

                    x = easy.type(opts.offset.x) === 'function' ? opts.offset.x.call( self ) : opts.offset.x;
                    y = easy.type(opts.offset.y) === 'function' ? opts.offset.y.call( self ) : opts.offset.y;
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

            setTipsOffset.call( self );



        } else if( 'position' in opts && !(opts.serialNumber in resizeStorage) ) {

            setWindowOffset.call( self );

        }

        if( resizeStorage[ opts.serialNumber ] ) resizeStorage[ opts.serialNumber ]();

    }

    function setTipsOffset() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            container = eles.container,
            position = opts.position,
            windowWidth, windowHeight,
            tipsOffset,
            scrollTop,
            scrollLeft,
            tipsDirection,
            direction, cOffset,
            tipsWidth, tipsHeight,
            cWidth, cHeight;

        tipsOffset = easy.offset( opts.tips );

        if( easy.type( opts.position ) === 'string' ) {
            if( opts.position.length > 1 ) opts.position = opts.position.charAt(0);
            if( !isTipsDirectionPattern.test(opts.position) ) opts.position = 't';

            tipsDirection = correctionTipsDirectionOrder( opts.position );

        } else if( easy.type(opts.position) === 'function' ) {

            opts.position.call( self, container, opts.tips );

            return;
        }

        x = tipsOffset.left;
        y = tipsOffset.top;

        scrollTop = easy.scrollTop();
        scrollLeft = easy.scrollLeft();

        cOffset = easy.offset( container );
        tipsWidth = easy.outerWidth( opts.tips );
        tipsHeight = easy.outerHeight( opts.tips );
        cWidth = easy.outerWidth( container );

        cHeight = easy.outerHeight( container );

        windowWidth = easy.width( window );
        windowHeight = easy.height( window );

        easy.removeClass( eles.arrow, 't r b l');

        while( tipsDirection ) {

            direction = tipsDirection.charAt(0);

            if( direction === 't' && y - scrollTop > cHeight + opts.tipsSpace && x + cWidth + opts.tipsSpace + opts.tipsOffset[0] < windowWidth ) {
                //
                easy.css( container, {
                    top: y - easy.height( container ) - opts.tipsSpace,
                    left: x + opts.tipsOffset[0]
                } );

                tipsDirection = null;
                break;
            } else if( direction === 'r' && windowWidth - x - tipsWidth - opts.tipsSpace > cWidth ) {
                //
                easy.css( container, {
                    top: y + opts.tipsOffset[1],
                    left: x + easy.width( opts.tips ) + opts.tipsSpace
                } );

                tipsDirection = null;
                break;
            } else if( direction === 'b' && windowHeight - y - tipsHeight - opts.tipsSpace > cHeight && x + cWidth + opts.tipsSpace + opts.tipsOffset[0] < windowWidth ) {
                //
                easy.css( container, {
                    top: y + easy.height( opts.tips ) + opts.tipsSpace,
                    left: x + opts.tipsOffset[0]
                } );

                tipsDirection = null;
                break;
            } else if( direction === 'l' && x - scrollLeft > cWidth + opts.tipsSpace ) {
                //
                easy.css( container, {
                    top: y + opts.tipsOffset[1],
                    left: x - easy.width( container ) - opts.tipsSpace
                } );

                tipsDirection = null;
                break;
            }

            tipsDirection = tipsDirection.replace( direction, '' );
        }

        if( tipsDirection === '' ) {

            easy.css( container, {
                top: y - easy.height( container ) - opts.tipsSpace,
                left: x
            } );

			if( direction ) easy.addClass( eles.arrow, 't');
        } else {
			if( direction ) easy.addClass( eles.arrow, direction);
		}



    }

    function setWindowOffset() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            container = eles.container,
            position = opts.position,
            windowWidth, windowHeight,
            resizeEndTimer;

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

    // 设置组件尺寸
    function setSize() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            container = eles.container,
            windowWidth = easy.width( window ),
            windowHeight = easy.height( window ),
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


		if( opts.minWidth === null ) {
			opts.minWidth = easy.width( container );
		}

		if( opts.minHeight === null ) {
			opts.minHeight = easy.height( container ) - headerHeight - footerHeight - extraTB;
		}

        if( easy.type(width) === 'number' && width > opts.minWidth + extraLR ) {
            containerWidth = width - extraLR;
        } else if( easy.type(width) === 'number' && width && easy.type(opts.minWidth) === 'number' ) {
            containerWidth = opts.minWidth + extraLR;
        }

        easy.css( container, 'width', containerWidth || width );

        if( easy.type(height) === 'number' && height > opts.minHeight + headerHeight + footerHeight + extraTB ) {
            containerHeight = height - extraTB;
        } else if( easy.type(height) === 'number' && height && easy.type(opts.minHeight) === 'number' ) {
            containerHeight = opts.minHeight + headerHeight + footerHeight + extraTB;
        }

		easy.css( container, 'height', containerHeight || height );


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

		easy.css( eles.body, 'height', bodyHeight || height );

        if( eles.frame ) {
            easy.css( eles.frame, 'height', bodyHeight );
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
            val = opts[ 'min' + key ];
        } else {
            val = 'auto';
        }

        return val !== null ? val : 'auto';
    }


    // 修正返回值
    function correctionValue( num, unit ) {

        if( unit === undef ) unit = 'px';
        return typeof num === 'number' || typeof num === 'string' && numPattern.test(num) ? ( num + unit ) : num;

    }

    // 帧动画样式初始化到head内
    function keyFramesInit() {
        var self = this,
            head = easy.query('head'),
            style = easy.query('#overlay-keyframes') ? easy.query('#overlay-keyframes') : document.createElement('style'),
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
            selectorFirst = '.overlay-container.',
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


    function handOver( instance, timestamp ) {
        var self = this,
            opts = self.options,
            sn = opts.serialNumber,
            selfHandlers = handlersStorage[ sn ],

            instanceOpts = instance.options,
            instanceSn = instanceOpts.serialNumber,
            instanceHandlers = handlersStorage[ instanceSn ];

        easy.each( instanceHandlers, function( key, instanceHandler ) {

            handOverHandlers = selfHandlers[ key ];

            easy.each( handOverHandlers, function( handOverKey, handler ) {

                if( handler.s__n > timestamp && !( handler in instanceHandler ) ) {
                    instanceHandler.push( handler );
                }

            } );

        } );

    }


    // 页面加载后，再执行的事件
    easy.on( document, 'DOMContentLoaded', function() {

        docBody = document.body;

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

    } );



    return Overlay;

});
