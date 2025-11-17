async function fetchjson(file) {
        let response = await fetch(file)
        let data = await response.json()
        console.log(data)
}
fetchjson("data.json")

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
// let email ="elomranisoufyan@gmail.com"

const addform = document.forms
const addBtnsave = document.getElementById("addBtnsave")
addform.addEventListener("submit" ,function(e){
  e.preventDefault()
  let emailtest = getElementById("emailadd").value;
  console.log(isValidEmail(emailtest))
})