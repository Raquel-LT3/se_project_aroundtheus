// In src/pages/index.js

// ---------------- IMPORT FIXES ----------------

import logoImage from "../images/app-logo.svg";
import avatarImage from "../images/profile-pic.jpg";
import Card from "../components/Card.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";

import Api from "../components/Api.js";
import { config } from "../scripts/validation.js";
import { API_CONFIG } from "../utils/constants.js";
import "../index.css";

let userId;

// ---------------- IMAGE INSERTION (The Fix for 404s) ----------------
const headerImage = document.querySelector(".header__image");
const profileImage = document.querySelector(".profile__image");

if (headerImage) {
  headerImage.src = logoImage;
}

if (profileImage) {
  profileImage.src = avatarImage;
}
// ---------------- END IMAGE INSERTION ----------------

// ---------------- API INITIALIZATION ----------------
const api = new Api(API_CONFIG); // Api is now defined!

// ---------------- DOM ELEMENTS ----------------
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileImageWrapper = document.querySelector(".profile__image-wrapper");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const formValidators = {};

// ---------------- POPUPS ----------------
const imagePreviewPopup = new PopupWithImage({
  popupSelector: "#image__open-modal",
});
imagePreviewPopup.setEventListeners();

const confirmDeletePopup = new PopupWithConfirmation({
  popupSelector: "#confirmation-modal",
});
confirmDeletePopup.setEventListeners();

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

// ---------------- CARD CREATION ----------------
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    (cardData) => imagePreviewPopup.open(cardData),
    (cardId, isLiked, updateLikes) => {
      const likeAction = isLiked ? api.removeLike(cardId) : api.addLike(cardId);

      likeAction
        .then((updatedCardFromServer) => {
          // Pass the WHOLE object so Card._updateLikes can read .isLiked and .likes
          console.log("Full data to card:", updatedCardFromServer);
          updateLikes(updatedCardFromServer);
        })
        .catch((err) => {
          console.error("Error updating likes:", err);
        });
    },
    (cardId, cardElement) => {
      confirmDeletePopup.setSubmitAction(() => {
        api
          .deleteCard(cardId)
          .then(() => {
            cardElement.remove();
            confirmDeletePopup.close();
          })
          .catch(console.error);
      });
      confirmDeletePopup.open();
    },
    userId
  );
  return card.getView();
}

// ---------------- SECTION ----------------
const cardSection = new Section({
  items: [], // Start empty
  renderer: (cardData) => cardSection.addItem(createCard(cardData)),
  containerSelector: ".cards__list",
});

// ---------------- POPUPS (FORMS) ----------------
const editProfilePopup = new PopupWithForm({
  popupSelector: "#profile-edit-modal",
  handleFormSubmit: (formData) => {
    const submitButton = editProfilePopup
      .getForm()
      .querySelector(".modal__button");
    submitButton.textContent = "Saving...";
    api
      .setUserInfo({ name: formData.title, about: formData.description })
      .then((updatedUser) => {
        userInfo.setUserInfo({
          name: updatedUser.name,
          job: updatedUser.about,
          avatar: updatedUser.avatar,
          _id: updatedUser._id,
        });
        editProfilePopup.close();
      })
      .catch(console.error)
      .finally(() => (submitButton.textContent = "Save"));
  },
});
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm({
  popupSelector: "#profile-add-modal",
  handleFormSubmit: (formData) => {
    const submitButton = addCardPopup.getForm().querySelector(".modal__button");
    submitButton.textContent = "Saving...";
    api
      .addCard({ name: formData.title, link: formData.url })
      .then((cardData) => {
        cardSection.addItem(createCard(cardData));
        addCardPopup.resetForm();
        addCardPopup.close();
      })
      .catch(console.error)
      .finally(() => (submitButton.textContent = "Create"));
  },
});
addCardPopup.setEventListeners();

const updateAvatarPopup = new PopupWithForm({
  popupSelector: "#update-avatar-modal",
  handleFormSubmit: (formData) => {
    const submitButton = updateAvatarPopup
      .getForm()
      .querySelector(".modal__button");
    submitButton.textContent = "Saving...";
    api
      .updateAvatar({ avatar: formData.url })
      .then((updatedUser) => {
        userInfo.setAvatar(updatedUser.avatar); // ✅ updates image directly
        userInfo.setUserId(updatedUser._id); // (optional but clean)
        updateAvatarPopup.close();
      })
      .catch((err) => console.error("Avatar update failed:", err))
      .finally(() => {
        submitButton.textContent = "Save";
      });
  },
});

updateAvatarPopup.setEventListeners();

// ---------------- EVENT LISTENERS ----------------
profileEditButton.addEventListener("click", () => {
  const current = userInfo.getUserInfo();
  profileTitleInput.value = current.name;
  profileDescriptionInput.value = current.job;
  formValidators[editProfilePopup.getForm().id]?.resetValidation();
  editProfilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  formValidators[addCardPopup.getForm().id]?.resetValidation();
  addCardPopup.open();
});

profileImageWrapper.addEventListener("click", () => {
  formValidators[updateAvatarPopup.getForm().id]?.resetValidation();
  updateAvatarPopup.open();
});

// ---------------- VALIDATION ----------------
const enableValidation = (config) => {
  document.querySelectorAll(config.formSelector).forEach((formElement) => {
    const key = formElement.id || formElement.name;
    if (!key) return;
    const validator = new FormValidator(config, formElement);
    formValidators[key] = validator;
    validator.enableValidation();
  });
};
enableValidation(config);

// ---------------- INITIAL LOAD (USER + CARDS) ----------------
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    // 1. Set the global variable
    userId = userData._id;

    // 2. Update UserInfo
    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
      avatar: userData.avatar,
      _id: userData._id,
    });
    userInfo.setAvatar(userData.avatar);

    // 3. IMPORTANT: Tell the section how to render using the FRESH userData._id
    // This ensures userId is NOT undefined when createCard runs
    const cardsToRender = Array.isArray(cards) ? cards : [];
    
    // We clear and re-render to be safe
    cardSection.renderItems([...cardsToRender].reverse());
  })
  .catch((err) => {
    console.error("Critical failure during initial load:", err);
  });
