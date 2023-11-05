---
slug: "/articles/4-balls-10-spinners-css3-animations"
type: "article"
date: "2014-08-20"
source: ""
title: "4 balls 10 spinners: CSS3 Animations"
link: "/934/4-balls-10-spinners-css3-animations"
---

Loading spinners are lots of fun. Their main purpose is to<strong> let users know that the app is loading</strong>, but it has a secondary one that make them very special: they should <strong>amuse the users while they are waiting</strong>. If they are good, they even make the waiting time shorter. The spinner is probably the part of an application where the designer can be more creative, having the freedom for creating a funny animation in an environment traditionally marked by the static nature of most of the components.

<strong>My challenge is to create 10 different loading spinners using 4 circles</strong> and CSS3 animations to cheer them up. It is a good creativity exercise, that will make me explore some key parts of CSS3 animations and, what is better, show them to you. I hope they are inspiring, let's start!
<h3>1. Newton's cradle</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="jsKza" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/jsKza/">Newton's cradle</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
Hey! That doesn't spin, it is not a spinner! Well, it is common among loading animations to be circular, but I will start with some plain ones because they are simpler.

I will use the <code>--prefix-free</code> option offered by codepen in all the spinners, so the result CSS will be much easier to read.

In the <a title="What is a newton's cradle?" href="http://en.wikipedia.org/wiki/Newton's_cradle" target="_blank">Newton's cradle</a> only two balls are animated. I get a natural movement updating the <code>animation-timing-function</code> inside a keyframe. <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function" target="_blank"><code>animation-timing-function</code></a> applies easing to every transition between keyframes. When the function is updated inside some keyframe, the transition to the following one will use that given function. Using <code>ease-out</code> when the ball is going away and <code>ease-in</code> when it is returning we have the desired <em>pendulum</em> effect.
<h3>2. Wave</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="hgvxJ" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/hgvxJ/">Wave</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
The timing function update inside a keyframe is also used in this spinner to ease the ball jump. <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function" target="_blank">Timings functions</a> are really powerful, and for the wiping ball I am using a customized <code>cubic-bezier</code> value.

I expected the <code>ease</code> value to work here, but it was producing collisions with the jumping balls. That's because the <code>ease</code> value doesn't apply the same easing for the beginning than for the end of the animation, so I had to use <code>cubic-bezier</code> to get the effect I want. I would explain <code>cubic-bezier</code> curves here, but the easiest way to understand how they work is visiting <a href="http://cubic-bezier.com/" target="_blank">cubic-bezier.com</a>, its interactive graph is worth a thousand words.
<h3>3. Circus</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="FaDKs" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/FaDKs/">Circus</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
Here we are spinning. Well, sort of... I will only use 2D transformations to create my spinners, so here there are just moving and scaling.

I use two animations for every ball. When you apply more than one animation to the same element, all of them run at the same time and , unfortunatelly, there is no way to create a queue using CSS3. But in this case is good enough.

Circus uses negative <code>animation-delay</code> values to set the starting position and size of each ball, and make them spin from the begining. As you can see, <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transforms" target="_blank">CSS3 transforms</a> are used to change the size and position of the balls. <a href="http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/" target="_blank">Transform are really handy for CSS3 animations</a>, I like especially the <code>scale</code> one, that makes the balls grow or shrink respecting the center of the elements. That means the balls grow/shrink to the same proportion to the left/right horizontally and to the top/bottom vertically. If I had used <code>width</code> and <code>height</code> properties, the balls just would have grown/shrunk to the left and the bottom. By default, the origin of CSS3 transformation is the center of the element.
<h3>4. Atom</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="lKoay" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/lKoay/">Atom</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
Let's start creating animations less horizontal. I will use Circu's 3D effect to create some electrons spinning around a nucleus :)

Here the <code>.ball</code> elements are actually squares, and the circles that are shown are<code> :before</code> pseudo-elements positioned absolutely at the top left of the square. Every square is rotated to make the balls move with a different inclination. Try to uncomment the <code>background</code> property in the electron mixin to see what I mean.

Animating the <code>z-index</code> property in the ball containers, I could make the electrons go back and forth around the nucleus. Pay attention than in firefox, to animate <code>z-index</code> property, the element should have a <code>z-index</code> value set up, otherwise it won't work. Also the nucleus has a subtle scale animation that make the spinner feel more dynamic.

People from github, don't you like it for you <a href="https://atom.io/" target="_blank">atom editor</a>? :)
<h3>5. Fussion</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="vfJbs" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/vfJbs/">Fussion</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
So far whe have animated the position and the size of the balls, but focusing in other properties we can get really different spinners. Fussion focus in background colors, and it is inspired by my of Nexus 7's boot animation.

It is a basic strategy for every spinner to render the balls in the same state that they had in the begining of the loop, in order to make possible repeat the animation infinitely. In this case, every ball is transformed in the next one to get ready for the next loop. Making the balls semi-transparent creates the effect of color fussion when they are all together.
<h3>6. Mitosis</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="mKBcE" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/mKBcE/">Mitosis</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
Mitosis uses an <code>alternate</code> value for the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction" target="_blank"><code>animation-direction</code></a> property, that means that when the animation finishes, goes backwards to the begining again. That way the balls can split at the begining and merge at the end coding just the half of the animation.

