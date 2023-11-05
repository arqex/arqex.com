---
slug: "/articles/easy-pagination-with-opencms"
type: "article"
date: "2011-06-15"
source: ""
title: "Easy pagination with Opencms"
link: "/570/easy-pagination-with-opencms"
---

There is a famous rule out there called DRY (Don't repeat yourself), and if there is one thing I have to code once and again in Opencms is Structured Content lists and their pagination.I will postpone the DRY way explanation of making structured contents lists for any other day and I will explain how to write a reusable robust pagination mechanism for Opencms.

<!--more The whole explanation is in the second page... -->
<p style="text-align: center;"><a rel="attachment wp-att-573" href="http://marquex.es/570/easy-pagination-with-opencms/paginacion"><img class="size-medium wp-image-573 aligncenter" title="paginacion" src="http://marquex.es/wp-content/uploads/2011/06/paginacion-570x129.jpg" alt="" width="570"  /></a></p>
Imagine that we have a structured content for news, a folder full of news and a jsp that display a list of news in it. The list jsp code would be like:

<pre lang="java">
<cms:contentload collector="allInFolder" param="%(opencms.request.folder)|news">
	<h3>
	<a href="<cms:link><cms:contentshow element="%(opencms.filename)" /></cms:link>">
		<cms:contentshow element="title" />
	</a>
	</h3>
	<div class="excerpt">
		<cms:contentshow element="excerpt" />
	</div>
</cms:contentload>
</pre>

Since our folder is full of news, I mean really full: 1001 news items, we don't want to show all of them at the same time, we need to show 10 for page. To do so, the Opencms's <strong>contentinfo </strong>tag is really useful, so we are going to change our jsp in order to get this:

<pre lang="java">
<c:choose>
<c:when test="${param.page > 0}">
	<c:set var="pagina" value="${param.page}" />
</c:when> 
<c:otherwise>
	<c:set var="pagina" value="1" />
</c:otherwise>
</c:choose>	

<cms:contentload collector="allInFolder" param="%(opencms.folder)|news" pageSize="10" pageIndex="${pagina}" pageNavLength="5">
	<cms:contentinfo var="info" scope="request" /> 
	<h3>
	<a href="<cms:link><cms:contentshow element="%(opencms.filename)" /></cms:link>">
		<cms:contentshow element="title" />
	</a>
	</h3>
	<div class="excerpt">
		<cms:contentshow element="excerpt" />
	</div>
</cms:contentload>

<div id="pagination">
	<cms:include page="pagination.jsp" />
</div>
</pre>

We are going to retrieve the page number to show from a URL parameter, so we check that the parameter is set and is bigger than 0, otherwise we set it to 1. For this example we won't do further validations, but this one is mandatory to make it work.

As you can see there are three more attributes in the contentload that will be a key part of our pagination:
<ul>
	<li><strong>pageSize</strong>: How many news we are showing in one</li>
	<li><strong>page. pageIndex</strong>: The number of the page we want to display.</li>
	<li><strong>pageNavLength</strong>: This parameter will help us to create our pagination links, I'll write about it soon in this article.</li>
</ul>
Thanks to the <code>cms:contentinfo</code> tag that we have added, we have all the info we need to create our pagination links in a request attribute. Usually this attribute is stored in the page context, but as long as we want to be DRY, we are going to create the navigation links in a jsp appart so we can call it from any list jsp we may make.And what's that info that we got?? Here you have:
<ul>
	<li><strong>info.resultSize</strong>: How many news items do we have? In our example: 1001</li>
	<li><strong>info.pageSize</strong>: How many news items per page? In our example 10, as we said in the contentload attribute.</li>
	<li><strong>info.pageCount</strong>: How many pages of news we have? In our examle 101, 1001/10 = 100 pages with 10 news items each plus one more with 1 item.</li>
	<li><strong>info.resultIndex</strong>: What is the current item? Since we are using this data after the contentload loop, in our example this will always point to the last item of the current page, but if you use it inside the loop it will return the current item index.</li>
	<li><strong>info.pageIndex</strong>: What is the current page? We have set this parameter using the contentload attribute.</li>
	<li><strong>info.pageNavLength</strong>: How many navigation links we want to display? In our example we have 101 pages, but having 101 links would be too much for the user, so we will try to display just 5.</li>
	<li><strong>info.pageNavStartIndex</strong>: What is the first page to display in the navigation links? Imagine that we are showing the page 10, as long as we are showing 5 links, the first page link that the navigation will display would be the 8.</li>
	<li><strong>info.pageNavEndIndex</strong>: What is the last page to display in the navigation links? Imagine that we are showing the page 10, as long as we are showing 5 links, the last page link that the navigation will display would be the 12, so we will have 5 links: 8, 9, 10, 11, 12.</li>
</ul>
We have all the necessary to create the navigation links, so let's write our pagination.jsp:

<pre lang="java">
<%
//Store the info in the page Context
pageContext.setAttribute("info", request.getAttribute("info"));

%>
<c:if test="${info.resultSize > info.pageSize}">

	<%-- Show the first page if it is not in navigation links --%>
	<c:if test="${info.pageNavStartIndex > 1}">
		<a class="pagelink" href="<cms:link><cms:info property="opencms.request.uri" /></cms:link>?page=1">1</a><span class="pagdots">&nbsp;...</span>
	</c:if>
	
	<c:forEach var="i" begin="${info.pageNavStartIndex}" end="${info.pageNavEndIndex}">
		<c:choose>
			<c:when test="${(i == info.pageIndex) || (i == 1 && info.pageIndex == null)}">										
				<a class="currentpagelink" href="<cms:link><cms:info property="opencms.request.uri" /></cms:link>?page=<c:out value="${i}" />"><c:out value="${i}"/></a>&nbsp;
			</c:when>
			<c:otherwise>
				<a class="pagelink" href="<cms:link><cms:info property="opencms.request.uri" /></cms:link>?page=<c:out value="${i}" />"><c:out value="${i}"/></a>&nbsp;
			</c:otherwise>
		</c:choose>
	</c:forEach>
	
	
	<%-- Show the last page if it is not in navigation links --%>
	<c:if test="${info.pageNavEndIndex < info.pageCount}">
			<span class="pagdots">...&nbsp;</span><a class="pagelink" href="<cms:link><cms:info property="opencms.request.uri" /></cms:link>?page=<c:out value="${info.pageCount}" />"><c:out value="${info.pageCount}" /></a>
	</c:if>
	
</c:if>
</pre>

The code is so straight, first of all we want the navigation links to appear when there are several pages, if we only have one page we don't need the links:

<pre lang="java">
<c:if test="${info.resultSize > info.pageSize}">
</pre>

We also want to show the links to the first page and the last page always, so we check if they are in the 5 visible links and if they are not we add them prefixes or sufixed by "...".

<pre lang="java">
We also want to show the links to the first page and the last page always, so we check if they are in the 5 visible links and if they are not we add them prefixes or sufixed by "...".

<c:if test="${info.pageNavStartIndex > 1}">
	<a class="pagelink" href="<cms:link><cms:info property="opencms.request.uri" /></cms:link>?page=1">1</a><span class="pagdots">&nbsp;...</span>
</c:if>
...
<c:if test="${info.pageNavEndIndex < info.pageCount}">
		<span class="pagdots">...&nbsp;</span><a class="pagelink" href="<cms:link><cms:info property="opencms.request.uri" /></cms:link>?page=<c:out value="${info.pageCount}" />"><c:out value="${info.pageCount}" /></a>
</c:if>
</pre>

The way to link to a page is adding the parameter "page" to the url. In a nice implementation we should check in our list jsp that the user is asking for a page that exists, this way we can avoid some <em>indexOutOfBoundExceptions</em>.

Here I leave the jsp file ready to download and use in your Opencms. Enjoy!

<h3 style="text-align:center" class="download"><a href="http://marquex.es/wp-content/uploads/2011/06/pagination.zip" title="Download pagination source for Opencms">Download pagination source code</a></h3>