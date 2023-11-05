---
slug: "/articles/learning-much-javascript-one-line-code"
type: "article"
date: "2014-10-06"
source: ""
title: "Learning much javascript from one line of code"
link: "/939/learning-much-javascript-one-line-code"
---

Since javascript is everywhere nowadays, it is really easy to learn new stuff everyday. Once you know the basics of the language, you can take bits of code from here and there that have a lot of knowledge in them. <strong>Bookmarklets</strong> are perfect examples of a bunch of packed functionality, whenever I discover a useful one, I enjoy studying their source, discovering how it can do so much. Also snippets to use external services, like the google analytics code, or facebook likebox, can teach us more than some books.

Today I want to break in pieces a <a href="https://gist.github.com/addyosmani/fd3999ea7fce242756b1">one-liner code</a> that <a href="http://addyosmani.com/blog/" target="_blank"><strong>Addy Osmani</strong></a> shared a few days ago that can be used to debug your CSS layers. Here it is, in 3 lines to fit in the post:
<pre class="striped:false nums:false wrap:false lang:js decode:true" title="A CSS debugger in one line">[].forEach.call($$("*"),function(a){
  a.style.outline="1px solid #"+(~~(Math.random()*(1&lt;&lt;24))).toString(16)
})</pre>
Try to type it in your browser console, and the different layers of HTML that there are in the web page will be highlighted in different colors. Isn't it awesome? Basically, <strong>it gets all the elements of the page, and applies a 1 px outline to them with a random color</strong>. The idea is simple, but to create a code line like this you must master a lot of aspects of web development. Let's study them.
<h3>TL;DR</h2>
People from <strong>Webucator</strong> made a video about this article, so you can watch instead of read. Isn't it great? If you are learning Javascript, checking <a title="Javascript training" href="https://www.webucator.com/webdesign/javascript.cfm" target="_blank">Webucator javascript training</a> is a must.
<div style="text-align: center">
https://youtu.be/6-xc-za9QJM
</div>
<h3>Selecting all the elements of a page</h2>
What it is needed the first is to get all the elements, and Addy uses the  function <code>$$</code> that is only available in the console of browsers. Try it by yourself, open your browser's javascript console and type <code>$$('a')</code> and you will get a list with all the anchor elements of the current page.

<code>$$</code> function is part of the command line API of modern browsers, and it is equivalent to use the method <code>document.querySelectorAll</code>, you can pass a CSS selector as argument to get the matched elements in the current page. So if you would like to use the one-liner out the browser's console you could replace <code>$$('*')</code> by <code>document.querySelectorAll('*')</code>. More about the function <code>$$</code> can be found in <a href="http://stackoverflow.com/questions/8981211/what-is-the-source-of-the-double-dollar-sign-selector-query-function-in-chrome-f#answer-10308917" target="_blank">this stackoverflow answer</a>.

It is great! For me, it was worthy to study the code just by meeting the function <code>$$</code>. But there are more about selecting everything in a page, if you have a look at the comments of the gist, there are people discussing this part of the code. One of them is <a href="https://mathiasbynens.be/" target="_blank"><strong>Mathias Bynens</strong></a>, ( a lot of clever people there! ) who suggests that we can also use <code>document.all</code> to select all the elements of a page, it is not standard, but it works ok in every browser <del>but firefox</del> (in FF too).
<h3>Iterating over the elements</h2>
So we have all the elements now as a <a href="https://developer.mozilla.org/en-US/docs/Web/API/NodeList"><code>NodeList</code></a> and we want to go through all of them applying the colorful outline. But wait, what the heck is used in our code?
<pre class="lang:js decode:true">[].forEach.call( $$('*'), function( element ) { /* And the modification code here */ });</pre>
<a href="https://developer.mozilla.org/en-US/docs/Web/API/NodeList" target="_blank"><code>NodeLists</code></a> seems like <code>Arrays</code>, you can access to their nodes using brackets, and you can check how many elements it contains using the property length, but they doesn't implement all the methods of the <code>Array</code> interface, so using <code>$$('*').forEach</code> will fail. In Javascript there are several objects that look like arrays but they are not, like the arguments variable inside functions, and we have here a very useful pattern to handle with them: Calling array methods on no-array objects as <code>NodeLists</code> is possible using the Function's methods call and apply.<a title="Javascript function context: bind vs call &amp; apply" href="http://arqex.com/853/javascript-function-bind-vs-call-apply"> I wrote about those functions some months ago</a>, they execute a function using the first parameter as the object this inside of the function
<pre class="lang:js decode:true">function say(name) {
 console.log( this + ' ' + name );
}

say.call( 'hola', 'Mike' ); // Prints out 'hola Mike' in the console

// Also you can use it on the arguments object
function example( arg1, arg2, arg3 ) {
 return Array.prototype.slice.call(arguments, 1); // Returns [arg2, arg3]
}</pre>
The one-liner is using <code>[].forEach.call</code> instead of <code>Array.prototype.forEach.call</code> to save some bytes ( another nice trick yeah? ) calling the method in the <code>Array</code> object <code>[]</code>. This would be equivalent to <code>$$('*').forEach</code> if <code>$$('*')</code> value was an <code>Array</code>.

