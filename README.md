# NodeDemo环境

## 简介
* **NodeDemo**是一个简单易用的、基于 Node.js 的多人前端Demo开发环境。
* 支持同时使用JS和**Velocity**进行模板开发，前端工程师能直接产出的vm，提高前后端协同效率。
* 目前已支持的**Velocity**语法包括`#set`、`#if`、`#foreach`、`$request.getParameter()`等，计划充分发挥JS动态语言的高效，低成本地打造一个高效可用的前端Demo环境。
* [GitHub项目地址](https://github.com/xhowhy/NodeDemo)

---------

### 与PHP Demo环境对比
**NodeDemo**与PHP Demo环境相似，甚至使用同一个SVN仓库和`DocumentRoot`，最大程度地还原原有的开发方式，这里只列出不同：

* NodeDemo环境的动态页面文件扩展名可以是`.html, .htm, .node, .json`——但不能是`.php`
* 动态页面中通过`<? ?>`标签嵌入`Javascript`代码而不是`PHP`
* NodeDemo动态页面除了支持js，还支持Velocity语法
* NodeDemo环境基于Node.js环境，安装过程非常简单，基本不需要配置。

---------------

### 访问方式（Beta）
1. Demo服务器通过`http://demo.tmall.net:3000+文件路径`访问
2. 本地环境通过`http://local.tmall.net:3000+文件路径`访问（可自己配置端口号）  
####访问示例
[http://demo.tmall.net:3000/u/fanyu/example.html?itemId=00001&cateId=10000](http://demo.tmall.net:3000/u/fanyu/example.html?itemId=00001&cateId=10000)


----------------


### 安装方法
1. 下载并安装 [Node.js环境](http://nodejs.org)
2. 下载 [NodeDemo.zip](http://demo.tmall.net/u/fanyu/NodeDemo.zip) 压缩包并解压
3. 打开解压目录中的config.js，配置`DocumentRoot`为你的网站根目录（wwwroot）
4. 切换到解压目录运行`run.sh`（*nix环境）或者`run.bat`(Windows环境)


--------------------


### 开发流程
1. 新建动态页面文件，wwwroot目录下的.html、.htm、.node、.json文件默认会被当作动态网页文件解析
2. Demo开发完毕后提交到SVN上，使用 `http://demo.tmall.net:3000/+文件路径` 来访问
####语法介绍
#####嵌入动态代码：请在`<? ?>`标签中使用Javascript动态代码
#####输出：用`<?= ?>`标签进行变量输出
#####判断   
  	
		<? var foo = 123; ?>
		<? if(foo == 321){ ?>
    	       <p>foo equal to bar</p>
		   <? }else{ ?>
		       <p>foo doesn't equal to bar</p>
		<? } ?>
		
		//或者
		#set($foo = 321)
		#if($foo == 321)
		<p>foo equal to bar</p>
		#else
		<p>foo doesn't equal to bar</p>
		#end
</div>
#####循环遍历的N种写法
######普通青年写的循环遍历
		<? for(var i = 0; i < items.length; i++){ ?>
	    	<?=items[i]?>  
		<? } ?>
######XX青年写的循环遍历…
		<ul>
			<?
			_.each([1,2,3,4,5], function(v,k){
			?>
			<li>
				arr[<?=k?>]的值是<?=v?>
			</li>
			<? }) ?>
		</ul>				
######爱工作的好青年写的循环遍历…
    	#foreach($i in $arr)
    	<li>
        	${velocityCount}=${i}
    	</li>
    	#end

#####子模板包含

		<?-partial('../header.html')?>
		<?-partial('../footer.html')?>
		<?-partial('menu.html', {menus: data.menus})?>
#####输出JSON格式
		<?=JSON.stringify(__request)?>
#####输出内容不转义
		<?-varname?>

--------

### 系统全局变量  
系统全局变量可以使用在动态页面中的任意位置，例如你可以用`<?=__get.itemId?>`获取并输出URL中的`itemId`参数。你也可以使用全局变量作判断、遍历等操作。

* `$request.getParameter()`: 同Velocity中的`$request.getParameter`方法

* `__get` : 对应PHP中的`$_GET`全局变量  

* `__post` : 对应PHP中的`$_POST`全局变量  

* `__cookie` : 对应PHP中的`$_COOKIE`全局变量  

* `__request` : 对应PHP中的`$_REQUEST`全局变量  

* `__session` : 对应PHP中的`$_SESSION`全局变量

* `__url` ： 当前请求的URL，例如：`http://local.tmall.net:3000/u/fanyu/example.html?itemId=123`

* `__script` ： 当前请求的页面地址，不含queryString 

* `__pathinfo` ： 当前页面所在的目录URL 例如：`http://local.tmall.net:3000/u/fanyu/` 

* `__filename` : 当前执行的文件的文件名（含路径）

* `__dirname` ：当前执行的文件所在的磁盘路径

* `__req` : Node.js http模块中的`http.ServerRequest`对象
	

#### 系统常量
* `require()` : Node.js模块加载函数

* `_` : underscore，一个很好用的类库…

____________

### TODO

* 模拟完整的模板方案
* 提供更强大的Assets开发和调试方案
* 支持应用子域名的访问
* 提供数据模型
* ……  



