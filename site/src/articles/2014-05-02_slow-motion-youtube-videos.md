---
slug: "/articles/slow-motion-youtube-videos"
type: "article"
date: "2014-05-02"
source: ""
title: "Slow motion youtube videos"
link: "/863/slow-motion-youtube-videos"
---

I have been playing guitar for long time now, and there has been something that I always wanted: <strong>make guitar videos on youtube go slower</strong> to see clearly how some piece is played. Now that most of the video sites use html5 video tags to render their videos, playing them in slowmotion is a piece of cake.

I have created a bookmarklet to everyone who needs the same:

<!--more-->

<a href="javascript:(function(){var v = document.querySelector('video');v.playbackRate = v.playbackRate == .5 ? 1 : .5;})()">Slow motion video</a>

Just drag the link above and drop it on your bookmark bar, visit youtube or vimeo start a video and click on it. That's it, you should be watching your video at half of the original speed.
<h3>Looks great. How does it work?</h3>
Nowadays browser let the developer take the controls of how to display videos thanks to the &lt;video&gt; tag. That tag offers you an API to play, pause and seek video moments. And also there are a property called <strong>playbackRate</strong> to control the playback speed.

So the bookmarklet just fetch the video tag from the DOM and change the playbackRate value to 0.5
 
<pre class="lang:js decode:true" title="Slow motion video scriptlet" >(function(){
	var v = document.querySelector('video');
	v.playbackRate = v.playbackRate == .5 ? 1 : .5;
})();</pre> 

As you can see, hitting the bookmark again will restore the playbackRate value to 1. Set values lower that 1 to play the video slower and bigger than 1 to play it faster. It is possible even to set negative values to play the video backwards.

For playbackRate values lower than 0.5 the sound is muted.

It is needed that the video is served in HTML5 format (default for most of browsers), otherwise it won't work.

If you want to know more from the HTML5 video API, have a look at <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video" title="HTML5 video API" target="_blank">Mozilla's docs</a>.