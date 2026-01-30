const loginbtn = document.getElementById("loginbtn");

loginbtn.addEventListener("click", async function () {

    const userdata = {
        username: document.getElementById("usernameinpt").value,
        email: document.getElementById("emailinpt").value,
        password: document.getElementById("passwordinpt").value
    };

    try {
        const response = await fetch(
          "https://calcsmp-production.up.railway.app/api/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userdata)
          }
        );

        const data = await response.json();
        alert("تم الإرسال بنجاح ✅");

    } catch (err) {
        alert("فشل الإرسال ❌");
    }
});
