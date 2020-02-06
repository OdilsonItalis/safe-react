// @flow
import * as React from 'react'
import { type Size, getSize } from '~/theme/size'
import { border } from '~/theme/variables'

const calculateStyleFrom = (color?: string, margin?: Size) => ({
  width: '100%',
  minHeight: '2px',
  height: '2px',
  backgroundColor: color || border,
  margin: `${getSize(margin)} 0px`,
})

type Props = {
  className?: string,
  color?: string,
  margin?: Size,
  style?: Object,
}

const Hairline = ({
  margin, color, style, className,
}: Props) => {
  const calculatedStyles = calculateStyleFrom(color, margin)
  const mergedStyles = { ...calculatedStyles, ...(style || {}) }

  return <div style={mergedStyles} className={className} />
}

export default Hairline
