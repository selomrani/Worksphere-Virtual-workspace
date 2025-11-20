let staff = []
const roomOccupationMap = {
  'conferenceroom': 'manager',
  'reception': 'receptionist',
  'serversroom': 'IT guy',
  'securityroom': 'security officer',
  'staff': 'Cleaning staff',
  'vault': 'security officer'
};

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

function addnewstaff(){
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
      img: img,
      occupation: occupation,
    };
    staff.push(newstaff);
    renderminicards()
    storeStaffDataToLocalStorage()
  } else {
    alert("Plese enter valid infos");
  }
  

})};
addnewstaff()
function storeStaffDataToLocalStorage() {
  const staffLocal = JSON.stringify(staff);
  localStorage.setItem("staffData", staffLocal);

}
function getDataFromLocalStorage() {
  const staffLocal = localStorage.getItem("staffData");
  if (staffLocal) {
    const storedStaff = JSON.parse(staffLocal);
    staff = storedStaff;
    renderminicards();
  }
}

function renderminicards() {
  const minicardsrender = document.getElementById("minicardsrender");
  minicardsrender.innerHTML = "";
  staff.forEach(staffMember => {
    const cardyy = document.createElement("div");
    cardyy.innerHTML = `<div class="card my-3">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <img src="assets/imgs/user-solid-full.svg" class="rounded-circle me-3"
                                    alt="Profile Picture" style="width: 60px; height: 60px;">
                                <div>
                                    <h6 class="card-title mb-0">${staffMember.fname} ${staffMember.lname}</h6>
                                    <p class="card-text text-muted mb-0">${staffMember.email}</p>
                                </div>
                                <div class="ms-auto d-flex flex-column gap-1">
                                    <button type="button" class="deletebtn btn btn-danger btn-sm" ><i class="bi bi-trash"></i></button>
                                    <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal"
                                        data-bs-target="#modify" aria-label="Edit">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`
    minicardsrender.appendChild(cardyy)
  })
};

function renderStaffListToModal(occupationType) {
  const stafflist = document.getElementById('stafflist');
  const modalTitle = document.getElementById('addtoroomLabel');
  if (modalTitle) {
    modalTitle.textContent = `Available staff`;
  }

  stafflist.innerHTML = '';

  const unassignedStaff = staff.filter(staffMember => staffMember.occupation === occupationType);

  if (unassignedStaff.length === 0) {
    stafflist.innerHTML = `<p class="text-center text-muted">No unassigned ${occupationType} staff available.</p>`;
    return;
  }
  unassignedStaff.forEach(staffMember => {
    const profile = document.createElement('div');
    profile.innerHTML = `
      <div class="card my-3">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <img src="assets/imgs/user-solid-full.svg" class="rounded-circle me-3" alt="Profile Picture" style="width: 60px; height: 60px;">
            <div>
              <h6 class="card-title mb-0">${staffMember.fname} ${staffMember.lname}</h6>
              <p class="card-text text-muted mb-0">${staffMember.email}</p>
            </div>
            <div class="ms-auto d-flex flex-column gap-1">
              <button type="button" class="btn btn-success btn-sm"><i class="bi bi-plus-circle"></i></button>
              <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#modify" aria-label="Edit"><i class="bi bi-pencil-square"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
    stafflist.appendChild(profile);
  });
}

const addStaffButtons = document.querySelectorAll(".add-staff-btn");

addStaffButtons.forEach(button => {
  button.addEventListener('click', function () {
    const roomId = this.getAttribute('data-room-id');
    const requiredOccupation = roomOccupationMap[roomId];
    if (requiredOccupation) {
      renderStaffListToModal(requiredOccupation);
    } else {
      console.log("No room with such id was found")
    }
  });
});
getDataFromLocalStorage()


