var expect = require('chai').expect,
    logger = require('..');

describe('logger()', function() {
  it('should return a function', function() {
    expect(logger()).to.be.a('function');
  });
});
