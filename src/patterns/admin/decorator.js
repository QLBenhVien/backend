function applyMiddlewares(middlewares, handler) {
  return [...middlewares, handler];
}

module.exports = applyMiddlewares;
