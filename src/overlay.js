(function( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    window.Overlay = factory();
})(this, function() {

    class Overlay {
        constructor( options ) {
            const self = this;

            let defOpts = {
                    title: null,
                    width: null,
                    height: null,
                    content: null,
                    el: null
                };

            Object.assign( defOpts, options );

            this.options = options = defOpts;

            let el = defOpts.el,
                content = defOpts.content;

            if( !el && !content ) return;

            let mask = document.createElement('div');
            defOpts.$mask = mask;
            mask.classList.add('overlay-mask');

            if( el ) {
                let $el
                // 找到核心元素 并将遮罩层插入到dom节点中
                defOpts.$el = $el = document.querySelector(el);
                $el.parentNode.insertBefore( mask, $el );

                // 创建包含元素，将核心元素放到包含元素内
                let container = self.containerInit();
                $el.parentNode.insertBefore( container, $el );
                container.appendChild($el);

            } else if( content ) {



            } else if( 1 ) {

            }


            return self;
        }
        init() {
            const self = this;


        }
        close() {

        }
        resize() {

        }

        containerInit() {
            const self = this;
            let container = document.createElement('div'),
                opts = self.options;

            opts.$container = container;
            container.classList.add('overlay-container');

            return container;
        }

        static alert() {
            const self = this;
        }
    }

    return Overlay;

});
 
