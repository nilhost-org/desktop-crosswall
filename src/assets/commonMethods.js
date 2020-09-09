const utils = require("./utils/index");
const methods = {
	install(Vue) {
		/**
		 *  @param {ArrayBuffer} data
		 *  @param {string} password
		 *  @returns {ArrayBuffer} encrypted buffer
		 */
		Vue.prototype.$browserAesEncrypt = async function(data, password) {
			console.log("browserAesEncrypt", window.crypto);
			const iv = utils.hexstr2ab(utils.str2MD5hexstr(password));
			const keyHash = await crypto.subtle.digest({ name: "SHA-256" }, utils.str2ab(password));
			console.log("iv", iv);
			const key = await crypto.subtle.importKey("raw", keyHash, { name: "AES-CBC", length: 256 }, false, [
				"encrypt",
				"decrypt"
			]);
			console.log("key", key, typeof data);
			console.log("data", data);
			const encrypted = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, data);
			console.log(encrypted ? "encrypted success" : "encrypted falied");
			console.log("encrypted", encrypted);
			this.encrypted = encrypted;
			return encrypted;
		};
		Vue.prototype.$browserAesDecrypt = async function(data, password) {
			console.log("browserAesDecrypt", window.crypto);
			const iv = utils.hexstr2ab(utils.str2MD5hexstr(password));
			const keyHash = await crypto.subtle.digest({ name: "SHA-256" }, utils.str2ab(password));
			const key = await crypto.subtle.importKey("raw", keyHash, { name: "AES-CBC", length: 256 }, false, [
				"encrypt",
				"decrypt"
			]);
			console.log("key", key, typeof data);
			console.log("data", data);
			let decrypt;
			try {
				decrypt = await window.crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
			} catch (error) {
				console.log("decrypt error");
				console.log(error);
			}
			console.log(decrypt ? "decrypt success" : "decrypt falied");
			console.log("decrypted", decrypt);
			this.decrypt = decrypt;
			return decrypt;
		};
	}
};
/* 		async browserAesEncrypt(data, password) {
			console.log("browserAesEncrypt", window.crypto)
			const iv = utils.hexstr2ab(utils.str2MD5hexstr(password))
			const keyHash = await crypto.subtle.digest(
				{ name: "SHA-256" },
				utils.str2ab(password)
			)
			console.log("iv", iv)
			const key = await crypto.subtle.importKey(
				"raw",
				keyHash,
				{ name: "AES-CBC", length: 256 },
				false,
				["encrypt", "decrypt"]
			)
			console.log("key", key, typeof data)
			console.log("data", data)
			const encrypted = await window.crypto.subtle.encrypt(
				{ name: "AES-CBC", iv },
				key,
				data
			)
			console.log(encrypted ? "encrypted success" : "encrypted falied")
			console.log("encrypted", encrypted)
			this.encrypted = encrypted
			return encrypted
		}, */
/* async browserAesDecrypt(data, password) {
			console.log("browserAesDecrypt", window.crypto)
			const iv = utils.hexstr2ab(utils.str2MD5hexstr(password))
			const keyHash = await crypto.subtle.digest(
				{ name: "SHA-256" },
				utils.str2ab(password)
			)
			const key = await crypto.subtle.importKey(
				"raw",
				keyHash,
				{ name: "AES-CBC", length: 256 },
				false,
				["encrypt", "decrypt"]
			)
			console.log("key", key, typeof data)
			console.log("data", data)
			const decrypt = await window.crypto.subtle.decrypt(
				{ name: "AES-CBC", iv },
				key,
				data
			)
			console.log(decrypt ? "decrypt success" : "decrypt falied")
			console.log("encrypted", decrypt)
			this.decrypt = decrypt
			return decrypt
		}, */
export default methods;
