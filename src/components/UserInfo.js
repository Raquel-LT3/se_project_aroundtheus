// components/UserInfo.js
export default class UserInfo { // UserInfo class to manage user information
  constructor({ nameSelector, jobSelector, avatarSelector }) { // constructor takes selectors for name, job, and avatar elements
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
    this._avatarElement = document.querySelector(avatarSelector);
    this._userId = null; // store userId
  }

  getUserInfo() { // retrieve user information
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
    };
  }

  setUserInfo({ name, job }) {  // update user information
    this._nameElement.textContent = name;
    this._jobElement.textContent = job;
  }

  setAvatar(avatarUrl) { // update user avatar
    this._avatarElement.src = avatarUrl;
  }

  setUserId(id) {   // store userId
    this._userId = id;
  }

  getUserId() {   // retrieve userId
    return this._userId;
  }
}
