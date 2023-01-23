<script setup>
import { personCircle } from 'ionicons/icons'

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
</script>

<template>
	<ion-header>
		<ion-toolbar align-title="center">
			<ion-title :style="titleStyle" size="large">{{ title }}</ion-title>
			<ion-buttons slot="start">
				<!-- <ion-back-button default-href="#"></ion-back-button> -->
				<ion-menu-button auto-hide="false"></ion-menu-button>
			</ion-buttons>
			<ion-buttons slot="end">
				<ion-button @click="router.push('/profile')">
					<ion-icon slot="icon-only" :icon="personCircle"></ion-icon>
				</ion-button>
				<!-- TODO: if enough room -->
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
