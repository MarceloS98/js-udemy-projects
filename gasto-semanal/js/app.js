const form = document.querySelector("#agregar-gasto");

// Con un prompt pedimos el presupuesto, el UI no se genera hasta que recibamos un monto válido
let budget = prompt("Ingrese su presupuesto");

while (budget === "" || isNaN(budget) || budget < 0) {
  budget = prompt("Ingrese su presupuesto");
}

// Clases
// Maneja los eventos del UI
class UI {
  constructor(budget) {
    this.budget = budget;
  }

  // Muestra el presupuesto total
  displayBudget() {
    document.querySelector("#total").textContent = this.budget;
  }

  // Muestra el monto restante
  static displayRemaining() {
    let totalExpense = budget - UI.updateBudget();

    const remainingSpan = document.querySelector("#restante");

    remainingSpan.textContent = totalExpense;

    if (totalExpense < budget * 0.25) {
      remainingSpan.closest("div").className = "restante alert alert-danger";
    } else if (totalExpense < budget * 0.5) {
      remainingSpan.closest("div").className = "restante alert alert-warning";
    } else {
      remainingSpan.closest("div").className = "restante alert alert-success";
    }

    return totalExpense;
  }

  // Actualiza el presupuesto restante
  static updateBudget() {
    let totalExpense = 0;

    const expenses = document.querySelectorAll("#gastos > ul > li");

    expenses.forEach((expense) => {
      let price = expense.querySelector("span").textContent;
      price = Number.parseInt(price.substr(2, price.length));
      totalExpense += price;
    });

    return totalExpense;
  }

  // Shows result message
  showMessage(message) {
    const div = document.createElement("div");
    div.classList.add("text-center", "alert");

    switch (message) {
      // Success
      case "success":
        div.classList.add("alert-success");
        div.textContent = "Gasto agregado correctamente";
        break;

      // Invalid amount
      case "invalid":
        div.classList.add("alert-danger");
        div.textContent = "Monto no válido";
        break;

      // Fields required
      case "required":
        div.classList.add("alert-danger");
        div.textContent = "Ambos campos son obligatorios";
        break;

      default:
        break;
    }

    form.closest("div.contenido.primario").insertBefore(div, form); // Busca al padre del form para poder insertar el div con el insertBefore

    // Remove alert after 3 seconds
    setTimeout(() => {
      form.previousElementSibling.remove();
    }, 3000);
  }
}

// Datos del gasto realizado
class Expense {
  constructor(name, amount) {
    this.name = name;
    this.amount = amount;
  }

  createExpenseItem(container) {
    // li item
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    li.textContent = this.name;

    // Span donde muestra el monto
    const span = document.createElement("span");
    span.classList.add("badge", "badge-primary", "badge-pill");
    span.textContent = `$ ${this.amount}`;

    // Boton para eliminar el item
    const button = document.createElement("button");
    button.classList.add("btn", "btn-danger", "borrar-gasto");
    button.textContent = "Borrar";
    button.addEventListener("click", function () {
      // Remueve el contenedor al que pertenece
      this.closest("li").remove();
      // Actualiza el budget restante
      UI.updateBudget();
      // Muestra el budget restante en el UI y almacena el gasto total
      const totalExpense = UI.displayRemaining();

      // Habilita o desabilita el boton de submit segun el valor de totalExpense
      const submitBtn = form.querySelector("button[type='submit']");
      totalExpense <= 0
        ? (submitBtn.disabled = true)
        : (submitBtn.disabled = false);
    });

    li.append(span, button);

    container.appendChild(li);
  }
}

// Instancia de la clase UI con el budget para que pueda realizar todas las actualizaciones a la interfaz cuando corresponda
let interface = new UI(budget);

// Muestra el budget y el restante al cargar la interfaz
interface.displayBudget();
UI.displayRemaining();

// En el submit, el form crea un  a instancia de la clase expense y se crea un gasto al UI
form.addEventListener("submit", addExpense);

function addExpense(e) {
  e.preventDefault();

  const expensesList = document.querySelector("#gastos > ul");
  const name = form.querySelector("#gasto").value;
  const amount = form.querySelector("#cantidad").value;

  // Valida si los datos del form son correctos
  if (name != "" && amount > 0 && !isNaN(amount)) {
    const expense = new Expense(name, amount);

    interface.showMessage("success");
    expense.createExpenseItem(expensesList);

    UI.updateBudget();
    let totalExpense = UI.displayRemaining();

    form.querySelector("#gasto").value = "";
    form.querySelector("#cantidad").value = "";

    const submitBtn = form.querySelector("button[type='submit']");
    totalExpense <= 0
      ? (submitBtn.disabled = true)
      : (submitBtn.disabled = false);
  } else if (name == "" || amount == "") {
    interface.showMessage("required");
  } else if (amount < 1 || isNaN(amount)) {
    interface.showMessage("invalid");
  }
}
