const stickyEls = document.querySelectorAll(".stickyEl");

const paralluxElements = document.querySelectorAll(".paralluxElements"),
  paralluxObjs = [];

const imgParalluxElements = document.querySelectorAll(".imgParalluxElements"),
  imgParalluxObjs = [];

let theDeviece = "big";
if (innerWidth < 1300 && innerWidth > 750) theDeviece = "medium";
else if (innerWidth < 750) theDeviece = "small";

setTimeout(() => {
  // ---------
  // --- Positioning Fixed & Sticky ---
  const positioningFixed = () => {
    fixedEls.forEach((fixedEl) => {
      let positions = [0, fixedEl.getBoundingClientRect().top];
      if (fixedEl.firstElementChild.getBoundingClientRect().top !== 0)
        fixedEl.firstElementChild.style.transform = `translateY(${-Math.round(
          positions[1]
        )}px)`;
    });
  };

  const positioningSticky = (stickyEl) => {
    let parentClientRect = stickyEl.parentElement.getBoundingClientRect(),
      clientRect = stickyEl.getBoundingClientRect(),
      positions = [parentClientRect.left, parentClientRect.top],
      finishLinePositions = [
        parentClientRect.width - clientRect.width,
        parentClientRect.height - clientRect.height,
      ],
      value = [0, 0];
    positions.forEach((position, indx) => {
      if (position <= 0 && -position <= finishLinePositions[indx])
        value[indx] = -position;
      else if (position > 0) value[indx] = 0;
      else if (-position > finishLinePositions[indx])
        value[indx] = finishLinePositions[indx];
    });
    stickyEl.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${value[0]}, ${value[1]}, 0, 1)`;
    // stickyEl.style.transform = `translate(${value[0]}px, ${value[1]}px)`;
  };
  // --- Positioning Fixed & Sticky ---

  // ---------
  // --- Genaral Parallux ---
  paralluxElements.forEach((element) => {
    const paraluxData = element.dataset.parallux.split(" ");
    const theObj = {
      element,
      startingPoint: 0,
      direction: paraluxData[0],
      paralluxRanges: [paraluxData[1], paraluxData[2]],
      positionPhase: 0,
    };
    element.dataset.point !== undefined
      ? (theObj.startingEl = document.getElementById(element.dataset.point))
      : (theObj.startingEl = element);

    theObj.paralluxHeightWidth =
      paraluxData[0] === "vertical"
        ? theObj.startingEl.getBoundingClientRect().height + innerHeight
        : theObj.startingEl.getBoundingClientRect().width + innerWidth;

    if (theDeviece === "medium")
      theObj.paralluxRanges = [
        Math.trunc(theObj.paralluxRanges[0] / 1.5),
        Math.trunc(theObj.paralluxRanges[1] / 1.5),
      ];
    else if (theDeviece === "small")
      theObj.paralluxRanges = [
        Math.trunc(theObj.paralluxRanges[0] / 2.5),
        Math.trunc(theObj.paralluxRanges[1] / 2.5),
      ];

    paralluxObjs.push(theObj);
  });

  const paraluxAnimator = function () {
    let theStartingPoint = (
        this.direction === "vertical"
          ? this.startingEl.getBoundingClientRect().top - innerHeight
          : this.startingEl.getBoundingClientRect().left - innerWidth
      ).toFixed(2),
      theAnimationValues = [
        Math.round(
          (
            -(theStartingPoint / this.paralluxHeightWidth) *
            this.paralluxRanges[0]
          ).toFixed(2)
        ),
        Math.round(
          (
            -(theStartingPoint / this.paralluxHeightWidth) *
            this.paralluxRanges[1]
          ).toFixed(2)
        ),
      ];

    if (
      theStartingPoint <= 0 &&
      theStartingPoint >= -this.paralluxHeightWidth &&
      Math.round(this.startingPoint) !== Math.round(theStartingPoint)
    ) {
      this.startingPoint = theStartingPoint;
      this.positionPhase = 0;
      this.element.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${theAnimationValues[0]}, ${theAnimationValues[1]}, 0, 1)`;
      // console.log("animation running 0");
    } else if (theStartingPoint > 0 && this.positionPhase !== 1) {
      this.startingPoint = 0;
      this.positionPhase = 1;
      this.element.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`;
      // console.log("animation running 1");
    } else if (
      theStartingPoint < -this.paralluxHeightWidth &&
      this.positionPhase !== 2
    ) {
      this.startingPoint = -this.paralluxHeightWidth;
      this.positionPhase = 2;
      this.element.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${this.paralluxRanges[0]}, ${this.paralluxRanges[1]}, 0, 1)`;
      // console.log("animation running 2");
    }
  };
  // --- Genaral Parallux ---

  // ---------
  // --- Image Parallux ---

  imgParalluxElements.forEach((element) => {
    const paraluxData = element.dataset.parallux.split(" "),
      theObj = {
        element,
        startingEl: element.parentElement,
        startingPoint: 0,
        direction: paraluxData[0],
        paralluxRanges: paraluxData[1],
        positionPhase: 0,
      };
    theObj.paralluxHeightWidth =
      paraluxData[0] === "vertical"
        ? theObj.startingEl.getBoundingClientRect().height + innerHeight
        : theObj.startingEl.getBoundingClientRect().width + innerWidth;

    imgParalluxObjs.push(theObj);
  });

  const imgParaluxAnimator = function () {
    let theStartingPoint = (
        this.direction === "vertical"
          ? this.startingEl.getBoundingClientRect().top - innerHeight
          : this.startingEl.getBoundingClientRect().left - innerWidth
      ).toFixed(2),
      theAnimationValues = (
        -(theStartingPoint / this.paralluxHeightWidth) * this.paralluxRanges
      ).toFixed(2);

    if (
      theStartingPoint <= 0 &&
      theStartingPoint >= -this.paralluxHeightWidth &&
      Math.round(this.startingPoint) !== Math.round(theStartingPoint)
    ) {
      this.startingPoint = theStartingPoint;
      this.positionPhase = 0;
      this.element.style.transform = `scale(${1 + theAnimationValues / 10})`;
      // console.log("animation running 0");
    } else if (theStartingPoint > 0 && this.positionPhase !== 1) {
      this.startingPoint = 0;
      this.positionPhase = 1;
      this.element.style.transform = `scale(1)`;
      // console.log("animation running 1");
    } else if (
      theStartingPoint < -this.paralluxHeightWidth &&
      this.positionPhase !== 2
    ) {
      this.startingPoint = -this.paralluxHeightWidth;
      this.positionPhase = 2;
      this.element.style.transform = `scale(${1 + this.paralluxRanges / 10})`;
      // console.log("animation running 2");
    }
  };
  // --- Image Parallux ---

  const animator = async function () {
    stickyEls.forEach((stickyEl) => positioningSticky(stickyEl));
    paralluxObjs.forEach((theObj) => paraluxAnimator.call(theObj));
    imgParalluxObjs.forEach((theObj) => imgParaluxAnimator.call(theObj));
    scrollerObjs.forEach((theObj) => containerResizer.call(theObj));
    requestAnimationFrame(animator);
  };
  animator();

  // -----
}, 500);
