module.exports = {
  ifCond: (a, b, options) => {
    return (a === b || Boolean(a) === Boolean(b)) ? options.fn(this) : options.inverse(this)
  }
}
