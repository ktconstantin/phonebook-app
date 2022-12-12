import React from 'react'
import Person from './Person'

export default function PersonList({
  persons,
  handleDeleteClick 
}) {
  return (
    <ul className='person-list'>
      {persons.map(person => (
        <Person
          key={person.id}
          name={person.name}
          number={person.number}
          handleDeleteClick={() => handleDeleteClick(person.id)}
        />
      ))}
    </ul>
  )
}
