import React from 'react'
import './Objects.scss'

type ObjectsProps = {
  addObject: Function
}

const Objects: React.FC<ObjectsProps> = ({ addObject }) => {
  function handleObjectClick(type: string) {
    addObject('text')
    console.log(type)
  }

  return (
    <div id="objects">
      <ul className="list">
        <li className="obj">
          <button
            onClick={() => {
              handleObjectClick('text')
            }}
          >
            Text
          </button>
        </li>
        <li className="obj">
          <button>Image</button>
        </li>
        <li className="obj">
          <button>Chart</button>
        </li>
      </ul>
    </div>
  )
}

export default Objects
