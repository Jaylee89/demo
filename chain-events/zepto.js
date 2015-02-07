(function(undefined) {  
  if (String.prototype.trim === undefined) // fix for iOS 3.2  
    String.prototype.trim = function() {  
      return this.replace(/^\s+|\s+$/g, '')  
    }  
  
  // For iOS 3.x  
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce  
  // 对数组进行累计执行fun，将上一次执行的结果传递给下一个循环  
  if (Array.prototype.reduce === undefined)  
    Array.prototype.reduce = function(fun) {  
      if (this === void 0 || this === null) throw new TypeError()  
      var t = Object(this),  
        // javascript无符号右移运算(也叫算术右移)：请见我的另一篇博客:  
        // http://www.cnblogs.com/keva/articles/javascript-binary-arithmetic.html  
        //javascript中对于(this.length >>> 0)运算有一个特殊的作用 1.所有非数值转换成0 2.所有大于等于 0 数取整数部分  
        len = t.length >>> 0,  
        k = 0,  
        accumulator  
      if (typeof fun != 'function') throw new TypeError()  
      if (len == 0 && arguments.length == 1) throw new TypeError()  
  
      if (arguments.length >= 2)  
        accumulator = arguments[1]  
      else  
        do {  
          if (k in t) {  
            accumulator = t[k++]  
            break  
          }  
          if (++k >= len) throw new TypeError()  
        } while (true)  
  
        while (k < len) {  
          if (k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)  
          k++  
        }  
      return accumulator  
    }  
})()  
  
