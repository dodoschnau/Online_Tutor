const dayjs = require('dayjs')

const customParseFormat = require('dayjs/plugin/customParseFormat')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

module.exports = dayjs
