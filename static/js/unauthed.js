document.addEventListener("DOMContentLoaded", function () {
  const signinLink = document.querySelector("#mobile-sign-in");
  const registerLink = document.querySelector("#mobile-register");
  const aboutLink = document.querySelector("#mobile-about-link");
  const signinMenuLink = document.querySelector("#sign-in");
  const registerMenuLink = document.querySelector("#register");
  const aboutMenuLink = document.querySelector("#about-link");

  if (aboutLink && registerLink && aboutLink) {
    addClickHandler(aboutLink, about);

    addClickHandler(registerLink, register);

    addClickHandler(signinLink, signin);

    addClickHandler(aboutMenuLink, about);

    addClickHandler(registerMenuLink, register);

    addClickHandler(signinMenuLink, signin);
  }
});

function siteMenuEffect() {
  var x = document.getElementById("site-menu");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}
