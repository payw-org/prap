import React, { useState } from 'react'
import Navigator from './Navigator'
import Canvas from './Canvas'
import Tools from './Options'
import Objects from './Objects'
import './Workspace.scss'

import sampleData from '../data/slides-sample'
const sampleSlides = sampleData.slides

export default () => {
  const [slides, setSlides] = useState(sampleSlides)

  return (
    <div id="workspace">
      <Objects />
      <Navigator slides={slides} />
      <Canvas />
      <Tools />
    </div>
  )
}
