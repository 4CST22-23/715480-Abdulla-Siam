const preLoader = document.querySelector("#preLoader");
let isFormActive = false,
  isFormSubmited = false,
  activeNavIndx = -1;

allHoverableEls.forEach((theEl) => {
  theEl.addEventListener("mouseenter", () => {
    mouseFollower.classList.add("linkHovered");
  });
  theEl.addEventListener("mouseleave", () => {
    mouseFollower.classList.remove("linkHovered");
  });
});

window.addEventListener("load", () => {
  setTimeout(() => {
    bodyEl.classList.add("loaded");

    imgEls.forEach((imgEl) => {
      imgEl.draggable = false;
      let mainSrc = imgEl.dataset.src;
      if (mainSrc) imgEl.src = mainSrc;
    });

    setTimeout(() => {
      scrollerObjs[0].isScrollerActive = true;
    }, 2900);
  }, 500);
});

const documentEl = document.querySelector(":root"),
  modeChanger = document.querySelector("#modeChanger"),
  modeColors = [
    ["rgb(236, 236, 236)", "rgb(19, 19, 19)"],
    ["rgb(205, 225, 245)", "rgb(30, 30, 150)"],
    ["rgb(245, 205, 245)", "rgb(125, 35, 115)"],
    ["rgb(230, 250, 225)", "rgb(35, 105, 50)"],
    ["rgb(245, 215, 215)", "rgb(125, 30, 30)"],
    ["rgb(235, 215, 245)", "rgb(90, 25, 105)"],
    ["rgb(215, 245, 235)", "rgb(15, 70, 70)"],
  ],
  modeChangerFunc = () => {
    const randomeColorSet = Math.trunc(Math.random() * modeColors.length);

    if (modeChanger.textContent === "Dark M.") {
      modeChanger.textContent = "Light M.";
      documentEl.style.setProperty(
        "--primary-color",
        modeColors[randomeColorSet][1]
      );
      documentEl.style.setProperty(
        "--secondary-color",
        modeColors[randomeColorSet][0]
      );
      documentEl.style.setProperty("--noise", 'url("/img/noise-effect-2.png")');
    } else {
      modeChanger.textContent = "Dark M.";
      documentEl.style.setProperty(
        "--primary-color",
        modeColors[randomeColorSet][0]
      );
      documentEl.style.setProperty(
        "--secondary-color",
        modeColors[randomeColorSet][1]
      );
      documentEl.style.setProperty("--noise", 'url("/img/noise-effect.png")');
    }
  };

documentEl.style.setProperty("--vh", innerHeight + "px");
modeChanger.addEventListener("click", modeChangerFunc);
