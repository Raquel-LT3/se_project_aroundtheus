export default class Card {
  constructor({ name, link }, cardSelector, openImageModal) {
    console.log({ name, link }, cardSelector); // Log the card data and selector for debugging
    this._name = name;
    this._link = link;
    this._cardSelector = cardSelector;
    this._openImageModal = openImageModal; // Function to open the image modal
  }

  _getTemplate() {
    const getCardTemplate = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return getCardTemplate; // Returns a cloned card template element
  }

  _setEventListeners() {
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._handleLikeIcon(); // Toggle the like button state
      });
    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._handleDeleteCard(); // Remove the card from the DOM
      });

    this._cardImage.addEventListener("click", () => {
      this._openImageModal({ link: this._link, name: this._name });
    }); // Open the image modal with the card's link and name
  }

  _handleDeleteCard() {
    this._cardElement.remove();
    this._cardElement = null; // Remove the card element from the DOM
  } 

  _handleLikeIcon() {
    this._likeButton.classList.toggle("card__like-button_active"); // Toggle the active state of the like button
  }

  getView() {
    this._cardElement = this._getTemplate(); // Get the card template and clone it
    this._likeButton = this._cardElement.querySelector(".card__like-button"); // Get the like button element
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    this._cardImage = this._cardElement.querySelector(".card__image"); // Get the card image element
    this._cardTitle = this._cardElement.querySelector(".card__title"); // Get the card title element

    this._cardImage.src = this._link; // Set the image source to the card's link
    this._cardImage.alt = this._name; // Set the image source and alt text
    this._cardTitle.textContent = this._name; // Set the card title text content
    this._setEventListeners(); //
    return this._cardElement;
  } // Returns the card element with all event listeners set up
}