But, if you look at the animation the balls are not merged in the same direction than they were splitted, that's because the whole spinner is rotated 90 degrees in the middle of the loop, using the <code>step(2, end)</code> value for the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function" target="_blank"><code>animation-timing-function</code></a>. The step function make the animations complete rendering just the number of frames given to the function. In our case 2 frames, the first is rotated 0 degrees and the second 90. The end of the animation (a 180º rotation) is never visible because a new loop starts again.

Another trick used in Mitosis is the deformation of the balls, they are scaled horizontally and vertically asynchronously, showing a really interesting jelly effect.
<h3>7. Flower</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="FfEIx" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/FfEIx/">Flower</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
First spinner here! Remember when I explained at Circus spinner that I said that by default the CSS3 transformations have the center of the object as origin by default? In flower, all the transformation's origins for the balls have been moved to the center of the spinner. That way the balls use that point as the center of the rotation instead their own center, so they can rotate as if they were one circle. <a href="https://developer.mozilla.org/es/docs/Web/CSS/transform-origin" target="_blank"><code>transform-origin</code></a> is the property that let us customize the center of all the transformations.

Thanks to <a href="http://lesscss.org/" target="_blank">LESS </a>the calculation of the origin is a bit easier. In this spinner I wish I had some way of enqueueing the animations, because calculate the keyframes position manually was really painful.
<h3>8. Clock</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="Hzxfp" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/Hzxfp/">Clock</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
Sometimes, to make some element spin, it is not necessary to change the <code>transform-origin</code>. In this case, <code>:before</code> pseudo-elements are used to render the balls, the same way they were in Atom spinner. So every <code>.ball</code> element is really a square, and the ball is placed in its top left. Rotating those squares we can make all the balls spin using the same center.

The <code>step</code> function is again used in the <code>.spinner</code> element to create the effect of whole spinner rotation in every loop of the ball group.
<h3>9. Washing machine</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="fAhoD" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/fAhoD/">Washing machine</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
Here the borders are the starring of the spinner, but, in this case, none of the balls is animated. The whole spinner is what is rotated, very fast, and alternating the direction thanks to the <code>animation-direction</code> property.

In this spinner <code>:before</code> pseudoelements are used for rendering the small balls, and the <code>.ball</code> elements are rotated to place the balls in different points of the big border. Again, LESS is really helpful to make all the calculations needed to center the balls in their container.
<h3>10. Pulse</h3>
<p class="codepen" data- data-theme-id="0" data-slug-hash="hcxwb" data-default-tab="result">See the Pen <a href="http://codepen.io/arqex/pen/hcxwb/">Pulse</a> by Javier Marquez (<a href="http://codepen.io/arqex">@arqex</a>) on <a href="http://codepen.io">CodePen</a>.</p>
This is an example of how diverse spinners can be made if we focus in different css properties. The main property animated here is <code>border</code>, with a little help of the <code>opacity</code> one to create a bubbling effect.

This is not a complex slider because every ball uses the same animation. Here again, <code>animation-delay</code> is our friend to make every ball bubble at their time.
<h3>Conclusion</h3>
Here it is where I am supposed to say "Animations are awesome, come on! Use them!". They have very strong points:
<ul>
	<li>No need of any external libraries.</li>
	<li>The animations are hardware accelerated, so their performance is really good.</li>
</ul>
But creating the spinners I felt that they were made to create small effects. When you start to think bigger, the complexity of the code and calculations grows exponentially, making the use of css preprocessors almost mandatory for their development.

Also, browser support is not really big. At the moment of writing this article, only 23.8% of users will be able to see the animations if you don't use vendor prefixes, according to <a href="http://caniuse.com/#feat=css-animation" target="_blank">Can I Use</a>, so you will need a css prefixer if you don't want to get old writing them all.

A way of making a queue of animations would be great to have. Currently, <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions" target="_blank">CSS transitions</a> can be used to create a queue, but you need a touch of javascript too coordinate when to apply them.

The last issue I would like to point out is that it is impossible to apply transformations independently. For example, if you want to move an element from 0px to 130px and, and in the middle you want to scale it to a 200% you need to calculate manually also the position of the element in that middle point:
<pre class="lang:css decode:true">@keyframes my-animation {

0%{
  transform: translateX(0);
}
50%{
  transform: translateX(65px) scale(2,2);
}
100%{
  transform: translateX(130px);
}
}</pre>
It may seem not a big problem, but if you want to apply some easing function, it will be applied to the 50% keyframe too, so it will got slower/faster in the middle of the animation.

I wouldn't use any library just to create a spinner in my projects, but if I had to create an app with some complex animation I would really think about using some tool like <a href="http://julian.com/research/velocity/" target="_blank">velocity.js</a> to make my life easier and gain some cross browser compatibility.
<h3>Your challenge</h3>
Did I tell you that spinners are fun? There is currently <a href="http://www.reddit.com/r/web_design/comments/2dwj5p/community_challenge_design_a_css_spinner/" target="_blank">a challenge to create the best spinner using CSS3 animations at reddit</a>. Web design community is always amazing, why don't to submit yours?

<script src="//codepen.io/assets/embed/ei.js" async=""></script>