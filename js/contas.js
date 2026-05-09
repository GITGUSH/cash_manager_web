const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

//Carrega as contas existentes
async function carregarContas(){
    const res = await fetch(`${API_URL}/contas`, { headers });
    const contas = await res.json();

    const lista = document.getElementById("listaContas");
    lista.innerHTML = "";

    contas.forEach(conta => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${conta.nome}</h5>
                    <p class="card-text fs-5">R$ ${conta.saldo.toFixed(2)}</p>
                    <button class="btn btn-outline-primary btn-sm me-2" onclick="verOperacoes(${conta.idConta}, '${conta.nome}')    ">
                        Ver Operações
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deletarConta(${conta.idConta})">
                        Deletar
                    </button>
                </div>
            </div>
        `;
        lista.appendChild(col);
    });
}

//Ver operações de uma conta espeçífica
async function verOperacoes(idConta, nomeConta){
    const res = await fetch(`${API_URL}/operacoes`, { headers });
    const operacoes = await res.json();

    //console.log("idConta recebido:", idConta, typeof idConta);
    //console.log("operacoes:", operacoes);

    const filtradas = operacoes.filter(o => o.idConta === idConta);

    //console.log("filtradas:", filtradas);

    document.getElementById("nomeContaSelecionada").textContent = nomeConta;
    document.getElementById("secaoOperacoes").style.display = "block";
    
    const tbody = document.getElementById("tabelaOperacoesConta");
    tbody.innerHTML = "";
    
    filtradas.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${o.descricao}</td>
            <td>R$ ${o.valor.toFixed(2)}</td>
            <td>${o.tipoES === "E" ? "Entrada" : "Saída"}</td>
            <td>${new Date(o.dataOperacao).toLocaleDateString("pt-BR")}</td>
        `;
        tbody.appendChild(tr);
    });
}

//Deletar conta
async function deletarConta(id) {
    if (!confirm("Tem certeza que deseja deletar essa conta?")) return;

    await fetch(`${API_URL}/conta/${id}`, {
        method: "DELETE",
        headers
    });

    carregarContas();
}

//Salvar nova conta
document.getElementById("btnSalvarConta").addEventListener("click", async function () {
    const nome = document.getElementById("nomeConta").value;
    const saldo = parseFloat(document.getElementById("saldoConta").value);

    await fetch(`${API_URL}/conta`, {
        method: "POST",
        headers,
        body: JSON.stringify({ Nome: nome, Saldo: saldo })
    });

    alert("Conta criada com sucesso!");

    // Fecha o modal e recarrega
    bootstrap.Modal.getInstance(document.getElementById("modalNovaConta")).hide();
    carregarContas();
});

// Sair
document.getElementById("btnSair").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

carregarContas();