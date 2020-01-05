import React, { useState, useEffect } from 'react'
import Navigator from '../Navigator'
import Canvas from '../Canvas'
import Tools from '../Options'
import Objects from '../Objects'
import './Workspace.scss'

import sampleData from '../../data/slides-sample'
const sampleSlides = sampleData.slides

export default () => {
  const [slides] = useState(sampleSlides)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    console.log('currentSlideIndex:' + currentSlideIndex)
  })

  return (
    <div id="workspace">
      <Objects />
      <Navigator
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
      />
      <Canvas selectedSlide={currentSlideIndex} />
      <Tools />
    </div>
  )
}
