// components/PopupWithForm.js

import Popup from "./Popup.js";

export default class PopupWithForm extends Popup { // extends Popup class
  constructor({ popupSelector, handleFormSubmit }) {
    super({ popupSelector });
    this._handleFormSubmit = handleFormSubmit;
    this._popupForm = this._popup.querySelector(".modal__form"); // select the form element
    this._inputElements = Array.from(this._popupForm.elements).filter(
      (el) => el.classList.contains("modal__input")
    );
  }

  _getInputValues() {
    const inputValues = {}; // object to hold input values
    this._inputElements.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._popupForm.addEventListener("submit", (evt) => { // handle form submission
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
