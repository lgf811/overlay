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
    var _slice = Array.prototype.slice,
        extend = function() {
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
                var className = this.className;

                className = ~className.indexOf(' ') ? className.split(' ') : [ className ];

                if( ~className.indexOf( cls ) ) return this;

                className.push(cls);
                this.className = className.join(' ');
            },
            removeClass: function() {
                var className = this.className;

                className = ~className.indexOf(' ') ? className.split(' ') : [ className ];

                if( !~className.indexOf( cls ) ) return this;

                className.splice(className.indexOf( cls ), 1);
                this.className = className.join(' ');
            }
        };
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

        var self = this,
            opts = self.options,
            el, content, $mask,
            $el, $container;

        // self.parsePutTogether();

        if( !('handlers' in self) ) {
            self.handlers = {};
        }

        $mask = self.maskInit();

        el = opts.el;
        content = opts.content;

        if( el ) {
            // 找到核心元素 并将遮罩层插入到dom节点中
            self.$el = $el = document.querySelector(el);
            $el.parentNode.insertBefore( $mask, $el );

        } else if( content ) {
            document.body.appendChild($mask);
            // 如果没有指定dom 则使用渲染内容的形式
            self.$el = $el = self.elInit();
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
            self.$title.innerText = opts.title;
        } else {
            self.$header.style.display = 'none';
        }

        if( !opts.showClose ) self.$close.style.display = 'none';

        // 根据配置，操作footer内的元素
        if( opts.buttons && typeof opts.buttons === 'object' ) {
            this.parseButtons();
        }

        // 初始化事件
        self.eventInit();

        // 如果是元素已经存在，则直接执行回调方法
        if( el && opts.defOpen ) {
            self.callContentHandler();
        }

    };

    // 初始化遮罩
    Overlay.prototype.maskInit = function() {
        var self = this,
            opts = self.options,
            $mask;

        $mask = document.createElement('div');
        self.$mask = $mask;
        $mask.classList.add('overlay-mask');

        return $mask;
    };

    // 在元素 el 未有的情况下，初始化 el
    Overlay.prototype.elInit = function() {
        var self = this,
            opts = self.options,
            $el, loadedCallback,
            name = 'overlay-frame-' + opts.serialNumber;

        // 如果content 是链接，则装入iframe中
        if( opts.content.match(opts.urlPattern)[0] ) {
            $el = document.createElement('iframe');
            $el.setAttribute('name', name);
            $el.setAttribute('id', name);
            $el.src = opts.content;
            loadedCallback = function( e ) {
                opts.frameObj = window.frames[name];
                if( opts.defOpen ) self.callContentHandler( e );
                this.removeEventListener('load', loadedCallback);
            }

            $el.addEventListener('load', loadedCallback, false);
        } else {
            $el = document.createElement('div');
            $el.appendChild(document.createTextNode(opts.content));
        }

        $el.className += 'overlay-custom-wrapper';
        document.body.appendChild($el);

        return $el;
    };

    // 初始化外包含
    Overlay.prototype.containerInit = function() {
        var self = this,
            opts = self.options,
            $container = document.createElement('div');

        self.$container = $container;
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

        self.$header = $header;
        $header.className += 'overlay-header';

        self.$title = $title;
        $title.className += 'overlay-title';

        self.$close = $close;
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

        self.$body = $body;
        $body.className += 'overlay-body';

        $body.appendChild( self.$el );

        return $body;
    };

    // 初始化底部
    Overlay.prototype.footerInit = function() {
        var self = this,
            opts = self.options,
            $footer = document.createElement('div'),
            $title = document.createElement('div');

        self.$footer = $footer;
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

        self['$' + fnName] = btn;

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

            $btn = self.$footer.appendChild( self.buttonInit( className, fnName, text, i++ ) );
            self.buttonsGroup[ fnName ] = $btn;
        }

        return self;
    };


    // 调用装载好的 content 内的方法
    Overlay.prototype.callContentHandler = function( e ) {
        var self = this,
            opts = self.options;

        if( !self.handlers.content || !self.handlers.content.length ) return;

        self.handlers.content.forEach(function( fn, i ) {
            fn.call( self, e );
        });

        return self;
    };

    // 连缀时使用的content方法，用来在 iframe或是内容加载成功后调用该方法
    Overlay.prototype.content = function( fn ) {
        var self = this,
            opts = self.options;

        if( !('content' in self.handlers) ) {
            self.handlers.content = [];
        }

        self.handlers.content.push(fn);

        return self;
    };


    // 事件初始化
    Overlay.prototype.eventInit = function() {
        var self = this,
            opts = self.options,
            btnGroup = self.buttonsGroup,
            fnName, fnGroup,
            $btn, returnStorage;


        if( !('callButtonHandler' in self) ) {
            // 调用装载好的自定义 button 内的方法
            Overlay.prototype.callButtonHandler = function( e ) {

                var fnGroup = this.fnGroup,
                    i = 0;


                for( ; i < fnGroup.length; i++ ) {
                    returnStorage = fnGroup[ i ].call( this.overlay, e, returnStorage ? returnStorage : undefined );
                }
            };
        }


        for( fnName in btnGroup ) {

            $btn = btnGroup[fnName];
            $btn.fnGroup = self.handlers[fnName];
            $btn.overlay = self;
            $btn.addEventListener('click', self.callButtonHandler, false );

        }


        // 为容器添加一个动画监听事件
        if( typeof self.containerTransitionEndHandler === 'undefined' && !('containerTransitionEndHandler' in self) ) {
            Overlay.prototype.containerTransitionEndHandler = function( e ) {
                if( e.currenterTarget === self.$container ) {

                }
            };
        }

        // 监听窗口动画事件
        if( 'ontransitionend' in window ) {
            self.$container.addEventListener('webkitTransitionEnd', self.containerTransitionEndHandler, false);
            self.$container.addEventListener('transitionend', self.containerTransitionEndHandler, false);
        }

        if( !('closeHandler' in self) ) {
            Overlay.prototype.closeHandler = function() {
                easy.addClass.call( self.$mask, 'close-mask' );
                if( 'ontransitionend' in window ) {
                    easy.addClass.call( self.$container, 'close-anim-container' );
                } else {
                    easy.addClass.call( self.$container, 'close-container' );
                }
            };
        }

        self.$close.addEventListener('click', self.closeHandler, false);

        return self;
    };


    Overlay.prototype.close = function() {
        var self = this,
            opts = self.options;

        easy.addClass.call( self.$container, 'close' );

        return self;
    };


    return Overlay;

});
