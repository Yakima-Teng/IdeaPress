import { promiseQuery } from '../../scripts/sql'
import { POST_LIST_TYPE } from '../../scripts/data'
import {
    subClauseForQueryingPostIdsInSpecificCategory,
    subClauseForQueryingPostIdsInSpecificMonth,
    subClauseForQueryingPostIdsForGlobal,
} from './getPostIds'

export const getTotalNumOfPosts = async (params) => {
    params.type = params.type || POST_LIST_TYPE.GLOBAL

    if (params.type === POST_LIST_TYPE.CATEGORY) {
        return (await promiseQuery(
            'SELECT COUNT(*) as total ' +
            subClauseForQueryingPostIdsInSpecificCategory({ categoryIds: params.categoryIds }) +
            ';',
        ))[0].total
    }

    if (params.type === POST_LIST_TYPE.ARCHIVE) {
        return (await promiseQuery(
            'SELECT COUNT(*) as total ' +
            subClauseForQueryingPostIdsInSpecificMonth({ year: params.year, month: params.month }) +
            ';',
        ))[0].total
    }

    return (await promiseQuery(
        'SELECT COUNT( * ) as total ' +
        subClauseForQueryingPostIdsForGlobal() +
        ';',
    ))[0].total
}
