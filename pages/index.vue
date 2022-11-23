<script setup>
import {
	Auth,
	SocialAuth,
	ThemeSupa,
	ThemeBold,
	ThemeMinimal,
	css
} from 'vue-auth-ui'

const router = useIonRouter()
const allPages = inject('pages')

const pages = allPages.slice(1)

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const appearance = {
	theme: ThemeSupa,
	style: {
		container: {
			alignItems: 'center'
		},
		button: {
			padding: '5px',
			paddingLeft: '3em',
			paddingRight: '3em',
			width: 'fit-content'
		}
	}
}

const loading = ref(false)
const done = ref(false)

const handleLogin = async provider => {
	try {
		console.log('Attempting to log in with Google')
		loading.value = true
		const { error } = await supabase.auth.signIn(
			{ provider: provider.provider },
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
	<ion-page>
		<ion-content>
			<ion-row v-if="!user">
				<ion-col class="ion-text-center">
					<h1 class="header">Please sign in to use Gym Tool</h1>
					<SocialAuth
						:providers="['google']"
						socialLayout="col"
						:appearance="appearance"
						:labels="{
							google: 'Sign in with Google'
						}"
						@signInWithOAuth="provider => handleLogin(provider)"
					/>
				</ion-col>
			</ion-row>
			<template v-else>
				<ion-row
					class="ion-justify-content-center ion-padding ion-margin"
				>
					<ion-button
						class="ion-padding ion-margin"
						v-for="page in pages"
						@click="router.push(page.path)"
						>{{ page.name }}</ion-button
					>
				</ion-row>
				<ion-row
					class="ion-justify-content-center ion-padding ion-margin"
				>
					<ion-button
						class="ion-padding ion-margin"
						@click="supabase.auth.signOut()"
						color="danger"
					>
						Sign Out
					</ion-button>
				</ion-row>
			</template>
		</ion-content>
	</ion-page>
</template>
