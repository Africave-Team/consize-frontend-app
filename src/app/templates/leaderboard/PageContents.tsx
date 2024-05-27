'use client'
import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import "./style.css"

interface Item {
  name: string
  rank: number
  score: number
  isCurrentUser: boolean
}

interface DataInterface {
  courseName: string
  studentName: string
  organizationName: string
  leaderboard: Item[]
}

export default function PageContents ({ details }: { details: DataInterface }) {
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>Course Leaderboard</h1>
        <p>{details.courseName}</p>
        <p>Organization: {details.organizationName}</p>
      </div>
      <div className="leaderboard-list" id="leaderboardList">
        {
          details.leaderboard.map((item: Item, index: number) => {
            return (
              <div key={`leader-${index}`} className={`leaderboard-item ${item.isCurrentUser ? 'current-user' : ''}`}>
                <span className="rank">{item.rank}</span>
                <span className="name capitalize">{item.name}</span>
                <span className="score">{item.score.toFixed(0)}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
