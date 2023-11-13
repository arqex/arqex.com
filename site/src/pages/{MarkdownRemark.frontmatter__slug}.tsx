import React, { useEffect } from "react"
import { graphql } from "gatsby"
import ScreenWrapper from "../components/ScreenWrapper"
import * as styles from './index.module.css';
import { Helmet } from "react-helmet";
import { Link } from "gatsby";

export default function Template(props: any) {
  const { markdownRemark } = props.data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  useEffect( () => {
    setTimeout( () => {
      document.querySelectorAll('pre[class^=lang]').forEach(el => {
        // then highlight each
        hljs.highlightElement(el);
      });
    }, 1000)
  });

  return (
    <ScreenWrapper>
      { () => (
        <>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Bellefair&family=Neucha&family=DM+Sans&family=Joan&family=JetBrains+Mono&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/github.min.css" />
            <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script>
          </Helmet>
          <main className={styles.contentBody}>
            <div className={styles.articleHeader}>
              <div>
                { frontmatter.type && (
                  <div className={styles.articleType}>
                  <Link to="/articles">{frontmatter.type}s</Link>
                  </div>
                )}
                <h2 className={styles.articleTitle}>{frontmatter.title}</h2>
                <div className={styles.articleMeta}>
                  Published {frontmatter.date?.toLocaleLowerCase()}
              </div>
              </div>
            </div>
            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </main>
        </>
      )}
    </ScreenWrapper>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        type
      }
    }
  }
`