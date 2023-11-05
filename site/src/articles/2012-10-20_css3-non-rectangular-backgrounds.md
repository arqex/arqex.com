---
slug: "/articles/css3-non-rectangular-backgrounds"
type: "article"
date: "2012-10-20"
source: ""
title: "CSS3 Non rectangular backgrounds"
link: "/738/css3-non-rectangular-backgrounds"
---

Bored of rectangular backgrounds? You are right, squared divs are boring but you don't like rounded corners anymore and need something special like this?
<style> .nonrectangular{ font-size:2em; width:300px; margin:0 auto; position:relative; color:#fff; text-align:center; padding:10px; } .nonrectangular:before{ content: " "; width:100%; height:100%; display:block; background:#276E33; position:absolute; z-index:-1; -webkit-transform: perspective(150px) rotate3D(0.5,-0.3,0.7,3deg) translate(-10px,-10px); -moz-transform: perspective(150px) rotate3D(0.5,-0.3,0.7,3deg) translate(-10px,-10px); transform: perspective(150px) rotate3D(0.5,-0.3,0.7,3deg) translate(-10px,-10px); -ms-transform: rotate(5deg) translate(10px); } </style>
<div class="nonrectangular">This is a nice div with a non rectangular background!</div>
Then, you have reached the right place!

<!--more Discover this nice trick...-->

This nice effect is obtained using the new <a href="http://www.w3schools.com/cssref/css3_pr_transform.asp">CSS 3D transform</a>, so no every browser will render this example properly, you won't see the example correctly if you don't use:
<ul>
	<li>Chrome 12+</li>
	<li>Firefox 10+</li>
	<li>Internet Explorer 10+</li>
	<li>Safari 4+</li>
</ul>
<h3>Creating a background layer</h3>
The first thing to do is creating a background which can be rotable or transformable without change the proportions of the actual div. We can get it using the <em>:before</em> selector, this will be our HTML:
<pre lang="html">
<div class="nonrectangular">
This is a nice div with a non rectangular background!
</div></pre>
And our base css:
<pre lang="css">.nonrectangular{ position:relative } 
.nonrectangular:before{ 
 content: " "; 
 width:100%; 
 height:100%; 
 background:#ccc;
 position:absolute;
 z-index:-1; 
}</pre>
Using <em>.nonrectangular:before</em> we create a virtual empty div with the same width and height inside the actual div. Making it absolute positioned, and its parent relative, we force our browser to redraw the <em>before </em>layer and it will visible, placed in the top left of the .<em>nonrectangular </em>div. The negative <em>z-index</em> property set our background layer up!
<h3>Setting the shape of the background</h3>
There is no way of making a non-paralelogram polygon using just 2D transformations, to obtain that great effect we need to add some perspective to our background. Currently, only Firefox (version 16) uses css transformations without vendor prefixes, so it is needed to add several rules to get a crossbrowser result:
<pre lang="css">
.nonrectangular:before{ 
 -webkit-transform: perspective(150px) rotate3D(0.5,-0.3,0.7,3deg); 
 -moz-transform: perspective(150px) rotate3D(0.5,-0.3,0.7,3deg);
 transform: perspective(150px) rotate3D(0.5,-0.3,0.7,3deg);
 -ms-transform: rotate(5deg) translate(-10px);
}</pre>
Different shapes can be obtained changing the values of the <em><a href="http://www.eleqtriq.com/2010/05/understanding-css-3d-transforms/">rotate3D</a></em> property, so just play a little bit with them! The last rule is for IE9, which doesn't support 3D transformations but 2D, so we can rotate the background in order to give some nice effect using IE9 too.

If you want to play a little with this background trick here you have a <a href="http://jsfiddle.net/zF333/2/">jsfiddle</a>.