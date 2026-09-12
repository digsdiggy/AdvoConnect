document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     DROPDOWN NAVIGATION
  ===================================================== */

  const dropdowns = document.querySelectorAll(".dropdown");

  function closeAllDropdowns() {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove("open");

      const button = dropdown.querySelector(".drop-btn");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  dropdowns.forEach(dropdown => {

    const button = dropdown.querySelector(".drop-btn");

    if (!button) return;

    button.addEventListener("click", event => {

      event.preventDefault();
      event.stopPropagation();

      const isOpen = dropdown.classList.contains("open");

      closeAllDropdowns();

      if (!isOpen) {
        dropdown.classList.add("open");

        button.setAttribute(
          "aria-expanded",
          "true"
        );
      }

    });

  });


  /* =====================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ===================================================== */

  document.addEventListener("click", event => {

    if (!event.target.closest(".dropdown")) {
      closeAllDropdowns();
    }

  });


  /* =====================================================
     FORM PAGES
  ===================================================== */

  const formPages = document.querySelectorAll(".form-page");


  function showFormPage(hash, shouldScroll = true) {

    /* Hide every form page */

    formPages.forEach(page => {
      page.classList.remove("active");
    });


    /* Nothing selected */

    if (!hash || hash === "#") {
      return;
    }


    /* Find selected page */

    const selectedPage = document.querySelector(hash);


    /* Make sure it is actually a form page */

    if (
      !selectedPage ||
      !selectedPage.classList.contains("form-page")
    ) {
      return;
    }


    /* Show selected form */

    selectedPage.classList.add("active");


    /* Scroll to it */

    if (shouldScroll) {

      setTimeout(() => {

        const header =
          document.querySelector(".site-header");

        const headerHeight =
          header ? header.offsetHeight : 0;

        const targetPosition =
          selectedPage.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          15;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

      }, 50);

    }

  }


  /* =====================================================
     NAVIGATION LINKS
  ===================================================== */

  document
    .querySelectorAll(".dropdown-menu a, .nav-menu > li > a")
    .forEach(link => {

      link.addEventListener("click", event => {

        const targetId =
          link.getAttribute("href");


        /* Ignore external links */

        if (
          !targetId ||
          targetId === "#" ||
          !targetId.startsWith("#")
        ) {
          return;
        }


        const target =
          document.querySelector(targetId);


        /* If target doesn't exist, let browser handle it */

        if (!target) {
          return;
        }


        event.preventDefault();


        /* Close dropdown */

        closeAllDropdowns();


        /* Update URL */

        history.pushState(
          null,
          "",
          targetId
        );


        /* IMPORTANT:
           Show the form immediately.
           pushState does NOT trigger hashchange.
        */

        if (target.classList.contains("form-page")) {

          showFormPage(targetId, true);

        } else {

          /* Normal section */

          const header =
            document.querySelector(".site-header");

          const headerHeight =
            header ? header.offsetHeight : 0;

          const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            15;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });

        }

      });

    });


  /* =====================================================
     ESCAPE KEY
  ===================================================== */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeAllDropdowns();
    }

  });


  /* =====================================================
     FORMS
  ===================================================== */

  document
    .querySelectorAll("form[data-form-name]")
    .forEach(form => {

      form.addEventListener("submit", event => {

        event.preventDefault();


        /* Validate form */

        if (!form.checkValidity()) {

          form.reportValidity();

          return;

        }


        /* Confirmation message */

        const message =
          form.querySelector(".form-message");


        /* Form name */

        const formName =
          form.dataset.formName;


        if (message) {

          message.textContent =
            `Thank you. Your ${formName.toLowerCase()} form has been received.`;

          message.setAttribute(
            "role",
            "status"
          );

          message.setAttribute(
            "aria-live",
            "polite"
          );

        }


        /* Reset form */

        form.reset();

      });

    });


  /* =====================================================
     COPYRIGHT YEAR
  ===================================================== */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =====================================================
     BROWSER BACK / FORWARD
  ===================================================== */

  window.addEventListener("popstate", () => {

    const hash =
      window.location.hash;

    showFormPage(hash, true);

  });


  /* =====================================================
     INITIAL PAGE LOAD
  ===================================================== */

  showFormPage(
    window.location.hash,
    false
  );

});