---
slug: "/articles/fontface-opencms"
type: "article"
date: "2011-05-18"
source: ""
title: "@font-face and Opencms"
link: "/519/fontface-opencms"
---

I've started to develop a new site in Opencms and this time I have free way to design it however I want, so I wanted to do something good looking.

The use of the CSS rule @font-face is not difficult, specially using the <a title="Font face generator" href="www.fontsquirrel.com/fontface/generator" target="_blank">@font-face generator from fontsquirrel.com</a>. You upload the font you want to use, and the generator transforms it in all the font formats that browsers use, and create a CSS code that you just to paste in your style file.

That way is how this blog is showing this beautiful typografy in its titles - WC Roughtrad by <a title="Great free fonts" href="http://www.wcfonts.com/" target="_blank">WCFonts</a>.

All this is very easy, but when I tried to do the same in the new Opencms site I realized that It wasn't working.
<p style="text-align: center;"><!--more Discover my Opencms-fontface problem --><a rel="attachment wp-att-520" href="http://marquex.es/519/fontface-opencms/opencmsff"><img class="size-medium wp-image-520 aligncenter" title="opencmsff" src="http://marquex.es/wp-content/uploads/2011/05/opencmsff-300x300.jpg" alt="" width="300"  /></a></p>
After 3 hours of looking for the reasons of the problem I finally found it: <strong>Opencms doesn't export the font files</strong>, but it behaves like if it does and my browser was trying to get them from
<pre>/opencms752/export/system/modules/mynewsite/resources/css/dayrom__-webfont.woff</pre>
That file didn't exist, but Opencms was returning a 303 error instead of the usual 404, so realizing that the files were missing took me some longer, since offline everything was working fine.

Once I understood the problem, I tried to export them from the Opencms admin area but I couldn't, so I finally copied them manually to the export folder of Opencms inside my Tomcat and... that was the solution.
Write the solution takes me less than five seconds - <strong>Copy the font files manually</strong> - but understanding what was happening was a nightmare.

I hadn't any problems then, but in my font-face investigation I read that some browsers have problems if the font mime-type is not correct, so if you want your Opencms not to serve your fonts as text/html, you will have to edit your opencms-vfs.xml, and add the following lines to the mimetipes section:
<pre>&lt;mimetype extension=".woff" type="application/x-font-woff"/&gt;
&lt;mimetype extension=".ttf" type="font/ttf"/&gt;
&lt;mimetype extension=".eot" type="application/vnd.ms-fontobject" /&gt;
&lt;mimetype extension=".etf" type="font/etf" /&gt;
</pre>
The svg extension is already in the file. Hope this helps!