<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const done = ref(false)

const handleLogin = async () => {
	try {
		loading.value = true
		const { error } = await supabase.auth.signIn(
			{ provider: 'google' },
			{ redirectTo: window.location.origin }
		)
		if (error) throw error
		done.value = true
	} catch (error) {
		alert(error.error_description || error.message)
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<form @submit.prevent="handleLogin">
		<h1 class="header">Please sign in to use Gym Tool</h1>
		<ion-button :disabled="loading">
			{{ loading ? 'Loading' : 'Sign in with google' }}
		</ion-button>
	</form>
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
