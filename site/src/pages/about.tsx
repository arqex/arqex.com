import React from "react"
import ScreenWrapper from "../components/ScreenWrapper";
import { Helmet } from "react-helmet";
import * as styles from "./index.module.css";
import { PageProps } from "gatsby";
import Flag from "../components/icons/Flag";
import AboutCard from "../components/AboutCard";
import JaviPic from '../images/javi-coco.jpg';

export default function CvPage(props: PageProps<any>) {
  return (
    <ScreenWrapper>
      { (setMenuState: Function) => (
        <>
          <Helmet>
            <title>Javier Márquez - Sofware Developer - arqex.com</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Bellefair&family=Neucha&family=DM+Sans&family=Joan&display=swap" rel="stylesheet" />
          </Helmet>
          <main>
            <div className={styles.contentHeader}>
              <h2 className={styles.headerTitle}>ABOUT ME</h2>
            </div>

            <div className={styles.contentBody}>
              <div className={styles.javiCardWrapper}>
                <AboutCard
                  title="Hi! I'm Javi"
                  subtitle="More than a software engineer"
                  imageURL={ JaviPic } />
                <div className={styles.aboutContent}>
                  <p>
                    I was born in Sevilla, Spain, about 40 years ago. I started travelling soon and I ended up living in different places around the world: London, Dublin, Milano, Guatemala City...
                  </p>
                  <p>
                    Lately I've settled down in Barcelona, where I live since 2013. I love the cosmopolitan way of living here. The sea, the mountains, the weather, the food, the friends and a great cultural offer that makes this city a place where I feel at home.
                  </p>
                  <p>
                    I'm a very curious person and I love to learn new things all the time. I can say that technology and software development are my passion, but I extend my curiosity to other activities that are not very related, like woodworking or practicing sports.
                  </p>
                  <p>
                    Music is also a very important part of my life. I like all music genres, but I'm specially fond of flamenco that I love to listen all the time. I play the guitar too, including playing for some band some time ago.
                  </p>
                  <p>
                    I'm an extrovert person and I love to meet new people (weird for an IT guy uh?). Maybe, some day we might find ourselves together far, far away.
                  </p>
                  <p>
                    If you have an interesting project and you think I can be a good fit for it, drop a DM on <a href="https://www.linkedin.com/in/arqex/" target="_blank">LinkedIn</a> or <a href="https://twitter.com/arqex" target="_blank">Twitter</a>.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </ScreenWrapper>
  );
}
