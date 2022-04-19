import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';
// Vue.use(ElementUI)
const size = localStorage.getItem('eleSize') ? localStorage.getItem('eleSize') : 'medium'
console.log(size);
Vue.use(Element, { size });
	// medium / small / mini