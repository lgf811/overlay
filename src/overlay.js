

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

    var _slice = Array.prototype.slice;

    if( typeof Function.prototype.bind === 'undefined' ) {
        Function.prototype.bind = function( oThis ) {
            if( typeof this !== 'function' ) {
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var fToBind = this,
                argus = _slice.call( arguments, 1 ),
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

            if( !arr ) return index;

            for( ; i < len; i++ ) {
                if( self[i] === val ) {
                    return i;
                }
            }
        };

        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
              this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    var extend = function() {
            var argus = _slice.call(arguments),
                newFlag, baseObj, mergeObjGroup, mergeObj,
                i1, i2;

            if( typeof argus[0] !== 'boolean' && typeof argus[0] !== 'object' ) return argus[0];

            if( typeof argus[0] === 'boolean' && argus[0] ) {
                newFlag = argus[0];
                argus.splice(0, 1);
                baseObj = 'length' in argus[0] && argus[0] instanceof Array ? [] : {};
            } else {
                baseObj = argus[0];
                argus.splice(0, 1);
            }
            mergeObjGroup = argus;

            for( i1 = 0; i1 < mergeObjGroup.length; i1++ ) {
                mergeObj = mergeObjGroup[i1];

                if( typeof mergeObj !== 'object' ) continue;

                for( i2 in mergeObj ) {

                    if( newFlag && typeof mergeObj[i2] === 'object' && !( mergeObj[i2] instanceof RegExp ) && mergeObj[i2] ) {
                        baseObj[i2] = 'length' in mergeObj[i2] && mergeObj[i2] instanceof Array ? [] : {};
                        baseObj[i2] = extend( newFlag, baseObj[i2], mergeObj[i2] );
                    } else {
                        baseObj[i2] = mergeObj[i2];

                    }
                }
            }

            return baseObj;
        }, i1, i2,
        zIndex = parseInt(Math.random() * 100000),
        serialNumber = 0,
        sheets, rules,
        urlPattern = new RegExp('^\\.?\\/|^https?:\\/\\/|\\/$|[a-z0-9-_=\\?]\/[a-z0-9-_=\\?]', 'gi'),
        windowKey,
        domPrototype,
        easy = {
            addClass: function( cls ) {
                var clsn = this.className;

                if( !cls || cls && easy.hasClass.call( this, cls ) ) return;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];

                if( ~clsn.indexOf( cls ) ) return this;

                clsn.push(cls);
                clsn = easy.trim( clsn.join(' ') );
                this.className = clsn;
            },
            removeClass: function( cls ) {
                var clsn = this.className,
                    i = 0;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];

                if( !cls ) return this;

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

                this.className = clsn.join(' ');
            },
            hasClass: function( cls ) {
                var clsn = this.className,
                    i = 0, flag = false;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];
                cls = ~cls.indexOf(' ') ? cls.split(' ') : [ cls ]

                for( ; i < cls.length; i++ ) {

                    if( ~clsn.indexOf( cls[i] ) ) {
                        flag = true;
                    } else {
                        flag = false;
                    }
                }

                return flag;
            },
            parents: function( cls ) {
                var self = this,
                    parent = self.parentNode;


                while( !easy.hasClass.call( parent, cls ) ) {
                    if(parent.parentNode) {
                        parent = parent.parentNode
                    } else {
                        return null;
                    }
                }

                return parent;
            },
            trigger: function( eventName ) {

                var e;

                if( document.createEvent ) {

                    e = document.createEvent('HTMLEvents');
                    e.initEvent(eventName, false, true);
                    document.dispatchEvent(e);

                } else if( document.createEventObject ) {
                    e = document.createEventObject();
                    this.fireEvent('on' + eventName, e);
                } else if( typeof this['on' + eventName] === 'function' ) {
                    this['on' + eventName]();
                }
            },
            on: function( eventName, handler ) {
                if( document.all ) {
                    this.attachEvent( 'on' + eventName, handler );
                } else {
                    this.addEventListener( eventName, handler, false );
                }
            },
            off: function( eventName, handler ) {
                if( document.all ) {
                    this.detachEvent( 'on' + eventName, handler );
                } else {
                    this.removeEventListener( eventName, handler, false );
                }
            },
            css: function( key, val ) {
                var unitPattern = /(px|%)$/;

                if( val === undefined ) {
                    return this.currentStyle ? this.currentStyle[ key ] : window.getComputedStyle(this).getPropertyValue( key );
                } else {
                    this.style[ key ] = val;
                }

            },
            trim: function( val ) {
                return val ? val.replace(/^\s+|\s$/, '') : val;
            },
            width: function() {
                return this.clientHeight - parseInt(easy.css.call( this, 'padding-right' )) - parseInt(easy.css.call( this, 'padding-left' ));
            },
            height: function() {
                return this.clientHeight - parseInt(easy.css.call( this, 'padding-top' )) - parseInt(easy.css.call( this, 'padding-bottom' ));
            },
            outerWidth: function() {
                return this.offsetWidth;
            },
            outerHeight: function() {
                return this.offsetHeight;
            },
            attr: function( key, val ) {
                if( val !== undefined ) {
                    this.setAttribute(key, val)
                    return this;
                }
                return this.getAttribute(key);
            },
            removeAttr: function( key ) {
                if( key === undefined ) return this;
                this.removeAttribute(key);
                return this
            }

        },
        returnStorage = {},
        resizeStorage = {},
        dragMoveStorage = {},
        supportAnim = 'onanimationend' in window,
        //defaultCallbackHandlerName = [ 'once', 'ready' ],
        dchni = 0,
        dragInit = { x: 0, y: 0 },
        dragCurr = { x: 0, y: 0 },
        dragD = { x: 0, y: 0 },
        dragFlag = false;

    // if( ~location.protocol.indexOf('http')) {
    //     sheets = document.styleSheets;
    //
    //     for( i1 = 0; i1 < sheets.length; i1++ ) {
    //         rules = sheets[i1].rules;
    //
    //         for( i2 in rules ) {
    //             if( rules[i2].style && rules[i2].style.zIndex > zIndex ) {
    //                 zIndex = Number(rules[i2].style.zIndex);
    //             }
    //         }
    //     }
    // }



    // Overlay 构造函数
    function Overlay( options ) {

        var $el = options.el ? document.querySelector(options.el) : '';

        if( $el && $el.overlay && $el.overlay instanceof Overlay ) return $el.overlay


        var self = this,
            defOpts = extend({}, Overlay.defaultOptions, options );

        self.options = defOpts;

        if( !defOpts.el && !('content' in defOpts) && defOpts.content !== null ) return;

        // self.options.width = 10000;
        self.options.zIndex = ++zIndex;
        self.options.serialNumber = ++serialNumber;

        return self.init();
    }

    // Overlay 默认属性
    Overlay.defaultOptions = {
        title: null,                                                                // 标题
        width: null,                                                                // 宽度
        height: null,                                                               // 高度
        content: null,                                                              // 被包含的字符串或是地址
        el: null,                                                                   // 被包含的元素
        defOpen: false,
        anim: 'scale',
        position: 'center',
        opacity: 0.4,
        drag: true,
        footAlign: 'center',
        showClose: true
    };

    // Overlay 默认配置
    Overlay.config = {
        urlPattern: urlPattern,                                                     // url正则匹配规则
        duration: 300,                                                              // 动画过程时间

        defaultCallbackHandlerName: [ 'once', 'ready', 'opened', 'closed' ],        // 默认的执行回调函数方法

        keyframes: {                                                                // 默认动画配置，可在创建实例前，追加新的动画名称
            fade: {
                'enter': {
                    "0%": "opacity: 0;",
                    "100%": "opacity: 1;"
                },
                'leave': {
                    "0%": "opacity: 1;",
                    "100%": "opacity: 0;"
                }
            },

            scale: {
                'enter': {
                    "0%": "opacity: 0; transform: scale(0.6)",
                    "100%": "opacity: 1; transform: scale(1)"
                },
                'leave': {
                    "0%": "opacity: 1; transform: scale(1)",
                    "100%": "opacity: 0; transform: scale(0.6)"
                }
            },

            spring: {
                'enter': {
                    "0%": "opacity: 0; transform: scale(0.6)",
                    "80%": "opacity: 0.8; transform: scale(1.05)",
                    "100%": "opacity: 1; transform: scale(1)"
                },
                'leave': {
                    "0%": "opacity: 1; transform: scale(1)",
                    "20%": "opacity: 0.8; transform: scale(1.05)",
                    "100%": "opacity: 0; transform: scale(0.6)"
                }
            }
        }
    };

    Overlay.alert = function( options ) {

        if( !options ) options = {};

        return new Overlay(extend( {
            title: '提示',
            content: '',
            closedDestroy: true,
            // showClose: false,
            defOpen: true,
            width: 280,
            buttons: {
                'enter.enter-btn': '确定',
                'enter.cancel-btn': '取消'
            }
        }, options ));
    };

    Overlay.prototype.init = function() {

        if( this.eles ) return this;

        var self = this,
            opts = self.options,
            eles,
            el, content, $mask,
            $el, $container,
            config, animClassName;

        if( !('handlers' in self) ) {
            self.handlers = {};
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

        $mask = self.maskInit();

        el = opts.el;
        content = opts.content;

        if( el ) {
            // 找到核心元素 并将遮罩层插入到dom节点中
            eles.el = $el = document.querySelector(el);

            $el.parentNode.insertBefore( $mask, $el );

        } else if( typeof content === 'string' ) {
            document.body.appendChild($mask);
            // 如果没有指定dom 则使用渲染内容的形式
            eles.el = $el = self.elInit();
        }

        // 将实例绑到dom对象上，方便查找调用
        $el.overlay = self;

        if( easy.css.call( $el, 'display' ) === 'none' ) {
            easy.css.call( $el, 'display', 'block' );
        }

        // 创建包含元素，将核心元素放到包含元素内
        $container = self.containerInit();

        $el.parentNode.insertBefore( $container, $el );
        $container.appendChild( self.headerInit() );
        $container.appendChild( self.bodyInit() );
        $container.appendChild( self.footerInit() );

        // 根据配置，操作 header内的元素
        if( opts.title ) {
            eles.title.innerText = opts.title;
        } else {
            easy.css.call( eles.header, 'display', 'none' );
        }

        if( !opts.showClose ) easy.css.call( eles.close, 'display', 'none' );

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
            dchn = Overlay.config.defaultCallbackHandlerName;

        // 将默认的回调方法输出
        for( dchni = 0; dchni < dchn.length; dchni++ ) {
            (function( hn ) {
                if( hn in self ) return;

                self[hn] = function( fn ) {

                    var self = this,
                        opts = self.options;

                    if( !(hn in self.handlers) ) self.handlers[ hn ] = [];
                    // once 在打开界面后，执行一次即可
                    if( hn === 'once' && self.handlers[ hn ].length === 1 ) return self;

                    self.handlers[ hn ].push(fn);

                    // 如果是静态元素或是普通自符串，并且执行方法是ready的话，直接调用函数即可实现ready方法
                    if( ( self.options.el || !hasUrl ) && hn === 'ready' ) {
                        triggerEventHandler.call( self, 'ready', null, null, self.handlers[ hn ].length - 1 );
                    }

                    return self;
                };
            })( dchn[dchni] );

        }
    }

    // 初始化遮罩
    Overlay.prototype.maskInit = function() {
        var self = this,
            opts = self.options,
            $mask;

        $mask = document.createElement('div');
        self.eles.mask = $mask;
        easy.addClass.call( $mask, 'overlay-mask' );
        easy.css.call( $mask, 'opacity', opts.opacity );
        easy.css.call( $mask, 'filter', 'alpha(opacity=' + ( opts.opacity * 100 ) + ')' );

        return $mask;
    };

    // 在元素 el 未有的情况下，初始化 el
    Overlay.prototype.elInit = function() {
        var self = this,
            opts = self.options,
            $el, loadedCallback,
            name = 'overlay-frame-' + opts.serialNumber,
            hasUrl = opts.content.match(opts.urlPattern);

        // 如果 content 是链接，则装入iframe中
        if( hasUrl && hasUrl.length && hasUrl[0] ) {
            $el = document.createElement('iframe');
            $el.setAttribute('name', name);
            $el.setAttribute('id', name);
            $el.src = opts.content;

            elemsBindEvent.call( self, $el, 'ready', 'load', function() {
                elemsUnbindEvent.call( self, $el, 'load' );
            } );

        } else {
            $el = document.createElement('div');
            easy.addClass.call( $el, 'overlay-custom-wrapper' );
            // $el.className += 'overlay-custom-wrapper';
            $el.appendChild(document.createTextNode(opts.content));
        }

        document.body.appendChild($el);

        return $el;
    };

    // 初始化外包含
    Overlay.prototype.containerInit = function() {
        var self = this,
            opts = self.options,
            $container = document.createElement('div');

        self.eles.container = $container;
        easy.addClass.call( $container, 'overlay-container' );
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
            $tool = document.createElement('div');

        self.eles.header = $header;
        easy.addClass.call( $header, 'overlay-header' );
        // $header.className += 'overlay-header';

        self.eles.title = $title;
        easy.addClass.call( $title, 'overlay-title' );
        // $title.className += 'overlay-title';

        self.eles.tool = $tool;
        easy.addClass.call( $tool, 'overlay-head-tool' );

        self.eles.close = $close;
        easy.addClass.call( $close, 'overlay-close-btn' );
        $tool.appendChild( $close )

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
        easy.addClass.call( $body, 'overlay-body' );
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
        easy.addClass.call( $footer, 'overlay-footer overlay-footer-' + ( opts.footAlign ) );
        if( !opts.buttons ) {
            easy.css.call( $footer, 'display', 'none' );
        }

        // $footer.className += 'overlay-footer';

        return $footer;
    };

    // 初始化按钮
    Overlay.prototype.buttonInit = function( className, fnName, text, i ) {
        var self = this,
            opts = self.options,
            btn = document.createElement('a');

        btn.appendChild( document.createTextNode(text) );

        easy.addClass.call( btn, 'overlay-btn overlay-btn-' + i + ( className.length ? (' ' + className.join(' ')) : '' ) );

        self.eles[fnName] = btn;

        return btn;
    };


    // 解析按钮
    Overlay.prototype.parseButtons = function() {
        var self = this,
            opts = self.options,
            buttons = opts.buttons,
            key, fnName, className, text, i = 0,
            $btn, group;

        if( !self.buttonsGroup ) self.buttonsGroup = {};

        for( key in buttons ) {
            className = ~key.indexOf('.') ? key.split('.') : [ key ];
            text = buttons[key];
            fnName = className.splice(0, 1)[0];

            if( !(fnName in self.handlers) ) {
                self.handlers[ fnName ] = [];
            }

            (function( fnName ) {
                self[ fnName ] = function( fn ) {
                    self.handlers[ fnName ].push(fn);

                    return self;
                }
            })( fnName, group );

            $btn = self.eles.footer.appendChild( self.buttonInit( className, fnName, text, i++ ) );
            self.buttonsGroup[ fnName ] = $btn;
        }

        return self;
    };


    // 连缀时使用的once方法，用来在 iframe或是内容加载成功后调用该方法
    Overlay.prototype.once = function( fn ) {
        var self = this,
            opts = self.options;

        if( !('once' in self.handlers) ) self.handlers.once = [];
        if( self.handlers.once.length === 1 ) return self;
        self.handlers.once.push(fn);
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

        // 为
        for( fnName in btnGroup ) {
            $btn = btnGroup[fnName];
            elemsBindEvent.call( self, $btn, fnName );
        }

        // 监听窗口动画事件
        if( supportAnim ) {
            easy.on.call( eles.container, 'webkitAnimationEnd', animationEndHandler.bind(self) );
            easy.on.call( eles.container, 'animationend', animationEndHandler.bind(self) );
        }

        if( eles.close ) {
            easy.on.call( eles.close, 'click', closeHandler.bind( self ) );
        }

        if( opts.drag ) {
            easy.on.call( eles.header, 'mousedown', dragDownOrUpHandler.bind( self ) );

            dragMoveStorage[ opts.serialNumber ] = function( e ) {
                if( !dragFlag ) return;
                var opts = self.options,
                    eles = self.eles;

                easy.css.call( eles.container, 'top', e.clientY - dragD.y + 'px' );
                easy.css.call( eles.container, 'left', e.clientX - dragD.x + 'px' );

            }
            easy.on.call( eles.header, 'mouseup', dragDownOrUpHandler.bind( self ) );
        } else {
            easy.addClass.call( eles.header, 'not-drag' );
        }

        return self;
    };


    // 打开窗口方法
    Overlay.prototype.open = function() {
        var self = this,
            opts = self.options,
            config = Overlay.config;

        easy.addClass.call( self.eles.mask, 'open');

        if( supportAnim ) {
            easy.addClass.call( self.eles.container, 'open overlay-anim ' + opts.animClass.enter);
            setTimeout(function() {
                triggerEventHandler.call( self, 'once' );
            });
        } else {
            easy.addClass.call( self.eles.container, 'open');
            triggerEventHandler.call( self, 'once' );
            triggerEventHandler.call( self, 'opened' );
        }

        setStyle.call( self );

        return self;
    };

    // 关闭窗口方法
    Overlay.prototype.close = function() {
        var self = this,
            opts = self.options;

        easy.removeClass.call( self.eles.mask, 'open');
        if( supportAnim ) {
            easy.addClass.call( self.eles.container, opts.animClass.leave);
        } else {
            easy.removeClass.call( self.eles.container, 'open');
            triggerEventHandler.call( self, 'closed' );
        }

        return self;
    };


    // 组件销毁
    Overlay.prototype.destroy = function() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            i,
            dchn = Overlay.config.defaultCallbackHandlerName;

        for( i in self.buttonsGroup ) {
            if( self.buttonsGroup[i] ) {
                self.buttonsGroup[i].parentNode.removeChild( self.buttonsGroup[i] );
                delete self.buttonsGroup[i];
            }
        }
        delete self.buttonsGroup;

        if( opts.el ) {
            eles.container.parentNode.insertBefore( eles.el, eles.container );
            easy.removeAttr.call( eles.el, 'style' );
            delete eles.el;
        }

        for( i in self.eles ) {
            if( self.eles[i] && self.eles[i].parentNode ) {
                self.eles[i].parentNode.removeChild( self.eles[i] );
            }
        }

        for( i in self.handlers ) {
            if( self[i] ) {
                delete self.handlers[i];
                delete self[i];
            }
        }
        delete self.handlers;

        for( i = 0; i < dchn.length; i++ ) {
            if( self[ dchn[i] ] ) {
                delete self[ dchn[i] ];
            }
        }

        delete self.eles;
        delete self.options;

    };


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

        if( eventName === undefined ) eventName = 'click';
        if( typeof eventName === 'string' ) eventName = [ eventName ];
        if( typeof handlerName === 'string' ) handlerName = [ handlerName ];


        for( ; i < eventName.length; i++ ) {
            for( ; j < handlerName.length; j++ ) {
                easy.on.call( $elem, eventName[i], triggerEventHandler.bind( self, handlerName[j], callback ) );
                // $elem.addEventListener(eventName[i], triggerEventHandler.bind( self, handlerName[j], callback ), false );
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
            handlers = self.handlers[ handlerName ],
            onceFlag,
            returnTemp, i, j;

        i === undefined ? ( i = 0 ) : ( onceFlag = true );

        if( !handlers ) return;

        // 循环已经装载好的所有可执行回调函数
        for( ; i < handlers.length; i++ ) {
            returnStorage[ sn ] = handlers[ i ].call(
                self,
                e,
                returnStorage[ sn ] ? returnStorage[ sn ] : undefined ) || returnStorage[ sn ];

            if( onceFlag ) break;
        }

        // 执行补充的回调函数
        typeof callback === 'function' && callback();

        return self;
    }

    // 支持css延时动画的，会在这里执行
    function animationEndHandler( e ) {
        var self = this,
            opts = self.options,
            eles = self.eles;

        if( e.target !== eles.container ) return;

        if( easy.hasClass.call( eles.container, opts.animClass.enter ) ) {
            triggerEventHandler.call( self, 'opened' );
            easy.removeClass.call( eles.container, opts.animClass.enter);
        } else if( easy.hasClass.call( eles.container, opts.animClass.leave ) ) {
            triggerEventHandler.call( self, 'closed' );
            easy.removeClass.call( eles.container, opts.animClass.leave + ' open');
            easy.removeClass.call( eles.mask, 'open');
        }

    }

    // 关闭事件监听函数
    function closeHandler() {
        this.close();
    }

    // 拖拽事件监听函数
    function dragDownOrUpHandler( e ) {
        var self = this,
            opts = self.options,
            eles = self.eles;

        // mousedown
        if( e.target !== eles.title && e.target !== eles.header ) return;

        if( e.type === 'mousedown' ) {

            dragInit.x = e.clientX;
            dragInit.y = e.clientY;
            dragCurr.x = eles.container.offsetLeft;
            dragCurr.y = eles.container.offsetTop;
            dragD.x = dragInit.x - dragCurr.x;
            dragD.y = dragInit.y - dragCurr.y;

            dragFlag = opts.serialNumber;

            return;
        }

        dragFlag = 0;
        // mouseup
    }


    ////////
    ////////  设置组件样式代码块
    ////////

    // 设置弹出框位置
    function setStyle() {
        var self = this;

        setZIndex.call( self );
        setSize.call( self );
        setOffset.call( self );

    }

    // 设置 z-index 层顺序
    function setZIndex() {
        var self = this,
            opts = self.options,
            mask = self.eles.mask,
            container = self.eles.container,
            cStyle = container.style;

        mask.style.zIndex = opts.zIndex;
        cStyle.zIndex = opts.zIndex;
    }

    // 设置组件位置
    function setOffset() {
        var self = this,
            opts = self.options,
            position = self.position,
            container = self.eles.container,
            cStyle = container.style;

        if( opts.offset && opts.offset.x && opts.offset.y && !opts.isTips ) {

            cStyle.top = correctValue(opts.offset.y);
            cStyle.left = correctValue(opts.offset.x);

        } else if( opts.isTips ) { // 判断是否是提示组件



        } else if( opts.position && !(opts.serialNumber in resizeStorage) ) {

            resizeStorage[ opts.serialNumber ] = function() {

                if( !easy.hasClass.call( container, 'open' ) ) return;

                var windowWidth = document.documentElement.clientWidth,
                    windowHeight = document.documentElement.clientHeight;

                switch( opts.position ) {
                    case 'center' :
                    case 'c' :
                    //

                    container.style.top = correctValue( ( windowHeight - easy.height.call(container) ) / 2 );
                    container.style.left = correctValue( ( windowWidth - easy.width.call(container) ) / 2 );

                    break;

                    case 'top' :
                    case 't' :
                    //
                    break;

                    case 'right' :
                    case 'r' :
                    //

                    break;

                    case 'bottom' :
                    case 'b' :
                    //
                    break;

                    case 'left' :
                    case 'l' :
                    //
                    break;

                    case 'top-left' :
                    case 'tl' :
                    case 't-l' :
                    case 'left-top' :
                    case 'lt' :
                    case 'l-t' :
                    //
                    break;

                    case 'top-right' :
                    case 'tr' :
                    case 't-r' :
                    case 'right-top' :
                    case 'rt' :
                    case 'r-t' :
                    //
                    break;

                    case 'bottom-right' :
                    case 'br' :
                    case 'b-r' :
                    case 'right-bottom' :
                    case 'rb' :
                    case 'r-b' :
                    //
                    break;

                    case 'bottom-left' :
                    case 'bl' :
                    case 'b-l' :
                    case 'left-bottom' :
                    case 'lb' :
                    case 'l-b' :
                    //
                    break;
                }

            };

        }

        if( opts.position && resizeStorage[ opts.serialNumber ] ) {
            resizeStorage[ opts.serialNumber ]();
        }
    }



    // 设置组件尺寸
    function setSize() {
        var self = this,
            opts = self.options,
            eles = self.eles,
            container = eles.container,
            cStyle = container.style,
            windowWidth = document.documentElement.clientWidth,
            windowHeight = document.documentElement.clientHeight,
            containerWidth, containerHeight,
            headerHeight = eles.header ? easy.outerHeight.call( eles.header) : 0,
            footerHeight = eles.footer ? easy.outerHeight.call( eles.footer) : 0,
            cRect;

        if( opts.width ) cStyle.width = containerWidth = correctValue(opts.width);
        if( opts.height ) cStyle.height = containerHeight = correctValue(opts.height);

        // 如果组件的宽度或高度大于了窗口的高或宽，则让组件的宽或高等于窗口的宽或高
        cRect = container.getBoundingClientRect();
        if( cRect.width > windowWidth ) cStyle.width = containerWidth = correctValue(windowWidth);
        if( cRect.height > windowHeight ) cStyle.height = containerHeight = correctValue(windowHeight);

        eles.body.style.height = correctValue( parseInt(containerHeight) - headerHeight - footerHeight );
    }



    // 修正返回值
    function correctValue( num, unit ) {
        var _num,
            hasUnitPattern = /\d?\.?\d+?(\%|px)$/g,
            numPattern = /^\d?\.?\d+?$/g;

        if( unit === undefined ) unit = 'px';

        return typeof num === 'number' || typeof num === 'string' && numPattern.test(num) ? ( num + unit ) :
                hasUnitPattern.test(num) ? num : 'auto';

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
    easy.on.call( window, 'resize', function() {
        var i;
        // 查看序号是否是原始值，是的话，则说明没有创建过组件
        if(!serialNumber) return;

        for( i in resizeStorage ) {
            if( !resizeStorage ) return;

            resizeStorage[ i ]();
        }

    } );

    easy.on.call( document.body, 'mousemove', function( e ) {
        var i;
        // 查看序号是否是原始值，是的话，则说明没有创建过组件
        if(!serialNumber && !dragMoveStorage[ dragFlag ]) return;

        typeof dragMoveStorage[ dragFlag ] === 'function' && dragMoveStorage[ dragFlag ]( e );

    } );





    return Overlay;

});
