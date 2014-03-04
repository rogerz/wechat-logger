/* logger for wechat-handler
   framework copied from https://github.com/expressjs/morgan/
   MIT Licensed
 */

/**
 * Logger:
 *
 * Log requests with the given `options` or a `format` string.
 *
 * @param {String|Function|Object} format or options
 * @return {Function}
 * @api public
 */
exports = module.exports = function logger(options) {
  if (typeof options === 'object') {
    options = options || {};
  } else if (options) {
    options = { format: options };
  } else {
    options = {};
  }

  var fmt = exports[options.format] || options.format || exports.default;
  if (typeof fmt === 'string') fmt = compile(fmt);

  var stream = options.stream || process.stdout;

  return function logger(req, res, next) {
    var line = fmt(exports, req, res);
    stream.write(line + '\n');
    next();
  };
};

/**
 * Compile `fmt` into a function.
 *
 * @param {String} fmt
 * @return {Function}
 * @api private
 */

function compile(fmt) {
  fmt = fmt.replace(/"/g, '\\"');
  var js = '  return "' + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function(_, name, arg){
    return '"\n    + (tokens["' + name + '"](req, res, "' + arg + '") || "-") + "';
  }) + '";';
  return new Function('tokens, req, res', js);
}

/**
 * Define a token function with the given `name`,
 * and callback `fn(req, res)`.
 *
 * @param {String} name
 * @param {Function} fn
 * @return {Object} exports for chaining
 * @api public
 */

exports.token = function(name, fn) {
  exports[name] = fn;
  return this;
};

/**
 * Define a `fmt` with the given `name`.
 *
 * @param {String} name
 * @param {String|Function} fmt
 * @return {Object} exports for chaining
 * @api public
 */

exports.format = function(name, str){
  exports[name] = str;
  return this;
};

exports.format('default', ':date :user -> :sp :req[MsgType]');

exports.token('user', function (req) {
  return req.weixin.FromUserName;
});

exports.token('sp', function (req) {
  return req.weixin.ToUserName;
});

exports.token('date', function () {
  return new Date().toUTCString();
});

exports.token('req', function (req, res, key) {
  return req.weixin[key];
});
