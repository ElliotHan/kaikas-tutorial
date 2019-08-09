import React from 'react'
import cx from 'classnames'

import './Message.scss'

const Message = ({
  type,
  message,
}) => {
  return (
    <div
      className={cx('Message', {
        'Message--error': type === 'error',
        'Message--txHash': type === 'txHash',
        'Message--receipt': type === 'receipt',
        'Message--rawTransaction': type === 'rawTransaction',
      })}
    >
      <div className="Message__status">
        {type === 'error' && 'error'}
        {type === 'txHash' && 'txHash'}
        {type === 'receipt' && 'receipt'}
        {type === 'rawTransaction' && `SignedTransaction`}
      </div>
      <div className="Message__message">
        {message}
      </div>
    </div>
  )
}

export default Message
