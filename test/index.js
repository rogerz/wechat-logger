var expect = require('chai').expect,
    logger = require('..');

var lastLine;
var stream = {
  write: function (str) {
    lastLine = str;
  }
};

var req = {
  weixin: {
    FromUserName: 'user',
    ToUserName: 'sp',
    MsgType: 'text'
  }
};
var res = {};
var next = function () {};

describe('logger()', function() {
  it('should return a function', function() {
    expect(logger()).to.be.a('function');
  });

  it('should log user and sp by default', function () {
    var defaultLogger = logger({ stream: stream });
    defaultLogger(req, res, next);
    expect(lastLine).to.include('user');
    expect(lastLine).to.include('sp');
  });

  it('should support token in format', function () {
    var fmtLogger = logger({ stream: stream, format: ':user' });
    fmtLogger(req, res, next);
    expect(lastLine).to.equal('user\n');
  });

  it('should support fields of token', function () {
    var fieldLogger = logger( { stream: stream, format: ':req[FromUserName]'});
    fieldLogger(req, res, next);
    expect(lastLine).to.equal('user\n');
  });
});
