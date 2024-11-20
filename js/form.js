const contactBtns = document.querySelectorAll(".contact-btn"),
  formSect = document.querySelector("#form-sect"),
  formEl = document.querySelector("form"),
  formCloser = document.querySelector("#form-closer"),
  checkBoxEls = document.querySelectorAll(".checkbox"),
  inputEls = document.querySelectorAll(".input"),
  inputName = document.querySelector("#inp-name"),
  inputMail = document.querySelector("#inp-mail"),
  inputBudget = document.querySelector("#inp-budget"),
  inputDescribtion = document.querySelector("#inp-describtion");

contactBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    scrollerObjs[0].isScrollerActive = false;
    formSect.classList.add("active-1");
    formSect.classList.add("active-2");
    setTimeout(() => {
      formSect.classList.add("active-3");
    }, 700);
    isFormActive = true;
    activeNavIndx = -1;
  });
});
formCloser.addEventListener("click", () => {
  formSect.classList.remove("active-3");
  setTimeout(() => {
    formSect.classList.remove("active-2");
    setTimeout(() => {
      formSect.classList.remove("active-1");
      scrollerObjs[0].isScrollerActive = true;
    }, 650);
  }, 750);
  isFormActive = false;
  activeNavIndx = -1;
});

checkBoxEls.forEach((el) => {
  el.addEventListener("click", () => {
    el.classList.toggle("active");
  });
});

inputEls.forEach((el) => {
  el.firstElementChild.addEventListener("focus", () => {
    el.classList.add("active-1");
    setTimeout(() => {
      el.classList.add("active-2");
    }, 300);
  });
  el.firstElementChild.addEventListener("blur", () => {
    if (
      el.firstElementChild.value === "" ||
      el.firstElementChild.value === Number
    ) {
      el.classList.remove("active-2");
      el.classList.remove("active-1");
    }
  });
});

let errorViewTimer = undefined;
const showInvalid = (theEl) => {
  scrollToPoint(theEl, 1);
  theEl.focus();
  theEl.parentElement.classList.add("errorAlert");

  clearTimeout(errorViewTimer);
  errorViewTimer = setTimeout(() => {
    errorViewTimer = undefined;
    theEl.parentElement.classList.remove("errorAlert");
  }, 2500);
};

inputMail.addEventListener("invalid", (theEvent) => {
  theEvent.preventDefault();
  showInvalid(inputMail);
});
inputBudget.addEventListener("invalid", (theEvent) => {
  theEvent.preventDefault();
  showInvalid(inputBudget);
});
const mailValidation = (inputMailValue) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    inputMailValue
  );
};

formEl.addEventListener("submit", (theEvent) => {
  theEvent.preventDefault();

  const checkedBoxEls = document.querySelectorAll(".checkbox.active"),
    inputNameValue = inputName.value.trim(),
    inputMailValue = inputMail.value.trim(),
    inputBudgetValue = inputBudget.value.trim(),
    inputDescribtionValue = inputDescribtion.value.trim();

  if (checkedBoxEls.length === 0) {
    if (
      !scrollerObjs[1].containerEl.classList.contains("hideScrollbarX") ||
      !scrollerObjs[1].containerEl.classList.contains("hideScrollbarY")
    ) {
      scrollToPoint(checkBoxEls[0], 1);
    }
    checkBoxEls.forEach((el, indx) => {
      el.firstElementChild.style.animation = `checkbox-required 0.65s ${
        indx * 90
      }ms cubic-bezier(0.15, 0.35, 0.35, 0.95) 3`;

      setTimeout(() => {
        el.firstElementChild.style.animation = "none";
      }, 2130);
    });
  } else if (inputNameValue === "") {
    showInvalid(inputName);
  } else if (!mailValidation(inputMailValue)) {
    showInvalid(inputMail);
  } else if (
    inputBudgetValue === "" ||
    inputBudgetValue < 10 ||
    inputBudgetValue.includes("e")
  ) {
    showInvalid(inputBudget);
  } else {
    Email.send({
      // Host: "smtp.gmail.com",
      SecureToken: "74d19a0f-2637-4c13-9300-ec0d8f86a95f",
      To: "abdullah.webtest@gmail.com",
      From: "abdullah.webtest@gmail.com",
      Subject: `(DESLOP) - ${inputNameValue} have knocked you for project discussion.`,
      Body: `
      <h1>DESLOP - project request</h1>
      <p>Hi I am ${inputNameValue}. My e-mail is ${inputMailValue}.</p>
      <p>I want ... from you. My budget is ${inputBudgetValue}$.</p>
      <h3>Project describtion -</h3>
      <p>${inputDescribtionValue}</p>
    `,
    }).then((message) => {
      if (message === "OK")
        setTimeout(() => {
          formSect.classList.add("thanks");
          isFormSubmited = true;
          activeNavIndx = -1;
        }, 150);
      else alert(message);
    });
  }
});

console.log();
