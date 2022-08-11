import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	ssr: false,
	modules: ['nuxt-ionic'],
	target: 'static',
	router: {
		base: '/GymTool/'
	},
	css: [
		'@ionic/core/css/core.css',
		'@ionic/core/css/normalize.css',
		'@ionic/core/css/structure.css',
		'@ionic/core/css/typography.css',
		'@ionic/core/css/ionic.bundle.css'
	],
	components: [
		{
			path: '@/components',
			pathPrefix: false
		}
	]
})
