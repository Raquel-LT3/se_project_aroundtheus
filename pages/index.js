import Card from "../components/Card.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import { config } from "../scripts/validation.js";

// ---------------- INITIAL DATA ----------------
const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
    _id: "1",
    likes: [],
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
    _id: "2",
    likes: [],
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
    _id: "3",
    likes: [],
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
    _id: "4",
    likes: [],
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
    _id: "5",
    likes: [],
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
    _id: "6",
    likes: [],
  },
];

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
});

const editProfilePopup = new PopupWithForm({
  popupSelector: "#profile-edit-modal",
  handleFormSubmit: (formData) => {
    userInfo.setUserInfo({ name: formData.title, job: formData.description });
    editProfilePopup.close();
  },
});
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm({
  popupSelector: "#profile-add-modal",
  handleFormSubmit: (formData) => {
    const newCardData = { name: formData.title, link: formData.url };
    const newCardElement = createCard(newCardData);
    cardSection.addItem(newCardElement); // ✅ only here

    addCardPopup.resetForm();
    addCardPopup.close();
  },
});
addCardPopup.setEventListeners();

const updateAvatarPopup = new PopupWithForm({
  popupSelector: "#update-avatar-modal",
  handleFormSubmit: (formData) => {
    document.querySelector(".profile__image").src = formData.url;
    updateAvatarPopup.close();
  },
});
updateAvatarPopup.setEventListeners();

// ---------------- CARD CREATION ----------------
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    (cardData) => imagePreviewPopup.open(cardData),
    (cardId, isLiked, updateLikes) => {
      const newLikes = isLiked ? [] : [userInfo.getUserId()];
      updateLikes(newLikes);
    },
    (cardId, cardElement) => {
      confirmDeletePopup.setSubmitAction(() => {
        cardElement.remove();
        confirmDeletePopup.close();
      });
      confirmDeletePopup.open();
    },
    userInfo.getUserId()
  );
  return card.getView();
}

// ---------------- SECTION ----------------
const cardSection = new Section({
  items: initialCards,
  renderer: (cardData) => createCard(cardData),
  containerSelector: ".cards__list",
});

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

// ---------------- INITIAL RENDER ----------------
cardSection.renderItems();
