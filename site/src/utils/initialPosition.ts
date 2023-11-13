const INIT_POSITION_KEY = 'ARQEX_INIT_POS';

export function getInitialPosition(): string {
  if( typeof localStorage === 'undefined' ) return 'top';
  let position = localStorage.getItem(INIT_POSITION_KEY)
  return  position === 'top' ? 'top' : 'middle';
}

export function setInitialPosition( position: string ){
  localStorage.setItem(INIT_POSITION_KEY, position);
}