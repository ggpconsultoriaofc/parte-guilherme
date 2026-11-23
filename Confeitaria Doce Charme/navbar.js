(function () {
  "use strict";


  var BRAND = "Doce Charme";
  var HOME = "index.html";

  var LINKS = [
    { label: "Home",     href: "index.html" },
    { label: "Produtos", href: "produtos.html" },
    { label: "Contato",  href: "contatos.html" }
  ];

  var LOGO_ICON =
    '<svg class="navbar__logo-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
      '<path d="M12.5 25h23l-2.6 16.4a2.4 2.4 0 0 1-2.4 2H17.5a2.4 2.4 0 0 1-2.4-2z" fill="#6b2a1c"/>' +
      '<path d="M19 28.5l1.1 12M24 28.5v12M29 28.5l-1.1 12" stroke="#f3c9d3" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M9.5 26c0-7.2 6-11.5 14.5-11.5S38.5 18.8 38.5 26z" fill="#f3c9d3" stroke="#6b2a1c" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M14 22.5c4-2.2 8-1.2 11 .8s6 1.8 9-.5" stroke="#6b2a1c" stroke-width="1.4" stroke-linecap="round" fill="none"/>' +
      '<path d="M24 14.8c-5-3-6.8-5.8-4.6-8.2 1.8-1.7 3.8-.7 4.6.8.8-1.5 2.8-2.5 4.6-.8 2.2 2.4.4 5.2-4.6 8.2z" fill="#6b2a1c"/>' +
    '</svg>';


  function currentPage() {
    var file = window.location.pathname.split("/").pop();
    if (!file) return HOME;                                   // "/" => index.html
    return file.indexOf(".") === -1 ? file + ".html" : file;  // "/produtos" => produtos.html
  }


  function buildHTML(page) {
    var items = LINKS.map(function (link) {
      var current = link.href === page ? ' aria-current="page"' : "";
      return (
        '<li><a class="navbar__link" href="' + link.href + '"' + current + ">" +
        link.label + "</a></li>"
      );
    }).join("");

    return (
      '<header class="navbar">' +
        '<div class="navbar__inner">' +
          '<a class="navbar__logo" href="' + HOME + '" aria-label="' + BRAND + ' – página inicial">' +
            LOGO_ICON + "<span>" + BRAND + "</span>" +
          "</a>" +
          '<button class="navbar__toggle" type="button" aria-label="Abrir menu" ' +
            'aria-expanded="false" aria-controls="navbar-menu">' +
            '<span class="navbar__bars"></span>' +
          "</button>" +
          '<nav aria-label="Navegação principal">' +
            '<ul class="navbar__menu" id="navbar-menu">' + items + "</ul>" +
          "</nav>" +
        "</div>" +
      "</header>"
    );
  }


  var mount = document.getElementById("navbar");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "navbar";
    document.body.insertBefore(mount, document.body.firstChild);
  }

  var tpl = document.createElement("template");
  tpl.innerHTML = buildHTML(currentPage());
  var header = tpl.content.firstElementChild;

  mount.replaceWith(header);


  var toggle = header.querySelector(".navbar__toggle");
  var menu = header.querySelector(".navbar__menu");

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("is-open"));
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (e) {
    if (!header.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 721px)").addEventListener("change", function (e) {
    if (e.matches) setOpen(false);
  });
})();