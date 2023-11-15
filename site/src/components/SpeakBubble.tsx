import * as React from 'react';
import * as styles from './SpeakBubble.module.css';
import {motion} from 'framer-motion';
import classNames from 'classnames';

export default function SpeakBubble({type, children}: any) {
  return (
    <motion.div
      { ...getAnimations(type) }
      >
      <div className={styles.tip} />
      <div className={ classNames(
        styles.container,
        type === 'menu' && styles.menuBubble
       )}>
        {children}
      </div>
    </motion.div>
  )
}

function getAnimations( type: string ){
  if( type === 'init' ){
    return {
      initial: {opacity: 0, scale: .1, x: 0, y: -224},
      animate: {opacity: 1, scale: 1, x: 20, y: -294, transition: {delay: 2}},
      exit: {opacity:0, x: 20, y: -320, transition:{duration: .2}}
    }
  }

  return {};
}