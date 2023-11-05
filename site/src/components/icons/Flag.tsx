import * as React from 'react';

interface FlagProps {
  country: 'es' | 'fr' | 'en' | 'it' | 'ca'
}

export default function Flag({country}: FlagProps){
  const leftColor = country === 'it' ? '#107B17': '#2205D1';
  switch (country) {
    case 'es':
      return(
        <svg viewBox="0 0 398 389">
          <g fill="none" fillRule="evenodd">
            <path fill="#CE2424" d="M0 0h398v107H0zM0 282h398v107H0z"/>
            <path fill="#FFD500" d="M0 107h398v175H0z"/>
          </g>
        </svg>
      );
    case 'en':
      return(
        <svg viewBox="0 0 1200 600">
          <defs><path id="a" d="M0 0v600h1200V0z"/>
            <path d="M600 300h600v300L600 300Zm0 0v300H0l600-300Zm0 0H0V0l600 300Zm0 0V0h600L600 300Z" id="c"/>
          </defs>
          <g fill="none" fillRule="evenodd">
            <mask id="b" fill="#fff">
              <use xlinkHref="#a"/>
            </mask>
            <g mask="url(#b)">
              <path fill="#012169" fillRule="nonzero" d="M0 0v600h1200V0z"/>
              <path d="m0 0 1200 600m0-600L0 600" stroke="#FFF" stroke-width="120" fill="#000" fillRule="nonzero"/>
              <mask id="d" fill="#fff"><use xlinkHref="#c"/></mask>
              <path d="m0 0 1200 600m0-600L0 600" stroke="#C8102E" stroke-width="80" fill="#000" fillRule="nonzero" mask="url(#d)"/>
              <path d="M600 0v600M0 300h1200" stroke="#FFF" stroke-width="200" fill="#000" fillRule="nonzero"/>
              <path d="M600 0v600M0 300h1200" stroke="#C8102E" stroke-width="120" fill="#000" fillRule="nonzero"/>
            </g>
          </g>
        </svg>
      );
    case 'fr':
    case 'it':
      return (
        <svg viewBox="0 0 415 368">
          <g fill="none" fillRule="evenodd">
            <path fill={leftColor} d="M1 368V1h138v367z"/>
            <path fill="#FFF" d="M139 368V1h138v367z"/>
            <path fill="#BD0303" d="M277 368V1h138v367z"/>
          </g>
        </svg>
      )
  }
  return (
    <svg viewBox="0 0 810 540">
      <g fillRule="nonzero" fill="none">
        <path fill="#FCDD09" d="M0 0h810v540H0z"/>
        <path d="M0 90h810m0 120H0m0 120h810m0 120H0" stroke="#DA121A" stroke-width="60" fill="#000"/>
      </g>
    </svg>
  );
}
