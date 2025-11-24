const KEY = 'tema';
const btn = document.querySelector('.btnTema');

if (localStorage.getItem(KEY) === 'oscuro') {
    document.body.classList.add('dark-theme');
}

btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem(KEY, isDark ? 'oscuro' : 'claro');
});