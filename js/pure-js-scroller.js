const scrollSpeed = Math.round((130 * innerHeight) / 750),
  BtnScrollerRange = Math.round((450 * innerHeight) / 750),
  scrollerObjs = [],
  lastcurrentActiveScrollerObjs = [];

let btnScrollAnimator = undefined,
  btnMousePosition = [0, 0],
  wheelBtnPressing = false,
  mainActiveScrollerObj = undefined,
  currentActiveScrollerObj = undefined,
  passedActiveScrollerEl = 0,
  activeScrollerThumb = undefined,
  activeThumbGrabOffset = undefined,
  activeThumbAxis = undefined,
  activeScrollerPassTimer = undefined,
  isTuching = false,
  mainScrollDirection = undefined;

const mouseFollower = document.querySelector("#mouseFollower");
let isMouseActive = false,
  isMouseFollower = true;

const scrollableHeightCalc = function () {
  this.scrollableHeight[0] =
    this.scrollpage.clientWidth - this.scrollpageContainer.clientWidth;
  this.scrollableHeight[1] =
    this.scrollpage.clientHeight - this.scrollpageContainer.clientHeight;
};

const scrollbarHeightCalc = function (scrollbar, indx) {
  let scrollbarAxis, heightOrWidth, scrollbarContMeasure;
  if (indx === 0) {
    scrollbarAxis = "X";
    heightOrWidth = "width";
    scrollbarContMeasure = "clientWidth";
  } else {
    scrollbarAxis = "Y";
    heightOrWidth = "height";
    scrollbarContMeasure = "clientHeight";
  }
  let scrollbarContHeightOrWidth = scrollbar.container[scrollbarContMeasure],
    thumbHeightOrWidth = Math.round(
      scrollbarContHeightOrWidth /
        (this.scrollpage[scrollbarContMeasure] / scrollbarContHeightOrWidth)
    );

  if (thumbHeightOrWidth < scrollbarContHeightOrWidth) {
    if (thumbHeightOrWidth > 40)
      scrollbar.thumbHeightOrWidth = thumbHeightOrWidth;
    else scrollbar.thumbHeightOrWidth = 40;
    if (this.containerEl.classList.contains("hideScrollbar" + scrollbarAxis)) {
      this.containerEl.classList.remove("hideScrollbar" + scrollbarAxis);
      this.mainScrollbarIndx[indx] = true;
    }

    let scrollbarScrollableHeight =
      scrollbarContHeightOrWidth - scrollbar.thumbHeightOrWidth;
    scrollbar.thumbScrollableHeight = scrollbarScrollableHeight;
    this.scrollbarMoveRatio[indx] = (
      this.scrollableHeight[indx] / scrollbarScrollableHeight
    ).toFixed(3);

    scrollbar.thumb.style[heightOrWidth] = scrollbar.thumbHeightOrWidth + "px";
  } else {
    scrollbar.thumbHeightOrWidth = scrollbarContHeightOrWidth;
    if (!this.containerEl.classList.contains("hideScrollbar" + scrollbarAxis)) {
      this.containerEl.classList.add("hideScrollbar" + scrollbarAxis);
      this.mainScrollbarIndx[indx] = false;
    }
  }
};

const currentObjChanger = (
  doNotChangeCurrentObj,
  isTuching,
  mainScrollvalue,
  indx
) => {
  if (
    !doNotChangeCurrentObj &&
    currentActiveScrollerObj !== scrollerObjs[0] &&
    btnScrollAnimator === undefined
  ) {
    if (!isTuching) {
      currentObjChangerCancel();
      activeScrollerPassTimer = setTimeout(() => {
        const theCondition = changeCurrentObj();
        if (theCondition) {
          activeScrollerPassTimer = undefined;
        }
      }, 450);
    } else {
      const theCondition = changeCurrentObj();
      if (theCondition) {
        scroller(mainScrollvalue, indx, false, true);
        passedActiveScrollerEl = 0;
        currentActiveScrollerObj = mainActiveScrollerObj;
      }
    }
  }
};

const currentObjChangerCancel = () => {
  if (activeScrollerPassTimer !== undefined) {
    clearTimeout(activeScrollerPassTimer);
    activeScrollerPassTimer = undefined;
  }
};

const changeCurrentObj = () => {
  const nextObj =
    lastcurrentActiveScrollerObjs[
      lastcurrentActiveScrollerObjs.length - (passedActiveScrollerEl + 1)
    ];
  if (nextObj?.isScrollerActive) {
    passedActiveScrollerEl += 1;
    currentActiveScrollerObj = nextObj;
    return true;
  } else return false;
};

