const temaSalvo = localStorage.getItem("tema") || "light";
document.documentElement.setAttribute("data-bs-theme", temaSalvo);

const btn = document.getElementById("btnTema");
btn.textContent = temaSalvo === "dark" ? "⚪" : "⚫";

btn.addEventListener("click", function () {
    const temaAtual = document.documentElement.getAttribute("data-bs-theme");
    const novoTema  = temaAtual === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-bs-theme", novoTema);
    localStorage.setItem("tema", novoTema);
    this.textContent = novoTema === "dark" ? "⚪" : "⚫";
});

document.getElementById("btnEncerrar").addEventListener("click", async function () {
    if (!confirm("Deseja encerrar o sistema completamente?")) return;
    alert("Sistema encerrado, pode fechar o navegador.")

    await fetch(`${API_URL}/shutdown`, { method: "POST" });

    localStorage.removeItem("token");
    window.close(); // fecha a aba do navegador
});
