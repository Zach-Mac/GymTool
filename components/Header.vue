<script setup>
import { useRoute } from 'vue-router'

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	pages: {
		type: Array
	},
	titleStyle: {
		type: String,
		default: 'font-size: 2rem'
	},
	subtitleStyle: {
		type: String,
		default: 'font-size: 1.3rem'
	},
	buttonStyle: {
		type: String,
		default: ''
	}
})
const router = useIonRouter()
const vueRoute = useRoute()

const subtitle = computed(() => {
	const page = props.pages.find(p => p.path === vueRoute.path)
	return page ? page.name : ''
})
</script>

<template>
	<ion-header>
		<ion-toolbar>
			<ion-title :style="titleStyle" size="large">{{ title }}</ion-title>
			<ion-buttons slot="secondary">
				<ion-back-button></ion-back-button>
				<ion-button
					v-for="page in pages"
					:style="buttonStyle"
					@click="router.push(page.path)"
					>{{ page.name }}</ion-button
				>
			</ion-buttons>
		</ion-toolbar>
		<!-- <ion-toolbar v-if="subtitle">
			<ion-title
				:style="subtitleStyle"
				size="large"
				class="ion-text-center"
				>{{ subtitle }}</ion-title
			>
		</ion-toolbar> -->
	</ion-header>
</template>

<style scoped>
/* bold title */
ion-title {
	font-weight: bold !important;
}
</style>
