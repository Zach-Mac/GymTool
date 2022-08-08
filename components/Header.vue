<script setup>
const props = defineProps({
	title: {
		type: String,
		required: true
	},
	subtitle: {
		type: String,
		default: ''
	},
	pages: {
		type: Array
	}
})
const router = useIonRouter()

const subtitle = ref(props.subtitle)

const onNavClick = (page, newSubtitle) => {
	router.push(page)
	subtitle.value = newSubtitle
}
</script>

<template>
	<ion-header>
		<ion-toolbar>
			<ion-title size="large">{{ title }}</ion-title>
			<ion-buttons slot="secondary">
				<ion-back-button></ion-back-button>
				<ion-button
					v-for="page in pages"
					@click="onNavClick(page.path, page.name)"
					>{{ page.name }}</ion-button
				>
			</ion-buttons>
		</ion-toolbar>
		<ion-toolbar v-if="subtitle">
			<ion-title size="large" class="ion-text-center">{{
				subtitle
			}}</ion-title>
		</ion-toolbar>
	</ion-header>
</template>

<style scoped>
/* bold title */
ion-title {
	font-weight: bold !important;
	font-size: 2rem;
}

ion-button {
	font-size: 1.5rem;
}
</style>
