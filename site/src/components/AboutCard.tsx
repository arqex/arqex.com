import * as React from 'react';
import * as styles from './AboutCard.module.css';
import RevealingPic from './RevealingPic';

interface AboutCardProps {
  title: string,
  subtitle: string,
  imageURL: string
}

const crop = {
  x: 700,
  y: 320,
  size: 400
}

export default function AboutCard({title, subtitle, imageURL}: AboutCardProps){
  return (
    <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <RevealingPic imageURL={imageURL} crop={crop} closedSize={96} />
        </div>
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
    </div>
  )
}