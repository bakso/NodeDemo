var express = require('./express'),
	app = express.createServer(),
	fs = require('fs'),
	path = require('path'),
	url = require('url'),
	C = require(__dirname + '/config.js').config,
	ejs = require('./ejs');

C.DocumentRoot = path.resolve(C.DocumentRoot);

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: "NodeDemo diao bao le" }));
app.use(app.router);
//app.use(express.errorHandler());

app.set("view engine", "html");
app.register(".html", ejs);
app.register(".htm", ejs);
app.register(".node", ejs);
app.register(".json", ejs);
app.set('views', C.DocumentRoot);
app.set('view options', {
	layout: false,
	open: '<?',
    close: '?>'
});

//app.enable('view cache');

app.dynamicHelpers({
	__get: function(req, res){
		return req.query
	},
	__post: function(req, res){
		return req.body
	},
	__cookie: function(req, res){
		return req.cookies
	},
	__request: function(req, res){
		mix(req.query, req.body, req.cookies)
	},
	__session: function(req, res){
		return req.session;
	},
	__req: function(req){
		return req
	}
});

app.helpers({
	"require": require,
    _: require('underscore')
});

var reg = '/', ftypes = C.FilterType;
ftypes.forEach(function(s){
	reg += '\\'+s.toLowerCase()+'.*'+'|';
});
reg = reg.slice(0, reg.length-1);
reg += '/';

app.get('/', function(req, res){
	res.render('u/fanyu/README.html');
});

app.all(new RegExp(reg), function(req, res){

	var layout = url.parse(req.url).pathname.slice(1);
	var __url = 'http://'+req.headers.host + req.originalUrl,
		__urlpath = __url.slice(0, __url.lastIndexOf('/')),
		__file = C.DocumentRoot + req.url.split('?')[0],
		__dir = __file.slice(0, __file.lastIndexOf('/'));

	res.render(layout, mix(global, {
		'res': res,
		'app': app,
		'__url': __url,
		'__urlpath': __urlpath,
		'__sourcepath': __urlpath.replace(/\:\d+?\//, '/'),
		'__dirname': __dir,
		'__filename': __file
	}));
});

// app.register('.md', {
//     compile: function(str, options){
//     	var html = md.toHTML(str);
// 		return function(locals){
// 			return html.replace(/\{([^}]+)\}/g, function(_, name){
//          		return locals[name];
// 			});
//       };
//     }
// });

app.use(express.directory(C.DocumentRoot));
app.use(express.static(C.DocumentRoot));

function mix(){
	var obj = {}, 
		args = Array.prototype.slice.call(arguments);

	for(var i = 0; i < args.length; i++){
		for(var j in args[i]){
			if(args[i].hasOwnProperty(j)){
				obj[j] = args[i][j];
			}
		}
	}
	return obj;
}

exports.app = app;

