const { platform } = require("os");
const cp = require("child_process");
const path = require("path");
const appRoot = require("app-root-dir").get();
const getPlatform = () => {
	switch (platform()) {
		case "aix":
		case "freebsd":
		case "linux":
		case "openbsd":
		case "android":
			return "linux";
		case "darwin":
		case "sunos":
			return "mac";
		case "win32":
			return "win";
	}
};
const resourcesPath =
	process.env.NODE_ENV === "production"
		? path.join(path.dirname(appRoot), "resources", "bin")
		: path.join(appRoot, "resources", getPlatform());
let getConfig = cp.spawn("./ipfs", ["config", "show"], {
	cwd: resourcesPath
});
getConfig.stdout.on("data", data => {
	let result = JSON.parse(data.toString());
	let api = result.Addresses.API;
	console.log("api is");
	console.log(api);
	var array = api
		.toString()
		.split("/")
		.slice(1);
	console.log("array is");
	console.log(array);
	global.IPFS_API = `http://${array[1]}:${array[3]}/ipfs/`;
});
