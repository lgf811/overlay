(function( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    window.Overlay = factory();
})(this, function() {

    function handy( elem ) {
        return new handy.init( elem );
    }

    handy.prototype.init = function( elem ) {

    }

    return handy;

});

(function( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    window.Overlay = factory();
})(this, function() {

    var _slice = Array.prototype.slice

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

    var extend = function() {
            var argus = _slice.call(arguments),
                newFlag, baseObj, mergeObjGroup, mergeObj,
                i1, i2;

            if( typeof argus[0] !== 'boolean' && typeof argus[0] !== 'object' ) return argus[0];

            if( typeof argus[0] === 'boolean' ) {
                newFlag = argus[0];
                argus.splice(0, 1);
                baseObj = {};
            } else {
                baseObj = argus[0];
                argus.splice(0, 1);
            }
            mergeObjGroup = argus;

            for( i1 = 0; i1 < mergeObjGroup.length; i1++ ) {
                mergeObj = mergeObjGroup[i1];
                for( i2 in mergeObj ) {
                    if( typeof mergeObj[i2] === 'object' && !( mergeObj[i2] instanceof RegExp ) && mergeObj[i2] ) {

                        baseObj[i2] = extend( true, baseObj[i2], mergeObj[i2] );
                    } else {
                        baseObj[i2] = mergeObj[i2];
                    }
                }
            }

            return baseObj;
        }, i1, i2,
        zIndex = 880811,
        serialNumber = 0,
        sheets, rules,
        urlPattern = new RegExp('^\\.?\\/|^https?:\\/\\/|\\/$|[a-z0-9-_=\\?]\/[a-z0-9-_=\\?]', 'gi'),
        windowKey,
        domPrototype,
        easy = {
            addClass: function( cls ) {
                var clsn = this.className;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];

                if( ~clsn.indexOf( cls ) ) return this;

                clsn.push(cls);
                this.className = clsn.join(' ');
            },
            removeClass: function() {
                var clsn = this.className;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];

                if( !~clsn.indexOf( cls ) ) return this;

                clsn.splice(clsn.indexOf( cls ), 1);
                this.className = clsn.join(' ');
            },
            hasClass: function( cls ) {
                var clsn = this.className,
                    parent = this.parentNode;

                clsn = ~clsn.indexOf(' ') ? clsn.split(' ') : [ clsn ];

                return !!~clsn.indexOf(cls);
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
            }
        },
        returnStorage = {},
        defaultCallbackHandlerName = [ 'once', 'ready' ],
        dchni = 0;
        // urlPattern = /^\.?\/|^https?:\/\/|\/$|[a-z0-9-_=\?]\/[a-z0-9-_=\?]/gi;
        // /^\.?\/|^https?:\/\/|\/$|[a-z0-9-_=\?]\/[a-z0-9-_=\?]/gi

    if( ~location.protocol.indexOf('http')) {
        sheets = _slice.call(document.styleSheets, 0);

        for( i1 = 0; i1 < sheets.length; i1++ ) {
            rules = _slice.call(sheets[i1].rules, 0);

            for( i2 in rules) {
                if( rules[i2].style.zIndex > zIndex ) zIndex = Number(rules[i2].style.zIndex);
            }
        }
    }




    function Overlay( options ) {
        var self = this,
            defOpts = extend({}, Overlay.config, options );

        self.options = defOpts;

        if( !defOpts.el && !defOpts.content ) return;

        self.options.width = 10000;
        self.options.zIndex = zIndex;
        self.options.serialNumber = serialNumber++;
        self.init();

        return self;
    }

    Overlay.config = {
        title: null,
        width: null,
        height: null,
        content: null,
        el: null,
        urlPattern: urlPattern,
        showClose: true,
        defOpen: false
    };

    Overlay.prototype.init = function() {
        if( this.eles ) return this;

        var self = this,
            opts = self.options,
            el, content, $mask,
            $el, $container;

        if( !('handlers' in self) ) {
            self.handlers = {};
        }

        if( !self.ready ) self.defaultCallbackInit();

        if( !('eles' in self) ) {
            self.eles = {};
        }

        $mask = self.maskInit();

        el = opts.el;
        content = opts.content;

        if( el ) {
            // 找到核心元素 并将遮罩层插入到dom节点中
            self.eles.el = $el = document.querySelector(el);
            $el.parentNode.insertBefore( $mask, $el );

        } else if( content ) {
            document.body.appendChild($mask);
            // 如果没有指定dom 则使用渲染内容的形式
            self.eles.el = $el = self.elInit();
        }

        // 将实例绑到dom对象上，方便查找调用
        $el.overlay = self;

        // 创建包含元素，将核心元素放到包含元素内
        $container = self.containerInit();

        $el.parentNode.insertBefore( $container, $el );
        $container.appendChild( self.headerInit() );
        $container.appendChild( self.bodyInit() );
        $container.appendChild( self.footerInit() );

        // 根据配置，操作 header内的元素
        if( opts.title ) {
            self.eles.title.innerText = opts.title;
        } else {
            self.eles.header.style.display = 'none';
        }

        if( !opts.showClose ) self.eles.close.style.display = 'none';

        // 根据配置，操作footer内的元素
        if( opts.buttons && typeof opts.buttons === 'object' ) {
            this.parseButtons();
        }

        // 初始化事件
        self.eventInit();

        // 如果默认初始化就打开，则执行open方法
        if( opts.defOpen ) self.open();

    };

    // 初始化内置回调方法
    Overlay.prototype.defaultCallbackInit = function() {
        var self = this,
            opts = self.options,
            sn = self.options.serialNumber,
            hasUrl = opts.urlPattern.test(opts.content);

        // 将默认的回调方法输出
        for( dchni = 0; dchni < defaultCallbackHandlerName.length; dchni++ ) {
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
                        eventHandler.call( self, 'ready', null, null, self.handlers[ hn ].length - 1 );
                    }

                    return self;
                };
            })( defaultCallbackHandlerName[dchni] );

        }
    }

    // 初始化遮罩
    Overlay.prototype.maskInit = function() {
        var self = this,
            opts = self.options,
            $mask;

        $mask = document.createElement('div');
        self.eles.mask = $mask;
        $mask.classList.add('overlay-mask');

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
            $el.className += 'overlay-custom-wrapper';
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
        $container.className += 'overlay-container';

        return $container;
    };

    // 初始化头部
    Overlay.prototype.headerInit = function() {
        var self = this,
            opts = self.options,
            $header = document.createElement('div'),
            $title = document.createElement('span'),
            $close = document.createElement('a');

        self.eles.header = $header;
        $header.className += 'overlay-header';

        self.eles.title = $title;
        $title.className += 'overlay-title';

        self.eles.close = $close;
        $close.className += 'overlay-close-btn';
        $close.innerText = '关闭';

        $header.appendChild( $title );
        $header.appendChild( $close );

        return $header;
    };

    // 初始化内容包围
    Overlay.prototype.bodyInit = function() {
        var self = this,
            opts = self.options,
            $body = document.createElement('div');

        self.eles.body = $body;
        $body.className += 'overlay-body';

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
        $footer.className += 'overlay-footer';

        return $footer;
    };

    // 初始化按钮
    Overlay.prototype.buttonInit = function( className, fnName, text, i ) {
        var self = this,
            opts = self.options,
            btn = document.createElement('a');

        btn.appendChild( document.createTextNode(text) );
        btn.className += 'overlay-btn overlay-btn-' + i;
        btn.className += className ? (' ' + className.join(' ')) : '';

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

    // 调用装载好的 once 内的方法
    // Overlay.prototype.callReadyHandler = function( e ) {
    //     var self = this,
    //         opts = self.options,
    //         sn = opts.serialNumber;
    //
    //     returnStorage[ sn ] = self.handlers.ready[0].call( self, e, returnStorage[ sn ] ? returnStorage[ sn ] : undefined ) || returnStorage[ sn ];
    //     return self;
    // };

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
            btnGroup = self.buttonsGroup,
            fnName, fnGroup,
            $btn;

        // 为
        for( fnName in btnGroup ) {
            $btn = btnGroup[fnName];
            elemsBindEvent.call( self, $btn, fnName );
        }

        // 监听窗口动画事件
        if( 'ontransitionend' in window ) {
            self.eles.container.addEventListener('webkitTransitionEnd', transitionendHandler, false);
            self.eles.container.addEventListener('transitionend', transitionendHandler, false);
        }

        if( !('closeHandler' in self) ) {
            Overlay.prototype.closeHandler = function() {
                easy.addClass.call( self.eles.mask, 'close-mask' );
                if( 'ontransitionend' in window ) {
                    easy.addClass.call( self.eles.container, 'close-anim-container' );
                } else {
                    easy.addClass.call( self.eles.container, 'close-container' );
                }
            };
        }

        self.eles.close.addEventListener('click', self.closeHandler, false);

        return self;
    };


    // 打开窗口方法
    Overlay.prototype.open = function() {
        var self = this,
            opts = self.options;

        easy.addClass.call( self.eles.mask, 'open');
        easy.addClass.call( self.eles.container, 'open');

        setOffset.call( self );

        setTimeout(function() {
            easy.addClass.call( self.eles.container, 'opening');
        });
        return self;
    };

    // 打开窗口方法
    Overlay.prototype.close = function() {
        var self = this,
            opts = self.options;

        easy.addClass.call( self.eles.container, 'close' );

        return self;
    };









    // 为元素绑定事件
    function elemsBindEvent( $elem, handlerName, eventName, callback ) {
        var self = this;
        if( typeof eventName === 'function' ) {
            callback = eventName;
            eventName = 'click';
        }
        if( eventName === undefined ) eventName = 'click';
        $elem.addEventListener(eventName, eventHandler.bind( self, handlerName, callback ), false );
        return self;
    }

    // 为元素移除事件
    function elemsUnbindEvent( $elem, eventName ) {
        var self = this;

        eventName = eventName ? eventName : 'click';
        $elem.removeEventListener(eventName, eventHandler, false );

        return self;
    }

    // 所有调用方法的回调，全部在这里被执行
    function eventHandler( handlerName, callback, e, i ) {
        var self = this,
            opts = self.options,
            sn = opts.serialNumber,
            handlers = self.handlers[ handlerName ],
            onceFlag;

        if( i === undefined ) {
            i = 0;
        } else {
            onceFlag = true;
        }


        // 循环已经装载好的所有可执行回调函数
        for( ; i < handlers.length; i++ ) {
            returnStorage[ sn ] = handlers[ i ].call( self, e, returnStorage[ sn ] ? returnStorage[ sn ] : undefined ) || returnStorage[ sn ];
            if( onceFlag ) break;
        }

        // 执行回
        callback && callback();

        return self;
    }

    // 支持css延时动画的，全部在这里被执行
    function transitionendHandler() {

    }

<<<<<<< HEAD
    //
    function setOffset() {
        var self = this,
            position = self.position,
            offset = window.documentElement.getBoundingClientRect();

=======
    // 设置弹出框位置
    function setOffset() {
        var self = this,
            opts = self.options,
            position = self.position,
            offset = window.documentElement.getBoundingClientRect(),
            cssText,
            container = self.eles.container,
            cStyle = container.style,
            num;

        if( opts.width ) cStyle.width = correctNumber(opts.width);
        if( opts.height ) cStyle.height = correctNumber(opts.height);

        

    }

    function correctNumber( num ) {
        var _num,
            hasUnitPattern = /\d+(\%|px)$/g,
            numPattern = /^\d+$/g;

        return typeof num === 'number' || typeof num === 'string' && numPattern.test(num) ? ( num + 'px' ) :
                hasUnitPattern.test(num) ? num : 'auto';
>>>>>>> d87228a70b3d7a7a1ee98a9d4c0b6654633c4403

    }

    return Overlay;

});
