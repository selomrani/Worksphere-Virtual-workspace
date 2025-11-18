let staff = [];

// function getstafffromlocalstorage() {
// //   const localStaff = localStorage.getItem("staff");
// //   if (localStaff) {
// //     staff = JSON.parse(localStaff);
// //   }
// // }
// // getstafffromlocalstorage();

// function addstafftolocalstorage() {
//   localStorage.setItem("staff", JSON.stringify(staff));
// }

async function fetchjson(file) {
  let response = await fetch(file);
  let data = await response.json();
  if (staff.length === 0) {
    staff = data;
  }
}
fetchjson("data.json");


function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const addform = document.getElementById("addform");

addform.addEventListener("submit", (event) => {
  event.preventDefault();
  const fname = document.getElementById("fname-add").value;
  const lname = document.getElementById("lname-add").value;
  const email = document.getElementById("emailadd").value;
  const phone = document.getElementById("phone-add").value;
  const img = document.getElementById("photo-add").value;
  const occupation = document.getElementById("occupation-add").value;
  if (isValidEmail(email)) {
    const newstaff = {
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      img: img || "assets/img/user-solid-full.svg", 
      occupation: occupation,
    };
    staff.push(newstaff);
    console.log(staff);
    renderminicards();
    addstafftolocalstorage();
  } else {
    alert("Plese enter valid infos");
  }
});

const minicardsrender = document.getElementById("minicardsrender");

function renderminicards(){
  minicardsrender.innerHTML="";
  staff.forEach((staffMember, index)=>{
    const imgPath = staffMember.img && staffMember.img !== "" ? staffMember.img : "assets/img/user-solid-full.svg";
    
    const cardyy = document.createElement("div");
    cardyy.innerHTML=`<div class="card my-3">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <img src="${imgPath}" class="rounded-circle me-3"
                                    alt="Profile Picture" style="width: 60px; height: 60px;">
                                <div>
                                    <h6 class="card-title mb-0">${staffMember.fname} ${staffMember.lname}</h6>
                                    <p class="card-text text-muted mb-0">${staffMember.email}</p>
                                </div>
                                <div class="ms-auto d-flex flex-column gap-1">
                                    <button type="button" class="btn btn-danger btn-sm" data-staff-index="${index}"><i class="bi bi-trash"></i></button>
                                    <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal"
                                        data-bs-target="#modify" aria-label="Edit" data-staff-index="${index}">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`
                        minicardsrender.appendChild(cardyy);
  })
};