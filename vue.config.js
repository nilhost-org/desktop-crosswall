module.exports = {
	devServer: {
		host: "127.0.0.1",
		port: 2333
	},
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				// options placed here will be merged with default configuration and passed to electron-builder
				"nsis": {
					"oneClick": false,
					"perMachine": false,
					"allowToChangeInstallationDirectory": true
				},
				extraFiles: [
					{
						from: "resources/${os}",
						to: "Resources/bin",
						filter: ["**/*"]
					}
				]
			}
		}
	}
};
