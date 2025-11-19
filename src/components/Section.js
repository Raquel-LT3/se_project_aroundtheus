// components/section.js

export default class Section {
    // Constructor to initialize the section with items and a renderer function
    // items: array of initial items to render
    // renderer: function to create and return an element for each item
    // containerSelector: CSS selector for the container where items will be added
    // This class is used to manage a list of items and render them in a specified container
  constructor({ items, renderer, containerSelector }) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems() {
    this._items.forEach((item) => {
      const element = this._renderer(item);
      this.addItem(element);
    });
  }

  addItem(element) {
    this._container.prepend(element);
  }
}