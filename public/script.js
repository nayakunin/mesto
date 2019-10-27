/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable max-classes-per-file */

const errorList = {
  emptyField: 'Это поле обязательное',
  wrongLength: 'Должно быть от 2 до 30 символов',
  wrongURL: 'Здесь должны быть ссылка',
};
const headerName = document.querySelector('.user-info__name');
const headerAbout = document.querySelector('.user-info__job');
const headerAvatar = document.querySelector('.user-info__photo');

const buttonNew = document.querySelector('.user-info__button');

const buttonEdit = document.querySelector('.user-info__button_edit');


const userInfo = {
  id: '',
};

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, this)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .catch((err) => console.log(err));
  }

  updatePersonalInfo() {
    return fetch(`${this.baseUrl}/users/5db6019b7a7d4a2e40e69d75`, this)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .catch((err) => console.log(err));
  }

  updateAvatar(link) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        avatar: link,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .catch((err) => console.log(err));
  }

  submitCard(popupNew, name, link) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: name.value,
        link: link.value,
      }),
    }).then((res) => {
      popupNew.commitButton.textContent = 'Загрузка...';
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res.status);
    })
      .catch((err) => console.log(err));
  }

  editInfo(popupEdit, name, about) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        name: name.value,
        about: about.value,
      }),
    }).then((res) => {
      popupEdit.commitButton.textContent = 'Загрузка...';
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res.status);
    }).catch((err) => console.log(err));
  }

  deleteCard(card) {
    fetch(`${this.baseUrl}/cards/${card.id}`, {
      method: 'DELETE',
      headers: this.headers,
    });
  }

  likeCard(card) {
    return fetch(`${this.baseUrl}/cards/like/${card.id}`, {
      method: 'PUT',
      headers: this.headers,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .catch((err) => console.log(err));
  }

  dislikeCard(card) {
    return fetch(`${this.baseUrl}/cards/like/${card.id}`, {
      method: 'DELETE',
      headers: this.headers,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .catch((err) => console.log(err));
  }
}

const api = new Api({
  baseUrl: '',
  headers: {
    authorization: 'b8b0ebd5-5fbc-41a6-b6b4-fb9a39bce3bb',
    'Content-Type': 'application/json',
  },
});

class Card {
  constructor(name, link, likes, id) {
    this.name = name;
    this.link = link;
    this.likes = likes;
    this.id = id;
    this.obj = this.create();
    this.remove = this.remove.bind(this);
    this.obj.addEventListener('click', this.toggleLike.bind(this));
    this.obj.addEventListener('click', this.remove.bind(this));
  }

  updateLikeCounter(likesArray) {
    this.likes = likesArray;
    this.obj.querySelector('.place-card__like-counter').textContent = this.likes.length;
  }

  toggleLike(event) {
    if (event.target.classList.contains('place-card__like-icon')) {
      if (!event.target.classList.contains('place-card__like-icon_liked')) {
        api.likeCard(this)
          .then((data) => {
            this.updateLikeCounter(data.likes);
          });
      } else {
        api.dislikeCard(this)
          .then((data) => {
            this.updateLikeCounter(data.likes);
          });
      }
      event.target.classList.toggle('place-card__like-icon_liked');
    }
  }

  remove(event) {
    if (event.target.classList.contains('place-card__delete-icon')) {
      // eslint-disable-next-line no-alert
      if (window.confirm('confirm?')) {
        api.deleteCard(this);
        this.obj.remove();
        this.obj.removeEventListener('click', this.like);
        this.obj.removeEventListener('click', this.handleRemove);
      }
    }
  }

  create() {
    const card = document.createElement('div');
    const background = document.createElement('div');
    const deleteButton = document.createElement('button');
    const cardDescription = document.createElement('div');
    const cardName = document.createElement('h3');
    const likeContainer = document.createElement('div');
    const likeButton = document.createElement('button');
    const likeCounter = document.createElement('div');


    card.classList.add('place-card');

    background.classList.add('place-card__image');
    background.style.backgroundImage = `url(${this.link})`;

    deleteButton.classList.add('place-card__delete-icon');

    background.appendChild(deleteButton);

    cardDescription.classList.add('place-card__description');

    cardName.classList.add('place-card__name');
    cardName.textContent = this.name;

    likeButton.classList.add('place-card__like-icon');

    likeCounter.classList.add('place-card__like-counter');
    this.likes.forEach(function (element) {
      if (element._id === userInfo.id) {
        likeButton.classList.add('place-card__like-icon_liked');
      }
    });
    likeCounter.textContent = this.likes.length;

    likeContainer.classList.add('place-card__like-container');

    likeContainer.appendChild(likeCounter);
    likeContainer.appendChild(likeButton);

    cardDescription.appendChild(cardName);
    cardDescription.appendChild(likeContainer);

    card.appendChild(background);
    card.appendChild(cardDescription);

    return card;
  }
}

class CardList {
  constructor(containerObject, array) {
    this.containerObject = containerObject;
    this.array = array;
    this.containerObject.addEventListener('click', function (event) {
      const card = event.target;
      if (card.classList.contains('place-card__image') && !card.classList.contains('place-card__delete-icon')) {
        const link = card.style.backgroundImage;
        _popupPicture.open(link.slice(5, -2));
      }
    });
    this.render();
  }

  addCard(card) {
    const { obj } = new Card(card.name, card.link, card.likes, card._id);
    if (card.owner._id === userInfo.id) {
      obj.querySelector('.place-card__delete-icon').classList.add('place-card__delete-icon_visible');
    }
    this.containerObject.appendChild(obj);
  }

  render() {
    for (let i = 0; i < this.array.length; i++) {
      this.addCard(this.array[i]);
    }
  }
}

const cardsContainer = api.getInitialCards().then((data) => new CardList(document.querySelector('.places-list'), data.data));

class Popup {
  constructor(popupObject) {
    this.popupObject = popupObject;
    this.firstField = popupObject.querySelectorAll('.popup__input')[0];
    this.secondField = popupObject.querySelectorAll('.popup__input')[1];
    this.firstFieldValid = false;
    this.secondFieldValid = false;
    this.commitButton = popupObject.querySelector('.popup__button');
    this.popupObject.addEventListener('click', function (event) {
      if (event.target.classList.contains('popup__close')) {
        this.close();
      }
    }.bind(this));
  }

  close() {
    this.popupObject.classList.remove('popup_is-opened');
    this.firstFieldValid = false;
    this.secondFieldValid = false;
    disableButton(this.commitButton);
  }
}

class PopupNew extends Popup {
  constructor(popupObject) {
    super(popupObject);
    document.forms.new.addEventListener('submit', this.submit.bind(this));
    document.forms.new.addEventListener('input', function () {
      if (this.firstFieldValid && this.secondFieldValid) {
        activateButton(this.commitButton);
      } else {
        disableButton(this.commitButton);
      }
    }.bind(this));
    this.firstField.addEventListener('input', function () {
      this.firstFieldValid = checkInput(this.firstField);
    }.bind(this));
    this.secondField.addEventListener('input', function () {
      this.secondFieldValid = checkInput(this.secondField, 'link');
    }.bind(this));
  }

  submit(event) {
    event.preventDefault();
    const form = document.forms.new;
    const name = form.elements.name;
    const link = form.elements.link;
    if (this.firstFieldValid && this.secondFieldValid) {
      api.submitCard(this, name, link)
        .then((data) => {
          this.commitButton.textContent = 'Сохранить';
          cardsContainer.addCard(data);
          this.close();
        });
    }
  }

  open() {
    this.popupObject.classList.add('popup_is-opened');
    this.firstField.value = '';
    this.secondField.value = '';
    checkInput(this.secondField, 'link');
  }
}

class PopupEdit extends Popup {
  constructor(popupObject) {
    super(popupObject);
    document.forms.edit.addEventListener('submit', this.submit.bind(this));
    document.forms.edit.addEventListener('input', function () {
      if (this.firstFieldValid && this.secondFieldValid) {
        activateButton(this.commitButton);
      } else {
        disableButton(this.commitButton);
      }
    }.bind(this));
    this.firstField.addEventListener('input', function () {
      this.firstFieldValid = checkInput(this.firstField);
    }.bind(this));
    this.secondField.addEventListener('input', function () {
      this.secondFieldValid = checkInput(this.secondField);
    }.bind(this));
  }

  submit(event) {
    event.preventDefault();

    const form = document.forms.edit;
    const name = form.elements.name;
    const about = form.elements.about;

    if (this.firstFieldValid && this.secondFieldValid) {
      api.editInfo(this, name, about)
        .then((data) => {
          headerName.textContent = data.name;
          headerAbout.textContent = data.about;
          this.commitButton.textContent = 'Сохранить';
          this.close();
        });
    }
  }

  open() {
    this.popupObject.classList.add('popup_is-opened');
    this.firstField.value = headerName.textContent;
    this.secondField.value = headerAbout.textContent;
    this.firstFieldValid = checkInput(this.firstField);
    this.secondFieldValid = checkInput(this.secondField);
  }
}

class PopupAvatar {
  constructor(popupObject) {
    this.popupObject = popupObject;
    this.input = popupObject.querySelector('.popup__input');
    this.inputValid = false;
    this.commitButton = popupObject.querySelector('.popup__button');
    document.forms.avatar.addEventListener('submit', this.submit.bind(this));
    document.forms.avatar.addEventListener('input', function () {
      // eslint-disable-next-line no-unused-expressions
      this.inputValid ? activateButton(this.commitButton) : disableButton(this.commitButton);
    }.bind(this));
    this.input.addEventListener('input', function () {
      this.inputValid = checkInput(this.input, 'link');
    }.bind(this));
    this.popupObject.addEventListener('click', function (event) {
      if (event.target.classList.contains('popup__close')) {
        this.close();
      }
    }.bind(this));
  }

  submit(event) {
    event.preventDefault();

    const form = document.forms.avatar;
    const link = form.elements.link;

    if (this.inputValid) {
      api.updateAvatar(link.value)
        .then((res) => {
          headerAvatar.style.backgroundImage = `url(${res.avatar})`;
          this.close();
        });
    }
  }

  open() {
    this.popupObject.classList.add('popup_is-opened');
    this.input.value = '';
    this.inputValid = checkInput(this.input, 'link');
  }

  close() {
    this.popupObject.classList.remove('popup_is-opened');
    this.inputValid = false;
    disableButton(this.commitButton);
  }
}

class PopupPicture {
  constructor(popupPictureObject) {
    this.popupObject = popupPictureObject;
    this.popupObject.addEventListener('click', function (event) {
      if (event.target.classList.contains('popup__close')) {
        this.close();
      }
    }.bind(this));
  }

  open(link) {
    this.popupObject.classList.add('popup-picture_is-opened');
    this.popupObject.querySelector('.popup-picture__content').src = link;
  }

  close() {
    this.popupObject.classList.remove('popup-picture_is-opened');
  }
}

const _popupNew = new PopupNew(document.querySelector('.popup_new'));
const _popupEdit = new PopupEdit(document.querySelector('.popup_edit'));
const _popupPicture = new PopupPicture(document.querySelector('.popup-picture'));
const _popupAvatar = new PopupAvatar(document.querySelector('.popup_avatar'));

const disableButton = function (commitButton) {
  commitButton.classList.remove('popup__button_active');
  commitButton.disabled = true;
};

const activateButton = function (commitButton) {
  commitButton.classList.add('popup__button_active');
  commitButton.disabled = false;
};

const isEmpty = function (element) {
  return element.length === 0;
};

const isWrongLength = function (element) {
  return element.length < 2 || element.length > 30;
};

const nameValidation = function (answer) {
  if (isEmpty(answer)) {
    return errorList.emptyField;
  }
  if (isWrongLength(answer)) {
    return errorList.wrongLength;
  }
  return true;
};

const linkValidation = function (answer) {
  if (isEmpty(answer)) {
    return errorList.emptyField;
  }
  return true;
};

const checkInput = function (eventTarget, mode = 'name') {
  const check = mode === 'link' ? linkValidation(eventTarget.value) : nameValidation(eventTarget.value);
  const errorMsg = eventTarget.parentNode.querySelector('.popup__error');
  if (check !== true) {
    errorMsg.classList.add('popup__error_active');
    errorMsg.textContent = check;
    return false;
  }
  errorMsg.classList.remove('popup__error_active');
  errorMsg.textContent = '';
  return true;
};

buttonEdit.addEventListener('click', function () {
  _popupEdit.open();
});

buttonNew.addEventListener('click', function () {
  _popupNew.open();
});

headerAvatar.addEventListener('click', function () {
  _popupAvatar.open();
});

api.updatePersonalInfo()
  .then((res) => {
    headerName.textContent = res.data[0].name;
    headerAbout.textContent = res.data[0].about;
    headerAvatar.style.backgroundImage = `url(${res.data[0].avatar})`;
    userInfo.id = res.data[0]._id;
  });
