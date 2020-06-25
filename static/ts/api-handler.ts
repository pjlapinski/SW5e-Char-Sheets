/**
 * Finds element of the specified json file data type that
 * matches the criteria given in filter. If no criteria are given, it returns
 * everything from that file
 */
async function apiFind(
  dataType: string,
  filter: { [name: string]: string }
): Promise<object> {
  let content = await fetch(`../static/json/${dataType}.json`).then(response =>
    response.json()
  )
  if (Object.keys(filter).length === 0)
    return await apiFind(dataType, { name: '' })
  let results = []
  for (let key in filter) {
    let value = filter[key]
    value = value.toLowerCase()
    for (let index in content) {
      let entry = content[index]
      if (entry[key].toLowerCase().includes(value)) results.push(entry)
    }
  }
  return results
}

/**
 * Finds element of the specified json file data type that
 * matches the criteria given in filter. If no criteria are given, it returns the first
 * element in that file. The values in kwargs have to match content of the element
 * EXACTLY for it to be returned.
 */
async function apiFindExactly(
  dataType: string,
  filter: { [name: string]: string }
): Promise<object> {
  let content = await fetch(`../static/json/${dataType}.json`).then(response =>
    response.json()
  )
  if (Object.keys(filter).length === 0) return content[0]
  let results = []
  for (let key in filter) {
    let value = filter[key]
    for (let index in content) {
      let entry = content[index]
      if (entry[key] === value) return entry
    }
  }
  return null
}
