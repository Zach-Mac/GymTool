<script setup>
const router = useIonRouter()
const allPages = inject('pages')

const pages = allPages.slice(1)
</script>
<template>
	<ion-page>
		<ion-content>
			<ion-row class="ion-justify-content-center ion-padding ion-margin">
				<ion-button
					class="ion-padding ion-margin"
					v-for="page in pages"
					@click="router.push(page.path)"
					>{{ page.name }}</ion-button
				>
			</ion-row>
		</ion-content>
	</ion-page>
</template>
