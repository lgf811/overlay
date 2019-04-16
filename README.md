# 欢迎使用 Overlay 弹出框插件
------
## 简介
Overlay 是一款通过 Promise 规范与 jQuery 存储数据的方式触发灵感而编写的一款弹出框插件，该插件使用链式函数监听事件，与调用内部方法，支持多点事件监听，事件解绑与绑定。

该插件仅支持IE8以上的浏览器，IE9无法使用内部动画效果


------
## API与示例

### 一、options

#### 1. title (Boolean:false  |  String) 
> default: null

标题 字符串文字表示需要显示，false则为隐藏


#### 2. width (Number  |  String:string(px  |  %  |  )  |  Function)
> default: null

宽度 可设置为数字，数字字符串（像素、百分比）、或是可返回数字类型的Function


#### 3. height (Number  |  String:string(px  |  %  |  )  |  Function)
> default: null

高度 可设置为数字，数字字符串（像素、百分比）、或是可返回数字类型的Function


#### 4. minWidth (Number)
> default: 200

组件的最小宽度，默认值200


#### 5. minHeight (Number  |  String:auto)
> default: "auto"

组件最小高度，默认值 "auto"


#### 6. content (Url:String(./test.html  |  ./test.html?a=b  |  ../  |  ./  |  /  |  http://...  |  https://...)  |  String)
> default: null

如果没有可被绑定的元素，则可以用 url 或是 html 字符串，或是普通的字符串。url 用iframe 打开


#### 6.1. content (String:\$.attr[Attribute] | \$.html | \$.text | string)
> default: null

该情况需要配合子组件tips使用即可生效，获取触发气泡元素的属性或是 HTML 或是 text，再或是普通的字符串。具体使用示例在下面 tips 有展示


#### 7. el (DOM Object |  String:CSS Selector)
> default: null

css选择器或是DOM对象，通过该属性将对象元素装入定义好的DOM中


#### 8. defOpen (Boolean)
> default: false

执行 new Overlay 时就打开组件


#### 9. anim (String)
> default: "scale"

打开动画的方式(fade  |  scale  |  spring  |  fadeSlideUp  |  fadeSlideDown) 动画方式可以通过 css 或是 Overlay.config 添加新的动画方式。css keyframes 打开的name 需要在后面加入-enter 关闭的name 需要加入 -leave，name 则要与 打开动画的name相同


#### 10. position (String)
> default: "center"

组件打开的位置\
其他值：\
左上：top-left  |  tl  |  t-l  |  left-top  |  lt  |  l-t\
上居中：top-center  |  tc  |  t-c  |  center-top  |  ct  |  c-t\
右上：top-right  |  tr  |  t-r  |  right-top  |  rt  |  r-t\
右居中：center-right  |  cr  |  c-r  |  right-center  |  rc  |  r-c\
右下：bottom-right  |  br  |  b-r  |  right-bottom  |  rb  |  r-b\
下居中：bottom-center  |  bc  |  b-c  |  center-bottom  |  cb  |  c-b\
左下：bottom-left  |  bl  |  b-l  |  left-bottom  |  lb  |  l-b\
左居中：center-left  |  cl  |  c-l  |  left-center  |  lc  |  l-c\
自定义：Function:function( container: DOM Obejct ) {}


#### 11.offset (Object)
> default: null

设置组件打开后的偏移位置\
{ \
&nbsp;&nbsp;&nbsp;&nbsp;x: Number  |  String:string(px  |  %  |  )  |  Function,\
&nbsp;&nbsp;&nbsp;&nbsp;y: Number  |  String:string(px  |  %  |  )  |  Function\
}


#### 12.drag (Boolean)
> default: false

组件是否可拖拽


#### 13.footAlign (String:left  |  center  |  right)
> default: "center"

按钮的对齐方式


#### 14.close (Boolean)
> default: true

是否显示关闭按钮


#### 15.bodyClass (String)
> default: null

组件主内容DOM元素样式


#### 16.containerClass (String)
> default: null

组件外层DOM元素样式


#### 17.mask (Number:0~1 | Boolean:false)
> default: 0.4

