import React from 'react'
import './style.scss'

type NavigatorProps = {
  slides: Array<any>
  currentSlideIndex: number
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<any>>
}

const Navigator: React.FC<NavigatorProps> = props => {
  const slidesElms = props.slides.map((slide, index) => {
    return (
      <div
        className={`slide ${
          index === props.currentSlideIndex ? 'current' : ''
        }`}
        key={index}
        onClick={() => {
          props.setCurrentSlideIndex(index)
        }}
      ></div>
    )
  })

  return <div id="navigator">{slidesElms}</div>
}

export default Navigator
