// 路由文件

import VueRouter from "vue-router";
import InputPart from '../pages/InputPart'
import RecogPart from '../pages/RecogPart'

//创建router实例对象
const router = new VueRouter({
	routes:[
		{
			path:'/input',
			component: InputPart
		},
		{
			path:'/recog',
			component: RecogPart
		}
	]
})

export default router
