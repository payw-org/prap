import React, { useState } from 'react'
import Navigator from 'components/Navigator'
import Canvas from 'components/Canvas'
import Options from 'components/Options'
import Objects from 'components/Objects'
import { Slides, SlideTextObject } from 'types'
import './style.scss'

import sampleFile from '../../data/slides-sample'
const sampleSlides: Slides = sampleFile.slides

export default () => {
  const [slides, setSlides] = useState(sampleSlides)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  function addObject(object: any) {
    let updatedSlides = [...slides]
    updatedSlides[currentSlideIndex].objects.push({
      type: 'text',
      content: 'Hello World',
      align: 'center',
      pos: {
        x: 50,
        y: 50
      }
    } as SlideTextObject)
    setSlides(updatedSlides)
  }

  return (
    <div id="workspace">
      <Objects addObject={addObject} />
      <Navigator
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
      />
      <Canvas currentSlide={slides[currentSlideIndex]} />
      <Options />
    </div>
  )
}
