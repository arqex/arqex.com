---
slug: "/articles/overflow-hidden-chrome-against-the-rest-of-browsers"
type: "article"
date: "2011-04-15"
source: ""
title: "Overflow hidden: Chrome against the rest of browsers"
link: "/438/overflow-hidden-chrome-against-the-rest-of-browsers"
---

This is a problem that I have to deal with everyday at my job. We have some templates "ready" to display a 3 columns fluid layout and they were perfect until Google Chrome arrived, which displays the layout in a different way.

The idea is easy, we have two divs, one floating to the right and the other one, called container, makes the fluid part of the page. We don't want the elements of the fluid div to wrap the right column, so the container has a right margin with the same or higher width than the right column. Inside the container, we use the same tactics to get a left column.

<!--more Why Chrome? Why? Continue reading... -->

<pre lang="php" line="1">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>Chrome-Firefox differences</title>
	<style type="text/css">
		body {
			color: #fff;
		}
		#rightcol{
			float: right;
			width: 200px;
			background: green;
			height: 200px;
		}
		#leftcol{
			float: left;
			width: 200px;
			background: red;
			height: 250px;
		}
		#main{
			margin-left: 210px;
			background: blue;
			height: 200px;
		}
		#container{
			overflow: auto;
			margin-right: 210px;
			background: #ddd;
		}
	</style>
</head>
<body>
	<div id="rightcol">And last but not least, the right column.</div>
	<div id="container">
		<div id="leftcol">Hi, I'm the left column</div>
		<div id="main">I am the main content. Nice to meet you.</div>
	</div>
</body>
</html>
</pre>

<h3 style="text-align: center;"><a href="http://marquex.es/wp-content/demos/diferencias.html" target="_blank">Try the demo by yourself</a></h3>

This way we have a fluid design that works ok except for one issue, the container will have the main div height even if the left column is taller than the main one. The fix for that issue is easy, we can add 'overflow:auto' or 'overflow:hidden' to the container, so it will realize it has a floating div inside and 'recalculate' its height. That is called create a new <a href="http://www.w3.org/TR/CSS21/visuren.html#block-formatting" target="_blank">block formatting context</a>, and it is very nice explained in the colinarts article <a href="http://colinaarts.com/articles/the-magic-of-overflow-hidden/" target="_blank">The magic of overflow hidden</a>.

On every browser it works as we would like, but on Chrome, adding the overflow:auto makes the container realize that have a floating div at its right too, and leave the right margin to the right column instead to the window border.
<h3>All browsers but Chrome</h3>
<a rel="attachment wp-att-440" href="http://marquex.es/438/overflow-hidden-chrome-against-the-rest-of-browsers/diferenciasff"><img class="aligncenter size-medium wp-image-440" title="Overflow hidden interpretation by Firefox" src="http://marquex.es/wp-content/uploads/2011/04/diferenciasff-570x201.png" alt="Overflow hidden interpretation by Firefox" width="570"  /></a>
<h3>Overflow hidden by Chrome</h3>
<a rel="attachment wp-att-441" href="http://marquex.es/438/overflow-hidden-chrome-against-the-rest-of-browsers/diferencias"><img class="aligncenter size-medium wp-image-441" title="Overflow hidden interpretation by Chrome" src="http://marquex.es/wp-content/uploads/2011/04/diferencias-570x201.png" alt="Overflow hidden interpretation by Chrome" width="570"  /></a>I could not find info about this case in the CSS docs, but I think that the new block formatting context should have effect only inside the 'overflow:hidden' div, not outside, so from my point of view, <strong>Chrome is doing it wrong</strong>. ¿What do you think?

Tested on: FF4, FF 3.6.16, Chrome 11.0.696.43, IE7, IE8, Opera 11.01