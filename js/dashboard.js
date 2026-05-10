const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

let todasContas = [];
let todasOperacoes = [];

function carregarDashboard() {
    Promise.all([
        fetch(`${API_URL}/contas`, { headers }),
        fetch(`${API_URL}/operacoes`, { headers })
    ])
    .then(([resContas, resOperacoes]) => Promise.all([resContas.json(), resOperacoes.json()]))
    .then(([contas, operacoes]) => {
        todasContas    = contas;
        todasOperacoes = operacoes;

        const select = document.getElementById("selectConta");
        select.innerHTML = '<option value="todas">Todas as contas</option>';
        contas.forEach(c => {
            const option = document.createElement("option");
            option.value = c.idConta;
            option.textContent = c.nome;
            select.appendChild(option);
        });

        select.addEventListener("change", function () {
            atualizarDashboard(this.value);
        });

        atualizarDashboard("todas");
    })
    .catch(err => console.error("Erro:", err));
}

function atualizarDashboard(idConta) {
    let contas    = todasContas;
    let operacoes = todasOperacoes;

    if (idConta !== "todas") {
        const id = parseInt(idConta);
        contas    = todasContas.filter(c => c.idConta === id);
        operacoes = todasOperacoes.filter(o => o.idConta === id);
    }

    const saldoTotal = contas.reduce((acc, c) => acc + c.saldo, 0);

    const totalEntradas = operacoes
        .filter(o => o.tipoES === "E")
        .reduce((acc, o) => acc + o.valor, 0);

    const totalSaidas = operacoes
        .filter(o => o.tipoES === "S")
        .reduce((acc, o) => acc + o.valor, 0);

    document.getElementById("saldoTotal").textContent    = `R$ ${saldoTotal.toFixed(2)}`;
    document.getElementById("totalEntradas").textContent = `R$ ${totalEntradas.toFixed(2)}`;
    document.getElementById("totalSaidas").textContent   = `R$ ${totalSaidas.toFixed(2)}`;

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

document.getElementById("btnSair").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

carregarDashboard();