// components/Popup.js

export default class Popup {
  constructor({ popupSelector }) {
    this._popup = document.querySelector(popupSelector);
    this._closeButton = this._popup.querySelector(".modal__close");
  }

  open() {
    this._popup.classList.add("modal_opened");
    document.addEventListener("keyup", this._handleEscClose);
    this._popup.addEventListener("mousedown", this._handleOverlayClose);
  }

  close() {
    this._popup.classList.remove("modal_opened");
    document.removeEventListener("keyup", this._handleEscClose);
    this._popup.removeEventListener("mousedown", this._handleOverlayClose);
  }

  _handleEscClose = (evt) => { // Close popup on Escape key press
    if (evt.key === "Escape") {
      this.close();
    }
  };

  _handleOverlayClose = (evt) => {
    if (
      evt.target.classList.contains("modal_opened") ||
      evt.target.classList.contains("modal__close")
    ) {
      this.close();
    }
  };

  setEventListeners() {
    this._closeButton.addEventListener("click", () => this.close());
  }
}
