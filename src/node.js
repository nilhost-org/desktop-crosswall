import { platform } from "os";
import { app, ipcMain } from "electron";
const log = require("electron-log");
const locationHost = "app://.";
const path = require("path");
const cp = require("child_process");
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

const runIpfsDamon = async createWindow => {
	let cmdStr = "";
	let runDaemonCmd = null;
	const resourcesPath =
		process.env.NODE_ENV === "production"
			? path.join(path.dirname(appRoot), "resources", "bin")
			: path.join(appRoot, "resources", getPlatform());

	if (getPlatform() === "win") {
		cmdStr = `.\\ipfs.exe`;
	} else {
		cmdStr = "./ipfs";
	}

	// initialize ipfs conifg if not exists
	let initCmd = cp.spawn("./ipfs", ["init"], {
		cwd: resourcesPath
	});
	const finishedInit = await new Promise((res, rej) => {
		initCmd.stdout.on("data", data => {
			console.log("init data");
			console.log(data.toString());
			if (data.toString().indexOf("ipfs cat") >= 0) {
				res(data);
			} else if (data.toString().indexOf("exists") >= 0) {
				res(data);
			}
		});
		initCmd.stderr.on("data", err => {
			console.log("init error~");
			console.log(err);
			log.error(err.toString());
			res(err);
		});
	});

	// get Config to set Access-Control-Allow-Origin
	let getConfigCmd = cp.spawn("./ipfs", ["config", "show"], {
		cwd: resourcesPath
	});

	try {
		var ipfsConfig = await new Promise((res, rej) => {
			getConfigCmd.stdout.on("data", data => {
				console.log("config data is");
				console.log(data);
				let result = JSON.parse(data.toString());
				let api = result.Addresses.API;
				let array = api
					.toString()
					.split("/")
					.slice(1);
				global.IPFS_API = `http://${array[1]}:${array[3]}/`;
				res(result);
			});

			getConfigCmd.stderr.on("data", error => {
				rej(error);
			});
		});
	} catch (error) {
		log.error(error.toString());
		console.error("getconfig reject error!!!!");
		console.log(error.toString());
	}

	// get Access-Control-Allow-Origin
	let origin = ipfsConfig.API.HTTPHeaders["Access-Control-Allow-Origin"];
	if (!origin) {
		origin = [locationHost];
	}
	let isAllowApp = origin.some(item => {
		console.log("item is");
		console.log(item);
		if (item === locationHost) {
			return true;
		} else {
			return false;
		}
	});
	if (!isAllowApp) {
		origin.push(locationHost);
	}
	let setOriginCmd = cp.spawn(
		"./ipfs",
		["config", "--json", "API.HTTPHeaders.Access-Control-Allow-Origin", JSON.stringify(origin)],
		{
			cwd: resourcesPath
		}
	);
	await new Promise(res => {
		setOriginCmd.on("close", data => {
			console.log("setheader close!");
			console.log(data);
			res();
		});
	});
	runDaemonCmd = cp.spawn(cmdStr, ["daemon"], {
		cwd: resourcesPath
	});

	app.on("will-quit", () => {
		try {
			process.kill(-runDaemonCmd.pid);
		} catch (error) {
			console.log("ipfs had already exit.");
		}
	});
	runDaemonCmd.stdout.on("data", data => {
		console.log(`stdout is: ${data}`);
		if (data.toString().indexOf("API server listening on") >= 0) {
			console.log("createWindow!!!");
			createWindow();
		}
	});

	runDaemonCmd.stderr.on("data", error => {
		console.log("daemon error!");
		console.log(error.toString());
		console.error(`stderr: ${error.toString()}`);
	});

	runDaemonCmd.on("close", code => {
		console.log(`子进程退出，退出码 ${code}`);
	});
};
export { runIpfsDamon };