If you have a look at the comments again, there are some people who use <code>for(i=0;A=$$('*');)</code> instead to make the code shorter. It works, but it is leaking global variables, so if you want to use the code out of the console, you better get a clean enviroment using
<pre class="lang:default decode:true">for(var i=0,B=document.querySelectorAll('*');A=B[i++];){ /* your code here */ }</pre>
If you use it in the browser's console it doesn't really matter, the variables <code>i</code> and <code>A</code> will be available there since you are declaring them there.
<h3>Assigning colors to the elements</h2>
To make the elements have that nice border, the code is using the CSS property <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/outline"><code>outline</code></a>. In case you don't know, the rendered outline is out of the CSS box model so <strong>it doesn't affect the size of the element or its position in the layout</strong>, so it is perfect for this purpose. It's syntax is like the one used for the <code>border</code> property, so it shouldn't be difficult to understand this part:
<pre class="lang:js decode:true">a.style.outline="1px solid #" + color</pre>
What  is interesting is how the color is defined:
<pre class="lang:js decode:true">~~(Math.random()*(1&lt;&lt;24))).toString(16)
</pre>
Scary uh? Sure. I am not a bit-wise operations expert, so this is the part I liked the most, because it let me learn a lot of new stuff.

What we want to achieve is a hexadecimal color like white <code>FFFFFF</code> or blue <code>0000FF</code> or... who knows... <code>37f9ac</code>. Non super-human people, like me, is used to work with decimal numbers, but our beloved code knows a lot about hexadecimal ones.

First thing it can teach us is how to convert a decimal number to hex using the method <code>toString</code> for integers. The method accepts a parameter to convert a number to a string using a base number of characters. If the parameter is not used, 10 characters are used (0...9, hence, decimal numbers), but you can use whatever other base:
<pre class="lang:js decode:true">(30).toString(); // "30"
(30).toString(10); // "30"
(30).toString(16); // "1e" Hexadecimal
(30).toString(2); // "11110" Binary
(30).toString(36); // "u" 36 is the maximum base allowed</pre>
The other way around, you can convert hexadecimal string to decimal numbers using the second parameter of the <code>parseInt</code> method:
<pre class="lang:js decode:true">parseInt("30"); // "30"
parseInt("30", 10); // "30"
parseInt("1e", 16); // "30"
parseInt("11110", 2); // "30"
parseInt("u", 36); // "30"</pre>
So we need a random number between <code>0</code> and <code>ffffff</code> in hexadecimal, that is <code>parseInt("ffffff", 16) == 16777215</code> and 16777215 is exactly <code>2^24 - 1</code>.

Do you like binary maths? If not, you will be ok knowing that <code>1&lt;&lt;24 == 16777216</code> (try it in the console).

If you like them, you need to know that every time that you add a 0 to the right of a 1 you are doing performing the <code>2^n</code> operation, being <code>n</code> the number of 0s you add.
<pre class="lang:default decode:true">1 // 1 == 2^0
100 // 4 == 2^2
10000 // 16 == 2^4
1000000000000000000000000 // 16777216 == 2^24</pre>
The left shift operation <code>x &lt;&lt; n</code> adds <code>n</code> <code>0</code>s to the binary representation of the number <code>x</code>, so <code>1&lt;&lt;24</code> is a short way of saying <code>16777216</code>, and doing <code>Math.random()*(1&lt;&lt;24)</code> we get a number between <code>0</code> and <code>16777216</code>.

We are not ready yet, because <code>Math.random</code> return a float number, and we need only the whole part. Our code use the<strong> tilde operator</strong> to get so. Tilde operator is used to negate a variable bit by bit. If you don't know about what I am talking about, here it is a good explanation:<a href="http://www.javascriptturnsmeon.com/the-tilde-operator-in-javascript/" target="_blank"> Javascript's tilde operator</a>.

But the code doesn't care about bitwise negation, it uses the tilde because the bitwise operations discard the decimal part of a float number, so bitwise-negation applied twice is a short way of writing <code>parseInt</code>:
<pre class="lang:js decode:true">var a = 12.34, // ~~a = 12
    b = -1231.8754, // ~~b = -1231
    c = 3213.000001 // ~~c = 3213
;

~~a == parseInt(a, 10); // true
~~b == parseInt(b, 10); // true
~~c == parseInt(c, 10); // true</pre>
Again, if you go to the <a href="https://gist.github.com/addyosmani/fd3999ea7fce242756b1" target="_blank">gist</a> and have a look at the comments you will realize that people there is using a shorter version to get the parseInt result. Using the bitwise <strong>OR operator</strong> you can get rid of the decimal part of our random number
<pre class="lang:default highlight:0 decode:true">~~a == 0|a == parseInt(a, 10)
~~b == 0|b == parseInt(b, 10)
~~c == 0|c == parseInt(c, 10)</pre>
Or operator is the last to be used in a operation so the parenthesis are not needed anymore. Here it is the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence" target="_blank">precedence of javascript operator</a>s in case you are interested in having a look.

Finally we have our random number <code>0</code> and <code>16777216</code>, our random color. We just need to turn it to a hexadecimal string using <code>toString(16)</code> to make it work.
<h3>Last thoughts</h2>
Being a programmer is not easy. We are used to code like crazy and sometimes we don't realize about how much knowledge is needed to do what we do. It takes a long long time to learn and internalize all the concepts that we use in our job.

I wanted to highlight the complexity of our job because I know that programmers are usually underestimated, ( especially in my country, Spain ) and it is nice to say ocassionally that we are really worthy and a key part of most of companies nowadays.

If you understood the one-liner code at first sight you can feel proud of yourself.

If not, but you have reach this point of the article, don't worry, you will be able to write lines like that soon, you are a learner!

If you thought <em>tl;dr</em> at the second line of the article but you are reading this, you are really weird, but your thoughts are also welcome in the comments section below : )