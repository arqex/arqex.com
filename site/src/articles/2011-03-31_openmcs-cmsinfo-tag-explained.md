---
slug: "/articles/openmcs-cmsinfo-tag-explained"
type: "article"
date: "2011-03-31"
source: ""
title: "Openmcs cms:info tag explained"
link: "/362/openmcs-cmsinfo-tag-explained"
---

&lt;cms:info&gt; is one of the most useful tags of the OpenCms taglib, but when I have a look at other's code I can see that people prefer other ways to get the same results that this tag offers just writing one line.I think that happens because a lack of documentation and examples about it. <a href="http://www.google.es/search?sourceid=chrome&amp;ie=UTF-8&amp;q=cms%3Ainfo+opencms" target="_blank">Googleing </a>a little about this tag you can find two main sources of documentation:
<ul>
	<li>Opencms cms:info tag docs</li>
	<li>Opencms cms:info tag tests</li>
</ul>
That is the original documentation packed with opencms, a really short explanation of some of the possible properties and a test for these properties where some of them returns the same result, so you can't see the differences between them.

I think I made a better example where I explain a little bit how the cms:info tag works and where you can see those differences.

<!--more Some source code inside this post. -->The example has 3 files:
<ul>
	<li>cmsinfo_probe1.jsp: Make an import of cmsinfo_probe2.jsp.</li>
	<li>cmsinfo_probe2.jsp: Load a xml content and print the cms:info properties</li>
	<li>element.html: A xml content to be loaded from cmsinfo_probe2.jsp and make some experiments.</li>
</ul>
I attach <a href="http://marquex.es/?attachment_id=363" target="_blank">a zip with the test files</a>.

In cmsinfo_probe1.jsp we make an import, this way we will be able to see de differences between 'opencms.uri' and 'opencms.request.uri':
<pre lang="java" escaped="true" line="1">&lt;%@ taglib prefix="cms" uri="http://www.opencms.org/taglib/cms" %&gt;
&lt;cms:include page="cmsinfo_probe2.jsp" /&gt;</pre>
In cmsinfo_probe2.jsp a contentload is made because i thought that maybe the 'opencms.request.element.uri' parameter was going to show the uri of the element loaded by &lt;cms:contentload&gt;. I was wrong:
<pre lang="java" escaped="true" line="1">&lt;%@ taglib prefix="cms" uri="http://www.opencms.org/taglib/cms" %&gt;&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
        &lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8"&gt;
	&lt;title&gt;cms:info probe&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;cms:contentload collector="singleFile" param="%(opencms.folder)element.html"&gt;
  &lt;h3&gt;OpenCms Parameters&lt;/h3&gt;
  &lt;b&gt;opencms.version:&lt;/b&gt; &lt;pre&gt;&lt;cms:info property="opencms.version" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.url: &lt;/b&gt;&lt;pre&gt;&lt;cms:info property="opencms.url" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.uri:&lt;/b&gt; &lt;pre&gt;&lt;cms:info property="opencms.uri" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.webapp&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="opencms.webapp" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.webbasepath&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="opencms.webbasepath" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.request.uri&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="opencms.request.uri" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.request.element.uri&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="opencms.request.element.uri" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.request.folder&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="opencms.request.folder" /&gt;&lt;/pre&gt;&lt;br/&gt;
		&lt;h3&gt;Non usual OpenCms Parameters&lt;/h3&gt;
	&lt;b&gt;opencms.request.encoding&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="opencms.request.encoding" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;opencms.request.locale&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="opencms.request.locale" /&gt;&lt;/pre&gt;&lt;br/&gt;
		&lt;h3&gt;Some system properties&lt;/h3&gt;
	&lt;b&gt;java.class.version&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="java.class.version" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;java.class.path&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="java.class.path" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;java.library.path&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="java.library.path" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;java.vm.vendor&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="java.vm.vendor" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;file.separator:&lt;/b&gt; &lt;pre&gt;&lt;cms:info property="file.separator" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;java.io.tmpdir&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="java.io.tmpdir" /&gt;&lt;/pre&gt;&lt;br/&gt;
	&lt;b&gt;user.dir&lt;/b&gt;: &lt;pre&gt;&lt;cms:info property="user.dir" /&gt;&lt;/pre&gt;&lt;br/&gt;
