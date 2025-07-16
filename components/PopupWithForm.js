// components/PopupWithForm.js

import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit }) {
    super({ popupSelector }); // Correctly passes object to parent
    this._handleFormSubmit = handleFormSubmit;
    this._popupForm = this._popup.querySelector(".modal__form"); // Ensure the form is correctly selected
    this._inputElements = Array.from(this._popupForm.elements).filter(
      (element) => element.classList.contains("modal__input")
    );
  }

  _getInputValues() {
    const inputValues = {};
    this._inputElements.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;  // Collect values from all input fields
  }

  setEventListeners() {
    super.setEventListeners(); // Call the parent method to set up close button and overlay listeners
    this._popupForm.addEventListener("submit", (evt) => { 
      this._handleFormSubmit(this._getInputValues());
    });
  }

  resetForm() {
    this._popupForm.reset(); // Reset the form fields
  }
}
