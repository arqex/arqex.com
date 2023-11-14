import React from "react"
import ScreenWrapper from "../components/ScreenWrapper";
import { Helmet } from "react-helmet";
import * as styles from "./index.module.css";
import { PageProps } from "gatsby";
import Flag from "../components/icons/Flag";

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
              <h2 className={styles.headerTitle}>CURRICULIM VITAE</h2>
            </div>

            <div className={styles.contentBody}>
              <h3>Location</h3>
              <ul className={styles.cvList}>
                <li>
                  I live in the beautiful city of <a href="https://www.google.com/maps/place/Barcelona/@41.3926606,2.0989899,13z/data=!3m1!4b1!4m6!3m5!1s0x12a49816718e30e5:0x44b0fb3d4f47660a!8m2!3d41.3873974!4d2.168568!16zL20vMDFmNjI?entry=ttu" target="_blank">Barcelona, Spain</a>. 
                </li>
              </ul>
            </div>
            <div className={styles.contentBody}>
              <h3>Software related education</h3>
              <ul className={styles.cvList}>
                <li>
                  <div className={styles.date}>2011</div>
                  ITIL V3 Foundation certificate
                </li>
                <li>
                  <div className={styles.date}>2011</div>
                  Trade information search and analysis at CECO
                </li>
                <li>
                  <div className={styles.date}>2008</div>
                Software Engineering degree at Universidad de Sevilla
                </li>
                <li>
                  <div className={styles.date}>2006</div>
                  Specialistica in Informatica at Università Milano Bicocca
                </li>
              </ul>
              <h3>Work experience</h3>
              <ul className={styles.cvList + ' ' + styles.cvWork}>
                <li>
                  <div className={styles.date}>2015 - nowadays</div>
                  <div className={styles.cvTitle}>Front-end lead developer at <a href="https://youcanbook.me/" target="_blank">YouCanBook.me</a></div>
                  <div className={styles.cvDesc}>Designing and developing complete applications in React, coordinating with the UX and back-end teams.</div>
                </li>
                <li>
                  <div className={styles.date}>2014 - 2015</div>
                  <div className={styles.cvTitle}>Freelance front-end developer</div>
                  <div className={styles.cvDesc}>Creating ad-hoc React applications for international companies like <a href="https://cargomatic.com/" target="_blank">Cargomatic</a> or <a href="https://mangrove-web.com/" target="_blank">Mangrove web</a>.</div>
                </li>
                <li>
                  <div className={styles.date}>2012 - 2014</div>
                  <div className={styles.cvTitle}>Front-end developer at <a href="https://wpmudev.com/" target="_blank">WPMUDEV</a></div>
                  <div className={styles.cvDesc}>Creating a Backbone.js powered visual editor for WordPress themes.</div>
                </li>
                <li>
                  <div className={styles.date}>2011 - 2012</div>
                  <div className={styles.cvTitle}>System Administrator at the <a href="https://www.icex.es/es/quienes-somos/donde-estamos/red-exterior-de-comercio/gt/inicio.html" target="_blank">Spanish Trade Office in Guatemala</a></div>
                  <div className={styles.cvDesc}>Microsoft network system administrator.</div>
                </li>
                <li>
                  <div className={styles.date}>2009 - 2011</div>
                  <div className={styles.cvTitle}>Web Developer at <a href="https://www.soltel.es/" target="_blank">Soltel</a> for Diputación de Sevilla</div>
                  <div className={styles.cvDesc}>Design and development using J2EE and Oracle DB for a network of websites.</div>
                </li>
                <li>
                  <div className={styles.date}>2008 - 2009</div>
                  <div className={styles.cvTitle}>Web Developer at <a href="https://inpro.dipusevilla.es/" target="_blank">Inpro</a> for Diputación de Sevilla</div>
                  <div className={styles.cvDesc}>Design and development using J2EE and Oracle DB for a network of websites.</div>
                </li>
                <li>
                  <div className={styles.date}>2008</div>
                  <div className={styles.cvTitle}>Web App developer at <a href="https://www.iscn.com/" target="_blank">ISCN</a></div>
                  <div className={styles.cvDesc}>PHP and Javascript development to create an employee assessment webapp.</div>
                </li>
                <li>
                  <div className={styles.date}>2007</div>
                  <div className={styles.cvTitle}>Web developer at <a href="https://www.alventus.com/" target="_blank">Alventus</a></div>
                  <div className={styles.cvDesc}>Design and development of website and CMS using PHP y MySql.</div>
                </li>
              </ul>
              <h3>Languages</h3>
              <ul className={styles.cvList}>
                <li>
                My mothertongue is <span className={styles.lang}>Spanish</span>
                <span className={styles.flag}><Flag country="es" /></span>. I speak <span className={styles.lang}>English</span><span className={`${styles.flag} ${styles.en}`}><Flag country="en" /></span>
                {" "}fluently and also <span className={styles.lang}>Italian</span><span className={styles.flag}><Flag country="it" /></span>, <span className={styles.lang}>French</span><span className={styles.flag}><Flag country="fr" /></span> and <span className={styles.lang}>Catalan</span><span className={styles.flag}><Flag country="ca" /></span> at a basic level.
                </li>
              </ul>

              <h3>And more...</h3>
              <ul className={styles.cvList}>
                <li>
                  I've tried to keep this résumé short, here's some info I left out:
                  <ul className={styles.cvMore}>
                    <li>
                      From time to time I write <a href="/articles">articles about software development</a>.
                    </li>
                    <li>
                      I love creating small <a href="/projects">personal projects</a> and <a href="https://github.com/arqex" target="_blank">open sourcing them</a>.
                    </li>
                    <li>
                      I'm not 24/7 at my computer. <a href="/about">Want to know more about me?</a>
                    </li>
                  </ul>
                </li>
              </ul>
             
            
            </div>
            
          </main>
        </>
      )}
    </ScreenWrapper>
  );
}
