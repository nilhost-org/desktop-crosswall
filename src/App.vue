<template>
	<div id="app">
		<el-container>
			<el-aside width="200px" class="app-aside">
				<ul class="slidebar-ul">
					<li class="slidebar-li">
						<router-link to="/Status" active-class="active-nav"
							><i class="el-icon-monitor"></i> <span>Status</span></router-link
						>
					</li>
					<li class="slidebar-li">
						<router-link to="/Setting" active-class="active-nav"
							><i class="el-icon-setting"></i> <span>Setting</span></router-link
						>
					</li>
					<!--
					<li class="slidebar-li">
						<router-link to="/Download" active-class="active-nav"
							><i class="el-icon-download"> </i><span>Download</span></router-link
						>
					</li>
					<li class="slidebar-li">
						<router-link to="/Decrypt" active-class="active-nav"
							><i class="el-icon-unlock"></i> <span>Decrypt</span></router-link
						>
					</li>
					-->
				</ul>
			</el-aside>
			<el-main>
				<div class="main">
					<router-view></router-view>
				</div>
				<!-- <el-button type="primary" @click="createRepo">Start</el-button> -->
			</el-main>
		</el-container>
	</div>
</template>

<script>
export default {
	name: "App",
	data() {
		return {
			switchToggle: {
				EncryptPassword: false
			},
			fileToBeUpload: {}
		};
	},
	mounted() {},
	methods: {
		async createRepo() {
			const repoPath = "ipfsdemo";
			window.ipfs = await IPFS.create({ repo: repoPath });
			console.log("createRepo!!");
		}
	}
};
</script>

<style lang="scss">
body,
p,
div {
	margin: 0;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
.active-nav {
	background: hsla(0, 0%, 100%, 0.1);
}
.app-aside {
	min-height: 100vh;
	background-color: #0b3a53;
	.slidebar-ul {
		padding: 0;
		.slidebar-li {
			list-style: none;
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			[class^="el-icon"] {
				margin-right: 10px;
			}
			a {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				text-decoration: none;
				color: #fff;
			}
		}
	}
}
.main {
	width: 600px;
	margin: 0 auto;
	.ipfs-msg {
		font-family: "Montserrat", "Verdana", system-ui, sans-serif;
		margin: 20px 0;
		font-size: 30px;
	}
	.upload-pannel {
		.el-upload-dragger {
			width: 600px;
			.el-icon-unlock {
				font-size: 67px;
				color: #c0c4cc;
				margin: 40px 0 16px;
				line-height: 50px;
			}
		}
	}
	.option-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 10px auto;
		border-bottom: solid 1px;
		border-color: #ebeef5;
		padding-bottom: 10px;
		.option-title {
			display: inline-block;
			width: 120px;
			text-align: left;
		}
		.option-item-input {
			display: flex;
			justify-content: space-between;
			flex: 1;
			&.column {
				flex-direction: column;
			}
			.el-input {
				margin-right: 10px;
				input {
					width: 180px;
				}
			}
		}
		.meta {
			min-width: 100%;
			display: inline-block;
			color: white;
			padding: 2px 4px;
			font-size: 14px;
			background: #a1afc9;
			margin: 2px 0;
		}
	}
}
</style>
