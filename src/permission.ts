import router from './router/index'
// import store from './store/index'
// import { storage } from '@/utils/utils'

router.beforeEach((to, from, next) => {
    next()
    // const token = store.getters.token || storage.sGet('token')
    // const addRouters = store.getters.addRouters
    // if (to.name !== 'Login' && !token) {
    //     next({ name: 'Login' })
    // } else {
    //     if (addRouters.length || to.name) {
    //         store.dispatch("SetBreadcrumbList", [to.name]);
    //         store.dispatch("SetMenuSelectedKeys", [to.path]);
    //         next()
    //     } else {
    //         store.dispatch('QueryMenus').then(() => {
    //             next({ ...to, replace: true })
    //         }, (err) => {
    //             next()
    //         })
    //     }
    // }
})