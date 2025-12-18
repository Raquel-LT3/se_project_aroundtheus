// components/section.js

export default class Section { // Section class to manage a list of items
  constructor({ items, renderer, containerSelector }) { // constructor takes items, renderer function, and container selector
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  // name is exactly 'renderItems'
  renderItems(items) {
    const itemsToRender = items || this._items; // use provided items or default items
    if (!itemsToRender) return;

    itemsToRender.forEach((item) => { // iterate over each item
      this._renderer(item);
    });
  }

  addItem(element) {
    this._container.prepend(element); // add new item to the beginning of the container
  }
}
