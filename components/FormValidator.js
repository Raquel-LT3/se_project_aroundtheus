class FormValidator {
  constructor(settings, formElement) {
    this._formSelector = settings.formSelector;
    this._inputSelector = settings.inputSelector;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._inputErrorClass = settings.inputErrorClass;
    this._errorClass = settings.errorClass;
    this._form = formElement;
    this._submitButtonElement = this._form.querySelector(
      this._submitButtonSelector
    );
    this._inputList = Array.from(
      this._form.querySelectorAll(this._inputSelector)
    );
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this.disableSubmitButton(); // Reusing the public disable method
      return;
    }
    this._submitButtonElement.classList.remove(this._inactiveButtonClass);
    this._submitButtonElement.disabled = false;
  }

  _hasInvalidInput() {
    return !this._inputList.every((inputEl) => inputEl.validity.valid); // Check if all inputs are valid
  }

  _setEventListeners() {
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    }); //

    this._toggleButtonState(); // Set initial button state when listeners are active
  }

  _checkInputValidity(inputElement) {
    const errorMessageEl = this._form.querySelector(
      `#${inputElement.id}-error`
    );
    if (!inputElement.validity.valid) {
      inputElement.classList.add(this._inputErrorClass);
      errorMessageEl.textContent = inputElement.validationMessage;
      errorMessageEl.classList.add(this._errorClass);
    } else {
        // If the input is valid, remove error styling and message
      inputElement.classList.remove(this._inputErrorClass);
      errorMessageEl.textContent = "";
      errorMessageEl.classList.remove(this._errorClass);
    }
  }

  // Disables the submit button and applies inactive styling
  disableSubmitButton() {
    this._submitButtonElement.classList.add(this._inactiveButtonClass);
    this._submitButtonElement.disabled = true;
  }

  // Resets the validation state of the form
  resetValidation() {
    this._inputList.forEach(inputElement => {
      const errorMessageEl = this._form.querySelector(
        `#${inputElement.id}-error`
      );
      // Reuse the logic from the 'else' block of _checkInputValidity
      inputElement.classList.remove(this._inputErrorClass);
      if (errorMessageEl) { // Check if errorMessageEl exists before accessing properties
        errorMessageEl.textContent = "";
        errorMessageEl.classList.remove(this._errorClass);
      }
    });

    
    this.disableSubmitButton(); // Reuse the disable method to reset button state
  }

  enableValidation() {
    this._form.addEventListener("submit", (e) => {
    });
    this._setEventListeners(); // Initialize event listeners for inputs
  }
}

export default FormValidator;