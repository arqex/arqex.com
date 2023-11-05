
import * as React from 'react';
import { SnapPoints } from './components-types';
import * as styles from './Menu.module.css';
import { AnimationControls, motion, MotionValue, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import classNames from 'classnames';
import SpeakBubble from './SpeakBubble';
import { Link } from 'gatsby';


interface MenuProps {
  yValue: MotionValue<number>,
  menuY: MotionValue<number>,
  snapPoints: SnapPoints,
  position: string,
  menuState: string,
  updateMenuState: (state: string) => any,
  controls: AnimationControls
}

export function Menu( props: MenuProps ){
  const {yValue, menuY, snapPoints, position, menuState, updateMenuState, controls} = props;
  const {top, middle, bottom} = snapPoints;
  const [isDragging, setDragging] = React.useState(false);
  const opacity = useTransform(
    yValue,
    [top, top + 80, top + 81],
    [1, 1, 0]
  );

  const transition = {
    type: "spring",
    damping: 30,
    stiffness: 400
  }

  const variants = {
    bottom: {zIndex: -1},
    top: {zIndex: 3},
    middle: {zIndex: -1},
    moving: {zIndex: 3},
  };

  function onDragStart(event, info) {
    setDragging(true);
  }

  function onDragEnd( event, info ){
    let y = info.point.y + (info.velocity.y/4);
    y > 200 ? updateMenuState("open") : updateMenuState("closed");
    setDragging(false);
  }

  const bubbleTransitionCoords = [-900, -850];
  const bubbleOpacity = useTransform(
    menuY,
    bubbleTransitionCoords,
    [0, 1]
  )
  const bubbleTranslation = useTransform(
    menuY,
    bubbleTransitionCoords,
    [ -10, 0]
  )

  let menuClasses = classNames(
    styles.menu,
    isDragging && styles.dragging
  )

  return ( 
    <motion.div className={styles.container}
      style={{opacity}}
      variants={variants}
      animate={position}>
        <motion.div
          className={styles.bubble}
          style={{opacity: bubbleOpacity, y: bubbleTranslation}}
          >
          <SpeakBubble type="menu">What a drag!</SpeakBubble>
        </motion.div>
        <div className={styles.bar}>
          <div className={styles.titleWrapper}>
            <Link to="/" className={styles.titleLink}>
              <h1 className={styles.name}>Javier Márquez</h1>
              <h2 className={styles.job}>Software Developer</h2>
            </Link>
          </div>
          <div className={styles.toggleWrapper}>
            <button
              className={styles.toggle}
              onClick={ menuState === "closed" ? () => updateMenuState("open") : () => updateMenuState("closed") }>
                { menuState === "closed" ? 'Menu' : 'Close menu' }
            </button>
          </div>
        </div>
        <motion.div
          className={menuClasses}
          drag="y"
          style={{y: menuY}}
          initial="closed"
          animate={ controls }
          transition={ transition }
          onDragEnd={ onDragEnd }
          onDragStart={ onDragStart }
          variants={{
            closed: {y: '-102%'},
            open: {y:-970}
          }}
          dragConstraints={{
            bottom: -970
          }}
          >
            <nav style={{visibility: menuState === 'open' ? 'visible' : 'hidden'}} className={styles.itemListContainer}>
              <ul className={styles.itemList}>
                <li className={styles.item}><a href="/">Home</a></li>
                <li className={styles.item}><Link to="/articles">Articles</Link></li>
                <li className={styles.item}><a href="/projects">Projects</a></li>
                <li className={styles.item}><a href="/cv">CV</a></li>
                <li className={styles.item}><a href="/about">About me</a></li>
              </ul>
            </nav>
          <div className={styles.dragBar} />
        </motion.div>
    </motion.div>
  );
}