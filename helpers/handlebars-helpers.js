module.exports = {
  ifCond: (a, b, options) => {
    return (a === b) ? options.fn(this) : options.inverse(this)
  },
  ifBooleanCond: (a, b, options) => {
    return (Boolean(a) === Boolean(b)) ? options.fn(this) : options.inverse(this)
  },
  ifOrCond: (a, b, c, options) => {
    return (a === b || a === c) ? options.fn(this) : options.inverse(this)
  },
  ifReviewExists: (review, options) => {
    return (review && review.score != null) ? options.fn(this) : options.inverse(this)
  }
}
