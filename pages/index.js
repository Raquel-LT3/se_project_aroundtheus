// pages/index.js

// 1. IMPORTS - Keep these at the top
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithImage from "../components/popupwithimage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import { config } from "../scripts/validation.js";

// 2. INITIAL DATA - Your initialCards array
const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

// 3. DOM ELEMENTS - Selectors for elements in the HTML

const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileAddModal = document.querySelector("#profile-add-modal");
const profileEditModalCloseButton = profileEditModal.querySelector(
  "#profile-edit-close-button"
);
const profileAddModalCloseButton = profileAddModal.querySelector(
  "#profile-add-close-button"
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const cardListEl = document.querySelector("#cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");

const imageOpenModal = document.querySelector("#image__open-modal");
const previewImage = imageOpenModal.querySelector(".modal__image");
const previewCaption = imageOpenModal.querySelector(".modal__caption");
const imageRemoveButton = document.querySelector("#image__close-button");

// 4. Form Validators - Initialize validators for each form
const formValidators = {};

// 5. Functions (for helpers like renderCard)

function renderCard(cardData) {
  const card = new Card(cardData, "#card-template", (data) => {
    imagePreviewPopup.open(data);
  });
  return card.getView();
}

// 6. Class Instances

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

const cardSection = new Section({
  items: initialCards,
  renderer: renderCard,
  containerSelector: ".cards__list",
});

const imagePreviewPopup = new PopupWithImage({
  popupSelector: "#image__open-modal",
});

const editProfilePopup = new PopupWithForm({
  popupSelector: "#profile-edit-modal",
  handleFormSubmit: (formData) => {
    userInfo.setUserInfo({
      name: formData.title,
      job: formData.description,
    });
    editProfilePopup.close();
  },
});

const addCardPopup = new PopupWithForm({
  popupSelector: "#profile-add-modal",
  handleFormSubmit: (formData) => {
    const newCardData = {
      name: formData.title,
      link: formData.url,
    };
    cardSection.addItem(renderCard(newCardData));
    addCardPopup.resetForm();
    addCardPopup.close();
  },
});

// 7. Event Listeners

imagePreviewPopup.setEventListeners();
editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();

profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  profileTitleInput.value = currentUserInfo.name;
  profileDescriptionInput.value = currentUserInfo.job;

  // Use getForm() to get the form element for validation
  formValidators[editProfilePopup.getForm().id].resetValidation();
  editProfilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  // Use getForm() to get the form element for validation
  formValidators[addCardPopup.getForm().id].resetValidation();
  addCardPopup.open();
});

// 8. Page Initialization

// 9. Enable validation for all forms
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => {
    const formKey = formElement.id || formElement.name;
    if (!formKey) {
      console.warn(
        "Form does not have an ID or name attribute, skipping validation:",
        formElement
      );
      return;
    }
    const validator = new FormValidator(config, formElement);
    formValidators[formKey] = validator;
    validator.enableValidation();
  });
};

enableValidation(config);
cardSection.renderItems();
