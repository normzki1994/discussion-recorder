const loginForm = document.querySelector(".login-form")

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/users/login");
    xhr.send();
    console.log(xhr.response);
});