var Zepto = (function() {  
  var undefined, key, $, classList, emptyArray = [],  
    slice = emptyArray.slice,  
    filter = emptyArray.filter,  
    document = window.document,  
    elementDisplay = {}, classCache = {},  
    getComputedStyle = document.defaultView.getComputedStyle,  
    // 设置css时不用加'px'后缀的属性列表  
    cssNumber = {  
      'column-count': 1,  
      'columns': 1,  
      'font-weight': 1,  
      'line-height': 1,  
      'opacity': 1,  
      'z-index': 1,  
      'zoom': 1  
    },  
    // HTML代码片段正则  
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,  
    // 匹配非单独一个闭合标签的标签  
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,  
    // 根节点  
    rootNodeRE = /^(?:body|html)$/i,  
  
    // special attributes that should be get/set via method calls  
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],  
  
    adjacencyOperators = ['after', 'prepend', 'before', 'append'],  
    table = document.createElement('table'),  
    tableRow = document.createElement('tr'),  
    containers = {  
      'tr': document.createElement('tbody'),  
      'tbody': table,  
      'thead': table,  
      'tfoot': table,  
      'td': tableRow,  
      'th': tableRow,  
      '*': document.createElement('div')  
    },  
    readyRE = /complete|loaded|interactive/,  
    // Class选择器  
    classSelectorRE = /^\.([\w-]+)$/,  
    // id选择器  
    idSelectorRE = /^#([\w-]*)$/,  
    // tag选择器  
    tagSelectorRE = /^[\w-]+$/,  
    class2type = {},  
    toString = class2type.toString,  
    zepto = {},  
    camelize, uniq,  
    tempParent = document.createElement('div')  
  
    // 判断一个元素是否匹配给定的selector选择器  
    zepto.matches = function(element, selector) {  
      if (!element || element.nodeType !== 1) return false  
      // 浏览器支持的matchesSelector方法  
      var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||  
        element.oMatchesSelector || element.matchesSelector  
      if (matchesSelector) return matchesSelector.call(element, selector)  
      // fall back to performing a selector:  
      var match, parent = element.parentNode,  
        temp = !parent  
      if (temp)(parent = tempParent).appendChild(element)  
      // 查找在parent中根据selector查找元素，并返回element在这些元素中的索引值  
      // 位运算符(~)的作用请见：  
      // http://www.cnblogs.com/keva/articles/javascript-binary-arithmetic.html  
      match = ~zepto.qsa(parent, selector).indexOf(element)  
      temp && tempParent.removeChild(element)  
      return match  
    }  
  
    // 利用String.prototype.toStirng判断给定参数的类型  
    function type(obj) {  
      return obj == null ? String(obj) :  
        class2type[toString.call(obj)] || "object"  
    }  
  
    // 判断给定参数是否是函数  
    function isFunction(value) {  
      return type(value) == "function"  
    }  
  
    // 判断给定参数是否是window对象  
    // window.window === window  
    function isWindow(obj) {  
      return obj != null && obj == obj.window  
    }  
  
    // 判断给定参数是否是document对象  
    function isDocument(obj) {  
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE  
    }  
  
    // 判断给定参数是否是object  
    function isObject(obj) {  
      return type(obj) == "object"  
    }  
  
    // 判断给定参数是否是plainobject，对于用对象字面量建立和用new Object()的对象返回true；new Object传递参数的返回false  
    // 参考： http://snandy.iteye.com/blog/663245  
    function isPlainObject(obj) {  
      return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype  
    }  
  
    // 判断给定参数是否是Array  
    // 这里的判断没有认定"类数组"是数组，关于"类数组"的判断可以参考"鸭式辨型"  
    function isArray(value) {  
      return value instanceof Array  
    }  
  
    // 简单的判断给定对象是否有length属性来判断该对象是否是"类数组"  
    function likeArray(obj) {  
      return typeof obj.length == 'number'  
    }  
  
    // 清除给定参数中成员为null或undefined(undefined == null)的成员，注意 0 != null '' != null  
    function compact(array) {  
      return filter.call(array, function(item) {  
        return item != null  
      })  
    }  
  
    // 得到一个数组的副本  
    function flatten(array) {  
      return array.length > 0 ? $.fn.concat.apply([], array) : array  
    }  
  
    // 将给定参数的字符转化为驼峰命名法  
  camelize = function(str) {  
    return str.replace(/-+(.)?/g, function(match, chr) {  
      return chr ? chr.toUpperCase() : ''  
    })  
  }  
  
  // 将字符串格式化成用(-)拼接的形式  
  function dasherize(str) {  
    return str.replace(/::/g, '/')  
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')  
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')  
      .replace(/_/g, '-')  
      .toLowerCase()  
  }  
  
  // 去除数组中重复的元素  
  uniq = function(array) {  
    return filter.call(array, function(item, idx) {  
      return array.indexOf(item) == idx  
    })  
  }  
  
  // 缓存给定的正则  
  function classRE(name) {  
    return name in classCache ?  
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))  
  }  
  
  // 需要添加'px'后缀的属性  
  function maybeAddPx(name, value) {  
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value  
  }  
  
  // 获取给定node的display属性  
  function defaultDisplay(nodeName) {  
    var element, display  
    if (!elementDisplay[nodeName]) {  
      element = document.createElement(nodeName)  
      document.body.appendChild(element)  
      display = getComputedStyle(element, '').getPropertyValue("display")  
      element.parentNode.removeChild(element)  
      display == "none" && (display = "block")  
      elementDisplay[nodeName] = display  
    }  
    return elementDisplay[nodeName]  
  }  
  
  // 返回element的子节点列表  
  function children(element) {  
    return 'children' in element ?  
      slice.call(element.children) :  
      $.map(element.childNodes, function(node) {  
        // 排除空节点  
        if (node.nodeType == 1) return node  
      })  
  }  
  
  // `$.zepto.fragment` takes a html string and an optional tag name  
  // to generate DOM nodes nodes from the given html string.  
  // The generated DOM nodes are returned as an array.  
  // This function can be overriden in plugins for example to make  
  // it compatible with browsers that don't support the DOM fully.  
  zepto.fragment = function(html, name, properties) {  
    if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")  
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1  
    if (!(name in containers)) name = '*'  
  
    var nodes, dom, container = containers[name]  
      container.innerHTML = '' + html  
      dom = $.each(slice.call(container.childNodes), function() {  
        container.removeChild(this)  
      })  
      if (isPlainObject(properties)) {  
        nodes = $(dom)  
        $.each(properties, function(key, value) {  
          if (methodAttributes.indexOf(key) > -1) nodes[key](value)  
          else nodes.attr(key, value)  
        })  
      }  
    return dom  
  }  
  
  // `$.zepto.Z` swaps out the prototype of the given `dom` array  
  // of nodes with `$.fn` and thus supplying all the Zepto functions  
  // to the array. Note that `__proto__` is not supported on Internet  
  // Explorer. This method can be overriden in plugins.  
  zepto.Z = function(dom, selector) {  
    dom = dom || []  
    dom.__proto__ = $.fn // 让dom继承所有$.fn中的方法，类似jquery中$.fn = $.prototype = $.fn.init.prototype  
    dom.selector = selector || ''  
    return dom  
  }  
  
  // `$.zepto.isZ` should return `true` if the given object is a Zepto  
  // collection. This method can be overriden in plugins.  
  zepto.isZ = function(object) {  
    return object instanceof zepto.Z  
  }  
  
  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and  
  // takes a CSS selector and an optional context (and handles various  
  // special cases).  
  // This method can be overriden in plugins.  
  // zepto 选择器函数  
  zepto.init = function(selector, context) {  
    // If nothing given, return an empty Zepto collection  
    // 选择器为空，返回一个空的zepto集合  
    if (!selector) return zepto.Z()  
    // If a function is given, call it when the DOM is ready  
    // selector为函数，则认定是DOM ready执行函数  
    else if (isFunction(selector)) return $(document).ready(selector)  
    // If a Zepto collection is given, just return it  
    // 如果已经是zepto集合，直接返回  
    else if (zepto.isZ(selector)) return selector  
    else {  
      var dom  
      // normalize array if an array of nodes is given  
      if (isArray(selector)) dom = compact(selector)  
      // Wrap DOM nodes. If a plain object is given, duplicate it.  
      else if (isObject(selector))  
        dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null  
        // If it's a html fragment, create nodes from it  
      else if (fragmentRE.test(selector))  
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null  
        // If there's a context, create a collection on that context first, and select  
        // nodes from there  
      else if (context !== undefined) return $(context).find(selector)  
      // And last but no least, if it's a CSS selector, use it to select nodes.  
      else dom = zepto.qsa(document, selector)  
      // create a new Zepto collection from the nodes found  
      return zepto.Z(dom, selector)  
    }  
  }  
  
  // `$` will be the base `Zepto` object. When calling this  
  // function just call `$.zepto.init, which makes the implementation  
  // details of selecting nodes and creating Zepto collections  
  // patchable in plugins.  
  $ = function(selector, context) {  
    return zepto.init(selector, context)  
  }  
  
  // 扩展对象，将source参数扩展至target对象中，deep标识是否深度拷贝  
  function extend(target, source, deep) {  
    for (key in source)  
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {  
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))  
          target[key] = {}  
        if (isArray(source[key]) && !isArray(target[key]))  
          target[key] = []  
        extend(target[key], source[key], deep)  
      } else  
    if (source[key] !== undefined) target[key] = source[key]  
  }  
  
  // Copy all but undefined properties from one or more  
  // objects to the `target` object.  
  $.extend = function(target) {  
    var deep, args = slice.call(arguments, 1)  
      if (typeof target == 'boolean') {  
        deep = target  
        target = args.shift()  
      }  
    args.forEach(function(arg) {  
      extend(target, arg, deep)  
    })  
    return target  
  }  
  
  // `$.zepto.qsa` is Zepto's CSS selector implementation which  
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.  
  // This method can be overriden in plugins.  
  // css选择器函数，优化了id选择器(利用getElementById)和class选择器(利用getElementsByClassName)getElementsByClassName() 在 Internet Explorer 5,6,7,8 中无效。  
  zepto.qsa = function(element, selector) {  
    var found  
    return (isDocument(element) && idSelectorRE.test(selector)) ?  
      ((found = element.getElementById(RegExp.$1)) ? [found] : []) :  
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :  
      slice.call(  
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :  
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :  
        element.querySelectorAll(selector)  
    )  
  }  
  
  // 根据selector筛选元素  
  function filtered(nodes, selector) {  
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)  
  }  
  
  // 检查parent元素是否是node元素的父节点  
  $.contains = function(parent, node) {  
    return parent !== node && parent.contains(node)  
  }  
  
  // 处理arg参数为函数的情况  
  // 在$.fn.html函数中，传递一个funcArg(this, html, idx, originHtml)，可以获取元素原来的html  
  function funcArg(context, arg, idx, payload) {  
    return isFunction(arg) ? arg.call(context, idx, payload) : arg  
  }  
  
  // 设置属性函数，如果不传value参数，相当于删除由name指定的属性  
  function setAttribute(node, name, value) {  
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)  
  }  
  
  // access className property while respecting SVGAnimatedString  
  // 返回元素的className属性，如果是svg元素，返回baseVal参数；如果传递value，则是设置className属性  
  function className(node, value) {  
    var klass = node.className,  
      svg = klass && klass.baseVal !== undefined  
  
    if (value === undefined) return svg ? klass.baseVal : klass  
    svg ? (klass.baseVal = value) : (node.className = value)  
  }  
  
  // 格式化字符串，规则如下  
  // "true"  => true  
  // "false" => false  
  // "null"  => null  
  // "42"    => 42  
  // "42.5"  => 42.5  
  // JSON    => parse if valid  
  // String  => self  
  function deserializeValue(value) {  
    var num  
    try {  
      return value ?  
        value == "true" ||  
        (value == "false" ? false :  
        value == "null" ? null : !isNaN(num = Number(value)) ? num :  
        /^[\[\{]/.test(value) ? $.parseJSON(value) :  
        value) : value  
    } catch (e) {  
      return value  
    }  
  }  
  
  // 将私有函数绑定到$对象，变为$对象下的静态函数  
  $.type = type  
  $.isFunction = isFunction  
  $.isWindow = isWindow  
  $.isArray = isArray  
  $.isPlainObject = isPlainObject  
  
  // 是否是空对象(如果该对象可以被遍历，则返回false)  
  $.isEmptyObject = function(obj) {  
    var name  
    for (name in obj) return false  
    return true  
  }  
  
  // 检查elem是否在array数组中  
  // Array.prototype.indexOf函数在IE8及以下浏览器中不支持  
  $.inArray = function(elem, array, i) {  
    0  
    return emptyArray.indexOf.call(array, elem, i)  
  }  
  
  $.camelCase = camelize  
  
  $.trim = function(str) {  
    return str.trim()  
  }  
  
  // plugin compatibility  
  // 相当于jquery中的uuid，记录*************************  
  $.uuid = 0  
  // 浏览器兼容性检查结果存放于该对象中  
  $.support = {}  
  $.expr = {}  
  
  // 遍历elements，将callback的执行结果作为一个新数组返回  
  // 如果elements是数组，循环调用；如果elements是对象，for in遍历  
  $.map = function(elements, callback) {  
    var value, values = [],  
      i, key  
    if (likeArray(elements))  
      for (i = 0; i < elements.length; i++) {  
        value = callback(elements[i], i)  
        if (value != null) values.push(value)  
      } else  
        for (key in elements) {  
          value = callback(elements[key], key)  
          if (value != null) values.push(value)  
        }  
    return flatten(values)  
  }  
  
  // 遍历elments，执行callback，遇到执行结果为false就返回  
  $.each = function(elements, callback) {  
    var i, key  
    if (likeArray(elements)) {  
      for (i = 0; i < elements.length; i++)  
        if (callback.call(elements[i], i, elements[i]) === false) return elements  
    } else {  
      for (key in elements)  
        if (callback.call(elements[key], key, elements[key]) === false) return elements  
    }  
  
    return elements  
  }  
  
  // 遍历elements，过滤掉不满足callback函数的成员  
  $.grep = function(elements, callback) {  
    return filter.call(elements, callback)  
  }  
  
  if (window.JSON) $.parseJSON = JSON.parse  
  
  // Populate the class2type map  
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {  
    class2type["[object " + name + "]"] = name.toLowerCase()  
  })  
  
  // Define methods that will be available on all  
  // Zepto collections  
  // 所有由Zepto()返回的对象都会拥有$.fn中的方法  
  $.fn = {  
    // Because a collection acts like an array  
    // copy over these useful array functions.  
    forEach: emptyArray.forEach,  
    reduce: emptyArray.reduce,  
    push: emptyArray.push,  
    sort: emptyArray.sort,  
    indexOf: emptyArray.indexOf,  
    concat: emptyArray.concat,  
  
    // `map` and `slice` in the jQuery API work differently  
    // from their array counterparts  
    map: function(fn) {  
      return $($.map(this, function(el, i) {  
        return fn.call(el, i, el)  
      }))  
    },  
  
    slice: function() {  
      return $(slice.apply(this, arguments))  
    },  
  
    // DOM Ready  
    // 检查document.readyState属性(/complete|loaded|interactive/)；或者给document添加DOMContentLoaded事件  
    ready: function(callback) {  
      if (readyRE.test(document.readyState)) callback($)  
      else document.addEventListener('DOMContentLoaded', function() {  
        callback($)  
      }, false)  
      return this  
    },  
  
    get: function(idx) {  
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]  
    },  
  
    toArray: function() {  
      return this.get()  
    },  
  
    size: function() {  
      return this.length  
    },  
  
    remove: function() {  
      return this.each(function() {  
        if (this.parentNode != null)  
          this.parentNode.removeChild(this)  
      })  
    },  
  
    each: function(callback) {  
      emptyArray.every.call(this, function(el, idx) {  
        return callback.call(el, idx, el) !== false  
      })  
      return this  
    },  
  
    filter: function(selector) {  
      if (isFunction(selector)) return this.not(this.not(selector))  
      return $(filter.call(this, function(element) {  
        return zepto.matches(element, selector)  
      }))  
    },  
  
    add: function(selector, context) {  
      return $(uniq(this.concat($(selector, context))))  
    },  
  
    is: function(selector) {  
      return this.length > 0 && zepto.matches(this[0], selector)  
    },  
  
    not: function(selector) {  
      var nodes = []  
      if (isFunction(selector) && selector.call !== undefined)  
        this.each(function(idx) {  
          if (!selector.call(this, idx)) nodes.push(this)  
        })  
      else {  
        var excludes = typeof selector == 'string' ? this.filter(selector) :  
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)  
        this.forEach(function(el) {  
          if (excludes.indexOf(el) < 0) nodes.push(el)  
        })  
      }  
      return $(nodes)  
    },  
  
    has: function(selector) {  
      return this.filter(function() {  
        return isObject(selector) ?  
          $.contains(this, selector) :  
          $(this).find(selector).size()  
      })  
    },  
  
    eq: function(idx) {  
      return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)  
    },  
  
    first: function() {  
      var el = this[0]  
      return el && !isObject(el) ? el : $(el)  
    },  
  
    last: function() {  
      var el = this[this.length - 1]  
      return el && !isObject(el) ? el : $(el)  
    },  
  
    find: function(selector) {  
      var result, $this = this  
      if (typeof selector == 'object')  
        result = $(selector).filter(function() {  
          var node = this  
          return emptyArray.some.call($this, function(parent) {  
            return $.contains(parent, node)  
          })  
        })  
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))  
      else result = this.map(function() {  
        return zepto.qsa(this, selector)  
      })  
      return result  
    },  
  
    //   
    closest: function(selector, context) {  
      var node = this[0],  
        collection = false  
      if (typeof selector == 'object') collection = $(selector)  
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))  
        node = node !== context && !isDocument(node) && node.parentNode  
      return $(node)  
    },  
  
    parents: function(selector) {  
      var ancestors = [],  
        nodes = this  
      while (nodes.length > 0)  
        nodes = $.map(nodes, function(node) {  
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {  
            ancestors.push(node)  
            return node  
          }  
        })  
      return filtered(ancestors, selector)  
    },  
  
    parent: function(selector) {  
      return filtered(uniq(this.pluck('parentNode')), selector)  
    },  
  
    children: function(selector) {  
      return filtered(this.map(function() {  
        return children(this)  
      }), selector)  
    },  
  
    contents: function() {  
      return this.map(function() {  
        return slice.call(this.childNodes)  
      })  
    },  
  
    siblings: function(selector) {  
      return filtered(this.map(function(i, el) {  
        return filter.call(children(el.parentNode), function(child) {  
          return child !== el  
        })  
      }), selector)  
    },  
  
    empty: function() {  
      return this.each(function() {  
        this.innerHTML = ''  
      })  
    },  
  
    // `pluck` is borrowed from Prototype.js  
    pluck: function(property) {  
      return $.map(this, function(el) {  
        return el[property]  
      })  
    },  
  
    show: function() {  
      return this.each(function() {  
        this.style.display == "none" && (this.style.display = null)  
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")  
          this.style.display = defaultDisplay(this.nodeName)  
      })  
    },  
  
    replaceWith: function(newContent) {  
      return this.before(newContent).remove()  
    },  
  
    wrap: function(structure) {  
      var func = isFunction(structure)  
      if (this[0] && !func)  
        var dom = $(structure).get(0),  
      clone = dom.parentNode || this.length > 1  
  
      return this.each(function(index) {  
        $(this).wrapAll(  
          func ? structure.call(this, index) :  
          clone ? dom.cloneNode(true) : dom  
        )  
      })  
    },  
  
    wrapAll: function(structure) {  
      if (this[0]) {  
        $(this[0]).before(structure = $(structure))  
        var children  
        // drill down to the inmost element  
        while ((children = structure.children()).length) structure = children.first()  
        $(structure).append(this)  
      }  
      return this  
    },  
  
    wrapInner: function(structure) {  
      var func = isFunction(structure)  
      return this.each(function(index) {  
        var self = $(this),  
          contents = self.contents(),  
          dom = func ? structure.call(this, index) : structure  
          contents.length ? contents.wrapAll(dom) : self.append(dom)  
      })  
    },  
  
    unwrap: function() {  
      this.parent().each(function() {  
        $(this).replaceWith($(this).children())  
      })  
      return this  
    },  
  
    clone: function() {  
      return this.map(function() {  
        return this.cloneNode(true)  
      })  
    },  
  
    hide: function() {  
      return this.css("display", "none")  
    },  
  
    toggle: function(setting) {  
      return this.each(function() {  
        var el = $(this);  
        (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()  
      })  
    },  
  
    prev: function(selector) {  
      return $(this.pluck('previousElementSibling')).filter(selector || '*')  
    },  
  
    next: function(selector) {  
      return $(this.pluck('nextElementSibling')).filter(selector || '*')  
    },  
  
    html: function(html) {  
      return html === undefined ?  
        (this.length > 0 ? this[0].innerHTML : null) :  
        this.each(function(idx) {  
          var originHtml = this.innerHTML  
          $(this).empty().append(funcArg(this, html, idx, originHtml))  
        })  
    },  
  
    text: function(text) {  
      return text === undefined ?  
        (this.length > 0 ? this[0].textContent : null) :  
        this.each(function() {  
          this.textContent = text  
        })  
    },  
  
    attr: function(name, value) {  
      var result  
      return (typeof name == 'string' && value === undefined) ?  
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :  
        (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :  
        (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result  
      ) :  
        this.each(function(idx) {  
          if (this.nodeType !== 1) return  
          if (isObject(name))  
            for (key in name) setAttribute(this, key, name[key])  
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))  
        })  
    },  
  
    removeAttr: function(name) {  
      return this.each(function() {  
        this.nodeType === 1 && setAttribute(this, name)  
      })  
    },  
  
    prop: function(name, value) {  
      return (value === undefined) ?  
        (this[0] && this[0][name]) :  
        this.each(function(idx) {  
          this[name] = funcArg(this, value, idx, this[name])  
        })  
    },  
  
    data: function(name, value) {  
      var data = this.attr('data-' + dasherize(name), value)  
      return data !== null ? deserializeValue(data) : undefined  
    },  
  
    val: function(value) {  
      return (value === undefined) ?  
        (this[0] && (this[0].multiple ?  
        $(this[0]).find('option').filter(function(o) {  
          return this.selected  
        }).pluck('value') :  
        this[0].value)) :  
        this.each(function(idx) {  
          this.value = funcArg(this, value, idx, this.value)  
        })  
    },  
  
    offset: function(coordinates) {  
      if (coordinates) return this.each(function(index) {  
        var $this = $(this),  
          coords = funcArg(this, coordinates, index, $this.offset()),  
          parentOffset = $this.offsetParent().offset(),  
          props = {  
            top: coords.top - parentOffset.top,  
            left: coords.left - parentOffset.left  
          }  
  
        if ($this.css('position') == 'static') props['position'] = 'relative'  
        $this.css(props)  
      })  
      if (this.length == 0) return null  
      var obj = this[0].getBoundingClientRect()  
      return {  
        left: obj.left + window.pageXOffset,  
        top: obj.top + window.pageYOffset,  
        width: Math.round(obj.width),  
        height: Math.round(obj.height)  
      }  
    },  
  
    css: function(property, value) {  
      if (arguments.length < 2 && typeof property == 'string')  
        return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))  
  
      var css = ''  
      if (type(property) == 'string') {  
        if (!value && value !== 0)  
          this.each(function() {  
            this.style.removeProperty(dasherize(property))  
          })  
        else  
          css = dasherize(property) + ":" + maybeAddPx(property, value)  
      } else {  
        for (key in property)  
          if (!property[key] && property[key] !== 0)  
            this.each(function() {  
              this.style.removeProperty(dasherize(key))  
            })  
          else  
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'  
      }  
  
      return this.each(function() {  
        this.style.cssText += ';' + css  
      })  
    },  
  
    index: function(element) {  
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])  
    },  
  
    hasClass: function(name) {  
      return emptyArray.some.call(this, function(el) {  
        return this.test(className(el))  
      }, classRE(name))  
    },  
  
    addClass: function(name) {  
      return this.each(function(idx) {  
        classList = []  
        var cls = className(this),  
          newName = funcArg(this, name, idx, cls)  
          newName.split(/\s+/g).forEach(function(klass) {  
            if (!$(this).hasClass(klass)) classList.push(klass)  
          }, this)  
          classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))  
      })  
    },  
  
    removeClass: function(name) {  
      return this.each(function(idx) {  
        if (name === undefined) return className(this, '')  
        classList = className(this)  
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {  
          classList = classList.replace(classRE(klass), " ")  
        })  
        className(this, classList.trim())  
      })  
    },  
  
    toggleClass: function(name, when) {  
      return this.each(function(idx) {  
        var $this = $(this),  
          names = funcArg(this, name, idx, className(this))  
          names.split(/\s+/g).forEach(function(klass) {  
            (when === undefined ? !$this.hasClass(klass) : when) ?  
              $this.addClass(klass) : $this.removeClass(klass)  
          })  
      })  
    },  
  
    scrollTop: function() {  
      if (!this.length) return  
      return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY  
    },  
  
    position: function() {  
      if (!this.length) return  
  
      var elem = this[0],  
        // Get *real* offsetParent  
        offsetParent = this.offsetParent(),  
        // Get correct offsets  
        offset = this.offset(),  
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {  
          top: 0,  
          left: 0  
        } : offsetParent.offset()  
  
        // Subtract element margins  
        // note: when an element has margin: auto the offsetLeft and marginLeft  
        // are the same in Safari causing offset.left to incorrectly be 0  
        offset.top -= parseFloat($(elem).css('margin-top')) || 0  
        offset.left -= parseFloat($(elem).css('margin-left')) || 0  
  
        // Add offsetParent borders  
        parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0  
        parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0  
  
        // Subtract the two offsets  
      return {  
        top: offset.top - parentOffset.top,  
        left: offset.left - parentOffset.left  
      }  
    },  
  
    offsetParent: function() {  
      return this.map(function() {  
        var parent = this.offsetParent || document.body  
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")  
          parent = parent.offsetParent  
        return parent  
      })  
    }  
  }  
  
  // for now  
  $.fn.detach = $.fn.remove  
  
  // Generate the `width` and `height` functions  
  // $.fn.width() && $.fn.height()    
  ;  
  ['width', 'height'].forEach(function(dimension) {  
    $.fn[dimension] = function(value) {  
      var offset, el = this[0],  
        Dimension = dimension.replace(/./, function(m) {  
          return m[0].toUpperCase()  
        })  
        if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :  
          isDocument(el) ? el.documentElement['offset' + Dimension] :  
          (offset = this.offset()) && offset[dimension]  
        else return this.each(function(idx) {  
          el = $(this)  
          el.css(dimension, funcArg(this, value, idx, el[dimension]()))  
        })  
    }  
  })  
  
  function traverseNode(node, fun) {  
    fun(node)  
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)  
  }  
  
  // Generate the `after`, `prepend`, `before`, `append`,  
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.  
  adjacencyOperators.forEach(function(operator, operatorIndex) {  
    var inside = operatorIndex % 2 //=> prepend, append  
  
    $.fn[operator] = function() {  
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings  
      var argType, nodes = $.map(arguments, function(arg) {  
          argType = type(arg)  
          return argType == "object" || argType == "array" || arg == null ?  
            arg : zepto.fragment(arg)  
        }),  
        parent, copyByClone = this.length > 1  
      if (nodes.length < 1) return this  
  
      return this.each(function(_, target) {  
        parent = inside ? target : target.parentNode  
  
        // convert all methods to a "before" operation  
        target = operatorIndex == 0 ? target.nextSibling :  
          operatorIndex == 1 ? target.firstChild :  
          operatorIndex == 2 ? target :  
          null  
  
        nodes.forEach(function(node) {  
          if (copyByClone) node = node.cloneNode(true)  
          else if (!parent) return $(node).remove()  
  
          traverseNode(parent.insertBefore(node, target), function(el) {  
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&  
              (!el.type || el.type === 'text/javascript') && !el.src)  
              window['eval'].call(window, el.innerHTML)  
          })  
        })  
      })  
    }  
  
    // after    => insertAfter  
    // prepend  => prependTo  
    // before   => insertBefore  
    // append   => appendTo  
    $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function(html) {  
      $(html)[operator](this)  
      return this  
    }  
  })  
  
  // 相当于jquery中的$.fn = $.prototype  
  zepto.Z.prototype = $.fn  
  
  // Export internal API functions in the `$.zepto` namespace  
  zepto.uniq = uniq  
  zepto.deserializeValue = deserializeValue  
  $.zepto = zepto  
  
  return $  
})()  
  
