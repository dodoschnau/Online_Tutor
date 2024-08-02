module.exports = {
  ifCond: (a, b, options) => {
    return (a === b) ? options.fn(this) : options.inverse(this)
  },
  ifBooleanCond: (a, b, options) => {
    return (Boolean(a) === Boolean(b)) ? options.fn(this) : options.inverse(this)
  }
}
