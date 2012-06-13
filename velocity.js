/**
 * 把Velocity解析成ejs语法
 * fanyu.xhy@tmall.com
 * @return {object}
 */
var velocityToEjs = (function(){

    var SENTENCE = /#(set|if|foreach|macro)\s*\(\s*([\s\S]+?)\s*\)/,
        VARIABLE = /\$\{*\w[\w\.]*\}*/g,
        Parser,
        replaceMap = {};

    Parser = {
        parse: function(str){
            str = this.walk(str);

            //去除each中变量前缀$
            str = str.replace(/_\.each\((.+)\,/g, function($, $1){
                return '_.each(' + $1.replace(/^\$/, '') + ',';
            });

            //去掉if括号里变量$前缀
            str = str.replace(/if \((.+?)\)/g, function($, $1){
                return 'if (' + $1.replace(/\$/g, '') + ')';
            });

            //替换变量
            str = str.replace(/\\*(\$\!*\{(\w+[\w\.\[\]\(\)\$\+]*)\})/g, function($, $1, $2){
                if($[0] == '\\') return $1;
                return '<?='+$2+'?>';
            });

            //vm私有变量
            str = str.replace(/\$\!*\{*request\.getParameter\((.+)\)\}*/g, function($, $1){
                return '<?=__request['+$1+']?>'
            });

            console.log(str);
            return str;
        },
        walk: function(str){
            var result, i = 1;
            while ((result = SENTENCE.exec(str)) !== null && i < 50000) {
                switch (result[1]) {
                    case 'set':
                        str = this.parseSet(str, result);
                        break;
                    case 'if':
                        str = this.parseIf(str, result);
                        break;
                    case 'foreach':
                        str = this.parseForeach(str, result);
                        break;
                    case 'macro':
                        str = this.parseMacro(str, result);
                        break;
                }
                i++;
            }
            return str;
        },
        parseComment: function(str, result){
            var start = result.index,
                end = start + result[0].length;

            return str.slice(0, start) + str.slice(end);
        },
        parseSet: function(str, result){
            var start = result.index,
                end = start + result[0].length,
                expression = result[2],
                expression = expression.replace(/\$([\w\.].+)/g, function($, $1, $2){
                    return '<?var ' + $1 + ';?>';
                });
            return str = str.slice(0, start) + expression + str.slice(end);
        },
        parseIf: function(str, result){
            var start = result.index,
                end = this.matchEnd(str) + 4,
                expression = str.slice(start, end);
            if (end === -1) {
                console.log('syntax error，miss #end', 'warn');
                return str;
            }

            expression = expression.replace(/#elseif\s*\(([\s\S]+)\)/g, '<? }elseif ($1)'+'{ ?>');

            expression = expression.replace(/#else/g, '<? }else{ ?>');
            
            expression = expression.replace(/#if(\(.+?\))([\s\S]+)#end/, function($, $1, $2){
                return '<? if '+ $1 + '{ ?>' + $2 + '<? } ?>';
            });

            return str = str.slice(0, start) + expression + str.slice(end);

        },
        parseForeach: function(str, result){
            var start = result.index,
                end = this.matchEnd(str) + 4,
                expression = str.slice(start, end),
                vcReg = /\$\{*velocityCount\}*/g,
                self = this;
            
            expression = expression.replace(vcReg, '${k+1}');
            expression = expression.replace(/#foreach\s*\(\$([\w]+) in (\$\!*\{*[\w\.\(\)]+)\}*\)([\s\S]+)#end/, function($, $1, $2, $3){

                
                _$2 = $2.replace(/^\$/, '');
                replaceMap[$2] = _$2;

                $3 = self.walk($3);

                $3 = $3.replace(new RegExp('\\$\\!*\\{('+$1+')', 'g'), function($$){
                    return '${v';
                });

                $3 = $3.replace(new RegExp('\\$\\!*('+$1+')', 'g'), function($$){
                    return '$v';
                });

                var _each = '<? ' + '_.each('+$2+', function(v,k){' + ' ?>' + $3 + '<? }) ?>';
                return _each;
            });
            return str = str.slice(0, start) + expression + str.slice(end);
        },
        matchEnd: function (str) { //find the position of #end
            var reg = /#(foreach|if|macro|end)/g,
                start = 0,
                index = -1,
                result;

            while ((result = reg.exec(str)) !== null) {
                switch (result[1]) {
                case 'foreach':
                    start += 1;
                    break;
                case 'if':
                    start += 1;
                    break;
                case 'end':
                    start -= 1;
                    if (start === 0) {
                        index = result.index;
                    }
                    break;
                default:
                    break;
                }

                if (index > -1) {
                    break;
                }
            }

            return index;
        }

    };
  	return {
		parse: function(str){
  			return Parser.parse(str);
  		}
	}
})();

exports.parse = velocityToEjs.parse;


// var str = '#set($d = "www")\r\n'+'#set($abc = "www")\r\n';
// str += '#if($d == $c) #if($a == $c) $d = $c #end \r\n#elseif($a==$b) $b = $c #else $a = $c #end';
// str += '\r\n<ul>\r\n#foreach($i in $arr) \r\n<li>$velocityCount ${i.a()}\r\n #foreach($a in $i) <a>${a}</a>\r\n #end</li>\r\n#end\r\n</ul>'
// str = velocityToEjs.parse(str)
// console.log(str);
