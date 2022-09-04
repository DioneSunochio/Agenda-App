import validator from "validator";

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.valid(e);
    });
  }

  valid(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]');
    const passwordInput = el.querySelector('input[name="password"]');
    let error = false;

    if (!validator.isEmail(emailInput.value)) {
      alert("Invalid Email.");
      error = true;
    }
    if (passwordInput.value.length < 6 || passwordInput.value.length > 30) {
      alert("The password must be between 6 and 50 characters.");
      error = true;
    }

    if (!error) el.submit();
  }
}
