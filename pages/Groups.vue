<script setup>
import draggable from 'vuedraggable'
import { useStorage } from 'vue3-storage'
const storage = useStorage()

const musclesListDefault = [
	'Front Delts',
	'Rear Delts',
	'Triceps',
	'Biceps',
	'Chest',
	'Abs',
	'Legs'
]
// const musclesDefault = Object.fromEntries(
// 	musclesListDefault.map((m, index) => [
// 		m,
// 		{ days: [], setsPerDay: '0', index: index }
// 	])
// )
const musclesDefault = Object.fromEntries({
	'Front Delts': {
		days: ['Monday', 'Thursday', 'Saturday'],
		setsPerDay: '4',
		index: 1
	},
	'Rear Delts': {
		days: ['Monday', 'Thursday', 'Saturday'],
		setsPerDay: '4',
		index: 3
	},
	Chest: {
		days: ['Tuesday', 'Friday', 'Sunday'],
		setsPerDay: '2',
		index: 6
	},
	Lats: {
		days: [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday'
		],
		setsPerDay: '1',
		index: 0
	},
	'Lat Delts': {
		days: ['Monday', 'Thursday', 'Saturday'],
		setsPerDay: '4',
		index: 2
	},
	Quads: { days: ['Wednesday', 'Sunday'], setsPerDay: '8', index: 10 },
	Hams: { days: ['Wednesday', 'Sunday'], setsPerDay: '4', index: 11 },
	Forearms: { days: ['Wednesday', 'Sunday'], setsPerDay: '5', index: 12 },
	Traps: {
		days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
		setsPerDay: '4',
		index: 4
	},
	Shins: { days: ['Wednesday', 'Sunday'], setsPerDay: '3', index: 13 },
	Calves: { days: ['Monday', 'Thursday'], setsPerDay: '4', index: 5 },
	'Up Tris': { days: ['Tuesday', 'Friday'], setsPerDay: '4', index: 8 },
	'Down Tris': { days: ['Tuesday', 'Friday'], setsPerDay: '4', index: 9 },
	Jump: { days: ['Tuesday', 'Friday'], setsPerDay: '5', index: 15 },
	'Up Chest': { days: ['Tuesday', 'Friday'], setsPerDay: '4', index: 7 },
	Neck: { days: ['Friday'], setsPerDay: '3', index: 14 }
})

const muscles = reactive(storage.getStorageSync('muscles') || musclesDefault)
console.log('muscles', toRaw(muscles))

let mL = new Array(Object.keys(muscles).length)
for (let name of Object.keys(muscles)) {
	console.log(name)
	mL[muscles[name].index] = name
}

const musclesList = ref(mL)
console.log('ml', toRaw(musclesList.value))

watch(muscles, () => {
	storage.setStorageSync('muscles', toRaw(muscles))
})

watch(musclesList, () => {
	console.log('mList watch', toRaw(musclesList.value))

	for (let i = 0; i < musclesList.value.length; i++) {
		console.log(
			musclesList.value[i],
			muscles[musclesList.value[i]].index,
			i
		)
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
	<Page>
		<div style="overflow-x: auto">
			<table ref="table" @mousemove="onTable">
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
	</Page>
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
