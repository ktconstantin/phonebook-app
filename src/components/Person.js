import React from 'react'

export default function Person({
  name,
  number,
  handleDeleteClick
}) {
  return (
    <li>
      {`${name}: ${number}`}
      <button onClick={handleDeleteClick}>
        delete
      </button>
    </li>
  )
}
