# Introduction

## Installation

```shell

```

## Usage

```javascript
const log = new createLog()
let test_value = 'Hi :)'

log.info(test_value)
log.error(test_value)
log.log(test_value)
log.verbose(test_value)

let test_val = `You can use markdown such as *bold1*, **bold with color**, _italics_, __italics with color__, ~~strikethrough~~.`
```

The configuration and available methods on the log object is defined in Yaml. Since the configuration is loaded dynamically at run time, you can easily add new methods just by editing the Yaml file.

```yaml
success:
    importance: success
    markdown: false
    base_logger: log
    pretty_obj: false
    pretty_opts:
        alphabetizeKeys: false
        noColor: true
    timestamp: true
    timestamp_relative: true
    new_line: true
    highlight_paths: false
error:
    markdown: false
    base_logger: error
    pretty_obj: false
    pretty_opts:
        alphabetizeKeys: false
        noColor: true
    timestamp: true
    timestamp_relative: true
    new_line: true
    highlight_paths: false
# Add your own method just like the two above
```

## History

I started off using [Winston][] and found [this helpful gist][] to simplify the process. But I since moved away from Winston as it seems to want to use too many of it's own classes and vocabulary, not making it clear what it is actually doing. I therefore moved away from Wintson and I decided to work directly with `process.stdout` and `process.stderr` by extending them, which enabled me to use the standard console object. I found [this guide][] most helpful for extending write streams.

[wintson]: https://www.npmjs.com/package/winston 'Winston'
[helpful gist]: https://gist.github.com/Xeoncross/b8a735626559059353f21a000f7faa4b 'helpful gist'
[this guide]: https://www.acuriousanimal.com/2015/08/31/how-to-read-from-a-writable-stream-httpserverresponse-in-node.html 'How to read from a writable tream(http.ServerResponse) in Node'
