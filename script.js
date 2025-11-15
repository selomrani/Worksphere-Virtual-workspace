async function fetchjson(file) {
        let response = await fetch(file)
        let data = await response.json()
}
fetchjson("data.json")