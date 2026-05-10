const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

let todasContas = [];
let todasOperacoes = [];

async function carregarDashboard() {
    const [resContas, resOperacoes] = await Promise.all([
        fetch(`${API_URL}/contas`, { headers }),
        fetch(`${API_URL}/operacoes`, { headers })
    ]);

    todasContas    = await resContas.json();
    todasOperacoes = await resOperacoes.json();

    // Preenche o select de contas
    const select = document.getElementById("selectConta");
    select.innerHTML = '<option value="todas">Todas as contas</option>';
    todasContas.forEach(c => {
        const option = document.createElement("option");
        option.value = c.idConta;
        option.textContent = c.nome;
        select.appendChild(option);
    });

    atualizarDashboard("todas");
}

function atualizarDashboard(idConta) {
    let contas     = todasContas;
    let operacoes  = todasOperacoes;

    // Filtra se uma conta específica foi selecionada
    if (idConta !== "todas") {
        const id = parseInt(idConta);
        contas    = todasContas.filter(c => c.idConta === id);
        operacoes = todasOperacoes.filter(o => o.idConta === id);
    }

    // Calcula saldo
    const saldoTotal = contas.reduce((acc, c) => acc + c.saldo, 0);

    // Calcula entradas e saídas
    const totalEntradas = operacoes
        .filter(o => o.tipoES === "E")
        .reduce((acc, o) => acc + o.valor, 0);

    const totalSaidas = operacoes
        .filter(o => o.tipoES === "S")
        .reduce((acc, o) => acc + o.valor, 0);

    // Preenche os cards
    document.getElementById("saldoTotal").textContent    = `R$ ${saldoTotal.toFixed(2)}`;
    document.getElementById("totalEntradas").textContent = `R$ ${totalEntradas.toFixed(2)}`;
    document.getElementById("totalSaidas").textContent   = `R$ ${totalSaidas.toFixed(2)}`;

    // Preenche a tabela com as últimas 5 operações
    const tbody = document.getElementById("tabelaOperacoes");
    tbody.innerHTML = "";

    const ultimas = operacoes.slice(-5).reverse();
    ultimas.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${o.descricao}</td>
            <td>${o.nomeConta}</td>
            <td>R$ ${o.valor.toFixed(2)}</td>
            <td>${o.tipoES === "E" ? "Entrada" : "Saída"}</td>
            <td>${new Date(o.dataOperacao).toLocaleDateString("pt-BR")}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Evento do select
document.getElementById("selectConta").addEventListener("change", function () {
    atualizarDashboard(this.value);
});

// Botão sair
document.getElementById("btnSair").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

carregarDashboard();