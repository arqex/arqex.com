import * as React from 'react';
import { AnimatePresence, motion, MotionValue, useTransform } from 'framer-motion';
import { SnapPoints } from './components-types';
import * as styles from './Hyperspace.module.css';
import HyperspaceStars from './HyperspaceStars';

interface HyperspaceProps {
  yValue: MotionValue<number>,
  snapPoints: SnapPoints,
  position: string
}
 
export default function Hyperspace({yValue, snapPoints, position}: HyperspaceProps) {
  const isActive = position === 'bottom';
  const [display, setDisplay] = React.useState( isActive ? 'slogan' : 'init' );

  const variants = {
    bottom: {zIndex: 3},
    top: {zIndex: -1},
    middle: {zIndex: -1},
    moving: {zIndex: 3},
  };

  React.useEffect( () => {
    if( isActive ){
      if( display === 'init' ){
        setDisplay('slogan');
        setTimeout( () => {
          setDisplay('info');
        }, 4000);
      }
    }
    else if( display === 'slogan' || display === 'info' ) {
      setDisplay('out');
      setTimeout( () => {
        setDisplay('init');
      }, 1000);
    }
    
  }, [isActive, display]);

  const sloganVariants = {
    init: {opacity: 0, scale: 0.1, transition: {duration: .1}},
    slogan: {opacity: 1, scale: 1},
    info: { opacity: 0, scale: 100, transition: {duration: 2, ease: 'easeIn'}},
    out: { opacity: 0, scale: 100, transition: {duration: .8}},
  }

  const infoVariants = {
    init: {opacity: 0, scale: 0.1, transition: {duration: .1}},
    slogan: {opacity: 0, scale: 0.1},
    info: { opacity: 1, scale: 1},
    out: { opacity: 0, scale: 100, transition: {duration: .8}},
  }

  return (
    <motion.div
      className={styles.container}
      style={getScreenStyle(yValue, snapPoints)}
      animate={position}
      variants={variants}>
      <AnimatePresence>
        { display !== 'init' && (
          <motion.div className={styles.stars} exit={{opacity: 0}}>
            <HyperspaceStars /> 
          </motion.div>
        )}

      </AnimatePresence>
      
      <motion.div className={styles.slogan} variants={sloganVariants} animate={display} transition={{duration: 2}}>
        Someday,<br/>we'll find ourselves<br/>far, far away...
      </motion.div>
      <motion.div className={styles.info}
        variants={infoVariants}
        animate={display}
        transition={{duration: 2}}
        inert={position !== 'bottom' && "true"}>
        <div>
          Transitions here have been created using a library of mine:<br/><a href='https://github.com/arqex/react-interactable' target="_blank">React interactable</a>.
        </div>
        <div>
          This awesome hyperspace effect thanks to <a href="https://codepen.io/noahblon/pen/DpNRyR" target="_blank">this codepen</a> from <a target="_blank" href='https://codepen.io/noahblon'>Noah Blon</a>.
        </div>
        <div>
          Software development can be fun!
        </div>
      </motion.div>
    </motion.div>
  );
}

function getScreenStyle( yValue: MotionValue<number>, snapPoints: SnapPoints ){
  return {
    opacity: useTransform(
      yValue,
      [snapPoints.middle - 50, snapPoints.middle + 50],
      [0, 1]
    )
  };
}