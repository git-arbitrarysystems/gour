const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:2222',
      changeOrigin: true,
      pathRewrite: function (path, req) { return path.replace('/api', '/') }
    })
  );
};