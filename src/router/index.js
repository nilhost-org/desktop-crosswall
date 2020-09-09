import Vue from "vue";
import VueRouter from "vue-router";
import Upload from "../components/upload.vue";
import Download from "../components/download.vue";
import Decrypt from "../components/decrypt.vue";
import Status from "../components/status.vue";
import Setting from "../components/setting.vue";
Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "",
		component: Status
	},
	{
		path: "/status",
		name: "Status",
		component: Status
	},
	{
		path: "/upload",
		name: "Upload",
		component: Upload
	},
	{
		path: "/download",
		name: "Download",
		component: Download
	},
	{
		path: "/decrypt",
		name: "Decrypt",
		component: Decrypt
	},
	{
		path: "/setting",
		name: "Setting",
		component: Setting
	},
];

const router = new VueRouter({
	mode: "hash",
	base: process.env.BASE_URL,
	routes
});

export default router;
