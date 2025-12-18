// components/PopupWithImage.js

import Popup from "./Popup.js";

export default class PopupWithImage extends Popup { // extends Popup class
  constructor({ popupSelector }) {
    super({ popupSelector });
    this._imageElement = this._popup.querySelector(".modal__image"); // select the image element
    this._captionElement = this._popup.querySelector(".modal__caption"); // select the caption element
  }

  open({ name, link }) {
    this._imageElement.src = link; // set image source
    this._imageElement.alt = name; // set image alt text
    this._captionElement.textContent = name; // set caption text
    super.open();
  }
}
