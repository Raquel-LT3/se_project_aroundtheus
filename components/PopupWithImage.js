// components/PopupWithImage.js

import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor({ popupSelector }) {
    super({ popupSelector }); // Call the parent constructor
    this._imageElement = this._popup.querySelector(".modal__image");
    this._captionElement = this._popup.querySelector(".modal__caption");
  }

  // Method to open the popup with an image and caption
  open({ name, link }) {
    this._imageElement.src = link;
    this._imageElement.alt = name;
    this._captionElement.textContent = name;
    super.open();
  }
}
