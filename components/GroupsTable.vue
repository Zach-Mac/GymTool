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
console.log('load table', props.loaded, 'user', user.value)

const loaded = computed(() => props.loaded)

const muscles = reactive(props.muscles)
// update db on change
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
		return m
	}
	return '-'
}

const mondayStyle = day =>
	day == 'Monday' ? 'border-left: 1px solid black' : ''

const table = ref(null)
const { width: tableWidth, height: tableHeight } = useElementSize(table)
const { width: winWidth, height: winHeight } = useWindowSize()
useLog('winwidth, tableWidth', winWidth, tableWidth)

const SHRINK_ORDER = ['DAY', ['SD', 'SW'], 'MUSCLE', 'G']
const MAX_SHRINKAGE = SHRINK_ORDER.flat().length
// turn shrink order into object of index
const SHRINK = Object.freeze(
	Object.fromEntries(
		SHRINK_ORDER.map((val, i) =>
			Array.isArray(val) ? val.map((v, j) => [v, i + 1]) : [[val, i + 1]]
		).flat()
	)
)
const shrinkage = ref(0)

const lastWinWidthTableChange = ref(0)
watch([winWidth, tableWidth], () => {
	if (winWidth.value < tableWidth.value + 5) {
		// shorten table
		// if not max level, increase level
		console.log('shorten table')
		if (shrinkage.value < MAX_SHRINKAGE) {
			shrinkage.value++
		}
		lastWinWidthTableChange.value = winWidth.value
	} else {
		// lengthen table
		// if not winWidth == lastWinWidthTableChange, decrease level
		console.log('lengthen table')
		if (winWidth.value != lastWinWidthTableChange.value) {
			if (shrinkage.value > 0) {
				shrinkage.value--
			}
		}
	}
})

const daysLabel = day => (shrinkage.value >= SHRINK.DAY ? day[0] : day)
const muscleLabel = m =>
	shrinkage.value >= SHRINK.MUSCLE
		? m.split(' ').reduce((prev, curr) => prev + curr[0], '')
		: m
const setsPerDayLabel = computed(() =>
	shrinkage.value >= SHRINK.SD ? 'S/D' : 'Sets/Day'
)
const setsPerWeekLabel = computed(() =>
	shrinkage.value >= SHRINK.SW ? 'S/W' : 'Sets/Week'
)
const groupLabel = computed(() => (shrinkage.value >= SHRINK.G ? 'G' : 'Group'))
</script>

<template>
	<div style="overflow-x: auto">
		<table v-if="loaded" ref="table">
			<tr>
				<th v-for="day in DAYS_OF_WEEK" :style="mondayStyle(day)">
					{{ daysLabel(day) }}
				</th>
				<th class="spacer"></th>
				<th>{{ 'Group' }}</th>
				<th>{{ setsPerDayLabel }}</th>
				<th>{{ setsPerWeekLabel }}</th>
				<!-- <th>
					<ion-button @click="drag = !drag">
						<ion-icon :icon="ioniconsReorderFourOutline" />
					</ion-button>
				</th> -->
			</tr>
			<draggable
				v-model="musclesList"
				tag="tbody"
				item-key="name"
				handle=".handle"
			>
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
								{{ muscleLabel(getDay(element, day)) }}
							</ion-button>
						</td>
						<td class="spacer"></td>
						<td class="handle">{{ element }}</td>
						<td>
							<ion-item fill="outline" class="sd">
								<ion-input
									class="ion-no-padding"
									type="text"
									size="1"
									v-model="muscles[element].setsPerDay"
								/>
							</ion-item>
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
.sdInput {
	--padding-start: 0px;
	padding-right: 0px;
	--inner-padding-end: 0px;
	text-align: center;
	--keyboard-offset: 0px;
	--overflow: auto;
	--offset-top: 0px;
	--offset-bottom: 0px;
	border-collapse: collapse;
	border-spacing: 0;
	--border-radius: 0px;
	--border-style: solid;
	--padding-top: 0px;
	--padding-bottom: 0px;
	--padding-end: 0px;
	--inner-padding-top: 0px;
	--inner-padding-bottom: 0px;
	--inner-padding-start: 0px;
	--inner-box-shadow: none;
	--detail-icon-color: initial;
	--detail-icon-font-size: 20px;
	--detail-icon-opacity: 0.25;
	--color-activated: var(--color);
	--color-focused: var(--color);
	--color-hover: var(--color);
	-webkit-font-smoothing: antialiased;
	display: block;
	position: relative;
	justify-content: space-between;
	outline: none;
	color: var(--color);
	font-family: var(--ion-font-family, inherit);
	text-decoration: none;
	--min-height: 48px;
	--background: var(--ion-item-background, var(--ion-background-color, #fff));
	--background-activated: transparent;
	--background-activated-opacity: 0;
	--background-focused-opacity: 0.12;
	--background-hover-opacity: 0.04;
	--color: var(--ion-item-color, var(--ion-text-color, #000));
	--transition: opacity 15ms linear, background-color 15ms linear;
	--highlight-color-focused: var(--ion-color-primary, #3880ff);
	--highlight-color-valid: var(--ion-color-success, #2dd36f);
	--highlight-color-invalid: var(--ion-color-danger, #eb445a);
	font-size: 16px;
	font-weight: normal;
	text-transform: none;
	align-items: center;
	--highlight-height: 2px;
	--inner-border-width: 0;
	--show-full-highlight: 1;
	--show-inset-highlight: 0;
	--ripple-color: transparent;
	--background-focused: transparent;
	--background-hover: transparent;
	--border-color: var(--ion-color-step-500, gray);
	--border-width: 1px;
	border: none;
	overflow: visible;
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
}
</style>
