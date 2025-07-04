import Card from "../components/Card.js";

import FormValidator from "../components/FormValidator.js";

import { config } from "../scripts/validation.js";

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

/*-------------------------------------------------------------------------------*/
/*                                  Elements                                     */
/*-------------------------------------------------------------------------------*/

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
const profileEditForm = document.forms["modal-profile-form"];
const profileAddForm = profileAddModal.querySelector("#add-card-form");
const cardListEl = document.querySelector("#cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");
const cardTitleInput = profileAddForm.querySelector("#modal__input_type_title");
const cardUrlInput = profileAddForm.querySelector("#modal__input_type_url");
const imageOpenModal = document.querySelector("#image__open-modal");
const previewImage = imageOpenModal.querySelector(".modal__image");
const previewCaption = imageOpenModal.querySelector(".modal__caption");
const imageRemoveButton = document.querySelector("#image__close-button");

/*-------------------------------------------------------------------------------*/
/*                                Functions                                      */
/*-------------------------------------------------------------------------------*/

function fillProfileForm() {
  profileTitleInput.value = profileTitle.textContent;

  profileDescriptionInput.value = profileDescription.textContent;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keyup", handleEscape);
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keyup", handleEscape);
}

function renderCard(cardData, container) {
  const card = new Card(cardData, "#card-template", handleOpenImage);
  const cardElement = card.getView();
  container.prepend(cardElement);
}

const handleOpenImage = (cardData) => {
  previewImage.src = cardData.link;
  previewImage.alt = cardData.name;
  previewCaption.textContent = cardData.name;
  openModal(imageOpenModal);
};

const closeButtons = document.querySelectorAll(".modal__close");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closePopup(popup));
});

/*-------------------------------------------------------------------------------*/
/*                               Event Handlers                                  */
/*-------------------------------------------------------------------------------*/

function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

function handleProfileAddSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link }, cardListEl);
  closePopup(profileAddModal); // Close the popup first or concurrently
  e.target.reset(); // Reset the form inputs
  addFormValidator.resetValidation(); // This will clear errors and disable the button for next time
}

// Handle Escape key to close modals
const handleEscape = (e) => {
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closePopup(openModal);
    }
  }
};

function handleOverlayClick(e) {
  if (e.target.classList.contains("modal_opened")) {
    closePopup(e.target);
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", handleOverlayClick);
});

/*-------------------------------------------------------------------------------*/
/*                           Event Listeners                                     */
/*-------------------------------------------------------------------------------*/

profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  openModal(profileEditModal);
});

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

profileAddForm.addEventListener("submit", handleProfileAddSubmit);

initialCards.forEach((cardData) => renderCard(cardData, cardListEl));

addNewCardButton.addEventListener("click", () => openModal(profileAddModal));

const editFormValidator = new FormValidator(config, profileEditForm);

editFormValidator.enableValidation();

const addFormValidator = new FormValidator(config, profileAddForm);

addFormValidator.enableValidation();
