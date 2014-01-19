// Generated by CoffeeScript 1.6.3
(function() {
  var HarResult, Sniffer, assert, execError, execSpy, execStdout, path, sandbox, sinon;

  assert = require('chai').assert;

  sinon = require('sinon');

  sandbox = require('sandboxed-module');

  path = require('path');

  HarResult = require('../lib/harResult');

  execError = function() {
    return null;
  };

  execStdout = function() {
    return '{}';
  };

  execSpy = sinon.spy(function(command, options, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return callback(execError(), execStdout());
  });

  Sniffer = sandbox.require('../lib/sniffer', {
    requires: {
      child_process: {
        exec: execSpy
      }
    }
  });

  suite('Sniffer test case', function() {
    setup(function() {
      execError = function() {
        return null;
      };
      execStdout = function() {
        return '{}';
      };
      this.url = 'http://example.com';
      return this.sniffer = new Sniffer(this.url);
    });
    suite('first argument (url)', function() {
      test('is required', function() {
        var _this = this;
        return assert.throws(function() {
          return new Sniffer();
        });
      });
      return test('is a string', function() {
        var _this = this;
        return assert.throws(function() {
          return new Sniffer({});
        });
      });
    });
    return suite('run', function() {
      setup(function() {
        return this.spy = sinon.spy();
      });
      test('runs phantomjs', function() {
        var netsniffPath, phantomjsExecCommand;
        netsniffPath = path.resolve(__dirname, '../vendor/netsniff.js');
        phantomjsExecCommand = 'phantomjs ' + netsniffPath + ' ' + this.url;
        this.sniffer.run();
        return assert.ok(execSpy.calledWith(phantomjsExecCommand));
      });
      test('calls callback', function() {
        this.sniffer.run(this.spy);
        return assert.ok(this.spy.called);
      });
      test('error', function() {
        var error;
        error = new Error('Foo error');
        execError = function() {
          return error;
        };
        this.sniffer.run(this.spy);
        return assert.ok(this.spy.calledWith(error));
      });
      test('result', function() {
        var har;
        har = {
          log: {
            pages: [
              {
                pageTimings: {
                  onLoad: 1937
                }
              }
            ],
            entries: []
          }
        };
        execStdout = function() {
          return JSON.stringify(har);
        };
        this.sniffer.run(this.spy);
        assert.ok(this.spy.calledWith(null));
        return assert.equal(this.spy.getCall(0).args[1].constructor.name, 'HarResult');
      });
      return test('unparsable stdout', function() {
        execStdout = function() {
          return '!@#$%';
        };
        this.sniffer.run(this.spy);
        return assert.equal(this.spy.getCall(0).args[0].constructor.name, 'Error');
      });
    });
  });

}).call(this);