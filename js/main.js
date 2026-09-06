// Vinho do Gringo — interações da landing page
(function () {
  "use strict";

  // Ano dinâmico no rodapé
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu mobile
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    function setMenuState(isOpen) {
      links.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", isOpen);
      links.inert = window.matchMedia("(max-width: 900px)").matches && !isOpen;
    }

    toggle.addEventListener("click", function () {
      setMenuState(!links.classList.contains("is-open"));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenuState(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && links.classList.contains("is-open")) {
        setMenuState(false);
        toggle.focus();
      }
    });
    setMenuState(false);
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Fecha apenas um <details> de FAQ por vez (comportamento acordeão suave)
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // Carrossel da seção de consultoria
  var carouselSlides = document.querySelectorAll(".carousel-slide");
  if (carouselSlides.length > 1) {
    var carouselIndex = 0;
    window.setInterval(function () {
      carouselSlides[carouselIndex].classList.remove("is-active");
      carouselSlides[carouselIndex].setAttribute("aria-hidden", "true");
      carouselIndex = (carouselIndex + 1) % carouselSlides.length;
      carouselSlides[carouselIndex].classList.add("is-active");
      carouselSlides[carouselIndex].setAttribute("aria-hidden", "false");
    }, 4000);
  }

  // Reproduz o vídeo do manifesto apenas enquanto ele está visível
  var manifestoVideo = document.querySelector(".instagram-video");
  if (manifestoVideo) {
    var manifestoSection = document.querySelector(".manifesto");
    var videoIsVisible = false;
    var setVideoPlayback = function (isVisible) {
      videoIsVisible = isVisible;
      if (isVisible) {
        var playPromise = manifestoVideo.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      } else {
        manifestoVideo.pause();
      }
    };

    manifestoVideo.addEventListener("loadeddata", function () {
      if (videoIsVisible) setVideoPlayback(true);
    });

    if ("IntersectionObserver" in window && manifestoSection) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          setVideoPlayback(entry.isIntersecting);
        });
      }, { threshold: 0.35 });
      videoObserver.observe(manifestoSection);
    } else {
      setVideoPlayback(true);
    }
  }
})();
