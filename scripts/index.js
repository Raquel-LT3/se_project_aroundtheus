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
/*                                 Elements                                      */
/*-------------------------------------------------------------------------------*/
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileAddModal = document.querySelector("#profile-add-modal");
const profileEditModalCloseButton = profileEditModal.querySelector("#profile-edit-close-button");
const profileAddModalCloseButton = profileAddModal.querySelector("#profile-add-close-buton");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector("#profile-description-input");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const profileAddForm = profileAddModal.querySelector(".modal__form");
const cardListEl = document.querySelector("#cards__list");
const cardTemplate = document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");
const cardTitleInput = profileAddForm.querySelector("#modal-title-input");
const cardUrlInput = profileAddForm.querySelector("#modal-input-url");
const imageOpenModal = document.querySelector("#image__open-modal");
const previewImage = imageOpenModal.querySelector(".modal__image");
const previewCaption = imageOpenModal.querySelector(".modal__caption");
const imageRemoveButton = document.querySelector("#image__close-button");

/*-------------------------------------------------------------------------------*/
/*                                 Functions                                     */
/*-------------------------------------------------------------------------------*/
function fillProfileForm() {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
}
  
function openModal(modal) {
    modal.classList.add("modal_opened");
}
  
function closePopup(modal) {
    modal.classList.remove("modal_opened");
}
  
const handleOpenImage = (cardData) => {
    previewImage.src = cardData.link;
    previewImage.alt = cardData.name;
    previewCaption.textContent = cardData.name;
    openModal(imageOpenModal);
};
  
imageRemoveButton.addEventListener("click", () => {
    closePopup(imageOpenModal);
});
  
function getCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardTitleEl = cardElement.querySelector(".card__title");
    const likeButton = cardElement.querySelector(".card__like-button");
    const deleteButton = cardElement.querySelector(".card__delete-button");
  
    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;
    cardTitleEl.textContent = data.name;
  
    likeButton.addEventListener("click", () => {
      likeButton.classList.toggle("card__like-button_active");
    });
    deleteButton.addEventListener("click", () => {
      cardElement.remove();
    });
    cardImageEl.addEventListener("click", () => handleOpenImage(data));
  
  
    return cardElement;
  }
  
  function renderCard(data) {
    const cardElement = getCardElement(data);
    cardListEl.prepend(cardElement);
  }


/*-------------------------------------------------------------------------------*/
/*                                 Event Handlers                                */
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
    closePopup(profileAddModal);
    e.target.reset();
  }

/*-------------------------------------------------------------------------------*/
/*                                 Event Listeners                               */
/*-------------------------------------------------------------------------------*/
profileEditButton.addEventListener("click", () => {
    fillProfileForm();
  
    openModal(profileEditModal);
  });
  
  profileEditModalCloseButton.addEventListener("click", () => closePopup(profileEditModal));
  profileAddModalCloseButton.addEventListener("click", () => closePopup(profileAddModal));
  profileEditForm.addEventListener("submit", handleProfileEditSubmit);
  profileAddForm.addEventListener("submit", handleProfileAddSubmit);
  
  initialCards.forEach((cardData) => renderCard(cardData, cardListEl));
  
  // add new card button
  addNewCardButton.addEventListener("click", () => openModal(profileAddModal));