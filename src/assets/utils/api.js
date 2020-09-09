const HOST = "http://40.73.100.114:10335/api/";
const VERSION = "v1/";
module.exports = {
	getNodeVersion: HOST + VERSION + "version", // GET
	completeTorrent: HOST + VERSION + "torrent", // POST
	getTorrentPeers: HOST + VERSION + "getTorrentPeers", // GET
	getScan: HOST + VERSION + "getScan" // GET
};
