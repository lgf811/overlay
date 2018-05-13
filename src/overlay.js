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
                    mergeObj;
                    if( typeof mergeObj[i2] === 'object' ) {
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
        sheets, rules;

    if( ~location.protocol.indexOf('http')) {
        sheets = _slice.call(document.styleSheets, 0);

        for( i1 = 0; i1 < sheets.length; i1++ ) {
            rules = _slice.call(sheets[i1].rules, 0);

            for( i2 in rules) {
                if( rules[i2].style.zIndex > zIndex ) zIndex = Number(rules[i2].style.zIndex) + 1;
            }
        }
    }

    // var a = {a: 123, b: 321},
    //     b = {aa: 123123, bb: 321321};
    //
    // extend( true, a, b );
    //
    // console.log( extend( true, a, b ) );
    // console.log( a );
    // console.log( b );

    function Overlay( options ) {
        var self = this,
            defOpts = {
                title: null,
                width: null,
                height: null,
                content: null,
                el: null
            },
            el, content, mask,
            $el, container;

        extend( defOpts, options );

        this.options = options = defOpts;

        el = defOpts.el;
        content = defOpts.content;
        mask;

        if( !el && !content ) return;

        mask = document.createElement('div');
        defOpts.$mask = mask;
        mask.classList.add('overlay-mask');

        if( el ) {
            // 找到核心元素 并将遮罩层插入到dom节点中
            defOpts.$el = $el = document.querySelector(el);
            $el.parentNode.insertBefore( mask, $el );

            // 创建包含元素，将核心元素放到包含元素内
            container = self.containerInit();
            $el.parentNode.insertBefore( container, $el );
            // container.appendChild($el);

        } else if( content ) {



        } else if( 1 ) {

        }


        return self;
    }

    Overlay.prototype.init = function() {

    }

    Overlay.prototype.containerInit = function() {
        var self = this,
            container = document.createElement('div'),
            opts = self.options;

        opts.$container = container;
        container.classList.add('overlay-container');

        return container;
    }

    // class Overlay {
    //     constructor( options ) {
    //         const self = this;
    //
    //         let defOpts = {
    //                 title: null,
    //                 width: null,
    //                 height: null,
    //                 content: null,
    //                 el: null
    //             };
    //
    //         Object.assign( defOpts, options );
    //
    //         this.options = options = defOpts;
    //
    //         let el = defOpts.el,
    //             content = defOpts.content;
    //
    //         if( !el && !content ) return;
    //
    //         let mask = document.createElement('div');
    //         defOpts.$mask = mask;
    //         mask.classList.add('overlay-mask');
    //
    //         if( el ) {
    //             let $el
    //             // 找到核心元素 并将遮罩层插入到dom节点中
    //             defOpts.$el = $el = document.querySelector(el);
    //             $el.parentNode.insertBefore( mask, $el );
    //
    //             // 创建包含元素，将核心元素放到包含元素内
    //             let container = self.containerInit();
    //             $el.parentNode.insertBefore( container, $el );
    //             container.appendChild($el);
    //
    //         } else if( content ) {
    //
    //
    //
    //         } else if( 1 ) {
    //
    //         }
    //
    //
    //         return self;
    //     }
    //     init() {
    //         const self = this;
    //
    //
    //     }
    //     close() {
    //
    //     }
    //     resize() {
    //
    //     }
    //
    //     containerInit() {
    //         const self = this;
    //         let container = document.createElement('div'),
    //             opts = self.options;
    //
    //         opts.$container = container;
    //         container.classList.add('overlay-container');
    //
    //         return container;
    //     }
    //
    //     static alert() {
    //         const self = this;
    //     }
    // }

    return Overlay;

});
