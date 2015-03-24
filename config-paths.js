var path = require('path');

/**
 * helper sub-namespace is just to expose them for testing.
 * Should not be used directly.
 */
var ConfigPaths = {helper:{}},
    loaders = {};

/**
 * Loads one or more configuration files in to an object
 * and returns the object.
 *
 * If multiple parameters are given at the same level, the
 * config file appearing later in the array supercedes the
 * earlier ones.
 * @param {string|string[]} config_files A single file path, or an array of file paths.
 */
ConfigPaths.load = function (config_files) {
    var config = {};

    if (!config_files) {
        return config;
    }

    if (!Array.isArray(config_files)) {
        config_files = [config_files];
    }

    config_files.forEach(function (filepath) {
        config = ConfigPaths.helper.loadConfigToObject(filepath, config);
    });

    return config;
};

/**
 * Parses an object, where each value is either a string
 * or an object of with more string values.
 *
 * Any value that is wrapped in %'s is replaced by its value
 * in config.
 *
 * %'s should be escaped with a \ before calling this. They
 * will be unescaped by this function.
 * @param {Object.<string, string|Object.<string>>} obj
 * @param {Object.<string, string|Object.<string>>} config
 * @param {Object.<string, string|Object.<string>>} [original_obj=]
 */
ConfigPaths.parse = function (obj, config, original_obj) {
    original_obj = original_obj || obj;
    var newObj = ConfigPaths.helper.cloneObject(obj),
        name, value,
        clean = true;

    for (name in obj) {
        if (obj.hasOwnProperty(name)) {
            value = obj[name];

            if (typeof value === "object") {
                newObj[name] = ConfigPaths.parse(value, config, original_obj);
            } else {
                newObj[name] = ConfigPaths.helper.parseString(value, original_obj, config);

                if (value !== newObj[name] && /(?!\\)%/.test(newObj[name])) {
                    clean = false;
                }
            }
        }
    }

    return !clean ? ConfigPaths.parse(newObj, config, original_obj) : newObj;
};

ConfigPaths.helper.parseString = function (str, obj, config) {
    return str.replace(/%[0-9a-z\._-]+%/gi, function (match, index) {
        var replacement = ConfigPaths.helper.findString(match.slice(1, -1), obj);

        if (replacement) {
            return replacement;
        } else {
            return ConfigPaths.helper.findString(match.slice(1, -1), config) || match;
        }
    });
};

ConfigPaths.helper.findString = function (str, obj) {
    var parts = str.split(/\./g),
        current = obj,
        part;

    while ((part = parts.shift()) && typeof current === 'object') {
        if (!current.hasOwnProperty(part)) {
            return null;
        }

        current = current[part];
    }

    if (parts.length > 0) {
        console.warn('Value was expected to be object, but was string instead: ', str.substr(0, str.length - parts.join('.').length - 1));
        return null;
    }
    
    return current;
};

ConfigPaths.helper.getLoaderForFilePath = function (filepath) {
    var ext = ConfigPaths.helper.getExtension(filepath);

    if (!loaders.hasOwnProperty(ext)) {
        loaders[ext] = require(path.join(__dirname, 'loaders', ext + '.js'));
    }

    return loaders[ext];
};

ConfigPaths.helper.loadConfigToObject = function (filepath, config) {
    return ConfigPaths.helper.mergeObjects(ConfigPaths.helper.getLoaderForFilePath(filepath)(filepath), config);
};

ConfigPaths.helper.mergeObjects = function (a, b) {
    var newObj = ConfigPaths.helper.cloneObject(a),
        name, value;

    for (name in b) {
        if (b.hasOwnProperty(name)) {
            value = b[name];
            if (typeof value === 'object') {
                newObj[name] = ConfigPaths.helper.mergeObjects(a[name] || {}, value);
            } else {
                newObj[name] = value;
            }
        }
    }

    return newObj;
};

/**
 * Clones strings and other objects.
 * @param obj
 */
ConfigPaths.helper.cloneObject = function (obj) {
    var clone = {},
        name, value;

    for (name in obj) {
        if (obj.hasOwnProperty(name)) {
            value = obj[name];

            if (typeof value === "object") {
                clone[name] = ConfigPaths.helper.cloneObject(value);
            } else {
                clone[name] = value;
            }
        }
    }

    return clone;
};

ConfigPaths.helper.getExtension = function (filepath) {
    return ((filepath.match(/(?:\.)([a-z0-9]+)$/gi) || [])[0] || '').toLowerCase().substr(1);
};

module.exports = ConfigPaths;