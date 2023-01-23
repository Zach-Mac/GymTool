<script setup>
const loading = ref(false)
const done = ref(false)

async function logout() {
	try {
		console.log('Attempting to logout')
		loading.value = true
		const { error } = await supabase.auth.signOut()
		if (error) throw error
		done.value = true
	} catch (error) {
		console.log('Error logging out', error)
		alert(error.error_description || error.message)
	} finally {
		console.log('Finally logging out')
		loading.value = false
	}
}
</script>

<template>
	<h1 class="header">Logout of Gym Tool</h1>
	<ion-button @click="logout" :disabled="loading">
		{{ loading ? 'Loading' : 'Log Out' }}
	</ion-button>
</template>
