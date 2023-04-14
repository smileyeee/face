// 路由文件

import VueRouter from "vue-router";
import InputPart from '../pages/InputPart'
import RecogPart from '../pages/RecogPart'
import ComparePart from '../pages/ComparePart'

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
		},
		{
			path:'/compare',
			component: ComparePart
		},
		{
			path: '/', // 修改默认初始页面，重定向根路径为要默认显示的页面路径
			redirect: '/input' 
		}
	]
})

export default router
