<template>
	<div class="decrypt-vue">
		<p class="ipfs-msg">Decrypt</p>
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
			<i class="el-icon-unlock"></i>
			<div class="el-upload__text">Drag your File Here or Click</div>
		</el-upload>
		<div class="option-item">
			<span>
				Decrypt Password:
			</span>
			<div class="option-item-input">
				<el-input class="" type="password" v-model="decryptPassword" placeholder="password"></el-input>
			</div>
			<el-button type="primary" @click="toDecrypt">Decrypt</el-button>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			fileName: "",
			fileInfo_to_be_Decrypt: null,
			decryptPassword: ""
		};
	},
	methods: {
		async handleChange(e) {
			console.log(e);
			this.fileName = e.name;
			const buffer = await e.raw.arrayBuffer();
			this.fileInfo_to_be_Decrypt = buffer;
			// this.browserAesEncrypt(buffer, "123456")
		},
		removeFile() {
			this.fileInfo_to_be_Decrypt = null;
		},
		async toDecrypt() {
			if (!this.fileInfo_to_be_Decrypt || !this.decryptPassword.trim()){
				this.$message.error('Please upload the file and fill password')
				return
			};
			const DecryptedFile = await this.$browserAesDecrypt(this.fileInfo_to_be_Decrypt, this.decryptPassword);
			if (!DecryptedFile) {
				this.$message.error("decrypted failed");
				return;
			}
			const blob = new Blob([DecryptedFile]);
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = `_deceypted_${this.fileName}`;
			link.click();
		}
	}
};
</script>
