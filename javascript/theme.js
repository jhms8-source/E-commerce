const THEME_KEY = 'nexusTheme';

function aplicarTema(theme) {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    if (!root) return;

    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    if (toggle) {
        toggle.textContent = theme === 'dark' ? '🌙 Escuro' : '☀️ Claro';
    }
}

function inicializarTema() {
    const temaSalvo = localStorage.getItem(THEME_KEY) || 'light';
    aplicarTema(temaSalvo);
}

document.addEventListener('DOMContentLoaded', function () {
    inicializarTema();

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            const atual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            aplicarTema(atual === 'dark' ? 'light' : 'dark');
        });
    }
});
