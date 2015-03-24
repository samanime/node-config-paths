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
            var result = getResult('core', 'core');

            assert.equal(result.test_path, 'abc/ghi');
            assert.equal(result.test_path2, 'abc/def/ghi');
        });

        it ('can ignore non-existing values', function () {
            var result = getResult('core', 'core');

            assert(true);
        });

        it ('can have just an object with an empty config', function () {
            var result = configPaths.parse(require(dataPath('demo')), {});

            assert(true);
        });
    });
});

function getResult(data_name, config_name) {
    return configPaths.parse(require(dataPath(data_name)), configPaths.load(configPath(config_name)));
}

function dataPath (name) {
    return path.join(__dirname, 'data', name + '.js');
}

function configPath (name) {
    return path.join(__dirname, 'configs', name + '.js');
}