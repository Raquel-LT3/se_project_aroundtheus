export default class Card {
  constructor(
    { name, link, _id, likes = [], isLiked }, // Destructure isLiked from data
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
    this._isLiked = isLiked; // Store the initial like status
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
    this._likeButton.addEventListener("click", () => {
      // Pass the current state to the handleLikeClick function
      this._handleLikeClick(
        this._id,
        this.isLiked(),
        this._updateLikes.bind(this)
      );
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this._id, this._cardElement);
    });

    this._cardImage.addEventListener("click", () => {
      this._handleCardClick({ link: this._link, name: this._name });
    });
  }

  _updateLikes(data) {
    // Update our internal boolean if the server provided one
    if (data && typeof data.isLiked === "boolean") {
      this._isLiked = data.isLiked;
    }

    // Update the internal array if provided
    if (data && Array.isArray(data.likes)) {
      this._likes = data.likes;
    }

    // Toggle the active class
    if (this.isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  isLiked() {
    // If the server provided a boolean flag, it's the most reliable
    if (typeof this._isLiked === "boolean") {
      return this._isLiked;
    }

    // Fallback: manually check if our ID is in the likes array
    return (this._likes || []).some((like) => {
      const likeId = like && like._id ? like._id : like;
      return likeId === this._userId;
    });
  }

  getView() {
    this._cardElement = this._getTemplate();

    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(".card__delete-button");
    this._cardImage = this._cardElement.querySelector(".card__image");
    this._cardTitle = this._cardElement.querySelector(".card__title");

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._cardTitle.textContent = this._name;

    // Set the initial visual state of the heart
    this._updateLikes({
      likes: this._likes,
      isLiked: this._isLiked,
    });

    this._setEventListeners();

    return this._cardElement;
  }
}