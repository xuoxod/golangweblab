document.addEventListener("DOMContentLoaded", function () {
  const accountLink = document.querySelector(".account-link");
  const profileLink = document.querySelector(".profile-link");
  const settingsLink = document.querySelector(".settings-link");
  const mobileAccountLink = document.querySelector(".mobile-account-link");
  const mobileProfileLink = document.querySelector(".mobile-profile-link");
  const mobileSettingsLink = document.querySelector(".mobile-settings-link");
  const indexAccountLink = document.querySelector("#index-account");
  const indexProfileLink = document.querySelector("#index-profile");
  const indexSettingsLink = document.querySelector("#index-settings");

  const accountLinkHandler = () => {
    log(`Account link clicked`);
  };

  const profileLinkHandler = () => {
    log(`Profile link clicked`);
  };

  const settingsLinkHandler = () => {
    log(`Settings link clicked`);
  };

  if (accountLink && profileLink && settingsLink) {
    addClickHandler(accountLink, accountLinkHandler);

    addClickHandler(profileLink, profileLinkHandler);

    addClickHandler(settingsLink, settingsLinkHandler);

    addClickHandler(mobileAccountLink, accountLinkHandler);

    addClickHandler(mobileProfileLink, profileLinkHandler);

    addClickHandler(mobileSettingsLink, settingsLinkHandler);

    addClickHandler(indexAccountLink, accountLinkHandler);

    addClickHandler(indexProfileLink, profileLinkHandler);

    addClickHandler(indexSettingsLink, settingsLinkHandler);
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
