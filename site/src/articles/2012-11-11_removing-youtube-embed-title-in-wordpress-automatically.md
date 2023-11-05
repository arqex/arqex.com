---
slug: "articles/removing-youtube-embed-title-in-wordpress-automatically"
type: "article"
date: "2012-11-11"
source: ""
title: "Removing Youtube embed title in WordPress automatically"
link: "/763/removing-youtube-embed-title-in-wordpress-automatically"
---

It's easy to find how to remove the initial title and controls in your youtube embeds. You just need to append
<pre>&amp;showinfo=0</pre>
to the youtube url. WordPress has a nice feature that embeds video links automatically, so you don't need to handle messed html code, but that embed show the video title too.

<!--more Click to discover the trick -->

To make WordPress to embed a youtube video without the title add this function to your theme's functions.php file
<pre class="lang:php decode:true crayon-selected">function remove_youtube_controls($code){
	if(strpos($code, 'youtu.be') !== false || strpos($code, 'youtube.com') !== false){
		$return = preg_replace("@src=(['\"])?([^'\"&gt;s]*)@", "src=$1$2&amp;showinfo=0&amp;rel=0", $code);
		return $return;
	}
	return $code;
}

add_filter('embed_handler_html', 'remove_youtube_controls');
add_filter('embed_oembed_html', 'remove_youtube_controls');
</pre>
The rel=0 attribute removes the related videos when the player stops. Enjoy!