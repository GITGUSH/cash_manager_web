const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

// Carrega e renderiza as operações
async function carregarOperacoes() {
    const res = await fetch(`${API_URL}/operacoes`, { headers });
    const operacoes = await res.json();

    const tbody = document.getElementById("tabelaOperacoes");
    tbody.innerHTML = "";

    operacoes.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${o.descricao}</td>
            <td>R$ ${o.valor.toFixed(2)}</td>
            <td>${o.tipoES === "E" ? "Entrada" : "Saída"}</td>
            <td>${o.nomeConta}</td>
            <td>${new Date(o.dataOperacao).toLocaleDateString("pt-BR")}</td>
            <td>
                <button class="btn btn-outline-danger btn-sm" onclick="deletarOperacao(${o.idOperacao})">
                    Deletar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Preenche o select de contas
async function carregarContas() {
    const res = await fetch(`${API_URL}/contas`, { headers });
    const contas = await res.json();

    const select = document.getElementById("contaOperacao");
    contas.forEach(c => {
        const option = document.createElement("option");
        option.value = c.idConta;
        option.textContent = c.nome;
        select.appendChild(option);
    });
}

// Preenche o select de categorias
async function carregarCategorias() {
    const res = await fetch(`${API_URL}/categorias`, { headers });
    const categorias = await res.json();

    const select = document.getElementById("categoriaOperacao");
    categorias.forEach(c => {
        const option = document.createElement("option");
        option.value = c.idCategoria;
        option.textContent = `${c.nome}`;
        option.dataset.tipo = c.tipoES; // ← guarda o tipo no dataset
        select.appendChild(option);
    });
}

// Deletar operação
async function deletarOperacao(id) {
    if (!confirm("Tem certeza que deseja deletar essa operação?")) return;

    await fetch(`${API_URL}/operacao/${id}`, {
        method: "DELETE",
        headers
    });

    carregarOperacoes();
}

// Salvar nova operação
document.getElementById("btnSalvarOperacao").addEventListener("click", async function () {
    const descricao    = document.getElementById("descricaoOperacao").value;
    const valor        = parseFloat(document.getElementById("valorOperacao").value);
    const tipoES       = document.querySelector("input[name='tipoOperacao']:checked")?.value;
    const idConta      = parseInt(document.getElementById("contaOperacao").value);
    const idCategoria  = parseInt(document.getElementById("categoriaOperacao").value);

    if (descricao === "" || isNaN(valor) || !tipoES || !idConta || !idCategoria) {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    await fetch(`${API_URL}/operacao`, {
        method: "POST",
        headers,
        body: JSON.stringify({ descricao, valor, tipoES, idConta, idCategoria })
    });

    alert("Operação registrada com sucesso!");
    bootstrap.Modal.getInstance(document.getElementById("modalNovaOperacao")).hide();
    carregarOperacoes();
});

// Limpa o modal ao fechar
document.getElementById("modalNovaOperacao").addEventListener("hidden.bs.modal", function () {
    document.getElementById("descricaoOperacao").value = "";
    document.getElementById("valorOperacao").value = "";
    document.querySelectorAll("input[name='tipoOperacao']").forEach(r => r.checked = false);
    document.getElementById("contaOperacao").value = "";
    document.getElementById("categoriaOperacao").value = "";
});

// Sair
document.getElementById("btnSair").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

carregarContas();
carregarCategorias();
carregarOperacoes();

// Adiciona evento nos radio buttons de tipo
document.querySelectorAll("input[name='tipoOperacao']").forEach(radio => {
    radio.addEventListener("change", function () {
        filtrarCategoriasPorTipo(this.value);
    });
});

function filtrarCategoriasPorTipo(tipo) {
    const select = document.getElementById("categoriaOperacao");
    const options = select.querySelectorAll("option:not(:first-child)");

    options.forEach(option => {
        if (option.dataset.tipo === tipo) {
            option.style.display = "block";
        } else {
            option.style.display = "none";
        }
    });

    select.value = ""; // reseta a seleção
}