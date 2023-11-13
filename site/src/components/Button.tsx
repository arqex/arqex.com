import * as React from 'react';
import * as styles from './Button.module.css';

export function Button({children, ...props}: any){
  return (
    <button {...props} className={styles.button}>{children}</button>
  )
}