export const Element = ({
  type = 'div',
  content,
  id,
  onClick,
  className,
  children,
  src,
  alt,
}) => {
  const newElement = document.createElement(type);
  if (content) newElement.textContent = content;
  if (id) newElement.id = id;
  if (src) newElement.src = src;
  if (alt) newElement.alt = alt;
  if (onClick) newElement.addEventListener('click', onClick);
  if (className) {
    const allClasses = Array.isArray(className) ? className : [className];
    allClasses.forEach((classNameItem) => newElement.classList.add(classNameItem));
  }
  if (children) {
    const allChildren = Array.isArray(children) ? children : [children];
    allChildren.forEach((child) => newElement.appendChild(child));
  }
  return newElement;
};

export const ListElement = (items) => {
  // items = { name: value, name: value, ... }
  /*
    <ul>
      <li>
        <div class="name">name<div>
        <div class="value">value</div>
      </li>
    </ul>
  */
  const LIElements = Object.keys(items).map((name) => {
    const value = items[name];
    const NameElement = Element({
      type: 'div',
      className: 'liName',
      content: `${name}:`,
    });
    const ValueElement = Element({
      type: 'div',
      className: 'liValue',
      content: value,
    });
    return Element({
      type: 'li',
      className: 'listItem',
      children: [NameElement, ValueElement],
    });
  });
  const ULElement = Element({
    type: 'ul',
    className: 'listContainer',
    children: LIElements,
  });

  return ULElement;
};
