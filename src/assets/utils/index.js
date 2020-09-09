const crypto = require("./crypto")
const config = require("./config")
module.exports = {
	...config,
	...crypto,
}
