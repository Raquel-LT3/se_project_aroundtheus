export default class Card {
  constructor(
    { name, link, _id, likes = [], isLiked }, // accept likes and isLiked from API
    cardSelector,
    handleCardClick,
    handleLikeClick,
    handleDeleteClick,
    userId
  ) {
    this._name = name;
    this._link = link;
    this._id = _id;
    this._likes = Array.isArray(likes) ? likes : [];
    this._isLiked =
      typeof isLiked === "boolean"
        ? isLiked
        : (this._likes || []).some((like) => {
            const likeId = like && like._id ? like._id : like;
            return likeId === userId;
          });
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
      this._handleLikeClick(
        this._id,
        this.isLiked(),
        this.updateLikes.bind(this)
      );
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this._id, this._cardElement);
    });

    this._cardImage.addEventListener("click", () => {
      this._handleCardClick({ link: this._link, name: this._name });
    });
  }

  // Purely visual toggle based on this._isLiked
  _renderLikes() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  // Flexible updater: accepts a boolean, an object with { isLiked, likes }, or an array
  updateLikes(payload) {
    if (typeof payload === "boolean") {
      this._isLiked = payload;
    } else if (payload && typeof payload === "object") {
      if (typeof payload.isLiked === "boolean") {
        this._isLiked = payload.isLiked;
      } else if (Array.isArray(payload.likes)) {
        // determine isLiked from likes array if boolean not provided
        this._likes = payload.likes;
        this._isLiked = (this._likes || []).some((like) => {
          const likeId = like && like._id ? like._id : like;
          return likeId === this._userId;
        });
      } else if (Array.isArray(payload)) {
        this._likes = payload;
        this._isLiked = (this._likes || []).some((like) => {
          const likeId = like && like._id ? like._id : like;
          return likeId === this._userId;
        });
      }
    } else if (Array.isArray(payload)) {
      this._likes = payload;
      this._isLiked = (this._likes || []).some((like) => {
        const likeId = like && like._id ? like._id : like;
        return likeId === this._userId;
      });
    }

    this._renderLikes();
  }

  isLiked() {
    if (typeof this._isLiked === "boolean") {
      return this._isLiked;
    }
    return (this._likes || []).some((like) => {
      const likeId = like && like._id ? like._id : like;
      return likeId === this._userId;
    });
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

    // Initialize visual state using stored data
    this._renderLikes();

    this._setEventListeners();

    return this._cardElement;
  }
}