window.Zepto = Zepto   
'$' in window || (window.$ = Zepto)  
  
// 浏览器UA信息  
;  
(function($) {  
  function detect(ua) {  
    var os = this.os = {}, browser = this.browser = {},  
      webkit = ua.match(/WebKit\/([\d.]+)/),  
      android = ua.match(/(Android)\s+([\d.]+)/),  
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),  
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),  
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),  
      touchpad = webos && ua.match(/TouchPad/),  
      kindle = ua.match(/Kindle\/([\d.]+)/),  
      silk = ua.match(/Silk\/([\d._]+)/),  
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),  
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),  
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),  
      playbook = ua.match(/PlayBook/),  
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),  
      firefox = ua.match(/Firefox\/([\d.]+)/)  
  
      // Todo: clean this up with a better OS/browser seperation:  
      // - discern (more) between multiple browsers on android  
      // - decide if kindle fire in silk mode is android or not  
      // - Firefox on Android doesn't specify the Android version  
      // - possibly devide in os, device and browser hashes  
  
      if (browser.webkit = !! webkit) browser.version = webkit[1]  
  
      if (android) os.android = true, os.version = android[2]  
      if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')  
      if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')  
      if (webos) os.webos = true, os.version = webos[2]  
      if (touchpad) os.touchpad = true  
    if (blackberry) os.blackberry = true, os.version = blackberry[2]  
    if (bb10) os.bb10 = true, os.version = bb10[2]  
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]  
    if (playbook) browser.playbook = true  
    if (kindle) os.kindle = true, os.version = kindle[1]  
    if (silk) browser.silk = true, browser.version = silk[1]  
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true  
    if (chrome) browser.chrome = true, browser.version = chrome[1]  
    if (firefox) browser.firefox = true, browser.version = firefox[1]  
  
    os.tablet = !! (ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))  
    os.phone = !! (!os.tablet && (android || iphone || webos || blackberry || bb10 ||  
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))  
  }  
  
  detect.call($, navigator.userAgent)  
  // make available to unit tests  
  $.__detect = detect  
})(Zepto)  
  
  
  
