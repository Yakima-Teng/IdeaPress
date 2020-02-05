import React from 'react'
import PropTypes from 'prop-types'
import { WidgetAbout } from './widgets/WidgetAbout'
import { WidgetArchives } from './widgets/WidgetArchives'
import { WidgetCategories } from './widgets/WidgetCategories'

export const Sidebar = (props) => (
    <div className="col-sm-3 col-sm-offset-1 siteSidebar">
        <WidgetAbout />
        {
            props.categoryList && props.categoryList.length > 0 && (
                <WidgetCategories categoryList={props.categoryList} />
            )
        }

        {
            props.months && props.months.length > 0 && (
                <WidgetArchives months={props.months} />
            )
        }

        <style jsx global>{`
            .siteSidebar {
                padding-top: 10px;
            }
            .sidebarWidget:nth-of-type(n+2) {
                margin-top: 15px;
            }
        `}</style>
    </div>
)

Sidebar.propTypes = {
    categoryList: PropTypes.array,
    months: PropTypes.array,
}
