import React from 'react'
import './Objects.scss'

export default () => {
  return (
    <div id="objects">
      <ul className="list">
        <li className="obj">
          <button>Text</button>
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
