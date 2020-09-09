<template>
	<div class="setting-vue">
		<el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
			<el-form-item label="活动名称">
				<el-input v-model="sizeForm.name"></el-input>
			</el-form-item>
			<el-form-item label="活动区域">
				<el-select v-model="sizeForm.region" placeholder="请选择活动区域">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动时间">
				<el-col :span="11">
					<el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
					<el-time-picker placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"></el-time-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="活动性质">
				<el-checkbox-group v-model="sizeForm.type">
					<el-checkbox-button label="美食/餐厅线上活动" name="type"></el-checkbox-button>
					<el-checkbox-button label="地推活动" name="type"></el-checkbox-button>
					<el-checkbox-button label="线下主题活动" name="type"></el-checkbox-button>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="特殊资源">
				<el-radio-group v-model="sizeForm.resource" size="medium">
					<el-radio border label="线上品牌商赞助"></el-radio>
					<el-radio border label="线下场地免费"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item size="large">
				<el-button type="primary" @click="onSubmit">参数设置</el-button>
				<el-button @click="onCancle">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
const axios = require("axios");
const api = require("../assets/utils/api");
const utils = require("../assets/utils/index");
const BufferList = require("bufferlist").BufferList;
const { remote } = window.require("electron");
export default {
	name: "Setting",
	data() {
		return {
			sizeForm: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			}
		};
	},
	mounted() {

	},
	methods: {
		onSubmit() {
			this.$notify({
						title: '成功',
						message: 'V2Ray客户端参数已设置',
						type: 'success'
					}
			);
		},
		onCancle(){
			this.sizeForm.date1="";
			this.sizeForm.date2="";
			this.sizeForm.name="";
			this.sizeForm.desc="";
			this.sizeForm.resource="";
			this.sizeForm.region="";
			this.sizeForm.delivery=false;
			this.sizeForm.type=[];
			this.$notify.error({
				title:'注意',
				message: 'V2Ray已重置',
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
