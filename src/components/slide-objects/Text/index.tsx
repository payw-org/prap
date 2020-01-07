import React from 'react'
import { SlideTextObject } from 'types'
import 'components/slide-objects/slide-object-style.scss'
import './style.scss'

type TextProps = {
  data: SlideTextObject
}

const Text: React.FC<TextProps> = ({ data }) => {
  return (
    <div
      className="slide-object text"
      style={
        {
          top: data.pos.y + '%',
          left: data.pos.x + '%'
        } as React.CSSProperties
      }
    >
      {data.content}
    </div>
  )
}

export default Text
