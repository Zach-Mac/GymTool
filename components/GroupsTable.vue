<script setup>
import draggable from 'vuedraggable'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const props = defineProps({
	muscles: {
		type: Object,
		required: true
	},
	loaded: {
		type: Boolean,
		required: true
	}
})

console.log('load table', props.loaded)

const loaded = computed(() => props.loaded)

const muscles = reactive(props.muscles)
watch(muscles, async () => {
	const { data, error } = await supabase
		.from('muscle_group_schedules')
		.upsert({
			user_id: user.value.id,
			data: muscles,
			name: 'testname'
		})

	if (error) {
		console.log('supabase post error', error)
	} else {
		console.log('supabase post data', data)
	}
})

let mL = new Array(Object.keys(muscles).length)
for (let name of Object.keys(muscles)) {
	mL[muscles[name].index] = name
}

const musclesList = ref(mL)
watch(musclesList, () => {
	for (let i = 0; i < musclesList.value.length; i++) {
		muscles[musclesList.value[i]].index = i
	}
})

const musclesComputed = computed(() => {
	let obj = Object.fromEntries(
		musclesList.value.map(m => [
			m,
			{
				setsPerWeek: parseInt(muscles[m].setsPerDay)
					? parseInt(muscles[m].setsPerDay) * muscles[m].days.length
					: 0
			}
		])
	)
	return obj
})

const totalSetsPerDay = day => {
	let total = 0
	for (let m of Object.keys(muscles)) {
		if (muscles[m].days.includes(day)) {
			total += parseInt(muscles[m].setsPerDay)
		}
	}
	return total
}

const newMuscle = ref('')
function addMuscle() {
	if (newMuscle.value) {
		const newIndex = musclesList.value.length
		muscles[newMuscle.value] = {
			days: [],
			setsPerDay: '0',
			index: newIndex
		}
		musclesList.value.push(newMuscle.value)
		newMuscle.value = ''
	}
}
function deleteMuscle(m) {
	delete muscles[m]
	musclesList.value = musclesList.value.filter(muscle => muscle !== m)
}

function toggleDay(m, day) {
	let index
	if ((index = muscles[m].days.indexOf(day)) >= 0)
		muscles[m].days.splice(index, 1)
	else muscles[m].days.push(day)
}

function getDay(m, day) {
	if (muscles[m].days.includes(day)) {
		// return tableOverflowing ? m[0] : m
		return m
	}
	return '-'
}

const mondayStyle = day =>
	day == 'Monday' ? 'border-left: 1px solid black' : ''

const TABLE_WIDTH = 995

function isOverflowing(el) {
	return el.scrollWidth <= TABLE_WIDTH
}

const table = ref(null)
const tableOverflowing = ref(false)

function onTable(e) {
	tableOverflowing.value = isOverflowing(table.value)
}

const daysLabel = day => (tableOverflowing ? day[0] : day)
const groupLabel = computed(() => (tableOverflowing ? 'G' : 'Group'))
const setsPerDayLabel = computed(() => (tableOverflowing ? 'S/D' : 'Sets/Day'))
const setsPerWeekLabel = computed(() =>
	tableOverflowing ? 'S/W' : 'Sets/Week'
)
</script>

<template>
	<div style="overflow-x: auto">
		<table v-if="loaded" ref="table" @mousemove="onTable">
			<tr>
				<th v-for="day in DAYS_OF_WEEK" :style="mondayStyle(day)">
					{{ daysLabel(day) }}
				</th>
				<th class="spacer"></th>
				<th>{{ 'Group' }}</th>
				<th>{{ setsPerDayLabel }}</th>
				<th>{{ setsPerWeekLabel }}</th>
			</tr>
			<draggable v-model="musclesList" tag="tbody" item-key="name">
				<template #item="{ element }">
					<tr>
						<td
							class="day"
							v-for="day in DAYS_OF_WEEK"
							:style="mondayStyle(day)"
						>
							<ion-button
								expand="full"
								color="dark"
								fill="clear"
								@click="toggleDay(element, day)"
							>
								{{
									tableOverflowing
										? getDay(element, day)[0]
										: getDay(element, day)
								}}
							</ion-button>
						</td>
						<td class="spacer"></td>
						<td>{{ element }}</td>
						<td>
							<ion-input
								type="text"
								size="1"
								v-model="muscles[element].setsPerDay"
							/>
						</td>
						<td>
							{{ musclesComputed[element].setsPerWeek }}
						</td>
						<td class="delete">
							<ion-button
								color="danger"
								@click="deleteMuscle(element)"
								>X</ion-button
							>
						</td>
					</tr>
				</template>
			</draggable>
			<tr>
				<td v-for="day in DAYS_OF_WEEK" :style="mondayStyle(day)">
					Total Sets: {{ totalSetsPerDay(day) }}
				</td>
				<td class="spacer"></td>
				<td>
					<ion-item fill="outline">
						<ion-label position="floating">Add</ion-label>
						<ion-input
							@keydown.enter="addMuscle()"
							type="text"
							size="10"
							v-model="newMuscle"
						/>
					</ion-item>
				</td>
			</tr>
		</table>
	</div>
</template>

<style scoped>
.cell-class {
	border-color: black;
	border-width: 0.01em;
	border-style: solid;
	margin-bottom: -1px;
	background-color: lightgrey;
}
/* style the table with big font and borders between columns and rows and add colours */
table {
	font-size: 1em;
	/* border-collapse: collapse; */
	table-layout: auto;
	width: 100%;
}
th,
td {
	padding: 0.3em;
	border-top: 1px solid black;
	border-right: 1px solid black;
	border-bottom: 1px solid black;
	text-align: center;
}

.blank {
	padding: 0.3em;
	border-top: 0px solid black;
	border-right: 0px solid black;
	border-bottom: 0px solid black;
	text-align: center;
}

.day {
	padding: 0;
}
.spacer {
	border-top: none;
	border-bottom: none;
}
</style>