&lt;/cms:contentload&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
As you can see in the code, i try two parameters that are not in the official documentation (at least in the examples) but I could see in the source code of the taglib. They are 'opencms.request.encoding' and 'opencms.request.locale'.

At the end of the jsp I try some java System properties, some of them I consider that they are more useful than the ones that opencms gives in those examples. Anyway, you can use as property anyone that you can retrieve by using the System.getProperty() method, you can check <a href="http://download.oracle.com/javase/1.5.0/docs/api/java/lang/System.html#getProperties()" target="_blank">what are they for JAVA SE5</a>.

The following is the <strong>result</strong> I got when I made click on cmsinfo_probe1.jsp from my OpenCms explorer:
<h3>OpenCms Parameters</h3>
<strong>opencms.version:</strong>
<pre>7.5.2</pre>
<strong>opencms.url: </strong>
<pre>http://localhost:8080/opencms752/opencms/system/modules/probes/resources/pruebas/cmsinfo/cmsinfo_probe2.jsp</pre>
<strong>opencms.uri:</strong>
<pre>/opencms752/opencms/system/modules/probes/resources/pruebas/cmsinfo/cmsinfo_probe2.jsp</pre>
<strong>opencms.webapp</strong>:
<pre>opencms752</pre>
<strong>opencms.webbasepath</strong>:
<pre>C:optTomcat5.5webappsopencms752</pre>
<strong>opencms.request.uri</strong>:
<pre>/system/modules/probes/resources/pruebas/cmsinfo/cmsinfo_probe1.jsp</pre>
<strong>opencms.request.element.uri</strong>:
<pre>/system/modules/probes/resources/pruebas/cmsinfo/cmsinfo_probe2.jsp</pre>
<strong>opencms.request.folder</strong>:
<pre>/system/modules/probes/resources/pruebas/cmsinfo/</pre>
<h3>Non usual OpenCms Parameters</h3>
<strong>opencms.request.encoding</strong>:
<pre>ISO-8859-1</pre>
<strong>opencms.request.locale</strong>:
<pre>es</pre>
<h3>Some system properties</h3>
<strong>java.class.version</strong>:
<pre>49.0</pre>
<strong>java.class.path</strong>:
<pre>C:optTomcat5.5binbootstrap.jar;C:optTomcat5.5binojdbc14-10.2.0.3.jar</pre>
<strong>java.library.path</strong>:
<pre>C:optTomcat5.5bin;.;C:WINDOWSsystem32;C:WINDOWS;D:oracleproduct10.1.0Db_1bin;D:oracleproduct10.1.0Db_1jre1.4.2binclient;C:oracleapporacleproduct10.2.0serverbin;C:WINDOWSsystem32;C:WINDOWS;C:WINDOWSSystem32Wbem;C:WINDOWSsystem32nls;C:WINDOWSsystem32nlsESPANOL;C:Archivos de programaIntelDMIX;C:optjdk1.5.0_17bin;C:grailsbin;C:Archivos de programaTortoiseGitbin;C:Archivos de programaKaspersky LabKaspersky Anti-Virus 6.0 for Windows Workstations MP4</pre>
<strong>java.vm.vendor</strong>:
<pre>Sun Microsystems Inc.</pre>
<strong>file.separator:</strong>
<pre></pre>
<strong>java.io.tmpdir</strong>:
<pre>C:optTomcat5.5temp</pre>
<strong>user.dir</strong>:
<pre>C:optTomcat5.5</pre>
The results tell us that 'opencms.request.uri' returns the path to the page requested by the user and all other uri's and url's refers to the current jsp that executes the code.

The property 'opencms.request.folder' also refers to the folder of the page requested by the user, in the example it would be the 'cmsinfo_probe1.jsp' folder.

Hope this helps somebody!