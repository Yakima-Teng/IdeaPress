import React from 'react'
import { WidgetAbout } from './widgets/WidgetAbout'
import { WidgetArchives } from './widgets/WidgetArchives'
import { WidgetLinks } from './widgets/WidgetLinks'

export const Sidebar = () => (
    <div className="col-sm-3 col-sm-offset-1">
        <WidgetAbout />
        <WidgetArchives />
        <WidgetLinks />

        <style jsx global>{`
            .sidebarWidget:nth-of-type(n+2) {
                margin-top: 15px;
            }
        `}</style>
    </div>
)
