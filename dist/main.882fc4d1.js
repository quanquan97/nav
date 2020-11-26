// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var $siteList = $(".siteList"); //这个放最上面 要访问到下面的变量

var $lastLi = $siteList.find("li.last"); //找到最后一个li 然后把新增网页放在最后一个的前面  lastli也要放上面 因为下面这个会用到
//window.hashMap={}   //不能变成全局变量 ，变成全局变量要用window //parcel会自动在代码外面加作用域，所以不需要我们操心，直接写就好了
// 现在hashmap的初始值就是xObject了， 就是从local Storage里读出来的 然后再把字符串再变成对象，但是又不能直接等于 ，因为考虑到第一次用的时候是空的，所以做一个 或 判断：如果xObject存在就用，如果不存在就用预先写好的默认数组

var x = localStorage.getItem('x');
var xObject = JSON.parse(x); //JSON parse如果发现x为null 也会返回一个null 不会报错
//hashmap初始化

var hashMap = xObject || [{
  logo: 'M',
  url: 'https://my.usc.edu/'
}, {
  logo: 'G',
  url: 'https://github.com/'
}]; //不需要预先把网站信息写在这里， 可以利用hashmap遍历一下,接收一个节点，生成创建一个Li, 生成了一个li 然后把li放到ul里面去
//如果新增网站，那就给hashmap新增一项 然后重新渲染hashmap就可以啦，在退出的时候把hashmap保存起来
//由于hash foreach这个函数用到两次 ，那就给它起个名字 渲染 以后调用就行了，简化代码  声明一个render
//现在完成一个小需求：就是让首字母是网站的首字母 而不是http的h 或者www的w  这样操作后 url原本的字符串是不变的 只是产生新的字符串. 还有一点，要考虑到万一用户复制了很长一串的url ，要把/后面的一长串给删掉
//简化LOGO

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('http://', '').replace('https://', '').replace('www.', '').replace(/\/.*/, ''); // 此处需要用到正则表达式，要用的时候上网搜就好了，写篇博客以后不用管他就ok
};

var render = function render() {
  $siteList.find('li:not(.last)').remove(); //找到除最后一个的所有li 然后删掉,在进行渲染之前先要进行删除这一步

  hashMap.forEach(function (node, index) {
    //console.log(index);
    var $li = $("<li>\n    \n              <div class=\"site\">\n                <div class=\"logo\">".concat(node.logo, "</div>\n                <div class=\"link\"> ").concat(simplifyUrl(node.url), " </div>\n                <div class=\"close\"> \n                <svg class=\"icon\" >\n    <use xlink:href=\"#icon-close\"></use>\n</svg></div>\n              </div>\n            </li>")).insertBefore($lastLi); //现在的问题是点击close按钮 ，它还是处于li上的，点它等同于点了li，现在需要完成  在点击close的时候 不让出现点击site 的情况 ，也就是阻止冒泡。 但是即使这样做了之后发现还是会跳转就，把a标签删了 不要了，用JS实现 用li.onclick代替a标签的作用，因为如果不这样代替的话就无法阻止冒泡，关闭按钮就没用了

    $li.on('click', function () {
      window.open(node.url); //跳转到一个地方 打开一个新窗口
    }); //监听close  e是事件

    $li.on('click', '.close', function (e) {
      console.log("鼠标点了关闭按钮");
      e.stopPropagation();
      console.log(hashMap); //webstorm独有的功能，变量后面 打.log按Tab 就出来了~
      //从hashmap里找到当前点的网站然后给删掉

      hashMap.splice(index, 1); //splice用法 从index删多少个，删完之后记得重新渲染一下hashmap

      render();
    });
  });
};

render(); // console.log($)
// 从boot cdn 输入jQuery复制script 粘贴到 main.js之前 ，然后想测试一下是否导入成功 ， 就在这里输入一下console.log($) 看网页的控制台有没有就好了~
//现在要用jQuery 监听点击新增网站的Button事件 ，console log调试大法，每做完一步想测试的时候就console.log一下看这一步有没有问题

$(".addButton").on("click", function () {
  // console.log(1)   //有1说明监听成功了
  var url = window.prompt("请输入您要添加的网址"); //现在需要点开后弹窗询问用户添加什么网址

  if (url.indexOf("http") !== 0) {
    //第一个字符如果不是https就提示一下，就默认给它加个https,所以要把const改成let，因为const改不了
    url = "https://" + url;
  }

  console.log(url); //现在要得到用户输入的东西 依旧log调试
  //现在要把新增网站的第一个字母放到里面去，新增一个div插进去，位置是在“新增网站”的前面

  console.log($siteList);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    //注意这个逗号！！！ 搞半天 这是哈希表 里面用逗号隔开！！！
    url: url
  }); //现在思路变了，当点击的时候不再创建Li了 而是在hashmap里添加一项，这个做完之后干嘛？ 就重新把hashmap 渲染一下（如下重新做一遍for each的步骤），但这个时候发现又多加了一个usc 和github, 所以要把之前的usc github删掉， 怎么删呢

  render();
}); //    console.log($siteList) 现在找到sitelist 然后打出来,打出来的是jquery的API  //多行字符串 用反引号 ， 下面这个const $li就是 新增的Li  ，去jq 中文文档看， 搜insert 找到insertBefore  
//   const $li = $(`<li>    
// <a href="${url}"
//             ><div class="site">
//               <div class="logo">${url[0]}</div>
//               <div class="link">${url}</div>
//             </div></a
//           >
// </li>`).insertBefore($lastLi);
// });
//现在用手机测一下 这个地方搞了半天  首先要让电脑和手机处于同一个wifi下 然后在手机的浏览器里输入ip+端口号(一定要加端口号 不然默认找8080端口就打不开了！！！)格式是：192.168.31.127:1234 最好用chrome打开 百度浏览器有些问题
//tips :为什么取名有讲究 叫global header 而不是header 因为要考虑到万一工作时候碰见了猪队友 ，写的代码很烂 乱加header  就会污染CSS, 所以就起这种比较特殊的名字 防止他们和我重名
// 现在要解决的是新增网站后，退出来后网站就不见了， 因为没有存起来， 怎么办呢？---用哈希表组成的数组给他存起来 
//现在监听用户要关闭页面时的操作，在关闭页面的时候就把哈希函数存起来

window.onbeforeunload = function () {
  console.log('页面关闭了');
  var string = JSON.stringify(hashMap); //local storage只能存字符串 不能存对象 所以现在我们用stringify把哈希对象变成字符串

  console.log(hashMap);
  console.log(_typeof(hashMap));
  console.log(_typeof(string));
  console.log(string); //现在把字符串存到全局变量local storage里面 window.可省略 他接受两个值，key和value

  localStorage.setItem('x', string);
}; //键盘导航，  监听键盘事件 ，监听document （经验之谈）
//document.addEventListener()
//或者用jq包装一下


$(document).on('keypress', function (e) {
  console.log(e.key); //webstorm提示keycode不要用 那就用key吧~
  //const key= e.key
  //如果变量名和属性名一样就可以简写如下

  var key = e.key;
  console.log(key); //现在要找到用户按的那个键然后打开对应的网址

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=https://quanquan97.github.io/nav/dist/main.882fc4d1.js.map