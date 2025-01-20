document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.getElementById("mobile-menu");
    const navList = document.querySelector(".nav-list");
    const menuHint = document.querySelector(".menu-hint");

    mobileMenu.addEventListener("click", () => {
        navList.classList.toggle("active");
        mobileMenu.classList.toggle("active");

        if (menuHint) {
            // Скрывать подсказку, если меню открыто
            menuHint.style.display = navList.classList.contains("active") ? "none" : "block";
        }
    });
});
