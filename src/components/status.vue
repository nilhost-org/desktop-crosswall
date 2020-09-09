<template>
	<div class="status-vue">
		<el-row>
				<el-button type="success" icon="el-icon-video-play" circle @click="startV2ray"></el-button>
		</el-row>
		<el-row>
			<el-button type="danger" size="160px" icon="el-icon-video-pause" class="mysize" circle @click="stopV2ray"></el-button>
		</el-row>
	</div>
</template>
<script>
const utils = require("../assets/utils/index");
const ipfsClient = require("ipfs-http-client");
const platform = require("../assets/utils/platform");
const cp = require("child_process");
const { remote } = window.require("electron");
const path = require("path");
const appRoot = window.require("app-root-dir").get();
const {ipcRenderer} = window.require('electron');
require("element-ui");

export default {
	mounted() {
		//this.connectServer();
	},
	data() {
		return {
			ipfsPeerInfo: {
				msg: "",
				status: false
			},
			config: {},
			localAddrs: {}
		};
	},
	methods: {
		startV2ray() {
			let result = ipcRenderer.sendSync("startV2ray");
			this.$notify({
				title: '成功',
				message: 'V2Ray客户端已启动',
				type: 'success'
			});
		},

		stopV2ray(){
			let result = ipcRenderer.sendSync("stopV2ray");
			this.$notify.error({
				title: '停止',
				message: 'V2Ray客户端已停止',
			});
		}
	}
};
</script>
<style>
.status-vue .mysize{
	padding: 10px!important;
}
.status-vue .el-icon-video-pause{
	font-size: 60px;
}
.status-vue .el-icon-video-play{
	font-size: 60px;
}
</style>
