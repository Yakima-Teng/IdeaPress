import React from 'react'
import { getTimeLeft } from '../scripts/utils'

const dateParams = getTimeLeft()

export const TimeLeft = (props) => (
    <div>
        <p className="bg-warning">{`当前日期：${dateParams.dateStr}。距离本月结束还剩：${dateParams.timeLeftThisMonth}，距离本年结束还剩：${dateParams.timeLeftThisYear}。`}</p>
        <style jsx>{`
            .bg-warning {
                padding: 10px;
                border-radius: 6px;
            }
        `}</style>
    </div>
)
