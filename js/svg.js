// Handling Page Load Event
window.addEventListener("load", function () {
  const svgObjects = document.querySelectorAll("object.svg");

  svgObjects.forEach((theObj) => {
    const svgDocument = theObj.contentDocument;
    const parentElement = theObj.parentElement;
    const styleClass = theObj.dataset.class;

    if (svgDocument && svgDocument.isConnected && styleClass) {
      // If connection  succeed
      const mainSvg = svgDocument.querySelector("svg");
      mainSvg.classList.add(styleClass);
      parentElement.replaceChild(mainSvg, theObj);
      // console.log(parentElement);
    }
  });
});
