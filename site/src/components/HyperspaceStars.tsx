import * as React from 'react';
import classnames from 'classnames';
import * as styles from './Hyperspace.module.css';

export default function HyperspaceStars(props: any){
  return (
    <div className={styles.scene}>
      <div className={styles.wrap}>
          <div className={classnames(styles.wall, styles.wallRight)}></div>
          <div className={classnames(styles.wall, styles.wallLeft)}></div>   
          <div className={classnames(styles.wall, styles.wallTop)}></div>
          <div className={classnames(styles.wall, styles.wallBottom)}></div> 
          <div className={classnames(styles.wall, styles.wallBack)}></div>    
      </div>
      <div className={styles.wrap}>
          <div className={classnames(styles.wall, styles.wallRight)}></div>
          <div className={classnames(styles.wall, styles.wallLeft)}></div>   
          <div className={classnames(styles.wall, styles.wallTop)}></div>
          <div className={classnames(styles.wall, styles.wallBottom)}></div>   
          <div className={classnames(styles.wall, styles.wallBack)}></div>    
      </div>
    </div>
  )
}