
import * as React from 'react';
import { SnapPoints } from './components-types';
import * as styles from './ScreenWrapper.module.css';
import { motion, MotionValue, useTransform } from 'framer-motion';


interface IntroLayerProps {
  yValue: MotionValue<number>,
  snapPoints: SnapPoints,
  position: string
}

export function IntroLayer( props: IntroLayerProps ){
  const {yValue, snapPoints, position} = props;
  const {top, middle, bottom} = snapPoints;
  const opacity = useTransform(
    yValue,
    [top, (top + middle) / 2, middle + 100, bottom],
    [0, 1, 1, 0]
  );
  const initLayerVariants = {
    bottom: {zIndex: -1},
    top: {zIndex: -1},
    middle: {zIndex: 3},
    moving: {zIndex: 3},
  };

  const nameY = useTransform(
    yValue,
    [top, middle - 100, middle, bottom],
    [-100, 0, 0, bottom + 230 ]
  );

  const textOpacity = useTransform(
    yValue,
    [middle - 200, middle - 100, middle, middle + 200],
    [0, 1, 1, 0]
  );

  const jobY = useTransform(
    yValue,
    [top, middle - 100, middle, bottom],
    [-50, 0, 0, bottom + 400]
  );

  return (  
    <motion.div className={styles.initLayer}
      style={{opacity}}
      variants={initLayerVariants}
      animate={position}>
      <div className={styles.initTexts}>
        <motion.div className={styles.name} style={{y: nameY, opacity: textOpacity}}>
          Javier Márquez
        </motion.div>
        <motion.div  className={styles.job} style={{y: jobY, opacity: textOpacity}}>
          Software developer
        </motion.div>
      </div>
    </motion.div>
  );
}