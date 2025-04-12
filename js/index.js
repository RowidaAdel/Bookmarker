// ^ JavaScript
// * Task(3)
// & HTML Elements
var nameSite = document.getElementById("nameSite");
var urlSite = document.getElementById("urlSite");
var dataTable = document.getElementById("dataTable");
var urlErrorMessage = document.getElementById("urlErrorMessage");
var nameErrorMessage = document.getElementById("nameErrorMessage");

// & App Variables
var bookmarkList = JSON.parse(localStorage.getItem("products")) || [];
displayBookmarkAll();

// & Functions
function submitForm() {
    // Step 1: Get trimmed values
    var bookmark = {
        name: nameSite.value.trim(),
        url: urlSite.value.trim()
    };

    // Step 2: Validate empty fields
    if (isEmpty(bookmark)) {
        showValidationAlert();
        return;
    }

    // Step 3: Auto-add https if missing
    if (!/^https?:\/\//i.test(bookmark.url)) {
        bookmark.url = "https://" + bookmark.url;
    }

    // Step 4: Check for duplicates
    if (isDuplicateName(bookmark.name)) {
        alert("Bookmark name already exists! Please choose another name.");
        return;
    }

    // Step 5: Save bookmark and update UI
    saveBookmark(bookmark);
    clearInputs();
}

// * ✅ Helpers

function isEmpty(bookmark) {
    return bookmark.name === "" || bookmark.url === "";
}

function showValidationAlert() {
    Swal.fire({
        title: `<div class="modal-header">
                   <div class="left">
                       <div class="dots">
                           <span class="dot red"></span>
                           <span class="dot yellow"></span>
                           <span class="dot green"></span>
                       </div>
                    </div>
                    <div class="right">
                        <span class="close-btn" onclick="Swal.close()">✖</span>
                    </div>
                </div>`,
        html: `<h3 class="modal-title">Site Name or Url is not valid, Please follow the rules below :</h3><br>
                <ul class="rules-list">
                    <li><strong>↪ Site name must contain at least 3 characters</strong></li>
                    <li><strong>↪ Site URL must be a valid one</strong></li>
                </ul>`,
        showConfirmButton: false,
        customClass: {
            popup: 'custom-swal-popup'
        }
    });
}

function isDuplicateName(name) {
    return bookmarkList.some(function (item) {
        return item.name.toLowerCase() === name.toLowerCase();
    });
}

function saveBookmark(bookmark) {
    bookmarkList.push(bookmark);
    localStorage.setItem("products", JSON.stringify(bookmarkList));
    displayBookmark(bookmarkList.length - 1);
}

function displayBookmark(index) {
    var displayIndex = index + 1;
    var table = `<tr>
                    <td>
                        <p>${displayIndex}</p>
                    </td>
                    <td>
                        <p>${bookmarkList[index].name}</p>
                    </td>
                    <td><button class="btn visit text-white" onclick='visitBookmark(${index})'>
                            <i class="fa-solid fa-eye"></i>
                            Visit
                        </button>
                    </td>
                    <td><button class="btn delete text-white" onclick='deleteBookmark(${index})'>
                            <i class="fa-solid fa-trash-can"></i>
                            Delete
                        </button>
                    </td>
                </tr>`;
    dataTable.innerHTML += table;
}

function displayBookmarkAll() {
    dataTable.innerHTML = "";
    for (var i = 0; i < bookmarkList.length; i++) {
        displayBookmark(i);
    }
}

function clearInputs() {
    nameSite.value = "";
    urlSite.value = "";
}

function deleteBookmark(index) {
    bookmarkList.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(bookmarkList));
    displayBookmarkAll();
}

function visitBookmark(index) {
    window.open(bookmarkList[index].url, '_blank');
}

// & Validation
var nameRegex = /^[a-z][a-z0-9]{2,}$/i;
var urlRegex = /^(https?:\/\/)?(www\.)?[\w-]+\.[a-z]{2,}(\S*)?$/i;

function validateName() {
    if (nameRegex.test(nameSite.value)) {
        nameSite.classList.add("is-valid");
        nameSite.classList.remove("is-invalid");
        nameErrorMessage.textContent = "";
    } else {
        nameSite.classList.add("is-invalid");
        nameSite.classList.remove("is-valid");
        nameErrorMessage.textContent = "⚠️ Site name must contain at least 3 characters.";
    }
}

function validateUrl() {
    if (urlRegex.test(urlSite.value)) {
        urlSite.classList.add("is-valid");
        urlSite.classList.remove("is-invalid");
        urlErrorMessage.textContent = "";
    } else {
        urlSite.classList.add("is-invalid");
        urlSite.classList.remove("is-valid");
        urlErrorMessage.textContent = "⚠️ Site URL must be a valid one.";
    }
}

urlSite.addEventListener("blur", validateUrl);
nameSite.addEventListener("blur", validateName);
