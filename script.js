let staff = []
async function fetchjson(file) {
  let response = await fetch(file)
  let data = await response.json()
  console.log(data)
}
fetchjson("data.json")


function infosvalid(staff) {
  const regexemail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexphone = /^\d{10}$/;
  const regeximgurl = staff.img.startsWith("http://") || staff.img.startsWith("https://");
  const lengthname = staff.fname.length >= 3 && staff.lname.length >= 3;
  const regex = regexemail.test(staff.email) && regexphone.test(staff.phone) && regeximgurl && lengthname
  return regex
}


const addexperiences = document.getElementById("addexp")
const expfield = document.getElementById("expfield")
addexperiences.addEventListener("click", (e) => {
  expfield.innerHTML += `
  <label class="form-label">Company</label>
                        <input type="text" class="form-control exp-company">
                        <label  class="form-label">From </label>
                        <input type="date" class="form-control exp-from">
                        <label class="form-label">To</label>
                        <input type="date" class="form-control exp-to">`
})


function addnewstaff() {
  const addform = document.getElementById("addform");
  addform.addEventListener("submit", (event) => {
    event.preventDefault();
    const fname = document.getElementById("fname-add").value;
    const lname = document.getElementById("lname-add").value;
    const email = document.getElementById("emailadd").value;
    const phone = document.getElementById("phone-add").value;
    const img = document.getElementById("photo-add").value;
    const occupation = document.getElementById("occupation-add").value;

    const companyInputs = document.querySelectorAll(".exp-company");
    const fromInputs = document.querySelectorAll(".exp-from");
    const toInputs = document.querySelectorAll(".exp-to");
    const experiences = [];

    for (let i = 0; i < companyInputs.length; i++) {
      const company = companyInputs[i].value.trim();
      const from = fromInputs[i].value.trim();
      const to = toInputs[i].value.trim();
      if (company !== '' || from !== '' || to !== '') {
        experiences.push({
          company: company,
          from: from,
          to: to
        });
      }
    }


    if (infosvalid({ fname, lname, email, phone, img })) {
      const newstaff = {
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        img: img,
        occupation: occupation,
        experiences: experiences,
      };
      staff.push(newstaff);
      renderminicards()
      storeStaffDataToLocalStorage()
      addform.reset();
      document.getElementById("fname-add").style.border = "1px solid green";
      document.getElementById("lname-add").style.border = "1px solid green";
      document.getElementById("emailadd").style.border = "1px solid green";
      document.getElementById("phone-add").style.border = "1px solid green";
      document.getElementById("photo-add").style.border = "1px solid green";
    } else {
      document.getElementById("fname-add").style.border = "1px solid red";
      document.getElementById("lname-add").style.border = "1px solid red";
      document.getElementById("emailadd").style.border = "1px solid red";
      document.getElementById("phone-add").style.border = "1px solid red";
      document.getElementById("photo-add").style.border = "1px solid red";
    }
  })
};
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
    renderStaffInRoom();
  }
}

function deleteStaff(email) {
  const deleteemail = staff.findIndex(member => member.email === email);
  staff.splice(deleteemail, 1);
  storeStaffDataToLocalStorage();
  renderminicards();
  renderStaffInRoom();
}

function renderminicards() {
  const minicardsrender = document.getElementById("minicardsrender");
  minicardsrender.innerHTML = "";
  
  const allAssignedEmails = Object.values(roomArrayMap).flat();

  const unassignedStaff = staff.filter(staffMember => 
      !allAssignedEmails.includes(staffMember.email)
  );
  
  unassignedStaff.forEach(staffMember => {
    const cardyy = document.createElement("div");
    cardyy.innerHTML = `<div class="card my-3">
    <div class="card-body">
        <div class="d-flex align-items-center">

            <img src="${staffMember.img}" 
                 class="opendetailsclick border border-success rounded-circle me-3 " 
                 alt="Profile Picture" 
                 style="width: 60px; height: 60px; cursor: pointer;"
                 role="button"
                 data-bs-toggle="modal" 
                 data-bs-target="#detailsmodal" data-staff-email="${staffMember.email}">   
            <div>
                <h6 class="card-title mb-0">${staffMember.fname} ${staffMember.lname}</h6>
                <p class="card-text text-muted mb-0">${staffMember.email}</p>
            </div>
            
            <div class="ms-auto d-flex flex-column gap-1">
                <button type="button" class="deletebtn btn btn-danger btn-sm" data-staff-email="${staffMember.email}">
                    <i class="bi bi-trash"></i>
                </button>
                <button type="button" class="editbtntoggle btn btn-warning btn-sm" data-bs-toggle="modal"
                    data-bs-target="#modify" aria-label="Edit" data-staff-email="${staffMember.email}">
                    <i class="bi bi-pencil-square"></i>
                </button>
            </div>
        </div>
    </div>
</div>`
    minicardsrender.appendChild(cardyy)
    const opndetailsclick = document.querySelectorAll(".opendetailsclick")
opndetailsclick.forEach(opendetails => {
  opendetails.addEventListener("click", (e) => {
    const showemail = e.target.getAttribute("data-staff-email")
    showstaffdetails(showemail)
  })
})
  })


  document.querySelectorAll(".deletebtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const staffemaildlt = e.target.getAttribute("data-staff-email");
      deleteStaff(staffemaildlt);
    });
  });
};


