// components/PopupWithForm.js

import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  // Inherit from Popup class
  constructor({ popupSelector, handleFormSubmit }) {
    super({ popupSelector });
    this._handleFormSubmit = handleFormSubmit;
    this._popupForm = this._popup.querySelector(".modal__form");
    this._inputElements = Array.from(this._popupForm.elements).filter(
      (element) => element.classList.contains("modal__input")
    );
  }

  _getInputValues() {
    const inputValues = {};
    this._inputElements.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues; // Collect values from input fields
  }

  setEventListeners() {
    super.setEventListeners();
    this._popupForm.addEventListener("submit", (evt) => {
      // Handle form submission
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  resetForm() {
    this._popupForm.reset();
  }

  getForm() {
    return this._popupForm;
  }
}