/*事件模块*/  
;  
(function($) {  
  var $$ = $.zepto.qsa,  
    // handlers保存所有事件处理函数集合，用zid作为一个标识符来确保element和处理函数的对应关系  
    // 需要添加事件处理函数的element上添加一个_zid属性，该属性作为一个键值保存在handlers中，键值为该元素的处理函数  
    handlers = {}, _zid = 1,  
    specialEvents = {},  
    hover = {  
      mouseenter: 'mouseover',  
      mouseleave: 'mouseout'  
    }  
  
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'  
  
  // 返回指定element的标识符，如果没有设置一个并返回  
  function zid(element) {  
    return element._zid || (element._zid = _zid++)  
  }  
  
  // 查找绑定在element上的事件处理函数集合  
  function findHandlers(element, event, fn, selector) {  
    event = parse(event)  
    if (event.ns) var matcher = matcherFor(event.ns)  
    return (handlers[zid(element)] || []).filter(function(handler) {  
      // 判断事件类型是否相同           event.e == handler.e  
      // 判断事件命名空间是否相同         
      // 判断handler.fn是否相同        
      return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector)  
    })  
  }  
  
  // 解析事件，返回一个包含事件名称和命名空间的对象  
  function parse(event) {  
    var parts = ('' + event).split('.')  
    return {  
      e: parts[0],  
      ns: parts.slice(1).sort().join(' ')  
    }  
  }  
  
  // 生成事件的命名空间  
  function matcherFor(ns) {  
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')  
  }  
  
  // 遍历事件执行iterator  
  function eachEvent(events, fn, iterator) {  
    if ($.type(events) != "string") $.each(events, iterator)  
    else events.split(/\s/).forEach(function(type) {  
      iterator(type, fn)  
    })  
  }  
  
  // focus和blur事件设置为捕获  
  function eventCapture(handler, captureSetting) {  
    return handler.del &&  
      (handler.e == 'focus' || handler.e == 'blur') || !! captureSetting  
  }  
  
  // 修复不支持mouseenter和mouseleave的情况  
  function realEvent(type) {  
    return hover[type] || type  
  }  
  
  // 给元素添加事件监听  
  // events参数可以是数组，或者"click mouseover"两种形式  
  function add(element, events, fn, selector, getDelegate, capture) {  
    var id = zid(element), // 给元素一个唯一的标识符，这个标识符在handlers处理函数中对应于该元素所有的处理函数集合  
      set = (handlers[id] || (handlers[id] = [])) // 元素上已经绑定的处理函数  
      eachEvent(events, fn, function(event, fn) {  
        var handler = parse(event)  
        // 保存fn，mouseenter和mouseleave事件单独做处理  
        handler.fn = fn  
        handler.sel = selector  
        // emulate mouseenter, mouseleave  
        // 模仿mouseenter, mouseleave  
        if (handler.e in hover) fn = function(e) {  
          // relatedTarget为事件相关对象，只有在mouseover/mouseout事件中才有  
          // 参考：http://www.w3school.com.cn/htmldom/event_relatedtarget.asp  
          // mouseover: 鼠标离开的事件对象  
          var related = e.relatedTarget  
          // 如果不存在relatedTarget，则说明不是mouseover/mouseout事件  
          // mouseover: 相关对象不是当前事件对象，并且relatedTarget不在当前事件对象中  
          // 当鼠标从事件对象上移入到子节点的时候related就等于this了，且!$.contains(this, related)也不成立，这个时间是不需要执行处理函数的  
          // mouseout: 同理  
          if (!related || (related !== this && !$.contains(this, related)))  
            return handler.fn.apply(this, arguments)  
        }  
        handler.del = getDelegate && getDelegate(fn, event)  
        // delegate优先  
        var callback = handler.del || fn  
        handler.proxy = function(e) {  
          var result = callback.apply(element, [e].concat(e.data))  
          // 当事件处理函数返回false时，阻止默认操作和冒泡  
          if (result === false) e.preventDefault(), e.stopPropagation()  
          return result  
        }  
        // 记录处理函数的索引值  
        handler.i = set.length  
        // 推入处理函数集合中  
        set.push(handler)  
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))  
      })  
  }  
  
  // 删除元素上的事件处理函数  
  function remove(element, events, fn, selector, capture) {  
    var id = zid(element)  
    eachEvent(events || '', fn, function(event, fn) {  
      findHandlers(element, event, fn, selector).forEach(function(handler) {  
        delete handlers[id][handler.i]  
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))  
      })  
    })  
  }  
  
  $.event = {  
    add: add,  
    remove: remove  
  }  
  
  //  
  $.proxy = function(fn, context) {  
    if ($.isFunction(fn)) {  
      var proxyFn = function() {  
        return fn.apply(context, arguments)  
      }  
      proxyFn._zid = zid(fn)  
      return proxyFn  
    } else if (typeof context == 'string') {  
      return $.proxy(fn[context], fn)  
    } else {  
      throw new TypeError("expected function")  
    }  
  }  
  
  $.fn.bind = function(event, callback) {  
    return this.each(function() {  
      add(this, event, callback)  
    })  
  }  
  $.fn.unbind = function(event, callback) {  
    return this.each(function() {  
      remove(this, event, callback)  
    })  
  }  
  $.fn.one = function(event, callback) {  
    return this.each(function(i, element) {  
      add(this, event, callback, null, function(fn, type) {  
        // delegate事件处理回调函数，在回调函数中删除事件绑定，打到一次执行的效果  
        return function() {  
          var result = fn.apply(element, arguments)  
          remove(element, type, fn)  
          return result  
        }  
      })  
    })  
  }  
  
  var returnTrue = function() {  
    return true  
  },  
    returnFalse = function() {  
      return false  
    },  
    ignoreProperties = /^([A-Z]|layer[XY]$)/,  
    eventMethods = {  
      // 是否调用过preventDefault()方法  
      preventDefault: 'isDefaultPrevented',  
      // 是否调用过stopImmediatePropagation()方法  
      // stopImmediatePropagation方法的作用见：  
      // https://developer.mozilla.org/zh-CN/docs/DOM/event.stopImmediatePropagation  
      stopImmediatePropagation: 'isImmediatePropagationStopped',  
      // 是否调用过stopPropagation方法  
      stopPropagation: 'isPropagationStopped'  
    }  
  
  // 重新包装原始event对象  
  function createProxy(event) {  
    var key, proxy = {  
        originalEvent: event // 原始事件  
      }  
    // 复制原始事件中的所有属性到proxy对象    
    for (key in event)  
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]  
  
    // 将preventDefault、stopImmediatePropagation、stopPropagation绑定到proxy对象上  
    $.each(eventMethods, function(name, predicate) {  
      proxy[name] = function() {  
        this[predicate] = returnTrue  
        return event[name].apply(event, arguments)  
      }  
      proxy[predicate] = returnFalse  
    })  
    return proxy  
  }  
  
  // emulates the 'defaultPrevented' property for browsers that have none  
  // 在不支持的浏览器中模拟defaultPrevented属性  
  function fix(event) {  
    if (!('defaultPrevented' in event)) {  
      event.defaultPrevented = false  
      var prevent = event.preventDefault  
      event.preventDefault = function() {  
        this.defaultPrevented = true  
        prevent.call(this)  
      }  
    }  
  }  
  
  // 事件委托，live函数依赖于此函数  
  $.fn.delegate = function(selector, event, callback) {  
    return this.each(function(i, element) {  
      add(element, event, callback, selector, function(fn) {  
        return function(e) {  
          // 将事件委托到e.target元素，然后在此元素中根据selector查找对应的元素并执行处理函数  
          var evt, match = $(e.target).closest(selector, element).get(0)  
            if (match) {  
              evt = $.extend(createProxy(e), {  
                currentTarget: match,  
                liveFired: element  
              })  
              return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))  
            }  
        }  
      })  
    })  
  }  
  $.fn.undelegate = function(selector, event, callback) {  
    return this.each(function() {  
      remove(this, event, callback, selector)  
    })  
  }  
  // 原理：将事件委托到document.body，利用了事件的冒泡原理，所有事件都会最后冒泡到document.body，在document.body上委托执行事件的处理函数  
  $.fn.live = function(event, callback) {  
    $(document.body).delegate(this.selector, event, callback)  
    return this  
  }  
  $.fn.die = function(event, callback) {  
    $(document.body).undelegate(this.selector, event, callback)  
    return this  
  }  
  
  // 如果不指定selector，简单的bind，如果指定了selector，则委托事件到document.body  
  $.fn.on = function(event, selector, callback) {  
    return !selector || $.isFunction(selector) ?  
      this.bind(event, selector || callback) : this.delegate(selector, event, callback)  
  }  
  $.fn.off = function(event, selector, callback) {  
    return !selector || $.isFunction(selector) ?  
      this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)  
  }  
  
  $.fn.trigger = function(event, data) {  
    if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)  
    fix(event)  
    event.data = data  
    return this.each(function() {  
      // items in the collection might not be DOM elements  
      // (todo: possibly support events on plain old objects)  
      if ('dispatchEvent' in this) this.dispatchEvent(event)  
    })  
  }  
  
  // triggers event handlers on current element just as if an event occurred,  
  // doesn't trigger an actual event, doesn't bubble  
  $.fn.triggerHandler = function(event, data) {  
    var e, result  
      this.each(function(i, element) {  
        e = createProxy(typeof event == 'string' ? $.Event(event) : event)  
        e.data = data  
        e.target = element  
        $.each(findHandlers(element, event.type || event), function(i, handler) {  
          result = handler.proxy(e)  
          if (e.isImmediatePropagationStopped()) return false  
        })  
      })  
      return result  
  }  
  
  // shortcut methods for `.bind(event, fn)` for each event type  
  ;  
  ('focusin focusout load resize scroll unload click dblclick ' +  
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +  
    'change select keydown keypress keyup error').split(' ').forEach(function(event) {  
    $.fn[event] = function(callback) {  
      return callback ?  
        this.bind(event, callback) :  
        this.trigger(event)  
    }  
  })  
  
  ;  
  ['focus', 'blur'].forEach(function(name) {  
    $.fn[name] = function(callback) {  
      if (callback) this.bind(name, callback)  
      else this.each(function() {  
        try {  
          this[name]()  
        } catch (e) {}  
      })  
      return this  
    }  
  })  
  
  // 根据参数创建一个Event对象  
  $.Event = function(type, props) {  
    if (typeof type != 'string') props = type, type = props.type  
    // 如果是click/mouseup/mousedown/mousemove事件，创建MouseEvent对象  
    var event = document.createEvent(specialEvents[type] || 'Events'),  
      bubbles = true  
    // 确保event对象的bubbles的值为true/false  
    if (props)  
      for (var name in props)(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name])  
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)  
    // 添加isDefaultPrevented方法，表明当前事件的默认动作是否已经被取消，也就是是否已经执行过preventDefault()方法  
    event.isDefaultPrevented = function() {  
      return this.defaultPrevented  
    }  
    return event  
  }  
})(Zepto)  
  
  
  
