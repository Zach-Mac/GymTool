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
