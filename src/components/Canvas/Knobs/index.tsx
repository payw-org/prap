import React from 'react'
import './style.scss'

type Axis = {
  x: number
  y: number
}

type KnobsProps = {
  topLeft: Axis
  topMiddle: Axis
  topRight: Axis
  middleLeft: Axis
  middleRight: Axis
  bottomLeft: Axis
  bottomMiddle: Axis
  bottomRight: Axis
}

const Knobs: React.FC<KnobsProps> = () => {
  return (
    <div className="knobs">
      <div className="knob"></div>
      <div className="knob"></div>
      <div className="knob"></div>
      <div className="knob"></div>
    </div>
  )
}

export default Knobs
