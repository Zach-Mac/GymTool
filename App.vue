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

const router = useRouter()

router.beforeEach((to, from, next) => {
	const user = useSupabaseUser()
	console.log('user', user.value)
	if (!user.value) {
		next('/')
	} else {
		next()
	}
})
</script>

<template>
	<AppStart :title="title" :pages="pages" />
</template>
