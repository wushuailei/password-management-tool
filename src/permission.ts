import router from './router/index'
import { computed } from 'vue'
import { useUserStore } from '@/store/user.ts'

router.beforeEach((to, _from, next) => {
    const userStore = useUserStore()
    const loginStatus = computed(() => userStore.loginStatus)
    if (to.name !== 'Login' && !loginStatus.value) {
        next({ name: 'Login' })
    }
    next()
})