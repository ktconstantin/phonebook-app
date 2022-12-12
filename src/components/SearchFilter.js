import React from 'react'

export default function SearchFilter({
  value,
  onChange
}) {
  return (
    <div className='search-filter'>
      filter by name: 
      <input 
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
