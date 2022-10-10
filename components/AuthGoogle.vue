<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const done = ref(false)

const handleLogin = async () => {
	try {
		console.log('Attempting to log in with Google')
		loading.value = true
		const { error } = await supabase.auth.signIn(
			{ provider: 'google' },
			{ redirectTo: window.location.origin }
		)
		if (error) throw error
		done.value = true
	} catch (error) {
		console.log('Error logging in with Google', error)
		alert(error.error_description || error.message)
	} finally {
		console.log('Finally logging in with Google')
		loading.value = false
	}
}
</script>

<template>
	<ion-button @click="handleLogin" :disabled="loading">
		{{ loading ? 'Loading' : 'Sign in with google' }}
	</ion-button>
	<!-- <ion-toast
		:isOpen="done"
		@idDismiss="() => (done = false)"
		message="Check your email for the login link!"
		duration="2000"
		position="middle"
	/> -->
</template>

<style scoped>
ion-item {
	max-width: 30em !important;
	/* align center */
	margin: 0 auto;
}
</style>
