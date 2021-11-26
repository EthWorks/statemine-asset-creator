import React from 'react'

interface CheckIconProps {
  className?: string
  width: string,
  height: string
}

export const CheckIcon = ({ className, height, width }: CheckIconProps): JSX.Element => (
  <svg className={className} width={width} height={height} viewBox="0 0 14 14" fill="none">
    <path d="M2.9165 7.58301L5.24984 9.91634L11.0832 4.08301" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)
