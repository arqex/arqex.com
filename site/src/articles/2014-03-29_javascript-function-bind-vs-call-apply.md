---
slug: "/articles/javascript-function-bind-vs-call-apply"
type: "article"
date: "2014-03-29"
source: ""
title: "Javascript function context: bind vs call & apply"
link: "/853/javascript-function-bind-vs-call-apply"
---

In case you don't know, or you are starting with javascript, there is a method in the Function prototype called <strong><em>bind</em></strong> that, once you start, you will never stop using it. This method was added in ES5 (so if you are developing for IE &lt; 9, I recommend to have a look at the <a href="http://underscorejs.org/#bind" title="Underscore bind polyfill" target="_blank">underscore polyfill</a>) and let the developer define what the object <strong><em>this</em></strong> will be inside the function. Here it is an example:

 
<pre class="lang:js decode:true " title="Function bind example" >var f = function(){
    console.log(this.toString());
}

var bound = f.bind('bind');

bound(); // bind</pre> 

On the other hand, there are two old javascript friends, <strong><em>call</em></strong> &amp; <strong><em>apply</em></strong> Function methods, which execute the function and also can customize the context of execution, allowing to define the <strong><em>this</em></strong> object when it is given as their first argument:
 
<pre class="lang:js decode:true " >var f = function(){
    console.log(this.toString());
}

f.apply('apply', []); // apply
f.call('call'); // call</pre>

So far so good, but there is a situation where the behaviour of these functions is not that clear. What would happen if the call or apply methods are used on a already bound function? Let's find out...
 
<pre class="lang:js decode:true " title="bind vs apply and call example" >var f = function(){
    console.log(this.toString());
}

var a = 'apply',
    b = 'bind',
    c = 'call'
;

var bound = f.bind(b);

bound(); // bind

f.apply(a, []); // apply
f.call(c); // call

bound.apply(a, []); // bind
bound.call(c); // bind</pre> 


Want to try it? here you have the <a title="Function bind is more powerful than call or apply" href="http://jsfiddle.net/marquex/BcvE6/1/" target="_blank">bind vs call &amp; apply jsfiddle</a>.

Yes, <strong>bind has won</strong>! I would have bet for call &amp; apply because they are executed after bind, but it seems like a bound function is always executed with the given <em>this </em>parameter. From now on, I will <strong>be careful when using call &amp; apply, they don't always use the <em>this </em>object passed as argument</strong>.