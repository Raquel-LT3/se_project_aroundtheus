// pages/index.js

// 1. IMPORTS - Keep these at the top
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithImage from "../components/PopupWithImage.js";
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

/* -------------------------------------------------------------------------- */
/*                                Elements                                    */
/* -------------------------------------------------------------------------- */
const profileEditButton = document.querySelector("#profile-edit-button"); // Handled by PopupWithForm instance
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileAddModal = document.querySelector("#profile-add-modal"); // Handled by PopupWithForm instance
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
const profileEditForm = document.forms["modal-profile-form"]; // Used by FormValidator
const profileAddForm = profileAddModal.querySelector("#add-card-form"); // Used by FormValidator
const cardListEl = document.querySelector("#cards__list"); // Used by Section
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");
const cardTitleInput = profileAddForm.querySelector("#modal__input_type_title");
const cardUrlInput = profileAddForm.querySelector("#modal__input_type_url");
const imageOpenModal = document.querySelector("#image__open-modal");
const previewImage = imageOpenModal.querySelector(".modal__image");
const previewCaption = imageOpenModal.querySelector(".modal__caption");
const imageRemoveButton = document.querySelector("#image__close-button");

// 3. Form Validators - Initialize validators for each form
const formValidators = {};

/* -------------------------------------------------------------------------- */
/*                   Functions (for helpers like renderCard)                  */
/* -------------------------------------------------------------------------- */

// This function needs to be outside the Section constructor
// because Section needs to be able to call it.
// It will now just return the card element for the Section to append.
function renderCard(cardData) {
  const card = new Card(cardData, "#card-template", (data) => {
    // This callback is for when an individual card's image is clicked
    imagePreviewPopup.open(data);
  });
  return card.getView();
}

/* -------------------------------------------------------------------------- */
/*                             Class Instances                                */
/* -------------------------------------------------------------------------- */

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
    // The Section's addItem expects a DOM element, so call renderCard directly here
    cardSection.addItem(renderCard(newCardData));
    addCardPopup.resetForm();
    addCardPopup.close();
  },
});

/* -------------------------------------------------------------------------- */
/*                            Event Listeners                                 */
/* -------------------------------------------------------------------------- */

// Set up event listeners for all popups
// These should be called *after* all popup instances are created.
imagePreviewPopup.setEventListeners();
editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();

profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  profileTitleInput.value = currentUserInfo.name;
  profileDescriptionInput.value = currentUserInfo.job;

  formValidators[profileEditForm.id].resetValidation();
  editProfilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  formValidators[profileAddForm.id].resetValidation();
  addCardPopup.open();
});

/* -------------------------------------------------------------------------- */
/*                        Page Initialization                                 */
/* -------------------------------------------------------------------------- */

// Enable validation for all forms
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => { // Ensure each form has a unique key
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

// 4. Call enableValidation here to initialize all form validators
enableValidation(config); // This is correctly placed now

// 5. Render initial cards using your Section instance
cardSection.renderItems();