/*Ajax模块*/  
;  
(function($) {  
  var jsonpID = 0,  
    document = window.document,  
    key,  
    name,  
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  
    scriptTypeRE = /^(?:text|application)\/javascript/i,  
    xmlTypeRE = /^(?:text|application)\/xml/i,  
    jsonType = 'application/json',  
    htmlType = 'text/html',  
    blankRE = /^\s*$/  
  
    // trigger a custom event and return false if it was cancelled  
    function triggerAndReturn(context, eventName, data) {  
      var event = $.Event(eventName)  
      $(context).trigger(event, data)  
      return !event.defaultPrevented  
    }  
  
    // trigger an Ajax "global" event  
    // 是否出发全局的ajax事件  
    function triggerGlobal(settings, context, eventName, data) {  
      if (settings.global) return triggerAndReturn(context || document, eventName, data)  
    }  
  
  // Number of active Ajax requests  
  // 标识当前是否是第一次ajax请求（当前时间没有其他ajax请求）  
  $.active = 0  
  
  function ajaxStart(settings) {  
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')  
  }  
  
  function ajaxStop(settings) {  
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')  
  }  
  
  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable  
  function ajaxBeforeSend(xhr, settings) {  
    var context = settings.context  
    // 如果beforeSend回调函数返回false，则直接返回不执行ajaxSend事件的处理函数  
    if (settings.beforeSend.call(context, xhr, settings) === false ||  
      triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)  
      return false  
  
    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])  
  }  
  
  function ajaxSuccess(data, xhr, settings) {  
    var context = settings.context,  
      status = 'success'  
    settings.success.call(context, data, status, xhr)  
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])  
    ajaxComplete(status, xhr, settings)  
  }  
  // type: "timeout", "error", "abort", "parsererror"  
  
  function ajaxError(error, type, xhr, settings) {  
    var context = settings.context  
    settings.error.call(context, xhr, type, error)  
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])  
    ajaxComplete(type, xhr, settings)  
  }  
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"  
  
  // ajaxSuccess/ajaxError事件之后都会出发ajaxComplete  
  function ajaxComplete(status, xhr, settings) {  
    var context = settings.context  
    settings.complete.call(context, xhr, status)  
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])  
    ajaxStop(settings)  
  }  
  
  // Empty function, used as default callback  
  function empty() {}  
  
  $.ajaxJSONP = function(options) {  
    // 如果不指定type，则执行ajax，所以要执行jsonp，一定要指定type参数  
    if (!('type' in options)) return $.ajax(options)  
  
    // jsonp回调函数  
    var callbackName = 'jsonp' + (++jsonpID),  
      script = document.createElement('script'),  
      cleanup = function() {  
        clearTimeout(abortTimeout)  
        $(script).remove()  
        delete window[callbackName]  
      },  
      abort = function(type) {  
        cleanup()  
        // In case of manual abort or timeout, keep an empty function as callback  
        // so that the SCRIPT tag that eventually loads won't result in an error.  
        if (!type || type == 'timeout') window[callbackName] = empty  
        ajaxError(null, type || 'abort', xhr, options)  
      },  
      xhr = {  
        abort: abort  
      }, abortTimeout  
  
    if (ajaxBeforeSend(xhr, options) === false) {  
      abort('abort')  
      return false  
    }  
  
    window[callbackName] = function(data) {  
      cleanup()  
      ajaxSuccess(data, xhr, options)  
    }  
  
    script.onerror = function() {  
      abort('error')  
    }  
  
    script.src = options.url.replace(/=\?/, '=' + callbackName)  
    $('head').append(script)  
  
    if (options.timeout > 0) abortTimeout = setTimeout(function() {  
      abort('timeout')  
    }, options.timeout)  
  
    return xhr  
  }  
  
  $.ajaxSettings = {  
    // Default type of request  
    type: 'GET',  
    // Callback that is executed before request  
    beforeSend: empty,  
    // Callback that is executed if the request succeeds  
    success: empty,  
    // Callback that is executed the the server drops error  
    error: empty,  
    // Callback that is executed on request complete (both: error and success)  
    complete: empty,  
    // The context for the callbacks  
    context: null,  
    // Whether to trigger "global" Ajax events  
    global: true,  
    // Transport  
    xhr: function() {  
      return new window.XMLHttpRequest()  
    },  
    // MIME types mapping  
    accepts: {  
      script: 'text/javascript, application/javascript',  
      json: jsonType,  
      xml: 'application/xml, text/xml',  
      html: htmlType,  
      text: 'text/plain'  
    },  
    // Whether the request is to another domain  
    crossDomain: false,  
    // Default timeout  
    timeout: 0,  
    // Whether data should be serialized to string  
    processData: true,  
    // Whether the browser should be allowed to cache GET responses  
    cache: true,  
  }  
  
  // 根据MIME返回相应的数据类型，用作ajax参数里的dataType用，设置预期返回的数据类型  
  function mimeToDataType(mime) {  
    if (mime) mime = mime.split(';', 2)[0]  
    return mime && (mime == htmlType ? 'html' :  
      mime == jsonType ? 'json' :  
      scriptTypeRE.test(mime) ? 'script' :  
      xmlTypeRE.test(mime) && 'xml') || 'text'  
  }  
  
  // 将查询字符串追加到URL后面  
  function appendQuery(url, query) {  
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')  
  }  
  
  // serialize payload and append it to the URL for GET requests  
  // 将payload参数添加到url后面，用get方式来请求  
  function serializeData(options) {  
    if (options.processData && options.data && $.type(options.data) != "string")  
      options.data = $.param(options.data, options.traditional)  
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))  
      options.url = appendQuery(options.url, options.data)  
  }  
  
  $.ajax = function(options) {  
    // 合并配置选项  
    var settings = $.extend({}, options || {})  
    for (key in $.ajaxSettings)  
      if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]  
  
    ajaxStart(settings)  
  
    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&  
      RegExp.$2 != window.location.host  
  
    if (!settings.url) settings.url = window.location.toString()  
    serializeData(settings)  
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())  
  
    var dataType = settings.dataType,  
      hasPlaceholder = /=\?/.test(settings.url)  
      if (dataType == 'jsonp' || hasPlaceholder) {  
        if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')  
        return $.ajaxJSONP(settings)  
      }  
  
    var mime = settings.accepts[dataType],  
      baseHeaders = {},  
      protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,  
      xhr = settings.xhr(),  
      abortTimeout  
  
    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'  
    if (mime) {  
      baseHeaders['Accept'] = mime  
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]  
      xhr.overrideMimeType && xhr.overrideMimeType(mime)  
    }  
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))  
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')  
    settings.headers = $.extend(baseHeaders, settings.headers || {})  
  
    xhr.onreadystatechange = function() {  
      if (xhr.readyState == 4) {  
        xhr.onreadystatechange = empty;  
        clearTimeout(abortTimeout)  
        var result, error = false  
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {  
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))  
          result = xhr.responseText  
  
          try {  
            // http://perfectionkills.com/global-eval-what-are-the-options/  
            if (dataType == 'script')(1, eval)(result)  
            else if (dataType == 'xml') result = xhr.responseXML  
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)  
          } catch (e) {  
            error = e  
          }  
  
          if (error) ajaxError(error, 'parsererror', xhr, settings)  
          else ajaxSuccess(result, xhr, settings)  
        } else {  
          ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)  
        }  
      }  
    }  
  
    var async = 'async' in settings ? settings.async : true  
    xhr.open(settings.type, settings.url, async)  
  
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])  
  
    if (ajaxBeforeSend(xhr, settings) === false) {  
      xhr.abort()  
      return false  
    }  
  
    if (settings.timeout > 0) abortTimeout = setTimeout(function() {  
      xhr.onreadystatechange = empty  
      xhr.abort()  
      ajaxError(null, 'timeout', xhr, settings)  
    }, settings.timeout)  
  
    // avoid sending empty string (#319)  
    xhr.send(settings.data ? settings.data : null)  
    return xhr  
  }  
  
  // handle optional data/success arguments  
  function parseArguments(url, data, success, dataType) {  
    var hasData = !$.isFunction(data)  
    return {  
      url: url,  
      data: hasData ? data : undefined,  
      success: !hasData ? data : $.isFunction(success) ? success : undefined,  
      dataType: hasData ? dataType || success : success  
    }  
  }  
  
  $.get = function(url, data, success, dataType) {  
    return $.ajax(parseArguments.apply(null, arguments))  
  }  
  
  $.post = function(url, data, success, dataType) {  
    var options = parseArguments.apply(null, arguments)  
    options.type = 'POST'  
    return $.ajax(options)  
  }  
  
  $.getJSON = function(url, data, success) {  
    var options = parseArguments.apply(null, arguments)  
    options.dataType = 'json'  
    return $.ajax(options)  
  }  
  
  $.fn.load = function(url, data, success) {  
    if (!this.length) return this  
    var self = this,  
      parts = url.split(/\s/),  
      selector,  
      options = parseArguments(url, data, success),  
      callback = options.success  
    if (parts.length > 1) options.url = parts[0], selector = parts[1]  
    options.success = function(response) {  
      self.html(selector ?  
        $('<div>').html(response.replace(rscript, "")).find(selector) : response)  
      callback && callback.apply(self, arguments)  
    }  
    $.ajax(options)  
    return this  
  }  
  
  var escape = encodeURIComponent  
    function serialize(params, obj, traditional, scope) {  
      var type, array = $.isArray(obj)  
        $.each(obj, function(key, value) {  
          type = $.type(value)  
          if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'  
          // handle data in serializeArray() format  
          if (!scope && array) params.add(value.name, value.value)  
          // recurse into nested objects  
          else if (type == "array" || (!traditional && type == "object"))  
            serialize(params, value, traditional, key)  
          else params.add(key, value)  
        })  
    }  
  
  $.param = function(obj, traditional) {  
    var params = []  
    params.add = function(k, v) {  
      this.push(escape(k) + '=' + escape(v))  
    }  
    serialize(params, obj, traditional)  
    return params.join('&').replace(/%20/g, '+')  
  }  
})(Zepto)  
  
