import React from 'react'

type TextProps = {
  data: string
}

const Text: React.FC<TextProps> = ({ data }) => {
  return <div>{data}</div>
}

export default Text
