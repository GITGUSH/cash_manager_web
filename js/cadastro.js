document.getElementById("formCadastro").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome           = document.getElementById("nome").value;
    const email          = document.getElementById("email").value;
    const senha          = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Validações no frontend
    if (nome === "" || email === "" || senha === "") {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const res = await fetch(`${API_URL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senhaHash: senha })
    });

    if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "index.html";
    } else {
        const msg = await res.text();
        alert(msg);
    }
});