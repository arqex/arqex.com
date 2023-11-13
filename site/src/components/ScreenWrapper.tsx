import React, { FunctionComponent, useState } from 'react'
import { useAnimation, useMotionValue } from "framer-motion"
import * as styles from './ScreenWrapper.module.css';
import "../global.css";
import Hyperspace from './Hyperspace';
import FloatingJavi from './FloatingJavi';
import { IntroLayer } from './IntroLayer';
import { Menu } from './Menu';
import { ContentAnimated } from './ContentAnimated';
import {getInitialPosition, setInitialPosition} from '../utils/initialPosition';

interface ScreenWrapperProps {
  children: any
}
 
const ScreenWrapper: FunctionComponent<ScreenWrapperProps> = (props) => {
  const [windowSize, setWindowSize] = useState( getWindowSize() );
  const javiSize = 120;
  const snapPoints = getSnapPoints(windowSize, javiSize);
  const controls = useAnimation();
  
  // @ts-ignore
  const yvalue = useMotionValue(snapPoints[getInitialPosition()]);
  const menuY = useMotionValue(-1000);
  const [position, setPosition] = useState(getInitialPosition());
  const [menuState, setMenuState] = React.useState("closed");
  const menuControls = useAnimation();
  const transition = {
    type: "spring",
    damping: 30,
    stiffness: 400
  }

  function updateMenuState( state:string ){
    setMenuState(state);
    menuControls.start(state);
  }

  React.useEffect(() => {
    function handleResize() {
      setWindowSize( getWindowSize() );
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  function onDragEnd(event, info) {
    let {height} = windowSize;

    let y = info.point.y + (info.velocity.y/4);

    if( y < height / 5 ) {
      controls.start("top", {
        ...transition,
        onComplete: () => {
          setPosition('top');
          setInitialPosition('top');
        }
      });
    }
    else if( y < height * 4 / 5 ){
      controls.start("middle", {
        ...transition,
        onComplete: () => {
          setPosition('middle');
          setInitialPosition('middle');
        }
      });
    }
    else {
      console.log("bottom");
      controls.start("bottom", {
        ...transition,
        onComplete: () => {
          setPosition('bottom');
          setInitialPosition('bottom');
        }
      });
    }
  }

  function onDragStart(){
    setPosition('moving');
  }

  function checkCloseMenu(e: any) {
    if( menuState === 'open' ){
      updateMenuState('closed');
    }
  }

  return (
    <div className={styles.container}>
      <FloatingJavi
        yValue={yvalue}
        snapPoints={snapPoints}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        controls={controls}
        position={position}
        transition={transition}
        size={javiSize} />
      <Menu
        yValue={yvalue}
        menuY={menuY}
        snapPoints={snapPoints}
        position={position}
        menuState={menuState}
        updateMenuState={updateMenuState}
        controls={menuControls} />
      <ContentAnimated yValue={yvalue} menuY={menuY} snapPoints={snapPoints} position={position} menuState={menuState} onClick={ checkCloseMenu }>
        {props.children(updateMenuState)}
      </ContentAnimated>
      <Hyperspace yValue={yvalue} snapPoints={snapPoints} position={position} />
      <IntroLayer yValue={yvalue} snapPoints={snapPoints} position={position} />
    </div>
  );
}

export default ScreenWrapper;


function getWindowSize() {
  if( typeof window === 'undefined' ) {
    // @ts-ignore
    global.window = {
      innerHeight: 0,
      innerWidth: 0
    }
    return {width: 0, height: 0};
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

function getSnapPoints( windowSize: {width: number, height: number}, javiSize:number){
  return {
    top: (windowSize.height / 2 * -1) - 2,
    middle: -javiSize,
    bottom: windowSize.height / 2 - javiSize - 10
  };
}