var assert = require("assert"),
    path = require('path'),
    configPaths = require('../config-paths.js');

console.log('testing');

describe('config-paths', function(){
    describe('#load', function(){
        it('should be an object', function(){
            assert.equal(typeof configPaths.load(configPath('core')), 'object');
        });
        it('should have data', function () {
            var config = configPaths.load(configPath('core'));
            assert.equal(config.a, 'abc');
        });
    });

    describe('#parse', function () {
        it ('should be an object', function () {
            assert.equal(typeof configPaths.parse({}, {}), 'object');
        });

        it ('should do replacements', function () {
            var data = require(dataPath('core'));
            var config = configPaths.load(configPath('core'));
            var result = configPaths.parse(data, config);

            assert.equal(result.test_path, 'abc/ghi');
            assert.equal(result.test_path2, 'abc/def/ghi');
        });
    });
});

function dataPath (name) {
    return path.join(__dirname, 'data', name + '.js');
}

function configPath (name) {
    return path.join(__dirname, 'configs', name + '.js');
}