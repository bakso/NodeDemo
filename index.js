var cluster = require('cluster'),
	app = require('./server').app,
	numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('death', function(worker) {
    	console.log('worker ' + worker.pid + ' died');
	});
}else{
	app.listen(3000);
}