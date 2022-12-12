import React from 'react'

export default function Notification({
  type,
  message
}) {

  if (!message) {
    return null
  }

  const className = type === 'error' ?
    'error-notification' : 'success-notification'

  return (
    <div className={className}>{message}</div>
  )
}
