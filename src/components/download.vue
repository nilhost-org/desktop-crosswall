<template>
	<div class="download-vue">
		<p class="ipfs-msg">Download</p>
		<!-- <p class="ipfs-msg">{{ ipfsPeerInfo.msg }}</p> -->
		<div v-show="ipfsPeerInfo.status">
			<el-input v-model="downloadHashInput" placeholder="QmHash">
				<el-button slot="append" @click="getFileByHash">Get</el-button>
			</el-input>
			<ul>
				<li v-for="file in directoryTree" :key="file.path">
					<a :href="downloadLinkFormat + '' + file.path" :download="file.path" target="_blank">
						{{ file.path }}
					</a>
				</li>
				<pre>
          <code>
            Gateway: {{ gatewayUrl }}
            <!-- downloadLinkFormat : {{downloadLinkFormat}} -->
          </code>
				</pre>
			</ul>
		</div>
	</div>
</template>
<script>
import { log } from "util";
const axios = require("axios");
const api = require("../assets/utils/api");
const utils = require("../assets/utils/index");
const ipfsClient = require("ipfs-http-client");
const BufferList = require("bufferlist").BufferList;
const { remote } = window.require("electron");
export default {
	name: "Download",
	mounted() {
		this.connectServer();
	},
	data() {
		return {
			utils,
			config: {},
			ipfsPeerInfo: {
				msg: "Connecting. . .",
				status: false,
				localAddrs: "",
				ipfs: null
			},
			downloadLinkFormat: "",
			gatewayUrl: "",
			downloadHashInput: "",
			directoryTree: []
		};
	},
	methods: {
		async connectServer() {
			var ipfs = ipfsClient(remote.getGlobal("IPFS_API"));
			try {
				this.config = await ipfs.config.get();
				var addresses = await ipfs.config.get("Addresses");
				this.gatewayUrl = addresses.Gateway;
				this.setDownloadLinkFormat(this.gatewayUrl);
				this.ipfs = ipfs;
				const localAddrs = await ipfs.swarm.localAddrs();
				this.ipfsPeerInfo.localAddrs = localAddrs[0].toString() + `/p2p/${this.config.Identity.PeerID}`;
				this.ipfsPeerInfo.status = true;
				this.ipfsPeerInfo.msg = "Connected to IPFS";
			} catch (error) {
				console.log(error);
				this.ipfsPeerInfo.msg = "Connect Failed";
			}
		},
		setDownloadLinkFormat(gatewayUrl) {
			console.log("gatewatUrl is");
			console.log(gatewayUrl);
			var array = gatewayUrl
				.toString()
				.split("/")
				.slice(1);
			this.downloadLinkFormat = `http://${array[1]}:${array[3]}/ipfs/`;
		},
		async getFileByHash() {
			if (!this.downloadHashInput.trim()) {
				this.$message.error("please fill file cid(hash)");
				return;
			}
			this.directoryTree = [];
			for await (const file of this.ipfs.get(this.downloadHashInput)) {
				console.log("file is");
				console.log(file);
				if (!file.content) {
					continue;
				}
				this.directoryTree.push(file);
				this.recordComplete(this.downloadHashInput, this.ipfsPeerInfo.localAddrs);
			}
		},
		/* fetchFile(path) {
			axios.get(this.downloadLinkFormat + path, { responseType: "blob" }).then(res => {
				const blob = new window.Blob([res.data]);
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");

				document.body.appendChild(a);
				a.style = "display:none";
				a.href = url;
				a.download = "";
				a.click();

				window.URL.revokeObjectURL(url);
			});
		}, */
		recordComplete(hash, peer) {
			axios
				.post(api.completeTorrent, { hash, peer }, { timeout: 10000 })
				.then(res => {
					console.log("res is");
					console.log(res);
					if (res.data.error === 0) {
					} else {
						this.$message.error(res.data.desc);
					}
				})
				.catch(err => {
					this.$message.error("network error");
				});
		}
	}
};
</script>
