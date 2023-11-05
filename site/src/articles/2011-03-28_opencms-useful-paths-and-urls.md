---
slug: "/articles/opencms-useful-paths-and-urls"
type: "article"
date: "2011-03-28"
source: ""
title: "Opencms useful paths and urls"
link: "/268/opencms-useful-paths-and-urls"
---

This is the first post in my new brand site about technology and I hope you can enjoy it or at least you get something useful.

As a person who likes programming and technology, I like to read and write about the newest stuff, but nowadays I am working as a OpenCms programmer, and since there is not a great documentation and tutorials on the internet about it, I want to share the solutions I found to the thousand problems i found myself in with OpenCms.

One of those problems is related with the paths used to get some data in a jsp. The next list will make your life easier when you want to load some content, display an image, or link some url with opencms.

<!--more Interested abouts paths? Keep reading...-->

<a rel="attachment wp-att-273" href="http://marquex.es/268/opencms-useful-paths-and-urls/uri"><img class="alignnone size-medium wp-image-273" title="uri" src="http://marquex.es/wp-content/uploads/2011/03/uri-570x244.jpg" alt="" width="570"  /></a>

Just a little explanation for newbies on OpenCms, if you want to use a taglib solution you will have to include the next code in the begining of your jsp:
<pre class="brush:java">&lt;%@ taglib prefix="cms" uri="http://www.opencms.org/taglib/cms" %&gt;</pre>
If you want to use a scriplet solution, then you will need to declare a CmsJspActionElement also in the begining of your file:
<pre class="brush:java">org.opencms.jsp.CmsJspActionElement cms = new org.opencms.jsp.CmsJspActionElement(pageContext, request, response);</pre>
<h3>Loading some contents from the current folder</h3>
If you want to create a jsp that read some contents from the folder that contains it, the easier way is using the cms:info tag
In this example we want to read all the news using a jsp in the same folder than the news. The path to our jsp will be "/extra/news/index.jsp".
<pre class="brush:java">With the taglib we would do:
&lt;cms:info property="opencms.request.folder" /&gt;
&lt;%-- prints out /extra/news/ --%&gt;</pre>
Using a scriptlet
<pre class="brush:java">String folderPath = cms.info("opencms.request.folder");
// Store "/extra/news/" in the variable folderPath</pre>
Using this, you will get your script to access to the content of the current folder. If you are using it to display news, you will only need to create a link to the file from other path to display their news.
<h3>Adding the context path "/opencms/opencms/" to your links</h3>
In my computer I have several OpenCms installations, one of them in /opencms/opencms/ and other in /opencms752/opencms/, and I need my jsp to work in all of them. If I write a link in my jsp like this:
<pre class="brush:html">&lt;a href="/opencms/opencms/miimage.jpg"&gt;My image&lt;/a&gt;</pre>
It wouldn't work in the /opencms752/opencms instalation. Instead hardcoding the link, in this case it is very useful the &lt;cms:link&gt; tag:
<pre class="brush:java">&lt;a href="&lt;cms:link&gt;/miimage.jpg&lt;/cms:link&gt;"&gt;My image&lt;/a&gt;
&lt;%--
Will link to
/opencms/opencms/miimage.jpg in my /opencms/opencms installation and
/opencms752/opencms/miimage.jpg in my /opencms752/opencms one.
--%&gt;</pre>
This is the proper way of linking for HTML, use it with a, img, script, style and form HTML tags.
<h3>Making a link work in the root site "/" and other sites "/sites/default/"</h3>
Imagine you need a bulletproof jsp that have to work if you call it from the administration area, whenever you are in the root site or in your /sites/default or any other site you have in your opencms.
This is typical when you are creating a administration section in opencms, you want to make it work the same way when you are in any site. Keep imagining that that jsp is the one from the first example that display the news list in the folder <em>/extra/news/</em>.
If you have your opencms in<em> "/sites/default/"</em> it will work for sure, but if you have it in the root site "/" it will return an error because you should search the news in the path <em>"/sites/default/extra/news/"</em>.
You can know when to add the <em>"/sites/default/" </em>prefix using the session manager:
<pre class="brush:java">&lt;%@ page import="org.opencms.main.OpenCms" %&gt;
&lt;%
String currentSitePrefix = OpenCms.getSessionManager().getSessionInfo(session).getSiteRoot();
/*
This will store "/sites/default/" or whatever site we are in the currentSitePrefix variable
but if we are in the root site this will store an empty String "".
*/
%&gt;</pre>
So when I need this functionality in my jsp's I use the following function:
<pre class="brush:java">&lt;%!
/**
* Add the site prefix to a path if we are in the root site "/"
* @param path String - The path we want to check.
* @param ses - The current HttpSession object.
* @return The correct path depending on the current site.
*/
String getSitePath(String path, HttpSession ses){
//If a file in the system folder is required we don't need to fix it,
//because that folder is accessible from any site
if(path.startsWith("/system/"))
return path;
//If we are on the root site, we need to prepend the site prefix
if(OpenCms.getSessionManager().getSessionInfo(ses).getSiteRoot().equals(""))
return org.opencms.main.OpenCms.getSiteManager().getDefaultSite().getSiteRoot() + path;
//If we are on other site we don't need to add a prefix
else
return path;
}
%&gt;
&lt;%
String path = getSitePath("/extra/news/", session);
//the path variable will contain "/extra/news/" if we are in the default site or "/sites/default/extra/news/" if we are in the root one.
%&gt;</pre>
This function only works with the default site, if we have more sites in our opencms we can add another parameter to the function
with the prefix of the site to prepend. When you are using one OpenCms for multiple sites you will find the CmsSiteManager class documentation very useful.