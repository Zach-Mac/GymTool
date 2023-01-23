<script setup>
const router = useIonRouter()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
</script>
<template>
	<ion-toast
		:isOpen="done"
		message="Successfully logged out!"
		duration="2000"
		position="middle"
	/>
	<ion-page>
		<ion-content>
			<ion-row>
				<ion-col class="ion-text-center">
					<Login v-if="!user" />
					<Logout v-else />
				</ion-col>
			</ion-row>
		</ion-content>
	</ion-page>
</template>
