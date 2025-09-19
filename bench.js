module.exports = banch;

var EasySax = require("easysax");

async function banch(xml, count, only) {
    if (!count) {
        count = 1000;
    };


    console.log('');
    console.log('count - ' + count);
    console.log('size - ' + xml.length);
    console.log('-------------------------------------------');


    var rules = [
        test_ltx,
        test_saxophone,
        test_saxen,
        test_saxjs,
        test_libxml,
        test_saxwasm_zero,
        test_saxwasm_full,
        test_saxwasm,
        test_expat,
        test_expat_buffer,
        test_EasySax_on_on_on,
        test_EasySax_off_on_on,
        test_EasySax_off_off_on,
        test_EasySax_off_off_off,
    ];

    var rule;
    while(rule = rules.shift()) {
        if (rule === '---') {
            console.log('---');
        } else {
            await test(xml, rule, count);
        };
    };

    console.log('-------------------------------------------');

};

function nullFunc() {};
function str(value, len) {
    return (value + '                                           ').slice(0, len);
};

async function test(xml, test, count = 10) {
    var run = async (log) => {
        var end, p = new Promise(x => end = x);

        var timeStart = performance.now();
        var time = 0;

        var config = await test();
        // time += performance.now() - timeStart;

        var config_write = config.write;
        var config_end = config.end;
        var config_name = config.name;
        var size = 0;

        var s_write = async (chunk) => {
            var xt = performance.now();
            await config_write(chunk);
            time += performance.now() - xt;
            size += chunk.size ?? chunk.length;
        };
        var s_end = async () => {
            var xt = performance.now();
            var res = await config_end();
            time += performance.now() - xt;

            var total = performance.now() - timeStart;

            end({total, time, name: config_name, size, ...res});
        };

        await s_write(config.utf === false ? new Buffer.from(xml) : xml);
        await s_end();

        return p;
    };


    var z = 2; while(z--) {
        await run(false);
    };

    var total = 0;
    var time = 0;
    var res;
    var i = count; while(i--) {
        res = await run();
        total += res.total;
        time += res.time;
    };

    if (true) {
        console.log(`${str(res.name, 30)} - total: ${str(total.toFixed(2), 7)} time: ${str(time.toFixed(2), 7)}`, res.countNodes, res.countText);
    };

};


async function test_charCodeAt() {
    var countNodes = 0;
    var countText = 0;
    var xml = '';

    return {
        name: 'charCodeAt',
        write: async function(txt) {
            xml += txt;
        },
        end: function() {
            var l = xml.length, x;
            var m = [];
            var j = 0;
            var w;

            for (; j < l; j++) {
                if (xml.charCodeAt(j) === 60) {
                    m.push(j)
                };
            };
            return {countNodes, countText};
        },
    };
};

async function test_stringIndexOf() {
    var countNodes = 0;
    var countText = 0;
    var xml = '';

    return {
        name: 'stringIndexOf',
        write: async function(txt) {
            xml += txt;
        },
        end: function() {
            var j = xml.indexOf('>');
            var m = [];
            for (; j !== -1; j = xml.indexOf('>', j + 1)) {
                m.push(j);
            };
            return {countNodes, countText};
        },
    };
};


var Saxophone = require('saxophone');

async function test_saxophone() {
    var countNodes = 0;
    var countText = 0;
    var xml;

    var parser = new Saxophone();

    parser.on('tagopen', function(tag) {
        Saxophone.parseAttrs(tag.attrs);
        countNodes += 1;
    });
    parser.on('tagclose', function() {})
    parser.on('text', function(op) {
        Saxophone.parseEntities(op.contents)
        countText += 1;
    });

    return {
        name: 'saxophone',
        write: async function(txt) {
            xml += txt;
        },
        end: function() {
            parser.end(xml);
            return {countNodes, countText};
        },
    };
};



var saxen = require('saxen');

async function test_saxen() {
    var countNodes = 0;
    var countText = 0;
    var xml;

    var parser = new saxen.Parser();

    parser.on('openTag', function(elementName, attrGetter, decodeEntities) {
        var attrs = attrGetter();
        countNodes += 1;
        for (var i in attrs) {
            //decodeEntities(attrs[i]);
        };
    });
    parser.on('closeTag', function() {})
    parser.on('text', function(text, decodeEntities) {
        decodeEntities(text);
        countText += 1;
    });

    return {
        name: 'saxen   ns=off uq=on  attr=on',
        write: async function(txt) {
            xml += txt;
        },
        end: function() {
            parser.parse(xml);
            return {countNodes, countText};
        },
    };
};


async function test_saxjs() {
    var saxjs = require('sax');
    var parser = saxjs.parser(false);

    var countNodes = 0;
    var countText = 0;


    parser.onopentag = function (node) {countNodes += 1};
    parser.ontext = function (t) {countText += 1};

    return {
        name: 'saxjs',
        write: async function(txt) {
            parser.write(txt);
        },
        end: function() {
            parser.close();
            return {countNodes, countText};
        },
    };
};

async function test_libxml() {
    var libxml = require("libxmljs");

    var countNodes = 0;
    var countText = 0;
    var xml = '';

    return {
        name: 'libxml',
        write: async function(txt) {
            xml += txt;
        },
        end: function() {
            try {
                new libxml.SaxParser(function() {}).parseString(xml)
            } catch(e) {
                console.log('libxml: error');
            };
            return {countNodes, countText};
        },
    };
};

