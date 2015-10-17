# Node-File-List

A basic node app to list all files in a specified directory and serve a JSON object with file information.

## Installation

```bash
git clone git@github.com:joshfarrant/node-file-list.git
```

## Dependencies

No external dependencies, however requires Node v4 and above.

## Usage

```bash
node file-list.js
```

By default, running this command will find all files in the current (excluding hidden files), populate a JSON object with information on them, serve that JSON object on port 8080, and refresh the list of files every 10 seconds.

### Optional flags

The following optional flags can be used when running the script.

```
Flag           Default            Description

--port         8080               Port to serve on
--path         Current directory  Path to directory
--refresh      10                 How often in seconds to check directory
--show-hidden  false              Whether to show hidden files
--debug        false              Increased logging
```
