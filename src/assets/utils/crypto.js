const CryptoJS = require("crypto-js");
const str2MD5hexstr = (str) => {
	return CryptoJS.MD5(str).toString()
};
const hexstr2ab = (str) => {
	if (!str) {
		return new Uint8Array()
	}
	var a = [];
	for (var i = 0, len = str.length; i < len; i += 2) {
		a.push(parseInt(str.substr(i, 2), 16))
	}
	return new Uint8Array(a)
};
const str2ab = (str) => {
	var bytes = new Uint8Array(str.length);
	for (var iii = 0; iii < str.length; iii++) {
		bytes[iii] = str.charCodeAt(iii);
	}
	return bytes;
};
module.exports = {
	str2MD5hexstr,
  hexstr2ab,
  str2ab,
};
