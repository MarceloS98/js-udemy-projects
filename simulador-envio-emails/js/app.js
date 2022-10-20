const form = document.querySelector("#formulario");
const emailInput = form.querySelector("div:nth-child(1) > input");
const subjectInput = form.querySelector("div:nth-child(2) > input");
const messageInput = form.querySelector("div:nth-child(3) > textarea");
const submitBtn = form.querySelector("#botones > button[type='submit']");
const resetBtn = form.querySelector("#botones > button[type='reset']");
const spinner = document.querySelector("#spinner");

function validateEmail(email) {
  const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  const resultado = regex.test(email);
  return resultado;
}

function handleAlert(e, alertText) {
  const inputContainer = e.target.closest("div");
  const alertMsj = inputContainer.querySelector(".alert");
  switch (e.target) {
    case emailInput:
      const emailIsValid = validateEmail(e.target.value);
      if (emailIsValid && alertMsj) {
        alertMsj.remove();
      } else if (!emailIsValid && alertMsj) {
        alertMsj.textContent = alertText;
      } else if (!emailIsValid && !alertMsj) {
        createAlert(e, alertText);
      }
      break;
    case subjectInput:
      if (subjectInput.value != "" && alertMsj) alertMsj.remove();
      break;
    case messageInput:
      if (messageInput.value != "" && alertMsj) alertMsj.remove();
      break;
  }
}

function handleSubmitBtn() {
  const alerts = form.querySelectorAll(".alert");
  const inputsAreEmpty =
    emailInput.value == "" ||
    subjectInput.value == "" ||
    messageInput.value == "";

  if (inputsAreEmpty) {
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-50");
  } else if (alerts.length === 0 && !inputsAreEmpty) {
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-50");
  } else if (alerts.length === 0 && inputsAreEmpty) {
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-50");
  }
}

function createAlert(e, alertText) {
  const inputContainer = e.target.closest("div");
  if (inputContainer.querySelector(".alert")) return;
  const alertMessage = document.createElement("div");
  alertMessage.className =
    "alert bg-red-600 text-white p-2 text-center font-bold";
  alertMessage.textContent = alertText;
  inputContainer.appendChild(alertMessage);
}

function validateInputs(e) {
  e.target === emailInput
    ? handleAlert(e, "Ingresa un email valido")
    : handleAlert(e);
}

function verifyInput(e) {
  const fieldIsEmpty = e.target.value === "";
  fieldIsEmpty
    ? createAlert(e, "Este campo es obligatorio")
    : validateInputs(e);

  handleSubmitBtn();
}

function clearAlerts(e) {
  e.preventDefault();
  const alerts = form.querySelectorAll(".alert");
  alerts.forEach((alert) => alert.remove());

  emailInput.value = "";
  subjectInput.value = "";
  messageInput.value = "";

  handleSubmitBtn();
}

function sendEmail(e) {
  e.preventDefault();
  spinner.classList.remove("hidden");
  spinner.classList.add("flex");

  setTimeout(() => {
    spinner.classList.remove("flex");
    spinner.classList.add("hidden");

    resetBtn.click();

    const alertaExito = document.createElement("p");
    alertaExito.classList.add(
      "bg-green-500",
      "text-white",
      "p-2",
      "text-center",
      "rounded-lg",
      "mt-10",
      "font-bold",
      "text-sm",
      "uppercase"
    );

    alertaExito.textContent = "Mensaje enviado correctamente";
    form.appendChild(alertaExito);

    setTimeout(() => {
      alertaExito.remove();
    }, 2000);
  }, 3000);
}

emailInput.addEventListener("blur", verifyInput);
subjectInput.addEventListener("blur", verifyInput);
messageInput.addEventListener("blur", verifyInput);
resetBtn.addEventListener("click", clearAlerts);
form.addEventListener("submit", sendEmail);
