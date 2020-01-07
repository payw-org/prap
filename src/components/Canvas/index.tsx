import React, { useState } from 'react'
import Text from 'components/slide-objects/Text'
import './style.scss'
import { Slide, SlideTextObject } from 'types'

type CanvasProps = {
  currentSlide: Slide
}

const Canvas: React.FC<CanvasProps> = ({ currentSlide }) => {
  const [
    selectedSlideObject,
    setSelectedSlideObject
  ] = useState<HTMLElement | null>(null)

  // Event listener delegation to all of the slide objects
  window.addEventListener('pointerdown', e => {
    const target = e.target
    if (!(target instanceof HTMLElement)) return

    const slideObject = target.closest('.slide-object') as HTMLElement
    if (slideObject) {
      if (slideObject.classList.contains('selected')) {
        slideObject.classList.add('editable')
      } else {
        setSelectedSlideObject(slideObject)
        slideObject.classList.add('selected')
      }
    } else {
      if (selectedSlideObject) {
        selectedSlideObject.classList.remove('selected')
      }
    }
  })

  // Double click event listener
  window.addEventListener('dblclick', e => {
    const target = e.target
    if (!(target instanceof HTMLElement)) return

    const slideObject = target.closest('.slide-object') as HTMLElement
    if (!slideObject) return

    if (slideObject.classList.contains('text')) {
      slideObject.contentEditable = 'true'
      slideObject.classList.add('editable')
    }
  })

  const elems = currentSlide.objects.map((item, index: number) => {
    if (item.type === 'text') {
      return <Text data={item as SlideTextObject} key={index} />
    } else {
      return <></>
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
