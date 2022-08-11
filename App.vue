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
const title = 'Gym Tool'
</script>

<template>
	<AppStart :title="title" :pages="pages" />
</template>
