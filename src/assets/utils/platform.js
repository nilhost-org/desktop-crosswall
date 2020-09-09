import { platform } from "os";
const getPlatform = () => {
	console.log('platform value is');
	console.log(platform())
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
export  {getPlatform };
