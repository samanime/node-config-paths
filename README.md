**Still under development.**

# node-config-paths

node-config-paths is a small module which loads configuration files and then integrates them
with objects of strings.

The primary use-case this is designed for is building an object of paths and other values for
use in tasks like gulp.

# Example

    // config.js
    module.exports = {
        cache_dir: '/path/to/cache'
    };

    // main.js
    var configPaths = require('config-paths');
    
    var config = configPaths.load('config.js');
    var paths = {
        test_path: '%cache_dir%/images',
        sub_path: '%test_path%/12'
    };
    
    paths = configPaths.parse(paths, config);
    // paths.test_path now equals '/path/to/cache/images'
    // paths.sub_path now equals '/path/to/cache/images/12'

# Supported configuration formats

  - JSON

         {
            "path": "/a/b/c"
            "sub": {
                "a": "b"
            }
         }
      
  - JavaScript (module.exports an object)
  
          module.exports = {
            path: "/a/b/c",
            sub: {
                "a": "b"
            }
          };
          
# Planned supported configuration formats

  - INI format
  
        path=/a/b/c
        [sub]
        a=b
        
  - YAML format
  
        path: /a/b/c
        sub: 
            - a: b
            
  - XML format
 
        <path>/a/b/c</path>
        <sub>
            <a>b</b>
        </sub>