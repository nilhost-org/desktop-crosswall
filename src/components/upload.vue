<template>
	<div class="upload-vue">
		<p class="ipfs-msg">Upload</p>
		<!-- <p class="ipfs-msg">{{ ipfsPeerInfo.msg }}</p> -->
		<div v-show="ipfsPeerInfo.status">
			<el-upload
				class="upload-pannel"
				drag
				:limit="1"
				:multiple="false"
				action="#"
				:auto-upload="false"
				:on-change="handleChange"
				:on-remove="removeFile"
			>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">Drag your File Here or Click</div>
			</el-upload>
			<div class="option-item">
				<span class="warning">
					Due to the network performance of ipfs, after uploading the file, it may take a while to download
				</span>
			</div>
			<div class="option-item">
				<span>
					Encryption:
				</span>
				<div class="option-item-input">
					<el-input class="" type="password" v-model="encryptPassword" placeholder="password (optional)"></el-input>
				</div>
				<el-button type="primary" @click="addToIpfs">Upload</el-button>
			</div>
			<div class="file-tree">
				<div class="file-meta" v-for="file in filesTree" :key="file.cid.string">
					<div>
						<p>{{ file.name }}</p>
						<span>{{ file.cid.string }}</span>
					</div>
					<i class="el-icon-share clipboard" @click="clipboard(file.cid.string, file.name)"></i>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
const axios = require("axios");
const api = require("../assets/utils/api");
const utils = require("../assets/utils/index");
const ipfsClient = require("ipfs-http-client");
const BufferList = require("bufferlist").BufferList;
const { remote } = window.require("electron");
export default {
	name: "Upload",
	data() {
		return {
			config: {},
			ipfsPeerInfo: {
				msg: "Connecting. . .",
				status: false,
				ipfs: null,
				localAddrs: {} // your node peer addr
			},
			fileInfo_to_be_Upload: {
				raw: null
			},
			filesTree: [], // the files you has been upload
			encryptPassword: ""
		};
	},
	mounted() {
		this.connectServer();
	},
	methods: {
		async connectServer() {
			var ipfs = ipfsClient(remote.getGlobal("IPFS_API"));
			try {
				var config = await ipfs.config.get();
				this.config = config;
				this.ipfs = ipfs;
				window.ipfs = ipfs; // TODO
				const localAddrs = await ipfs.swarm.localAddrs();
				this.ipfsPeerInfo.localAddrs = localAddrs[0].toString() + `/p2p/${this.config.Identity.PeerID}`;
				this.ipfsPeerInfo.status = true;
				this.ipfsPeerInfo.msg = "Connected to IPFS";
				this.updateFileTree();
			} catch (error) {
				console.log(error);
				this.ipfsPeerInfo.msg = "Connect Failed";
			}
		},

		async updateFileTree() {
			const tree = [];
			for await (const file of ipfs.files.ls("/")) {
				console.log(file);
				tree.push(file);
			}
			this.filesTree = tree;
		},

		async handleChange(e) {
			console.log(e);
			const buffer = await e.raw.arrayBuffer();
			this.fileInfo_to_be_Upload.raw = buffer;
			this.fileInfo_to_be_Upload.name = e.name;
		},

		removeFile() {
			this.fileInfo_to_be_Upload.raw = null;
		},

		clipboard(cid, name) {
			navigator.clipboard.writeText(`https://ipfs.io/ipfs/${cid}?filename=${name}`).then(
				() => {
					this.$message({
						type: "success",
						message: "copy file link successful"
					});
				},
				() => {
					this.$message.error("clipboard write failed");
				}
			);
		},

		async addToIpfs() {
			if (!this.fileInfo_to_be_Upload.raw) {
				this.$message.error('please select file to upload')
				return;
			}
			let fileRaw = this.fileInfo_to_be_Upload.raw;
			if (this.encryptPassword.trim()) {
				fileRaw = await this.$browserAesEncrypt(fileRaw, this.encryptPassword.trim());
			}
			try {
				await this.writeFile(`/${this.fileInfo_to_be_Upload.name}`, fileRaw);
				for await (const file of ipfs.files.ls(`/${this.fileInfo_to_be_Upload.name}`)) {
					console.log(file);
					this.updateFileTree();
					this.recordComplete(file.cid.string, this.ipfsPeerInfo.localAddrs);
					this.fileInfo_to_be_Upload.raw = null;
					this.fileInfo_to_be_Upload.name = "";
				}
			} catch (error) {}
		},

		async writeFile(path, content) {
			try {
				await this.ipfs.files.write(path, content, { create: true });
			} catch (error) {
				console.log(error);
				this.$message.error("write error");
			}
		},

		/**
		 *  @param {string} filehash
		 *  @param {string} peerID  Your ipfs server node. eg: /ip4/123.112.109.159/tcp/1076/p2p/QmVt9fusMLg5UpBoaGpwMNZHyrHS4zws7DYN6ZcRFbmqBC
		 */

		recordComplete(hash, peer) {
			axios
				.post(api.completeTorrent, { hash, peer }, { timeout: 10000 })
				.then(res => {
					console.log("res is");
					console.log(res);
					if (res.data.error === 0) {
						this.$message({
							type: "success",
							message: "upload successed"
						});
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
<style lang="scss">
.warning {
	font-size: 12px;
	color: grey;
}
.file-tree {
	width: 100%;
	.file-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 15px 0;
		& > div {
			text-align: left;
			span {
				color: grey;
				font-size: 12px;
				font-style: italic;
			}
		}
		.clipboard {
			font-size: 24px;
			cursor: pointer;
			&:hover {
				color: grey;
			}
		}
	}
}
</style>
