import React from "react"
import { graphql, PageProps } from "gatsby"
import ScreenWrapper from "../components/ScreenWrapper"
import { Helmet } from "react-helmet"
import * as styles from './index.module.css';
import { Link } from 'gatsby';

type DataNode = {
  node: Article
}

type Article = {
  excerpt: string,
  id: string,
  frontmatter: {
    title: string,
    date: string,
    source: string,
    link: string,
    slug: string
  }
}

type DataProps = {
  allMarkdownRemark: {
    edges: DataNode[]
  }
}

export default function ArticleTemplate(props: PageProps<DataProps>) {
  const { allMarkdownRemark } = props.data // data.markdownRemark holds your post data
  console.log( allMarkdownRemark )
  return (
    <ScreenWrapper>
      { (setMenuState: Function) => (
        <>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Bellefair&family=Neucha&family=DM+Sans&family=Joan&display=swap" rel="stylesheet" />
          </Helmet>
          <main>
            <div className={styles.contentHeader}>
              <h2 className={styles.headerTitle}>Articles</h2>
            </div>
            <div className={styles.contentBody}>
              { allMarkdownRemark.edges.map( ({node: article}) => (
                <article className={styles.articleItem}>
                  <h3 className={styles.articleTitle}>
                    { renderLink(article) }
                  </h3>
                  <div className={styles.articleMeta}>
                    Published on {article.frontmatter.date.toLocaleLowerCase()} {renderSource(article.frontmatter.source)}
                  </div>
                  <div>
                    {article.excerpt} ...
                  </div>
                </article>
              ))}
            </div>
          </main>
        </>
      )}

    </ScreenWrapper>
  )
}

function renderLink( {frontmatter}: Article ){
  const {source, link, title, slug} = frontmatter;
  if( !source || source === 'local'){
    return (
      <Link to={slug}>{title}</Link>
    );
  }

  return (
    <a href={link} target="_blank">
      {title} <span className={styles.externalLink}>⧉</span>
    </a>
  );
}

function renderSource(source: string){
  if( source ){
    return <>at {source}</>
  }
  return null;
}

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date]},
      limit: 100,
      filter: {frontmatter: {type: { eq: "article" }}}
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            slug
            title
            date(formatString: "MMMM DD, YYYY")
            source
            link
          }
        }
      }
    }
 }
`