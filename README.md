# Inclusive Elements

**Accessible, lightweight, unstyled implementations of common UI controls.**

![Size](https://img.shields.io/bundlephobia/minzip/inclusive-elements)

[**Demo**](https://tobyzerner.github.io/inclusive-elements/demo.html)

Basic interactive UI patterns like popup menus, tooltips, and modals are surprisingly hard to get right on the web. Component libraries tend to be weighty, opinionated, and come tightly coupled with styles you don't want. On the other hand, rolling your own components feels like you're reinventing the wheel and puts accessibility at risk.

`inclusive-elements` provides those basic behaviors in the form of Custom Elements, without any of the cruft. They are:

- **🦮 Accessible.** Designed following the [WAI-ARIA Authoring Practices](https://w3c.github.io/aria-practices) so everyone can use them.
- **🌳 Lightweight.** 3kB gzipped in total, zero dependencies. Less if you tree-shake only the elements you need.
- **🎨 Unstyled.** Easily integrate with your design bottom-up without having to fight defaults.
- **🚀 Easy to use.** Simple API, works with any framework that supports Custom Elements.

## Installation

```
npm install inclusive-elements --save
```

## Elements

Detailed descriptions and usage instructions are contained within each element:

- [Alerts](src/alerts)
- [Menu](src/menu)
- [Modal](src/modal)
- [Popup](src/popup)
- [Tooltip](src/tooltip)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
