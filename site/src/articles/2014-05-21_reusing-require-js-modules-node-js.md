---
slug: "/articles/reusing-require-js-modules-node-js"
type: "article"
date: "2014-05-21"
source: ""
title: "Reusing require.js modules in Node.js"
link: "/874/reusing-require-js-modules-node-js"
---

Using the same code in the browser and in the server is something that every developer dream of. The solution of that problem is known as the <strong>Holy Grail</strong> of javascript and there are different approaches to trying to get it. Probably we will be much closer to find the Grail when <a href="http://www.2ality.com/2013/07/es6-modules.html" target="_blank">ECMAScript 6 modules</a> are supported by every browser, but until that day, people try to find their ways to reuse as much as possible.

A lot of developers are using the awesome tool <strong><a href="http://browserify.org/" target="_blank">Browserify</a> </strong>nowadays to make node modules work in the browser. Browserify is great, and I think that the way of requiring modules in a Node way is much cleaner than the one used in the browser by AMD modules. But it needs to 'compile' the node source code to a browser version in order to be used in the client side, so actually it is not the same code that runs in the server.<!--more-->

Currently it is not possible to require scripts in a CommonJS style (node style) in the browser
<pre class="lang:js decode:true">var module = require('mymodule.js');</pre>
because the script execution can't be halted until the module is ready to use it. That is why Browserify needs to transform the code to be used by the client.

On the other hand, browser javascript modules are defined using the <strong><a href="https://github.com/amdjs/amdjs-api/wiki/AMD" target="_blank">AMD notation</a></strong> (for example, <strong>the ones used by <a href="http://requirejs.org/" target="_blank">require.js</a></strong>) and Node.js would be perfectly able to load the modules with a defined in that way.
<pre class="lang:js decode:true">require('mymodule.js', function(module){
//use your module here
});</pre>
<h3> Introducing AMDrequire</h2>
<strong><a href="https://github.com/arqex/amdrequire" target="_blank">AMDrequire</a> </strong>is a npm package that makes Node.js able to load AMD modules like if they were native Node modules. Let's say we have the following require.js module in <strong>mymodule.js</strong>
<pre class="lang:js decode:true" title="mymodule.js">define([],function(){
  return 10;
});</pre>
Using <strong>AMDrequire</strong> it is possible to load it in your Node.js the way it would be loaded in the browser:
<pre class="lang:js decode:true">require(['./mymodule.js'], function(ten){
  console.log(ten + 10); //Outputs 20 in the Node.js console.
});</pre>
That means that all the modules written for require.js are suddenly available for their use in Node.js. Isn't it great? And the best part of it that there is no need to modify one line of code, <strong>the same exact code is being reused by the client and the server</strong>.

And what is even better, <strong>you can still use Node.js modules as usual</strong>, requiring them in a synchronous way.

Notice that <strong>AMD modules are loaded using require.js notation, with an array as the first parameter</strong> (named define are not supported yet), and <strong>Node modules are loaded using standard Node.js notation, with the path or name string as the first parameter</strong>.
<pre class="lang:js decode:true">var module = require('mymodule.js');</pre>
<h3>How can I use AMDrequire?</h2>
AMDrequire is available as NPM package, so, to use it, the first thing to do is add it to your project
<pre class="lang:default highlight:0 decode:true">npm install amdrequire</pre>
Then, make it the first require in your application's entry file
<pre class="lang:js decode:true">require = require('amdrequire');</pre>
Once this is done, it is possible to<strong> load AMD modules in any of the application files</strong>. Also it is possible to create modules with the <code>define</code> method to be used in the server and the client.
<h3>Configuring AMDrequire</h2>
To make the configuration easier, AMDrequire can directly receive require.js configuration object to use the same named requires than the client.
<pre class="lang:js decode:true">require = require('amdrequire');
require.config({
    paths: {
        'world': 'somedir/world'
    }
    basePath: __dirname + '/public/assets/js',
    publicPath: __dirname + '/public'
});</pre>
As it is seen in the example, the <code>config</code> method accepts almost the same parameters of require.js one. <strong>That method is only available in the require object returned when amdrequire is loaded</strong>. There are two different parameters :
<ul>
	<li><strong>basePath</strong>:  It is equivalent to require.js <code>baseUrl</code> option, so it should point to the local path of that URL. All the relative paths used in AMD's require and define calls, that don't start with <code>./</code> or <code>../</code> will be relative to this directory. In the example, the <em>world</em> module should be in <code>__dirname + '/public/assets/js/somedir/world.js'</code> .</li>
	<li><strong>publicPath</strong>: Defines the path of the root URL directory. In the browser it is possible to require modules using root routes, they start with a slash <code>/like/route/from/the/root</code> and they are relative to the domain URL. <code>publicPath </code> tells what is the equivalent to that <code>/</code>  route to AMDrequire, so it can handle that kind of requires.</li>
</ul>
<h3> Want to collaborate?</h2>
AMDrequire is a young module, so any help in its development would be great. In the <a href="https://github.com/arqex/amdrequire" target="_blank"><strong>AMDrequire git page</strong></a> it is possible to find deeper documentation and some suggestions on what to improve, and of course, any comment is really welcome.