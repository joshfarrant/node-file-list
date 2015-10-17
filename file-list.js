'use strict';

var http = require('http');
var fs = require('fs');

var page = JSON.stringify([]); // Initialize page to empty array

// Define flags and defaults
var flags = {
  'port': 8080, // Port to serve on
  'path': './', // Path to directory
  'refresh': 10, // How often to check directory (in seconds)
  'show-hidden': false, // Whether to show hidden files
  'debug': false // Enable logging
};

function parseFlags(args) {

  let config = {};

  for (let flag of Object.keys(flags)) {

    // Iterate over all defined flags, check if each has been provided
    // If it has, get the following argument and set that to the flag
    // Else, set it to the default
    let flagIdx = args.indexOf(`--${flag}`);
     config[flag] = flagIdx > 0 ? args[flagIdx + 1] : flags[flag];

  }

  return config;

}

function getFiles() {

  fs.readdir(config.path, function(err, files) {

    // Read all files in provided directory

    if (config.debug) console.log('Reading files in directory');

    if (err) throw err;

    let data = [];

    for (let fileName of files) {

      // Iterate over each file

      // If we're not showing hidden files, and this
      // file's name starts with a '.', then continue
      if (!config['show-hidden'] && fileName[0] === '.') continue;

      // Get file information
      let stats = fs.statSync(config.path + fileName);

      data.push({
        name: fileName,
        lastModified: stats.mtime,
        isDir: stats.isDirectory(fileName)
      });

    }

    page = JSON.stringify(data);

  });

}


// Parse flags and set config information
var config = parseFlags(process.argv);

// Get files in specified directory once on first run
getFiles();

// Then get the files again periodically
// We're multiplyig by 1000 as setInterval works with
// milliseconds, but we're providing times in seconds
setInterval(getFiles, config.refresh * 1000);


// Build summary log
var summary = '';
summary += `Serving contents of \'${config.path}\' `;
summary += `(${config['show-hidden'] ? 'including' : 'excluding'} hidden files) `;
summary += `on port ${config.port}. `;
summary += `Refreshing every ${config.refresh} seconds.`;

console.log(summary);

http.createServer(function(req, res) {

  // Create the server on the specified port
  // Write the files to a JSON object

  if (config.debug) console.log('Page requested');

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  res.end(page);

}).listen(config.port, '0.0.0.0');
