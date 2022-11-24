<script setup>
import { onMounted } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const GOOD = 'good'

const supabaseGetError = ref(null)
const muscles = ref(EMPTY_MUSCLES)
const loaded = ref(false)

const router = useIonRouter()

if (!user.value) {
	router.push('/')
	loaded.value = true
}

watch(muscles, () => {
	console.log('muscles', muscles.value)
})

onMounted(async () => {
	const { data, error } = await supabase
		.from('muscle_group_schedules')
		.select('data')
		.match({ user_id: user.value.id })

	if (error) {
		supabaseGetError.value = error
		console.error('error', error)

		muscles.value = musclesDefault
	} else if (data.length && data[0].data) {
		console.log('data', data[0].data)
		supabaseGetError.value = GOOD
		muscles.value = data[0].data
	} else {
		muscles.value = musclesDefault
	}

	loaded.value = true
})
</script>

<template>
	<Page>
		<ion-toast
			:isOpen="supabaseGetError"
			message="Error getting data from database. Using default settings. Error: {{ supabaseGetError }}"
			duration="2000"
			position="middle"
		/>
		<ion-toast
			:isOpen="supabaseGetError == GOOD"
			message="Getting saved data from database"
			duration="1000"
			position="middle"
		/>
		<ion-loading :isOpen="!loaded" message="Loading..." />
		<GroupsTable v-if="loaded" :muscles="muscles" />
	</Page>
</template>
