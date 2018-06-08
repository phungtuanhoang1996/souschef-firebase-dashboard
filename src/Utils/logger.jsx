const logger = (tag, object) => {
	console.log('-----------------------')
	console.log(tag)
	if (object) console.log(object)
	console.log('-----------------------')
}

export default logger