function showstaffdetails(email) {
  const staffMember = staff.find(member => member.email === email);
  console.log(email)
  const profiledetails = document.getElementById("profiledetails")
  profiledetails.innerHTML = `
<div class="container-fluid p-0">
                            <div class="row">
                                <div class="col-12 text-center mb-3">
                                    <img src="${staffMember.img}"
                                        class="rounded-circle object-fit-cover border border-secondary"
                                        alt="Profile Picture" style="width: 80px; height: 80px;" id="details-photo">

                                    <h4 class="mt-2" id="details-fullname">${staffMember.fname} ${staffMember.lname} </h4>
                                    <p class="text-muted mb-0" id="details-occupation">${staffMember.occupation}</p>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-12">
                                    <h5 class="mb-3 text-primary"><i class="bi bi-person-badge me-2"></i>Contact
                                        Information</h5>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <span class="fw-bold"><i class="bi bi-person me-2"></i>First Name:</span>
                                            <span id="details-fname">${staffMember.fname}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <span class="fw-bold"><i class="bi bi-person me-2"></i>Last Name:</span>
                                            <span id="details-lname">${staffMember.lname}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <span class="fw-bold"><i class="bi bi-at me-2"></i>Email:</span>
                                            <span id="details-email">${staffMember.email}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <span class="fw-bold"><i class="bi bi-telephone-fill me-2"></i>Phone:</span>
                                            <span id="details-phone">${staffMember.phone}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-12">
                                    <h5 class="mb-3 text-primary"><i class="bi bi-briefcase-fill me-2"></i>Professional
                                        Experience</h5>
                                    <div id="details-experience-container">
                                        <p class="text-muted fst-italic" id="no-exp-message">Youcode</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
}


const editbuttons = document.querySelectorAll(".editbtntoggle")
editbuttons.forEach(editbutton =>{
  editbutton.addEventListener("click",(e)=>{
    const editemail = e.target.getAttribute("data-staff-email")
    const staffMember = staff.find(member => member.email === editemail);
     console.log(staffMember)
    const editmodalbody = document.getElementById("editmodalbody")
  editmodalbody.innerHTML = `
  <div class="container-fluid p-0">
                            <div class="row">
                                <div class="col-12 text-center mb-3">
                                    <img src="${staffMember.img}"
                                        class="rounded-circle object-fit-cover border border-secondary"
                                        alt="Profile Picture" style="width: 80px; height: 80px;" id="details-photo">

                                    <h4 class="mt-2" id="details-fullname">${staffMember.fname} ${staffMember.lname} </h4>
                                    <p class="text-muted mb-0" id="details-occupation">${staffMember.occupation}</p>            
                                </div>`
  })
})



let conferenceRoomStaff = [];
let receptionStaff = [];
let serversRoomStaff = [];
let securityRoomStaff = [];
let staffRoomStaff = [];
let vaultStaff = [];

const roomArrayMap = {
    'conferenceroom': conferenceRoomStaff,
    'reception': receptionStaff,
    'serversroom': serversRoomStaff,
    'securityroom': securityRoomStaff,
    'staff': staffRoomStaff,
    'vault': vaultStaff
};

function assignStaffToRoom(roomId, staffEmail) {
    const targetArray = roomArrayMap[roomId];
    
    for (const key in roomArrayMap) {
        const currentArray = roomArrayMap[key];
        const index = currentArray.indexOf(staffEmail);
        if (index > -1) {
            currentArray.splice(index, 1);
        }
    }
    
    if (!targetArray.includes(staffEmail)) {
        targetArray.push(staffEmail);
    }

    renderStaffInRoom();
    renderminicards();
    
    const modalElement = document.getElementById('addtoroom');
    if (modalElement) {
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open'); 
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
}

function removeStaffFromRoom(roomId, staffEmail) {
    const targetArray = roomArrayMap[roomId];
    const index = targetArray.indexOf(staffEmail);
    
    if (index > -1) {
        targetArray.splice(index, 1); 
        
        renderStaffInRoom();
        renderminicards();
    }
}

function renderStaffInRoom() {
    document.querySelectorAll('.room[id]').forEach(room => {
        const staffContainer = room.querySelector('.row-cols-1.g-2');
        if (staffContainer) {
            staffContainer.innerHTML = '';
        }
    });

    for (const roomId in roomArrayMap) {
        const assignedEmails = roomArrayMap[roomId];
        const roomElement = document.getElementById(roomId);
        if (!roomElement) continue;

        let staffContainer = roomElement.querySelector('.row-cols-1.g-2');
        if (!staffContainer) {
            staffContainer = document.createElement('div');
            staffContainer.className = 'row row-cols-1 g-2 justify-content-center align-content-center h-100';
            roomElement.prepend(staffContainer);
        }

        assignedEmails.forEach(email => {
            const staffMember = staff.find(member => member.email === email);
            if (staffMember) {
                const staffCard = document.createElement('div');
                staffCard.className = 'col staff-in-room-card';
                staffCard.style.maxWidth = '220px';

                staffCard.innerHTML = `
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-2 d-flex align-items-center justify-content-between">
                            <img src="${staffMember.img}"
                                class="rounded-circle object-fit-cover border" alt="Profile"
                                style="width: 35px; height: 35px;">
                            <div class="mx-2 text-truncate text-center flex-grow-1">
                                <span class="fw-bold" style="font-size: 0.8rem;">${staffMember.fname}</span>
                            </div>
                            <button class="btn-remove-staff btn btn-danger btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                style="width: 30px; height: 30px;" aria-label="Remove" data-staff-email="${email}" data-room-id="${roomId}">
                                <i class="bi bi-trash" style="font-size: 0.9rem;"></i>
                            </button>
                        </div>
                    </div>
                `;
                staffContainer.appendChild(staffCard);
            }
        });
    }

    document.querySelectorAll('.btn-remove-staff').forEach(button => {
        button.addEventListener('click', (e) => {
            const emailToRemove = e.currentTarget.getAttribute('data-staff-email');
            const roomId = e.currentTarget.getAttribute('data-room-id');
            removeStaffFromRoom(roomId, emailToRemove);
        });
    });
}

function renderStaffListToModal(roomId, occupationType) {
    const stafflist = document.getElementById('stafflist');
    const modalTitle = document.getElementById('addtoroomLabel');
    modalTitle.textContent = `Assign ${occupationType} to ${roomId}`;

    stafflist.innerHTML = '';

    const assignedInRoom = roomArrayMap[roomId];
    
    const eligibleStaff = staff.filter(staffMember => 
        (staffMember.occupation === occupationType || staffMember.occupation === 'coach') && 
        !assignedInRoom.includes(staffMember.email)
    );

    if (eligibleStaff.length === 0) {
        stafflist.innerHTML = `<p class="text-center text-muted">No eligible staff available to add.</p>`;
        return;
    }
    
    eligibleStaff.forEach(staffMember => {
        const profile = document.createElement('div');
        profile.innerHTML = `
            <div class="card my-3">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <img src="${staffMember.img}" class="rounded-circle me-3" alt="Profile Picture" style="width: 60px; height: 60px;">
                        <div>
                            <h6 class="card-title mb-0">${staffMember.fname} ${staffMember.lname}</h6>
                            <p class="card-text text-muted mb-0">${staffMember.email}</p>
                        </div>
                        <div class="ms-auto d-flex flex-column gap-1">
                            <button type="button" class="btn-assign-staff btn btn-success btn-sm" data-staff-email="${staffMember.email}" data-room-id="${roomId}">
                                <i class="bi bi-plus-circle"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        stafflist.appendChild(profile);
    });

    document.querySelectorAll('.btn-assign-staff').forEach(button => {
        button.addEventListener('click', (e) => {
            const emailToAssign = e.currentTarget.getAttribute('data-staff-email');
            const targetRoomId = e.currentTarget.getAttribute('data-room-id');
            assignStaffToRoom(targetRoomId, emailToAssign);
        });
    });
}


const roomOccupationMap = {
    'conferenceroom': 'coach', 
    'reception': 'receptionist',
    'serversroom': 'IT guy',
    'securityroom': 'security officer',
    'staff': 'Cleaning staff',
    'vault': 'security officer'
};

const addStaffButtons = document.querySelectorAll(".add-staff-btn");

addStaffButtons.forEach(button => {
    button.addEventListener('click', function () {
        const roomId = this.getAttribute('data-room-id');
        const requiredOccupation = roomOccupationMap[roomId];
        if (requiredOccupation) {
            renderStaffListToModal(roomId, requiredOccupation); 
        } else {
            console.log("No room with such id was found");
        }
    });
});
getDataFromLocalStorage();