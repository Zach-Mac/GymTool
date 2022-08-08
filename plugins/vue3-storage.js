import Vue3Storage from 'vue3-storage'

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(Vue3Storage)
})
