document.getElementById("formLogin").addEventListener("submit", async function (e){
    e.preventDefault(); //Impede o form de recarregar a página

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    
    const response = await fetch(`${API_URL}/login`, { //faz a requisição pro backend
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, senha})           
    });

    if (response.ok){
        const data = await response.json();

       //console.log(data);

        localStorage.setItem("token", data.token); //Salva o token para usar em próximas requisições
        //alert("Login OK");
        window.location.href = "dashboard.html"; //Redireciona para a página de dashboard
    } else{
        alert("E-mail ou senha incorretos!");
    }

});