;  
(function($) {  
  $.fn.serializeArray = function() {  
    var result = [],  
      el  
      $(Array.prototype.slice.call(this.get(0).elements)).each(function() {  
        el = $(this)  
        var type = el.attr('type')  
        if (this.nodeName.toLowerCase() != 'fieldset' && !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&  
          ((type != 'radio' && type != 'checkbox') || this.checked))  
          result.push({  
            name: el.attr('name'),  
            value: el.val()  
          })  
      })  
      return result  
  }  
  
  $.fn.serialize = function() {  
    var result = []  
    this.serializeArray().forEach(function(elm) {  
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))  
    })  
    return result.join('&')  
  }  
  
  $.fn.submit = function(callback) {  
    if (callback) this.bind('submit', callback)  
    else if (this.length) {  
      var event = $.Event('submit')  
      this.eq(0).trigger(event)  
      if (!event.defaultPrevented) this.get(0).submit()  
    }  
    return this  
  }  
  
})(Zepto)  
  
  
/*css3动画*/  
;  
(function($, undefined) {  
  var prefix = '',  
    eventPrefix, endEventName, endAnimationName,  
    vendors = {  
      Webkit: 'webkit',  
      Moz: '',  
      O: 'o',  
      ms: 'MS'  
    },  
    document = window.document,  
    testEl = document.createElement('div'),  
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,  
    transform,  
    transitionProperty, transitionDuration, transitionTiming,  
    animationName, animationDuration, animationTiming,  
    cssReset = {}  
  
    function dasherize(str) {  
      return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2'))  
    }  
  
    function downcase(str) {  
      return str.toLowerCase()  
    }  
  
    function normalizeEvent(name) {  
      return eventPrefix ? eventPrefix + name : downcase(name)  
    }  
  
  $.each(vendors, function(vendor, event) {  
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {  
      prefix = '-' + downcase(vendor) + '-'  
      eventPrefix = event  
      return false  
    }  
  })  
  
  transform = prefix + 'transform'  
  cssReset[transitionProperty = prefix + 'transition-property'] =  
    cssReset[transitionDuration = prefix + 'transition-duration'] =  
    cssReset[transitionTiming = prefix + 'transition-timing-function'] =  
    cssReset[animationName = prefix + 'animation-name'] =  
    cssReset[animationDuration = prefix + 'animation-duration'] =  
    cssReset[animationTiming = prefix + 'animation-timing-function'] = ''  
  
  $.fx = {  
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),  
    speeds: {  
      _default: 400,  
      fast: 200,  
      slow: 600  
    },  
    cssPrefix: prefix,  
    transitionEnd: normalizeEvent('TransitionEnd'),  
    animationEnd: normalizeEvent('AnimationEnd')  
  }  
  
  $.fn.animate = function(properties, duration, ease, callback) {  
    if ($.isPlainObject(duration))  
      ease = duration.easing, callback = duration.complete, duration = duration.duration  
    if (duration) duration = (typeof duration == 'number' ? duration :  
      ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000  
    return this.anim(properties, duration, ease, callback)  
  }  
  
  $.fn.anim = function(properties, duration, ease, callback) {  
    var key, cssValues = {}, cssProperties, transforms = '',  
      that = this,  
      wrappedCallback, endEvent = $.fx.transitionEnd  
  
    if (duration === undefined) duration = 0.4  
    if ($.fx.off) duration = 0  
  
    if (typeof properties == 'string') {  
      // keyframe animation  
      cssValues[animationName] = properties  
      cssValues[animationDuration] = duration + 's'  
      cssValues[animationTiming] = (ease || 'linear')  
      endEvent = $.fx.animationEnd  
    } else {  
      cssProperties = []  
      // CSS transitions  
      for (key in properties)  
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '  
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))  
  
      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)  
      if (duration > 0 && typeof properties === 'object') {  
        cssValues[transitionProperty] = cssProperties.join(', ')  
        cssValues[transitionDuration] = duration + 's'  
        cssValues[transitionTiming] = (ease || 'linear')  
      }  
    }  
  
    wrappedCallback = function(event) {  
      if (typeof event !== 'undefined') {  
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"  
        $(event.target).unbind(endEvent, wrappedCallback)  
      }  
      $(this).css(cssReset)  
      callback && callback.call(this)  
    }  
    if (duration > 0) this.bind(endEvent, wrappedCallback)  
  
    // trigger page reflow so new elements can animate  
    this.size() && this.get(0).clientLeft  
  
    this.css(cssValues)  
  
    if (duration <= 0) setTimeout(function() {  
      that.each(function() {  
        wrappedCallback.call(this)  
      })  
    }, 0)  
  
    return this  
  }  
  
  testEl = null  
})(Zepto)  
