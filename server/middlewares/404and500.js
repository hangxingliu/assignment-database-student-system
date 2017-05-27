//@ts-check
module.exports = {
	bind: (expressServer) => {
		expressServer.use((req, res) => {
			res.status(404);
			res.json({ error: 404 });
		});
		expressServer.use((err, req, res, next) => {
			res.status(500);
			res.json({ error: 500 });
			console.error(err ? (err.stack ? err.stack : err ) : "empty error description object");
		}); 
	}
};