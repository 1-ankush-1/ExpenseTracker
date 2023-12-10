//localstore data
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const usertoken = localStorage.getItem("token");

//check for premium
async function onloadData() {
    try {
        if (!usertoken) {
            window.location.href = "../../login/html/login.html";
        }
        //premium
        if (!userInfo.ispremiumuser) {
            window.location.href = "../html/home.html";
        }
    } catch (err) {
        console.log(err);
        alert(err.response.data.message)
        window.location.href = "../html/home.html";
    }
}

/**
 * onload - fetch from server
 */
window.addEventListener("DOMContentLoaded", onloadData);

/**
 * Elements
 */
const DisplayBody = document.getElementById("DisplayBody");
const dayTable = document.getElementById("dayTable");
const monthTable = document.getElementById("monthTable");
const yearTable = document.getElementById("yearTable");
const parentTime = document.getElementById("parentTime");
let timespan = "";
let timeslot;

/**
 * Choose Time
*/
const chooseTime = document.getElementById("chooseTime")
chooseTime.addEventListener("change", handelChooseTime);
function handelChooseTime(e) {
    e.preventDefault();

    //remove child
    if (parentTime.children.length >= 3) {
        parentTime.removeChild(parentTime.children[2]);
    }

    //add according to time slot
    if (chooseTime.value === "year") {
        timespan = "year"
        //hide rest show year
        yearTable.removeAttribute("hidden");
        monthTable.setAttribute("hidden", "");
        dayTable.setAttribute("hidden", "");
        //input form
        const form = document.createElement("form");
        form.id = "getExpense"
        form.className = "d-flex gap-2"
        const year = document.createElement("input");
        year.type = "number"
        year.min = 1;
        year.max = new Date().getFullYear();
        year.value = new Date().getFullYear();
        year.name = "year"
        year.placeholder = "2023"
        year.className = "form-control w-50"
        const btn = document.createElement("button");
        btn.type = "submit";
        btn.textContent = "GET"
        btn.className = "btn btn-primary"
        form.appendChild(year);
        form.appendChild(btn);
        parentTime.appendChild(form);
        //event listener
        form.addEventListener("submit", getDataByDay)
    } else if (chooseTime.value === "month") {
        timespan = "month"
        monthTable.removeAttribute("hidden");
        yearTable.setAttribute("hidden", "");
        dayTable.setAttribute("hidden", "");
        const form = document.createElement("form");
        form.id = "getExpense"
        form.className = "d-flex gap-2"
        const month = document.createElement("input");
        month.type = "number"
        month.min = 1;
        month.max = 12;
        month.value = new Date().getMonth() + 1;
        month.name = "month"
        month.placeholder = "1"
        month.className = "form-control w-50"
        const btn = document.createElement("button");
        btn.type = "submit";
        btn.textContent = "GET"
        btn.className = "btn btn-primary"
        form.appendChild(month);
        form.appendChild(btn);
        parentTime.appendChild(form);
        form.addEventListener("submit", getDataByDay)
    } else if (chooseTime.value === "day") {
        timespan = "";
        dayTable.removeAttribute("hidden");
        yearTable.setAttribute("hidden", "");
        monthTable.setAttribute("hidden", "");
        const form = document.createElement("form");
        form.id = "getExpense"
        form.className = "d-flex gap-2"
        const dayinp = document.createElement("input");
        dayinp.type = "date"
        dayinp.name = "day"
        dayinp.className = "form-control w-100"
        const btn = document.createElement("button");
        btn.type = "submit";
        btn.textContent = "GET"
        btn.className = "btn btn-primary"
        form.appendChild(dayinp);
        form.appendChild(btn);
        parentTime.appendChild(form);
        form.addEventListener("submit", getDataByDay)
    }
}

async function getDataByDay(e) {
    // Prevent default form submission
    e.preventDefault();

    try {
        const formdata = new FormData(e.target);
        const dateDetails = {}
        for (let [name, value] of formdata) {
            dateDetails[name] = value;
        }
        console.log(dateDetails);
        if (dateDetails.day) {
            timeslot = null;
            const monthdata = await axios.get(`http://localhost:3000/premium/report/day/${dateDetails.day}`, {
                headers: {
                    Authorization: usertoken
                }
            });
            console.log(monthdata);
        } else if (dateDetails.month) {
            timeslot = dateDetails.month;
            const monthdata = await axios.get(`http://localhost:3000/premium/report/month/${dateDetails.month}`, {
                headers: {
                    Authorization: usertoken
                }
            });

            if (monthdata.status == 200) {
                const report = monthdata.data.data.user
                const tbody = document.getElementById("monthtablebody");
                while (tbody.children[0]) {
                    tbody.removeChild(tbody.children[0]);
                }
                for (let individual of report) {
                    createHtmlYear(individual, tbody);
                }
                const row = document.createElement("tr");
                const monthtd = document.createElement("td");
                monthtd.textContent = "Total";
                const incometd = document.createElement("td");
                incometd.textContent = monthdata.data.data.totalIncome;
                const expensetd = document.createElement("td");
                expensetd.textContent = monthdata.data.data.totalExpense;
                const savingstd = document.createElement("td");
                savingstd.textContent = monthdata.data.data.totalSaving;

                row.appendChild(monthtd);
                row.appendChild(incometd);
                row.appendChild(expensetd);
                row.appendChild(savingstd);
                tbody.appendChild(row);
            };

        } else if (dateDetails.year) {
            timeslot = dateDetails.year;
            const yeardata = await axios.get(`http://localhost:3000/premium/report/year/${dateDetails.year}`, {
                headers: {
                    Authorization: usertoken
                }
            });

            if (yeardata.status == 200) {
                const report = yeardata.data.data
                const tbody = document.getElementById("yeartablebody");
                while (tbody.children[0]) {
                    tbody.removeChild(tbody.children[0]);
                }
                for (let individual of report) {
                    createHtmlYear(individual, tbody);
                }
            };
        }
    } catch (err) {
        console.log(err);
    }
}

function createHtmlYear(individual, tbody) {
    const row = document.createElement("tr");

    const monthtd = document.createElement("td");
    monthtd.textContent = individual.date;
    const incometd = document.createElement("td");
    incometd.textContent = individual.income.$numberDecimal;
    const expensetd = document.createElement("td");
    expensetd.textContent = individual.expense.$numberDecimal;
    const savingstd = document.createElement("td");
    savingstd.textContent = individual.savings;

    row.appendChild(monthtd);
    row.appendChild(incometd);
    row.appendChild(expensetd);
    row.appendChild(savingstd);
    tbody.appendChild(row);
}


/**
 * Download a file
*/
const downloadFile = document.getElementById("dwnldFile")
downloadFile.addEventListener("click", handelDownloadFile);
async function handelDownloadFile(e) {
    e.preventDefault();
    //to download directly
    // TableToExcel.convert(document.getElementById("yearTable"))

    try {
        if (timespan && timeslot) {
            const response = await axios.get(`http://localhost:3000/premium/report/download?filetype=${timespan}&timeslot=${timeslot}`, {
                headers: {
                    Authorization: usertoken
                }
            })

            if (response.status === 200) {
                const link = document.createElement('a');
                link.href = response.data.data;
                link.download = 'filename.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                response.data.file.download;
            }
        }
    } catch (err) {
        console.log(err);
    }
};

/**
 * Redirect to home
 */
document.getElementById("gotohome").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../html/home.html";
});
