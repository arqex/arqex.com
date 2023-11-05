const fs = require('fs')
const Path = require('path')
const expport = require('./arqex_posts.json');


expport[2].data.forEach( p => {
  let article = postToArticle(p);
  console.log(`Writing ${article.filename}`);
  fs.writeFileSync(Path.join(__dirname, '../articles', article.filename), article.content, 'utf-8');
})

function postToArticle(post) {
  const date = post.post_date.split(' ')[0];
  console.log( Object.keys(post) );
  return {
    filename: `${date}_${post.post_name}.md`,
    content: `---
slug: "/articles/${post.post_name}"
type: "article"
date: "${date}"
source: ""
title: "${post.post_title}"
link: "/${post.ID}/${post.post_name}"
---

${post.post_content.replace(/<h2/ig, '<h3')}`
  };
}