// components/PopupWithConfirmation.js
import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor({ popupSelector }) {
    super({ popupSelector });
    this._confirmButton = this._popup.querySelector(".modal__button-confirmation");
    this._form = this._popup.querySelector(".modal__form"); // grab the form
  }

  setSubmitAction(action) {
    this._handleSubmitAction = action;
  }

  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault(); // ✅ prevent page reload
      if (this._handleSubmitAction) {
        this._handleSubmitAction();
      }
    });
  }
}
