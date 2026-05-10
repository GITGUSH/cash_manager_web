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
                <button class="btn btn-outline-primary btn-sm me-2" onclick="verOperacoes(${conta.idConta}, '${conta.nome}')">
                    Ver Operações
                </button>
                <button class="btn btn-outline-success btn-sm me-2" onclick="abrirModalOperacao(${conta.idConta}, '${conta.nome}')">
                    + Operação
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
        <td>
            <button class="btn btn-outline-danger btn-sm" onclick="deletarOperacaoConta(${o.idOperacao}, ${o.idConta}, '${o.descricao}')">
                Deletar
            </button>
        </td>
    `;
    tbody.appendChild(tr);
});
}

//Deletar conta
async function deletarConta(id) {
    if (!confirm("Tem certeza que deseja deletar essa conta?")) return;

    const res = await fetch(`${API_URL}/conta/${id}`, {
        method: "DELETE",
        headers
    });

    if (!res.ok) {
        const msg = await res.text();
        alert(msg); // exibe a mensagem do backend
        return;
    }

    carregarContas();
}

//Salvar nova conta
document.getElementById("btnSalvarConta").addEventListener("click", async function () {
    const nome  = document.getElementById("nomeConta").value;
    const saldo = parseFloat(document.getElementById("saldoConta").value);

    if (nome !== "" && !isNaN(saldo)) {
        await fetch(`${API_URL}/conta`, {
            method: "POST",
            headers,
            body: JSON.stringify({ Nome: nome, Saldo: saldo })
        });

        alert("Conta criada com sucesso!");
        bootstrap.Modal.getInstance(document.getElementById("modalNovaConta")).hide();
        carregarContas();
    } else {
        alert("Todos os campos devem estar preenchidos!");
    }
});

// Sair
document.getElementById("btnSair").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

document.getElementById("modalNovaConta").addEventListener("hidden.bs.modal", function () {
    document.getElementById("nomeConta").value = "";
    document.getElementById("saldoConta").value = "";
});


// Guarda o id da conta selecionada
let idContaSelecionada = null;

// Abre o modal já com a conta definida
async function abrirModalOperacao(idConta, nomeConta) {
    idContaSelecionada = idConta;
    document.getElementById("nomeContaOperacao").textContent = nomeConta;

    const res = await fetch(`${API_URL}/categorias`, { headers });
    const categorias = await res.json();

    const select = document.getElementById("categoriaOp");
    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    categorias.forEach(c => {
        const option = document.createElement("option");
        option.value = c.idCategoria;
        option.textContent = `${c.nome} (${c.tipoES === "E" ? "Entrada" : "Saída"})`;
        option.dataset.tipo = c.tipoES;
        option.style.display = "none"; 
        select.appendChild(option);
    });

    document.querySelectorAll("input[name='tipoOp']").forEach(radio => {
        const novoRadio = radio.cloneNode(true);
        radio.parentNode.replaceChild(novoRadio, radio);
        novoRadio.addEventListener("change", function () {
            const options = select.querySelectorAll("option:not(:first-child)");
            options.forEach(option => {
                option.style.display = option.dataset.tipo === this.value ? "block" : "none";
            });
            select.value = "";
        });
    });

    new bootstrap.Modal(document.getElementById("modalNovaOperacaoConta")).show();
}
// Salvar operação direto da conta
document.getElementById("btnSalvarOperacaoConta").addEventListener("click", async function () {
    const descricao   = document.getElementById("descricaoOp").value;
    const valor       = parseFloat(document.getElementById("valorOp").value);
    const tipoES      = document.querySelector("input[name='tipoOp']:checked")?.value;
    const idCategoria = parseInt(document.getElementById("categoriaOp").value);

    if (descricao === "" || isNaN(valor) || !tipoES || !idCategoria) {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    await fetch(`${API_URL}/operacao`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            descricao,
            valor,
            tipoES,
            idConta: idContaSelecionada,
            idCategoria
        })
    });

    alert("Operação registrada com sucesso!");
    bootstrap.Modal.getInstance(document.getElementById("modalNovaOperacaoConta")).hide();
    carregarContas();
}); 

// Limpa o modal ao fechar
document.getElementById("modalNovaOperacaoConta").addEventListener("hidden.bs.modal", function () {
    document.getElementById("descricaoOp").value = "";
    document.getElementById("valorOp").value = "";
    document.querySelectorAll("input[name='tipoOp']").forEach(r => r.checked = false);
    document.getElementById("categoriaOp").value = "";
    idContaSelecionada = null;
});

async function deletarOperacaoConta(idOperacao, idConta, descricao) {
    if (!confirm(`Deseja deletar a operação "${descricao}"?`)) return;

    await fetch(`${API_URL}/operacao/${idOperacao}`, {
        method: "DELETE",
        headers
    });

    carregarContas();
    verOperacoes(idConta, document.getElementById("nomeContaSelecionada").textContent);
}

carregarContas();