遮罩层显示透明度或关闭


#### 18.maskClose (Boolean)
> default: true

点击遮罩层是否可以关闭组件


#### 19.full (Boolean)
> default: false

是否显示放大缩小组件按钮


#### 20.defFull (Boolean)
> default: false

是否在打开的时候全屏显示


#### 21.tips (Boolean | DOM Object | String:CSS Selector)
> default: false

使用气泡组件时使用到的参数，其他组件不可使用，与 el 参数类似，在结合 tips 使用的情况下 content 属性可以获取触发元素的对应内容

```html
<!-- 示例1 -->
<a href="javascript:;" class="test-trigger-btn" data-info="气泡内容">气泡触发按钮</a>
```
```javascript
// 示例1
// 该参数在使用气泡时才可以使用
// 在结合 tips 使用的情况下 content 属性可以获取触发器元素的[Attribute]，并将内容显示到气泡DOM中
Overlay.tips({
    content: '$.attr.data-info',
    tips: '.test-trigger-btn'
});
```
示例1中展示了气泡的一种显示方式，默认的触发方式是mouseenter，内容是靠读取属性的方式并加以显示的
```html
<!-- 示例2 -->
<div class="test-tips">测试气泡文字</div>
<a href="javascript:;" class="test-trigger-btn">气泡触发按钮</a>
```
```javascript
// 示例2
// 该参数在使用气泡时才可以使用
// 在结合 tips 使用的情况下 el 属性可以将对应的DOM放入到对应的气泡DOM中
Overlay.tips({
    el: '.test-tips',
    tips: '.test-trigger-btn'
});
```

#### 22.tipsSpace (Number)
> default: 8

弹出的气泡与触发元素的间隔距离


#### 23.resize (Boolean)
> default: true

组件大小是否可调整，鼠标在组件右下角可以触发

#### 24.resize (Boolean)
> default: true

组件大小是否可调整，鼠标在组件右下角可以触发


#### 25.skin (String)
> default: null

组件皮肤，可根据自己的需要，自定义


#### 26.outBound (Boolean)
> default: false

组件在可拖拽的情况下，是否可以拖到界外


#### 27.buttons (Object)
> default: null

组件内存放按钮的参数

```javascript
//示例1
new Overlay({
    title: '示例标题',
    content: '示例文字',
    buttons: {
        'enter.enter-btn': '确定',
        'cancel.cancel-btn': '取消'
    },
    defOpen: true
}).enter(function() {
    console.log( '点击了确定按钮' );
}).cancel(function() {
    console.log( '点击了取消按钮' );
});

//示例2
new Overlay({
    title: '示例标题2',
    content: '示例文字2',
    buttons: {
        'submit.submit-btn': '确定',
        'clear.clear-btn': '清除',
        'shut.shut-btn': '取消'
    },
    defOpen: true
}).submit(function() {
    console.log( '点击了确定按钮' );
}).clear(function() {
    console.log( '点击了清除按钮2' );
}).shut(function() {
    console.log( '点击了取消按钮' );
});
```
上面示例1 buttons 中 enter 是接收回调函数的方法，.enter-btn 是对应按钮的样式，样式也可以写多个，类似 enter.enter-btn.submit-btn 而 enter 也不是指定好的一个接收回调函数的方法，只要在 buttons 里 key 的起始位置写一个单词或是驼峰式的词组，就可以在后面的链式调用中用到。\
示例2中也印证了示例1中的说明，接收回调函数的方法也可以用链式调用，多次接收回调函数\

下面是该组件已经占用的链式调用方法，所以在buttons里就不要再用了，否则会引起报错\
**once、ready、beforeOpen、opened、closed、movestart、moveing、moveend、destroyed、fullBefore、fullAfter、cancelFullBefore、cancelFullAfter、resizeStart、resizing、resizeEnd、open、close、full、cancelFull、autoAdjust、restore、setSize、setOffset、setTop、setContent、off、push、pull、destroy**


#### 28.closedDestroy (Boolean)
> default: false

组件关闭后是否销毁
