import React from 'react'

export default function AddPersonForm({
  nameValue,
  handleNameChange,
  numberValue,
  handleNumberChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: 
        <input 
          value={nameValue}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: 
        <input 
          value={numberValue}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
