import React, { createContext, useState } from 'react'
import sampleFile from 'data/slides-sample'

export const FileContext = createContext(sampleFile)

export const FileProvider: React.FC = props => {
  return (
    <FileContext.Provider value={sampleFile}>
      {props.children}
    </FileContext.Provider>
  )
}
