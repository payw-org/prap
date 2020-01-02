import React from 'react'
import 'components/Navigator.scss'

type NavigatorProps = {
  slides: Array<any>
}

const Navigator: React.FC<NavigatorProps> = props => {
  const slidesElms = props.slides.map((slide, index) => {
    return <div className="slide"></div>
  })

  return <div id="navigator">{slidesElms}</div>
}

export default Navigator
