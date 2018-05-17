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
                    if( typeof mergeObj[i2] === 'object' && mergeObj[i2] ) {
                        baseObj[i2] = {};
                        extend( true, baseObj[i2], mergeObj[i2] );
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
        urlPattern = /^\.?\/|^https?:\/\/|\/$|[a-z0-9-_=\?]\/[a-z0-9-_=\?]/gi;

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
        urlPattern: urlPattern
    };

    Overlay.prototype.init = function() {
        var self = this,
            opts = self.options,
            el, content, $mask,
            $el, $container;

        self.parsePutTogether();

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

        // 创建包含元素，将核心元素放到包含元素内
        $container = self.containerInit();
        $el.parentNode.insertBefore( $container, $el );
        $container.appendChild( self.headerInit() );
        $container.appendChild( self.bodyInit() );
        $container.appendChild( self.footerInit() );
    };

    Overlay.prototype.maskInit = function() {
        var self = this,
            opts = self.options,
            $mask;

        $mask = document.createElement('div');
        self.$mask = $mask;
        $mask.classList.add('overlay-mask');

        return $mask;
    };

    Overlay.prototype.elInit = function() {
        var self = this,
            opts = self.options,
            $el, loadedCallback,
            name = 'overlay-frame-' + opts.serialNumber;

        // 如果content 是链接，则装入iframe中
        if( urlPattern.test(opts.content) ) {
            $el = document.createElement('iframe');
            $el.setAttribute('name', name);
            $el.setAttribute('id', name);
            $el.src = opts.content;
            loadedCallback = function( e ) {
                opts.frameObj = window.frames[name];
                self.callContentHandler( e );
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

    Overlay.prototype.containerInit = function() {
        var self = this,
            opts = self.options,
            $container = document.createElement('div');

        self.$container = $container;
        $container.className += 'overlay-container';

        return $container;
    };

    Overlay.prototype.headerInit = function() {
        var self = this,
            opts = self.options,
            $header = document.createElement('div'),
            $title = document.createElement('div');

        self.$header = $header;
        $header.className += 'overlay-header';

        self.$title = $title;
        $title.className += 'overlay-title';

        $header.appendChild( $title );

        return $header;
    }

    Overlay.prototype.bodyInit = function() {
        var self = this,
            opts = self.options,
            $body = document.createElement('div');

        self.$body = $body;
        $body.className += 'overlay-body';

        $body.appendChild( self.$el );

        return $body;
    }

    Overlay.prototype.footerInit = function() {
        var self = this,
            opts = self.options,
            $container = document.createElement('div');

        opts.$container = $container;
        $container.className += 'overlay-container';

        return $container;
    }

    Overlay.prototype.contentLoadingSuccess = function() {

    }

    Overlay.prototype.parsePutTogether = function() {

    }



    return Overlay;

});
