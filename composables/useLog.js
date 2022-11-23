export default function (name, ...refs) {
	const rawRefs = refs.map(ref => {
		if (ref) return unref(ref)
	})
	console.log(name, ...rawRefs)

	watch(refs, () => {
		const rawRefs = refs.map(ref => {
			if (ref) return unref(ref)
		})
		console.log(name, ...rawRefs)
	})
}

// const refVar = useLog(ref('whatever'))
// const refVar2 = useLog()
//

// function log(variable) {
// 	console.log(JSON.stringify(variable))
// }

// export default log

// console.log('-------------------------- TESTING LOG --------------------------')

// const asdf = 10
// const string2 = 'asdfstridfg'
// // log(asdf, 12, 'string', asdf, string2)
// log({ asdf, string2 })
