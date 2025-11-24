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
    }
}

function deleteStaff(email) {
    const deleteemail = staff.findIndex(member => member.email === email);
    staff.splice(deleteemail, 1);
    storeStaffDataToLocalStorage();
    renderminicards();
}

function renderminicards() {
    const minicardsrender = document.getElementById("minicardsrender");
    minicardsrender.innerHTML = "";

    staff.forEach(staffMember => {
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
editbuttons.forEach(editbutton => {
    editbutton.addEventListener("click", (e) => {
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
            console.log(`Add staff button clicked for room: ${roomId} with occupation: ${requiredOccupation}`);
        } else {
            console.log("No room with such id was found");
        }
    });
});
getDataFromLocalStorage();