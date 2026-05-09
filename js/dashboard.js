const token = localStorage.getItem("token");

if (!token) window.location.href = "index.html";

async function carregarDashboard() {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    //Busca contas e operações
    const [resContas, resOperacoes] = await Promise.all([
        fetch(`${API_URL}/contas`, { headers }),
        fetch(`${API_URL}/operacoes`, { headers })
    ]);

    const contas = await resContas.json();
    const operacoes = await resOperacoes.json();

    //Calcula saldo
    const saldoTotal = contas.reduce((acc, c) => acc + c.saldo, 0);

    //Calcula entradas e saídas
    const totalEntradas = operacoes
        .filter(o => o.tipoES === "E")
        .reduce((acc, o) => acc + o.valor, 0);

    const totalSaidas = operacoes
        .filter(o => o.tipoES === "S")
        .reduce((acc, o) => acc + o.valor, 0);

    //Preenche os cards
    document.getElementById("saldoTotal").textContent = `R$ ${saldoTotal.toFixed(2)}`;
    document.getElementById("totalEntradas").textContent = `R$ ${totalEntradas.toFixed(2)}`;
    document.getElementById("totalSaidas").textContent = `R$ ${totalSaidas.toFixed(2)}`;

    //Preenche a tabela com as 5 últimas operações

    const tbody = document.getElementById("tabelaOperacoes");
    const ultimas = operacoes.slice(-5).reverse();

    ultimas.forEach(o => {
        const tr = document.createElement("tr");
                tr.innerHTML = `
            <td>${o.descricao}</td>
            <td>R$ ${o.valor.toFixed(2)}</td>
            <td>${o.tipoES === "E" ? "Entrada" : "Saída"}</td>
            <td>${o.nomeConta}</td>
            <td>${new Date(o.dataOperacao).toLocaleDateString("pt-BR")}</td>
        `;
        tbody.appendChild(tr);
    });
}

//Botão sair - limpa token
document.getElementById("btnSair").addEventListener("click", function(e){
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

carregarDashboard();
