import React from 'react'
const Notice = ({ notice }) => {
  return (
    <div>
      <div className="dateLine">
        <div className="noticeTime">
          <span>{notice.NOTICE_TIME}</span>
        </div>
      </div>
      <div>
        <span className="material-symbols-outlined">comment</span>
        <span>{notice.MESSAGE}</span>
      </div>
    </div>
  )
}

export default Notice
