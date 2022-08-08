<script setup>
const pages = [
	{
		name: 'Home',
		path: '/'
	},
	{
		name: 'Muscle Groups',
		path: '/groups'
	}
]

provide('pages', pages)
</script>

<template>
	<ion-app>
		<Header title="Gym Tool" :pages="pages" />
		<ion-content>
			<ion-router-outlet></ion-router-outlet>
		</ion-content>
	</ion-app>
</template>