async function test_expat() {
    var Expat = require('node-expat');
    var nullfunc = () => {};

    var countNodes = 0;
    var countText = 0;
    var xml = '';

    var parser = new Expat.Parser('utf-8');

    parser.addListener('startElement', x => countNodes++);
    parser.addListener('endElement', nullfunc);
    parser.addListener('text', x => countText++);

    return {
        name: 'expat',
        write: async function(txt) {
            xml += txt;
        },
        end: function() {
            parser.parse(xml, true);
            return {countNodes, countText};
        },
    };
};

async function test_expat_buffer() {
    var Expat = require('node-expat');
    var nullfunc = () => {};

    var countNodes = 0;
    var countText = 0;

    var parser = new Expat.Parser('utf-8');

    parser.addListener('startElement', x => countNodes++);
    parser.addListener('endElement', nullfunc);
    parser.addListener('text', x => countText++);

    return {
        name: 'expat buffer',
        utf: false,
        write: async function(data) {
            parser.write(data);
        },
        end: function() {
            return {countNodes, countText};
        },
    };
};


var {SaxEventType, SAXParser} = require('sax-wasm');
var {readFileSync} = require('fs');

const wasmUrl = require.resolve('sax-wasm/lib/sax-wasm.wasm');
const saxWasm = readFileSync(wasmUrl);

async function test_saxwasm_full() {
    const parser = new SAXParser(1023);
    await parser.prepareWasm(saxWasm);

    var countNodes = 0;
    var countText = 0;

    parser.eventHandler = (eventType, data) => {
        if (eventType === SaxEventType.OpenTag) {
            countNodes += 1;
        };
        if (eventType === SaxEventType.Text) {
            countText += 1;
        };
        // console.log('Событие:', eventType);
        // console.log('  Данные:', data);
        // console.log('---');
    };

    return {
        name: 'saxwasm-full',
        utf: false,
        write: async function(buffer) {
            parser.write(buffer);
        },
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};

async function test_saxwasm_zero() {
    const parser = new SAXParser();
    await parser.prepareWasm(saxWasm);

    var countNodes = 0;
    var countText = 0;

    parser.eventHandler = (eventType, data) => {
    };

    return {
        name: 'saxwasm-zero',
        utf: false,
        write: async function(buffer) {
            parser.write(buffer);
        },
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};

async function test_saxwasm() {
    const parser = new SAXParser(SaxEventType.CloseTag | SaxEventType.OpenTag | SaxEventType.Text);
    await parser.prepareWasm(saxWasm);

    var countNodes = 0;
    var countText = 0;

    parser.eventHandler = (eventType, data) => {
        if (eventType === SaxEventType.OpenTag) {
            countNodes += 1;
        };
        if (eventType === SaxEventType.Text) {
            countText += 1;
        };
        // console.log('Событие:', eventType);
        // console.log('  Данные:', data);
        // console.log('---');
    };

    return {
        name: 'saxwasm-abc',
        utf: false,
        write: async function(buffer) {
            parser.write(buffer)
        },
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};

function test_ltx() {
    var LtxSaxParser = require('ltx/lib/parsers/ltx.js');

    var countNodes = 0;
    var countText = 0;

    var parser = new LtxSaxParser();

    parser.on('startElement', function (name, attrs) {countNodes += 1})
    parser.on('endElement', function (name) {})
    parser.on('text', function (text) {countText += 1;});

    return {
        name: 'ltx',
        write: function(data) {
            parser.write(data)
        },
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};


function test_EasySax_on_on_on() {
    var countNodes = 0;
    var countText = 0;

    var entityDecode = EasySax.entityDecode;
    var mapNS = {
        'http://www.w3.org/1999/xhtml': 'xhtml',
        'http://purl.org/rss/1.0/': 'rss',
        'http://www.w3.org/2005/Atom': 'atom',
        'http://search.yahoo.com/mrss/': 'media',
        'http://www.georss.org/georss': 'georss',
        'http://schemas.google.com/g/2005': 'gd',
        'http://www.bloglines.com/about/specs/fac-1.0': 'fac',
    };

    var parser = new EasySax({
        autoEntity: true,
        defaultNS: 'rss',
        ns: mapNS,
        on: {
            startNode: function (name, attr, isTagEnd, getStrNode) {
                countNodes += 1;
                attr();
            },
            endNode: nullFunc,
            text: function(text) {
                countText += 1;
            },
        },
    });

    return {
        name: 'easysax ns=on  uq=on  attr=on ',
        write: function(data) {parser.write(data)},
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};


function test_EasySax_off_on_on() {
    var entityDecode = EasySax.entityDecode
    var countNodes = 0;
    var countText = 0;

    var parser = new EasySax({
        autoEntity: true,
        on: {
            startNode: function (elem, attr) {
                countNodes += 1;
                attr();

            },
            endNode: nullFunc,
            text: function(text) {
                countText += 1;
            },
        },
    });

    return {
        name: 'easysax ns=off uq=on  attr=on ',
        write: function(data) {parser.write(data)},
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};

function test_EasySax_off_off_on() {
    var countNodes = 0;
    var countText = 0;

    var parser = new EasySax({
        autoEntity: false,
        on: {
            startNode: function(name, attr) {
                countNodes += 1;
                attr();
            },
            endNode: nullFunc,
            text: function(text) {countText += 1},
        },
    });

    return {
        name: 'easysax ns=off uq=off attr=on ',
        write: function(data) {parser.write(data)},
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};



function test_EasySax_off_off_off() {
    var countNodes = 0;
    var countText = 0;

    var parser = new EasySax({
        autoEntity: false,
        on: {
            startNode: function() {countNodes += 1},
            endNode: nullFunc,
            text: function(text) {
                countText += 1;
            },
        },
    });

    return {
        name: 'easysax ns=off uq=off attr=off',
        write: function(data) {parser.write(data)},
        end: function() {
            parser.end();
            return {countNodes, countText};
        },
    };
};