const scroller = function (
  scrollValue,
  indx,
  doNotChangeCurrentObj,
  isTuching
) {
  if (!currentActiveScrollerObj.isScrollerActive) return;

  let mainScrollvalue = scrollValue;

  if (
    currentActiveScrollerObj.mainScrollbarIndx[0] ||
    currentActiveScrollerObj.mainScrollbarIndx[1]
  ) {
    scrollValue =
      currentActiveScrollerObj.scrollPosition[indx] + mainScrollvalue;
    let scrollableHeight = currentActiveScrollerObj.scrollableHeight[indx];

    if (scrollableHeight > 0) {
      if (scrollValue < 0) {
        currentActiveScrollerObj.scrollPosition[indx] = 0;
        currentObjChanger(
          doNotChangeCurrentObj,
          isTuching,
          mainScrollvalue,
          indx
        );
      } else if (scrollValue > scrollableHeight) {
        currentActiveScrollerObj.scrollPosition[indx] = scrollableHeight;
        currentObjChanger(
          doNotChangeCurrentObj,
          isTuching,
          mainScrollvalue,
          indx
        );
      } else {
        currentActiveScrollerObj.scrollPosition[indx] = scrollValue;
        currentObjChangerCancel();
      }

      // currentActiveScrollerObj.scrollpage.style.margin = `${-currentActiveScrollerObj
      //   .scrollPosition[1]}px 0 0 ${-currentActiveScrollerObj
      //   .scrollPosition[0]}px`;
      currentActiveScrollerObj.scrollpage.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${-currentActiveScrollerObj
        .scrollPosition[0]}, ${-currentActiveScrollerObj
        .scrollPosition[1]}, 0, 1)`;

      scrollbarThumbMover.call(currentActiveScrollerObj, indx);
    }
  } else if (currentActiveScrollerObj !== scrollerObjs[0]) {
    if (btnScrollAnimator === undefined && !isTuching) changeCurrentObj();
    else if (btnScrollAnimator === undefined && isTuching) {
      changeCurrentObj();
      scroller(mainScrollvalue, indx, false, true);
      passedActiveScrollerEl = 0;
      currentActiveScrollerObj = mainActiveScrollerObj;
    }
  }
};

const scrollbarThumbMover = function (indx) {
  let theValue = Math.round(
    this.scrollPosition[indx] / this.scrollbarMoveRatio[indx]
  );

  if (theValue > this.scrollbars[indx].thumbScrollableHeight)
    this.scrollThumbPosition[indx] =
      this.scrollbars[indx].thumbScrollableHeight;
  else if (theValue < 0) this.scrollThumbPosition[indx] = 0;
  else this.scrollThumbPosition[indx] = theValue;

  this.scrollbars[indx].thumb.style.transform = `translate${
    indx === 0 ? "X" : "Y"
  }(${this.scrollThumbPosition[indx]}px)`;
};

const pageMoverByThumb = function (indx) {
  currentActiveScrollerObj.scrollPosition[indx] = Math.round(
    currentActiveScrollerObj.scrollThumbPosition[indx] *
      currentActiveScrollerObj.scrollbarMoveRatio[indx]
  );

  // currentActiveScrollerObj.scrollpage.style.margin = `${-currentActiveScrollerObj
  //   .scrollPosition[1]}px 0 0 ${-currentActiveScrollerObj.scrollPosition[0]}px`;
  currentActiveScrollerObj.scrollpage.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${-currentActiveScrollerObj
    .scrollPosition[0]}, ${-currentActiveScrollerObj.scrollPosition[1]}, 0, 1)`;
};

const scrollToPoint = (theEl, scrollerObjIndx) => {
  const oldCurrentActiveScrollerObj = currentActiveScrollerObj,
    clientRect = theEl.getBoundingClientRect();

  currentActiveScrollerObj = scrollerObjIndx
    ? scrollerObjs[scrollerObjIndx]
    : scrollerObjs[0];

  scroller(clientRect.left - innerWidth / 4, 0);
  scroller(clientRect.top - innerHeight / 4, 1);

  currentActiveScrollerObj = oldCurrentActiveScrollerObj;
};

const deactivateScrollerThumb = (doNotChangeCurrentObj) => {
  if (activeScrollerThumb !== undefined) {
    activeScrollerThumb.thumb.classList.remove("activeThumb");
    currentActiveScrollerObj.scrollpage.classList.remove("activeThumbPage");
    bodyEl.classList.remove("activeThumbBody");
    activeScrollerThumb = undefined;
    activeThumbGrabOffset = undefined;
  }
  if (!doNotChangeCurrentObj) currentActiveScrollerObj = mainActiveScrollerObj;
};

const addScrlContObj = (containerEl, indx) => {
  const theObj = {
    containerEl,
    scrollpageContainer: document.querySelector("#scrollpageContainer" + indx),
    scrollpage: document.querySelector("#scrollpage" + indx),
    scrollableHeight: [0, 0],
    scrollbars: [
      {
        container: document.querySelector("#thumbContainerBarX" + indx),
        thumb: document.querySelector("#thumbBarX" + indx),
        thumbHeightOrWidth: undefined,
        thumbScrollableHeight: undefined,
      },
      {
        container: document.querySelector("#thumbContainerBarY" + indx),
        thumb: document.querySelector("#thumbBarY" + indx),
        thumbHeightOrWidth: undefined,
        thumbScrollableHeight: undefined,
      },
    ],
    scrollbarMoveRatio: [0, 0],
    scrollPosition: [0, 0],
    scrollThumbPosition: [0, 0],
    mainScrollbarIndx: [true, true],
    isScrollerActive: true,
  };

  scrollableHeightCalc.call(theObj);
  scrollbarHeightCalc.call(theObj, theObj.scrollbars[0], 0);
  scrollbarHeightCalc.call(theObj, theObj.scrollbars[1], 1);
  scrollerObjs.push(theObj);
};

scrollContEls.forEach((containerEl, indx) => {
  addScrlContObj(containerEl, indx);

  containerEl.addEventListener("pointerenter", () => {
    if (indx !== 0) lastcurrentActiveScrollerObjs.push(mainActiveScrollerObj);
    mainActiveScrollerObj = scrollerObjs[indx];
    if (!activeScrollerThumb && btnScrollAnimator === undefined && !isTuching) {
      currentActiveScrollerObj = mainActiveScrollerObj;
      currentObjChangerCancel();
    }
  });
  containerEl.addEventListener("pointerleave", () => {
    mainActiveScrollerObj =
      lastcurrentActiveScrollerObjs.pop() || scrollerObjs[0];
    if (!activeScrollerThumb && btnScrollAnimator === undefined && !isTuching) {
      currentObjChangerCancel();
      currentActiveScrollerObj = mainActiveScrollerObj;
      passedActiveScrollerEl = 0;
    }
  });

  scrollerObjs[indx].scrollbars.forEach((scrollbar, index) => {
    scrollbar.thumb.addEventListener("pointerdown", (theEvent) => {
      activeScrollerThumb = scrollbar;
      activeThumbAxis = index;
      activeThumbGrabOffset = theEvent[`offset${index === 0 ? "X" : "Y"}`];
      activeScrollerThumb.thumb.classList.add("activeThumb");
      currentActiveScrollerObj.scrollpage.classList.add("activeThumbPage");
      bodyEl.classList.add("activeThumbBody");
    });
  });
});

scrollerObjs[0].isScrollerActive = false;
mainActiveScrollerObj = scrollerObjs[0];
currentActiveScrollerObj = mainActiveScrollerObj;
currentActiveScrollerObj.scrollpageContainer.scrollTo(0, 0);
mainScrollDirection = scrollerObjs[0].containerEl.classList.contains(
  "fixedWidth"
)
  ? "vertical"
  : "horizontal";

const containerResizer = function () {
  let thisScrollableHeight = [...this.scrollableHeight];
  scrollableHeightCalc.call(this);

  this.scrollpageContainer.scrollTo(0, 0);

  thisScrollableHeight.forEach((scrollableHeight, indx) => {
    if (scrollableHeight !== this.scrollableHeight[indx]) {
      scrollbarHeightCalc.call(this, this.scrollbars[indx], indx);
      scrollbarThumbMover.call(this, indx);
      scrollableHeight = this.scrollableHeight[indx];

      if (scrollableHeight <= 0) this.scrollPosition[indx] = 0;
      else if (this.scrollPosition[indx] > scrollableHeight)
        this.scrollPosition[indx] = scrollableHeight;
      else if (this.scrollPosition[indx] < 0) this.scrollPosition[indx] = 0;

      // this.scrollpage.style.margin = `${-this.scrollPosition[1]}px 0 0 ${-this
      //   .scrollPosition[0]}px`;
      this.scrollpage.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${-this
        .scrollPosition[0]}, ${-this.scrollPosition[1]}, 0, 1)`;
    }
  });
};

// const resizer = () => {
// scrollerObjs.forEach((theObj) => containerResizer.call(theObj));
//   requestAnimationFrame(resizer);
// };
// resizer();

window.addEventListener("resize", () => {
  scrollerObjs.forEach((theObj) => containerResizer.call(theObj));

  documentEl.style.setProperty("--vh", innerHeight + "px");
});

window.addEventListener("wheel", (theEvent) => {
  deactivateScrollerThumb(true);

  if (!theEvent.ctrlKey) {
    let scrollValue = theEvent.deltaY > 0 ? scrollSpeed : -scrollSpeed;

    if (!currentActiveScrollerObj.mainScrollbarIndx[1]) {
      scroller(scrollValue, 0);
    } else {
      if (theEvent.shiftKey) {
        scroller(scrollValue, 0);
      } else {
        scroller(scrollValue, 1);
      }
    }
  }
});

window.addEventListener("keydown", (theEvent) => {
  deactivateScrollerThumb(true);

  if (!theEvent.shiftKey && !theEvent.ctrlKey) {
    if (theEvent.code === "ArrowUp") scroller(-scrollSpeed, 1);
    else if (theEvent.code === "ArrowDown") scroller(scrollSpeed, 1);
    else if (theEvent.code === "ArrowLeft") scroller(-scrollSpeed, 0);
    else if (theEvent.code === "ArrowRight") scroller(scrollSpeed, 0);
  }
  if (theEvent.code === "Tab") {
    theEvent.preventDefault();

    let activeElsIndx = 0;
    if (isFormActive && isFormSubmited) {
      activeElsIndx = 2;
    } else if (isFormActive && !isFormSubmited) {
      activeElsIndx = 1;
    }

    if (!theEvent.shiftKey) {
      if (allNavigators[activeElsIndx][activeNavIndx + 1] !== undefined)
        activeNavIndx++;
      else activeNavIndx = 0;
    } else {
      if (activeNavIndx === 0)
        activeNavIndx = allNavigators[activeElsIndx].length - 1;
      else activeNavIndx--;
    }

    let activeEl = allNavigators[activeElsIndx][activeNavIndx];
    currentActiveScrollerObj.scrollpage.style.position = "fixed";
    activeEl.focus();
    currentActiveScrollerObj.scrollpage.style.position = "relative";

    scrollToPoint(activeEl);
  }
});

let touchPosition = undefined;

window.addEventListener("pointerdown", (theEvent) => {
  if (theEvent.pointerType === "mouse")
    mouseFollower.classList.add("clickPressing");

  if (theEvent.button === 1 && !theEvent.shiftKey && !theEvent.ctrlKey) {
    theEvent.preventDefault();
    deactivateScrollerThumb();
    bodyEl.classList.add("activeMiddleMouseBtn");

    wheelBtnPressing = true;
    btnScrollAnimator = setInterval(() => {
      scroller(btnMousePosition[0], 0, true);
      scroller(btnMousePosition[1], 1, true);
    }, 100);
    isMouseFollower = false;
  }
  if (theEvent.pointerType === "touch") {
    isTuching = true;
    touchPosition = [theEvent.clientX, theEvent.clientY];

    // currentActiveScrollerObj.scrollpage.classList.add("activeThumbPage");
  }
});

window.addEventListener("pointerup", (theEvent) => {
  deactivateScrollerThumb();
  if (theEvent.pointerType === "mouse")
    mouseFollower.classList.remove("clickPressing");

  if (theEvent.button === 1) {
    wheelBtnPressing = false;
    btnMousePosition[0] = 0;
    btnMousePosition[1] = 0;
    bodyEl.classList.remove("activeMiddleMouseBtn");
    isMouseFollower = true;
  }
  if (btnScrollAnimator !== undefined) {
    clearInterval(btnScrollAnimator);
    btnScrollAnimator = undefined;
  }
  if (isTuching) {
    isTuching = false;
    touchPosition = undefined;
    // currentActiveScrollerObj.scrollpage.classList.remove("activeThumbPage");
  }
});

window.addEventListener("pointermove", (theEvent) => {
  if (!isMouseActive && theEvent.pointerType === "mouse") isMouseActive = true;
  else if (isMouseActive) isMouseActive = false;

  if (passedActiveScrollerEl > 0 && btnScrollAnimator === undefined) {
    currentActiveScrollerObj = mainActiveScrollerObj;
    passedActiveScrollerEl = 0;
    currentObjChangerCancel();
  }

  if (activeScrollerThumb !== undefined) {
    let thumbScrollableHeight = activeScrollerThumb.thumbScrollableHeight,
      scrollbarAxis = activeThumbAxis === 0 ? "X" : "Y",
      thumbPosition =
        theEvent["client" + scrollbarAxis] - activeThumbGrabOffset;
    // thumbPosition =
    //   currentActiveScrollerObj.scrollThumbPosition[activeThumbAxis] +
    //   theEvent["movement" + scrollbarAxis];

    if (thumbPosition >= thumbScrollableHeight)
      currentActiveScrollerObj.scrollThumbPosition[activeThumbAxis] =
        thumbScrollableHeight;
    else if (thumbPosition <= 0)
      currentActiveScrollerObj.scrollThumbPosition[activeThumbAxis] = 0;
    else
      currentActiveScrollerObj.scrollThumbPosition[activeThumbAxis] =
        thumbPosition;

    activeScrollerThumb.thumb.style.transform = `translate${scrollbarAxis}(${currentActiveScrollerObj.scrollThumbPosition[activeThumbAxis]}px)`;
    pageMoverByThumb(activeThumbAxis);
  } else if (isTuching && btnScrollAnimator === undefined) {
    let mousePosition = [
      touchPosition[0] - theEvent.clientX,
      touchPosition[1] - theEvent.clientY,
    ];
    touchPosition = [theEvent.clientX, theEvent.clientY];
    // if (Math.abs(mousePosition[0]) < 5 || Math.abs(mousePosition[1]) < 5) {
    //   currentActiveScrollerObj.scrollpage.classList.add("activeThumbPage");
    // }
    // if (Math.abs(mousePosition[0]) > 5 || Math.abs(mousePosition[1]) > 5) {
    //   currentActiveScrollerObj.scrollpage.classList.remove("activeThumbPage");
    // }
    mousePosition.forEach((position, indx) => {
      scroller(position * 1.5, indx, false, true);
    });
    // console.log(mousePosition[1], theEvent);
  } else if (wheelBtnPressing === true) {
    let mousePosition = [
      btnMousePosition[0] + theEvent.movementX,
      btnMousePosition[1] + theEvent.movementY,
    ];
    mousePosition.forEach((position, indx) => {
      if (Math.abs(position) <= BtnScrollerRange)
        btnMousePosition[indx] = position;
    });
  }
});

// window.addEventListener("touchend", (e) => {
// e.preventDefault();
// console.log(e.target.tagName !== "A" || "BUTTON");
// console.log(e.target.tagName);
// });

// --
// Mouse interector
const mouseInterector = document.querySelector(".mouseInterector"),
  mouseInterectorParent = mouseInterector.parentElement;

window.addEventListener("mousemove", (theEvent) => {
  if (isMouseActive && isMouseFollower) {
    mouseFollower.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${theEvent.clientX}, ${theEvent.clientY}, 0, 1)`;

    if (
      scrollerObjs[0].isScrollerActive &&
      mouseInterectorParent.getBoundingClientRect().top >
        -mouseInterectorParent.getBoundingClientRect().height
    ) {
      const halfInnerHeight = innerHeight / 2,
        halfInnerWidth = innerWidth / 2,
        valueX = ((theEvent.clientX - halfInnerWidth) / halfInnerWidth).toFixed(
          2
        ),
        valueY = (
          (theEvent.clientY - halfInnerHeight) /
          halfInnerHeight
        ).toFixed(2);

      mouseInterector.style.transform = `translate(${-valueX * 30}px, ${
        -valueY * 30
      }px) rotateX(${valueY * 19}deg) rotateY(${valueX * 19}deg) rotateZ(${
        -valueX * 3
      }deg) skew(${valueX * 5}deg, ${valueY * 5}deg)`;
    }
  }
});

bodyEl.addEventListener(
  "pointerenter",
  (theEvent) => {
    if (theEvent.pointerType === "mouse") mouseFollower.style.opacity = 1;
  },
  false
);

bodyEl.addEventListener(
  "pointerleave",
  (theEvent) => {
    if (theEvent.pointerType === "mouse") mouseFollower.style.opacity = 0;
    mouseInterector.style.transform = "none";
  },
  false
);
// ------------------ Alhamdulillah
