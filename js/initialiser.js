"use strict";

// Pure Js scrollbar function ---
let scrollContEls = document.querySelectorAll(".parentScrollContainer");

for (let indx = 0; indx < scrollContEls.length; indx++) {
  const scrollpageEls = scrollContEls[indx].innerHTML,
    scrollpageContainerEls = `
        <div id="${"scrollpageContainer" + indx}" class="scrollpageContainer">
          <div id="${"scrollpage" + indx}" class="scrollpage">
            ${scrollpageEls}
          </div>
        </div>
        <div class="scrollbarContainer barY">
          <div id="${"thumbContainerBarY" + indx}" class="thumbContainer">
            <div id="${"thumbBarY" + indx}" class="thumb"></div>
          </div>
        </div>
        <div class="scrollbarContainer barX">
          <div id="${"thumbContainerBarX" + indx}" class="thumbContainer">
            <div id="${"thumbBarX" + indx}" class="thumb"></div>
          </div>
        </div>`;

  scrollContEls[indx].innerHTML = scrollpageContainerEls;
  scrollContEls = document.querySelectorAll(".parentScrollContainer");
}

const bodyEl = document.body,
  imgEls = document.querySelectorAll("img"),
  allHoverableEls = [
    ...document.querySelectorAll("a"),
    ...document.querySelectorAll("button"),
    ...document.querySelectorAll(".checkbox"),
    ...document.querySelectorAll("input"),
    ...document.querySelectorAll("textarea"),
    ...imgEls,
    document.querySelector("#modeChanger"),
  ];

bodyEl.scrollTo(0, 0);

allHoverableEls.forEach((el) => {
  if (el.tagName !== "IMG" && el.tagName !== "P")
    el.classList.add("navigatorEl");
});
const allNavigators = [
  document.querySelectorAll(".navigatorEl"),
  document.querySelectorAll("#form-sect .navigatorEl"),
  document.querySelectorAll("#form-sect .sub-cont .navigatorEl"),
];
allNavigators[0] = [...allNavigators[0]].splice(
  0,
  [...allNavigators[0]].indexOf(allNavigators[1][0])
);
allNavigators[1] = [...allNavigators[1]].splice(
  0,
  [...allNavigators[1]].indexOf(allNavigators[2][0])
);
allNavigators[2] = [allNavigators[1][0], ...allNavigators[2]];

const singleLinks = document.querySelectorAll(".singleLinks");
singleLinks.forEach((link) => {
  link.insertAdjacentHTML(
    "beforeend",
    `
    <object
      class="svg"
      data="./img/icons/arrow.svg"
      type="image/svg+xml"
      data-class="svg-icon"
    ></object>
    `
  );
});

const subNavs = document.querySelectorAll(".subNavs");
subNavs.forEach((nav) => {
  nav.insertAdjacentHTML(
    "afterbegin",
    `
    <object
      class="svg"
      data="./img/icons/arrow.svg"
      type="image/svg+xml"
      data-class="svg-icon"
    ></object>
    `
  );
});
