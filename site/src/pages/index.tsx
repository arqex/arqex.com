import * as React from "react"
import ScreenWrapper from "../components/ScreenWrapper"
import {Helmet} from "react-helmet"
import * as styles from "./index.module.css";
import { Button } from "../components/Button";

// markup
class IndexPage extends React.Component {
  render() {
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
            <main className={styles.container}>
              <h2>15+ years of experience...</h2>
              <div>
                <p>Enough time to have used hundreds of different technologies.</p>
                <p>Time is the key to seniority. It gave me a general view about software development that is product driven and focused on results.</p>
                <p>Sleek UIs, solid API designs, clean coding, agile processes, mentorship, fluid communication across teams… 
        I have a very well loaded toolbelt.</p>
                <p>Nonetheless, my best tool is still my passion for software and technology. I discover, learn and improve every day.</p>
              </div>
              <div className={styles.buttonWrapper}>
                <Button onClick={ () => setMenuState("open" )}>Know more</Button>
              </div>
            </main>
          </>
        )}

      </ScreenWrapper>
    );
  }
}

export default IndexPage
