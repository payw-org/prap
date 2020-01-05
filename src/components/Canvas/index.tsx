import React, { useState } from 'react'
import './Canvas.scss'

type CanvasProps = {
  selectedSlide: Object
}

const Canvas: React.FC<CanvasProps> = ({ selectedSlide }) => {
  function makeObjectItem(obj: any) {
    if (obj.type === 'text') {
      console.log(obj.type)
    }
  }

  return (
    <div id="canvas-container">
      <div id="canvas-wrapper">
        <div id="canvas"></div>
      </div>
    </div>
  )
}

export default Canvas
