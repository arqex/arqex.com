
import * as React from 'React';
import * as styles from './RevealingPic.module.css';
import { createPortal } from 'react-dom';

interface RevealPicProps {
  imageURL: string,
  closedSize: number
  crop: {
    x: number,
    y: number,
    size: number
  }
}

interface RevealingPicState {
  isOpen: boolean,
}

export default class RevealingPic extends React.Component<RevealPicProps, RevealingPicState> {
  state: RevealingPicState = {
    isOpen: false
  }

  closedImageRef = React.createRef<HTMLImageElement>();

  render() { 
    const {imageURL, crop, closedSize} = this.props;
    const {isOpen} = this.state;
    const dimensions = {width: closedSize, height: closedSize};
    const scale = closedSize / crop.size;
    const imageStyle = {
      transform: `translate(-${crop.x}px, -${crop.y}px) scale(${scale})`,
      transformOrigin: `${crop.x}px ${crop.y}px`
    };

    return (
      <div className={styles.container} style={dimensions}>
        <a onClick={ this._open }>
          <img ref={this.closedImageRef}
            src={imageURL}
            className={styles.image}
            style={imageStyle} />
        </a>
        { isOpen && createPortal(
          <RevealedPic
            imageURL={imageURL}
            crop={crop}
            closedSize={closedSize}
            position={ this.closedImageRef.current?.getBoundingClientRect() } 
            onClose={ this._close } />,
            document.body
        )}
      </div>
    );
  }


  _open = () => {
    this.setState({isOpen: true});
  }

  _close = () => {
    this.setState({isOpen: false});
  }
}



interface RevealedPicProps {
  imageURL: string,
  crop: {
    x: number,
    y: number,
    size: number
  }
  closedSize: number
  position: DOMRect
  onClose: () => void
}
interface RevealedPicState {
  isExpanded: boolean
}

class RevealedPic extends React.Component<RevealedPicProps> {
  state = {
    isExpanded: false,
    togglingExpand: false,
  }

  render() {
    const {imageURL, crop, closedSize, position} = this.props;
    const {isExpanded} = this.state;
    const collapsedTranslateX = (position.x + (position.width / 2)) - (window.innerWidth / 2);
    const collapsedTranslateY = (position.y + (position.height / 2)) - (window.innerHeight / 2);
    const scale = closedSize / crop.size;

    const imageStyle = isExpanded ? {
      boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 40px 0px',
      transform: `scale(${this.getExpandedScale(scale)})`,
      clipPath: `circle(200% at ${crop?.x}px ${crop?.y}px)`
    } : {
      width: position.width / scale,
      height: position.height / scale,
      clipPath: `circle(${closedSize}px at ${crop.x+closedSize}px ${crop.y+closedSize}px)`,
      transform: `translate(${collapsedTranslateX}px, ${collapsedTranslateY}px) scale(${scale})`,
    };

    const maskStyle = isExpanded ? {} : {
      borderRadius: '50%',
      width: closedSize,
      height: closedSize
    }

    let bgClasses = styles.overlayBackground;
    if( isExpanded ) {
      bgClasses += " " + styles.overlayBackground_expanded;
    }

    return (
      <div className={styles.overlay} onClick={ this._toggleExpand }>
        <div className={bgClasses} />
        <img 
          src={imageURL}
          className={styles.revealedPic}
          style={imageStyle} />
      </div>
    );
  }

  _toggleExpand = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
      togglingExpand: true
    });
    this._scheduleToggleExpandEnd();
  }

  _scheduleToggleExpandEnd = () => {
    setTimeout(() => {
      this.setState({togglingExpand: false});
      if( !this.state.isExpanded) {
        this.props.onClose();
      }
    }, 420);
  }

  getExpandedScale( closedScale: number ) {
    const {width, height} = this.props.position;
    const {innerWidth, innerHeight} = window;
    console.log( width, height, innerWidth, innerHeight);
    if( innerWidth - width > innerHeight - height ) {
      return Math.min( 1, innerHeight * closedScale / height );
    }
    return Math.min( 1, innerWidth * closedScale / width );
  }

  componentDidMount = () => {
    setTimeout( () => this.setState({isExpanded: true}), 0);
  }
}