export default function (name, ...refs) {
	console.log(
		name,
		refs.map(ref => toRaw(ref))
	)
	refs.forEach(ref => {
		watch(ref, () => {
			console.log(name, toRaw(ref))
		})
	})
}
