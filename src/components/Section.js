// components/section.js

export default class Section {
  constructor({ items, renderer, containerSelector }) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  // Make sure the name is exactly 'renderItems'
  renderItems(items) {
    const itemsToRender = items || this._items;
    if (!itemsToRender) return;

    itemsToRender.forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(element) {
    this._container.prepend(element);
  }
}
