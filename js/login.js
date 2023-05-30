const url = "http://localhost:3001";
const form_login = document.getElementById("login");


async function login(info) {
    try {
        let end_point = "auth/login";
       const response = await fetch(`${url}/${end_point}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: info
       })

       const data = await response.json();

        if (!data.success) {
            let str = JSON.stringify(data.error);
            throw new Error(str);
        }
        return data.data;
    } catch (error) {
        throw error;
    }
}


form_login.addEventListener("submit", (e) => {
    e.preventDefault();
    const user_name = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let send_info = JSON.stringify({
        data: {
            "username": user_name,
            "password": password
        }
    });

    login(send_info).then((data) => {
        localStorage.setItem("jwt", data);
        window.location.href = `medico.html`;
    })
    .catch(error => {
        localStorage.removeItem("jwt");
        alert(error);
    })
});