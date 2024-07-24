const getOffset = (page, limit) => (page - 1) * limit

const getPagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const prev = page > 1 ? page - 1 : page
  const next = page < totalPages ? page + 1 : page

  return {
    totalPages,
    pages,
    prev,
    next,
    page
  }
}

module.exports = {
  getOffset,
  getPagination
}
