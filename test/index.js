var expect = require('chai').expect,
    wechatLogger = require('..');

describe('wechat-logger', function() {
  it('should say hello', function(done) {
    expect(wechatLogger()).to.equal('Hello, world');
    done();
  });
});
