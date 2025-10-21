export default class Card {
  constructor(
    { name, link, _id, likes = [], owner }, // API data
    cardSelector,
    handleCardClick,
    handleLikeClick,
    handleDeleteClick,
    userId
  ) {
    this._name = name;
    this._link = link;
    this._id = _id;
    this._likes = likes;
    this._owner = owner || { _id: userId }; // fallback for initial cards
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
    this._userId = userId;
  }

  _getTemplate() {
    return document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  _setEventListeners() {
    // Like button
    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(
        this._id,
        this.isLiked(),
        this._toggleLike.bind(this)
      );
    });

    // Delete button
    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._handleDeleteClick(this._id, this._cardElement);
      });
    }

    // Image click
    this._cardImage.addEventListener("click", () => {
      this._handleCardClick({ link: this._link, name: this._name });
    });
  }

  _toggleLike() {
    if (this.isLiked()) {
      this._likeButton.classList.remove("card__like-button_active");
      this._likes = this._likes.filter((id) => id !== this._userId);
    } else {
      this._likeButton.classList.add("card__like-button_active");
      this._likes.push(this._userId);
    }
  }

  isLiked() {
    return this._likes.includes(this._userId);
  }

  getView() {
    this._cardElement = this._getTemplate();

    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    this._cardImage = this._cardElement.querySelector(".card__image");
    this._cardTitle = this._cardElement.querySelector(".card__title");

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._cardTitle.textContent = this._name;

    // Hide delete button if not owner
    if (this._owner._id !== this._userId && this._deleteButton) {
      this._deleteButton.style.display = "none";
    }

    // Initialize like state
    if (this.isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    }

    this._setEventListeners();
    return this._cardElement;
  }
}
