
import * as React from 'react';
import { SnapPoints } from './components-types';
import { motion, MotionValue, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import * as styles from './ContentAnimated.module.css';

import Linkedin from './icons/Linkedin';
import Twitter from './icons/Twitter';
import Youtube from './icons/Youtube';
import Github from './icons/Github';


interface MenuProps {
  yValue: MotionValue<number>,
  menuY: MotionValue<number>,
  snapPoints: SnapPoints,
  position: string,
  menuState: string,
  onClick: any,
  children: any
}

export function ContentAnimated( props: MenuProps ) {
  const {yValue, menuY, snapPoints, position, menuState, onClick} = props;

  const variants = {
    bottom: {zIndex: 1},
    top: {zIndex: 2},
    middle: {zIndex: 1},
    moving: {zIndex: 1},
  };

  const whiteTranslate = useTransform(
    menuY,
    [-1200, -990],
    [0, 100]
  );
  const whiteOpacity = useTransform(
    menuY,
    [-1200, -990],
    [1, .6]
  );
  
  const {top, middle} = snapPoints;
  const blackTranslate = useTransform(
    yValue,
    [(top + middle) / 2, top],
    [100, 0]
  );
  
  
  return (
    <motion.div variants={variants} animate={position} style={{y: blackTranslate}} onClick={onClick}>
      <div className={styles.blackbg}>
        <motion.div style={{y: whiteTranslate, opacity: whiteOpacity}}>
          <div className={styles.whitebg} inert={(position !== 'top' || menuState === 'open') && "true" || undefined }>
            <div className={styles.content}>
              {props.children}
            </div>
            <footer className={styles.footer}>
              <div className={styles.footerLeft}>
                © arqex <span id="year">{ (new Date()).getFullYear() }</span>
              </div>
              <div className={styles.footerRight}>
                <a className={styles.socialLink} target="_blank" href='https://github.com/arqex' title="Check arqex open-source projects on Github">
                  <Github color="#fff" />
                </a>
                <a className={styles.socialLink} target="_blank" href='https://twitter.com/arqex' title="Go to arqex Twitter feed">
                  <Twitter />
                </a>
                <a className={styles.socialLink} target="_blank" href='https://www.linkedin.com/in/arqex/' title="Go to arqex Linkedin profile">
                  <Linkedin />
                </a>
                <a className={styles.socialLink} target="_blank" href="https://www.youtube.com/channel/UCZlO7aqGwiGMtdOxwewXxdQ/videos" title="Go to aprendiendo web 3 Youtube channel">
                  <Youtube />
                </a>
              </div>
            </footer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}