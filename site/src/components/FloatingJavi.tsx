import * as React from 'react';
import { AnimatePresence, AnimationControls, motion, MotionValue, PanInfo, useTransform } from 'framer-motion';
import { SnapPoints } from './components-types';
import * as styles from './FloatingJavi.module.css';
import image from '../images/javi.png';
import SpeakBubble from './SpeakBubble';

interface FloatingJaviProps {
  yValue: MotionValue<number>,
  snapPoints: SnapPoints,
  onDragStart: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => any,
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => any
  controls: AnimationControls,
  transition: any,
  position: string,
  size: number
}

let mounted = false;

export default function FloatingJavi(props: FloatingJaviProps) {
  const {yValue, snapPoints, onDragStart, onDragEnd, controls, transition, size, position} = props;

  const {top, middle, bottom} = snapPoints;
  const borderWidth = 4;

  const [isInitialBouncing, setInitialBouncing] = React.useState(!mounted && position === 'middle');
  const animation = isInitialBouncing ? 
    {y: [ middle, middle - 50, middle -50 , middle], transition: {duration: 1.2}} :
    controls;

  mounted = true;

  React.useEffect( () => {
    if( isInitialBouncing ){
      setTimeout( () => setInitialBouncing(false), 1000);
    }
  }, [isInitialBouncing])


  const sizeTransition = useTransform(
    yValue,
    [top, middle - 50 ],
    [64, size]
  );
  
  const breakPoint = middle - 50;
  const step = (top - breakPoint) / 3;
  const circleScale = useTransform(
    yValue,
    [top, top - step, breakPoint + step, breakPoint ],
    [500, 200, 10, 1]
  )
  const circleTranslate = useTransform(
    yValue,
    [snapPoints.top, snapPoints.top + 30 ],
    [-70, 0]
  )

  return (
    <div className={styles.container}>
      <motion.div
        drag="y"
        style={{
          y: yValue,
          top: window.innerHeight / 2,
          left: (window.innerWidth / 2) - (size / 2),
          width: sizeTransition, height: sizeTransition,
          padding: borderWidth
        }}
        className={styles.handler}
        animate={animation}
        initial={position}
        variants={{
          top: { y: snapPoints.top },
          middle: { y: snapPoints.middle},
          bottom: { y: snapPoints.bottom }
        }}
        transition={ transition }
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}>
          <img
            className={styles.image}
            src={image} />
          <motion.div className={styles.expandCircle} style={{scale: circleScale, y: circleTranslate}}>

          </motion.div>
      </motion.div>
      <AnimatePresence>
        { position === 'middle' && (
          <SpeakBubble type="init">
            Drag me<br/>around!
          </SpeakBubble>
        )}
      </AnimatePresence>
    </div>

  )
}