<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const done = ref(false)
const email = ref('')

const handleLogin = async () => {
	try {
		loading.value = true
		const { error } = await supabase.auth.signIn({ email: email.value })
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
		<p class="description">Sign in via magic link with your email below</p>
		<ion-item fill="outline">
			<ion-label position="floating">Email</ion-label>
			<ion-input type="email" v-model="email" required />
		</ion-item>
		<ion-button type="submit" :disabled="loading">
			{{ loading ? 'Loading' : 'Send magic link' }}
		</ion-button>
	</form>
	<ion-toast
		:isOpen="done"
		@didDismiss="() => (done = false)"
		message="Check your email for the login link!"
		duration="2000"
		position="middle"
	/>
</template>

<style scoped>
ion-item {
	max-width: 30em !important;
	/* align center */
	margin: 0 auto;
}
</style>
