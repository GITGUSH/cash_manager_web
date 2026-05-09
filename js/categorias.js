const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

// Carrega e renderiza as categorias
async function carregarCategorias() {
    const res = await fetch(`${API_URL}/categorias`, { headers });
    const categorias = await res.json();

    const lista = document.getElementById("listaCategorias");
    lista.innerHTML = "";

    categorias.forEach(categoria => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${categoria.nome}</h5>
                    <p class="card-text">${categoria.tipoES === "E" ? "Entrada" : "Saída"}</p>
                    <button class="btn btn-outline-danger btn-sm" onclick="deletarCategoria(${categoria.idCategoria})">
                        Deletar
                    </button>
                </div>
            </div>
        `;
        lista.appendChild(col);
    });
}

// Deletar categoria
async function deletarCategoria(id) {
    if (!confirm("Tem certeza que deseja deletar essa categoria?")) return;

    await fetch(`${API_URL}/categoria/${id}`, {
        method: "DELETE",
        headers
    });

    carregarCategorias();
}

// Salvar nova categoria
document.getElementById("btnSalvarCategoria").addEventListener("click", async function () {
    const nome   = document.getElementById("nomeCategoria").value;
    const tipoES = document.querySelector("input[name='tipo']:checked")?.value;

    if (nome !== "" && tipoES) {
        await fetch(`${API_URL}/categoria`, {
            method: "POST",
            headers,
            body: JSON.stringify({ nome, tipoES })
        });

        alert("Categoria criada com sucesso!");
        bootstrap.Modal.getInstance(document.getElementById("modalNovaCategoria")).hide();
        carregarCategorias();
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

document.getElementById("modalNovaCategoria").addEventListener("hidden.bs.modal", function () {
    document.getElementById("nomeCategoria").value = "";
    document.querySelectorAll("input[name='tipo']").forEach(r => r.checked = false);
});

carregarCategorias();