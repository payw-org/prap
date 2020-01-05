import React, { useState, useEffect } from 'react'
import Text from './Text'
import './Canvas.scss'

type CanvasProps = {
  currentSlide: any
}

const Canvas: React.FC<CanvasProps> = ({ currentSlide }) => {
  const elems = currentSlide.objects.map((item: any, index: number) => {
    if (item.type === 'text') {
      return <div className="text">{item.data}</div>
    } else {
      return
    }
  })

  return (
    <div id="canvas-container">
      <div id="canvas-wrapper">
        <div id="canvas">{elems}</div>
      </div>
    </div>
  )
}

export default Canvas
