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