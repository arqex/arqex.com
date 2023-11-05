import * as React from 'react';

interface PlayIconProps {
  color: string
}

export default function PlayIcon({color = '#000'}: PlayIconProps){
  return (
    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
      <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5-103 385.5-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103zm384 823q32-18 32-55t-32-55l-544-320q-31-19-64-1-32 19-32 56v640q0 37 32 56 16 8 32 8 17 0 32-9z" fill={color}/>
    </svg>
  )
}