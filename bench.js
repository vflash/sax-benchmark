module.exports = banch;

var EasySax = require("easysax");


function banch(xml, count, only) {
    'use strict';

    //var only = /^easysax ns=off uq=on attr=on/;
    //var count = 1;

    if (!count) {
        count = 1000;
    };

    console.log('');
    console.log('count - ' + count);
    console.log('size - ' + xml.length);
    console.log('-------------------------------------------');


    function test(name, test) {
        'use strict';

        if (only && !only.test(name.trim())) {
            return;
        };

        if (count > 50) {
            for(var z = 20; z--;) {
                test();
            };
        };

        console.time(name);

        for(var z = count; z--;) {
            test();
        };

        console.timeEnd(name);
    };

    new function() {
        return;
        test('charCodeAt', function() {
            var l = xml.length, x;
            var m = [];
            var j = 0;
            var w;

            for (; j < l; j++) {
                if (xml.charCodeAt(j) === 60) {
                    m.push(j)
                };
            };
        });
    };

    new function() {
        return;
        test('stringIndexOf', function() {
            var j = xml.indexOf('>');
            var m = [];

            for (; j !== -1; j = xml.indexOf('>', j + 1)) {
                m.push(j);
            };
        });
    };


    new function() {
        return;
        var buff = new Buffer(xml)

        test('Buffer2String', function() {
            buff.toString();
        });
    };

    new function() {
        var saxjs = require('sax');
        var parser = saxjs.parser(false);

        test('saxjs ', function() {
            parser.write(xml).close();
        });
    };

    new function() {
        var libxml = require("libxmljs");

        function go() {
            new libxml.SaxParser(function() {}).parseString(xml)
        };

        try {
            test('libxml', go);
        } catch(e) {
            console.log('libxml: error');
        };
    };

    new function() {
        var Expat = require('node-expat'), parser;
        function nullfunc() {};

        test('expat ', function() {
            parser = new Expat.Parser('utf-8');

            parser.addListener('startElement', nullfunc);
            parser.addListener('endElement', nullfunc);
            parser.addListener('text', nullfunc);

            parser.parse(xml, true);
        });
    };

    new function() {
        var Expat = require('node-expat');
        var buff = new Buffer(xml), parser;
        function nullfunc() {};

        test('expat buffer', function() {
            parser = new Expat.Parser('utf-8');
            parser.addListener('startElement', nullfunc);
            parser.addListener('endElement', nullfunc);
            parser.addListener('text', nullfunc);
            parser.parse(buff, true);
        });
    };

    new function() {
        var LtxSaxParser = require('ltx/lib/parsers/ltx.js');
        var parser = new LtxSaxParser();

        parser.on('startElement', function (name, attrs) {})
        parser.on('endElement', function (name) {})
        parser.on('text', function (s) {});

        test('ltx', function() {
            parser.write(xml);
        });
    };

    new function() {
        var parser = new EasySax();
        function nullfunc() {};

        parser.ns('rss', {
            'http://www.w3.org/1999/xhtml': 'xhtml',
            'http://purl.org/rss/1.0/': 'rss',
            'http://www.w3.org/2005/Atom': 'atom',
            'http://search.yahoo.com/mrss/': 'media',
            'http://www.georss.org/georss': 'georss',
            'http://schemas.google.com/g/2005': 'gd',
        });


        parser.on('startNode', function(elem, attr, uq, str, tagend) {
            var a = attr();
            if (!a || a === true) {
                return;
            };

            for (var i in a) {
                uq(a[i]);
            };
        });

        parser.on('textNode', function(s, uq) {
            uq(s);
        });

        parser.on('endNode', nullfunc);
        parser.on('comment', nullfunc);
        parser.on('error', nullfunc);
        parser.on('cdata', nullfunc);

        //parser.on('question', nullfunc); // <? ... ?>
        //parser.on('attention', nullfunc); // <!XXXXX zzzz="eeee">

        test('easysax ns=on uq=on attr=on   ', function() {
            parser.parse(xml);
        });
    };

    new function() {
        var parser = new EasySax();
        function nullfunc() {};


        parser.on('startNode', function(elem, attr, uq, str, tagend) {
            var a = attr();
            if (!a || a === true) {
                return;
            };

            for (var i in a) {
                uq(a[i]);
            };
        });

        parser.on('textNode', function(s, uq) {
            uq(s);
        });

        parser.on('endNode', nullfunc);
        parser.on('comment', nullfunc);
        parser.on('error', nullfunc);
        parser.on('cdata', nullfunc);

        //parser.on('question', nullfunc); // <? ... ?>
        //parser.on('attention', nullfunc); // <!XXXXX zzzz="eeee">

        test('easysax ns=off uq=on attr=on  ', function() {
            parser.parse(xml);
        });

    };

    new function() {
        var parser = new EasySax();
        function nullfunc() {};


        parser.on('startNode', function(elem, attr, uq, str, tagend) {
            attr();
        });

        parser.on('textNode', nullfunc);
        parser.on('endNode', nullfunc);
        parser.on('comment', nullfunc);
        parser.on('error', nullfunc);
        parser.on('cdata', nullfunc);

        //parser.on('question', nullfunc); // <? ... ?>
        //parser.on('attention', nullfunc); // <!XXXXX zzzz="eeee">

        test('easysax ns=off uq=off attr=on ', function() {
            parser.parse(xml);
        });

    };

    new function() {
        var parser = new EasySax();
        function nullfunc() {};

        parser.on('startNode', nullfunc);
        parser.on('textNode', nullfunc);
        parser.on('endNode', nullfunc);
        parser.on('comment', nullfunc);
        parser.on('error', nullfunc);
        parser.on('cdata', nullfunc);

        //parser.on('question', nullfunc); // <? ... ?>
        //parser.on('attention', nullfunc); // <!XXXXX zzzz="eeee">

        test('easysax ns=off uq=off attr=off', function() {
            parser.parse(xml);
        });

    };

    console.log('-------------------------------------------');

};

