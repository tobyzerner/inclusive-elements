# Changelog

## [0.5.0-beta.1](https://github.com/tobyzerner/inclusive-elements/compare/v0.4.6...v0.5.0-beta.1) (2023-11-06)


### Features

* **alerts:** remove hello-goodbye ([8e6583a](https://github.com/tobyzerner/inclusive-elements/commit/8e6583a04b211de7830d1e5d4a98afc1a9c34780))
* **modal:** lock body scrolling while modal is open ([59e693d](https://github.com/tobyzerner/inclusive-elements/commit/59e693dd1d44840fd0e1bc77b7224738efdd0e07))
* **popup:** use fixed positioning strategy instead of absolute ([d00137f](https://github.com/tobyzerner/inclusive-elements/commit/d00137f04bc60ba4f56bb817c7c0e022e38c71e7))
* **tooltip:** don't show tooltip on touch ([c8998bc](https://github.com/tobyzerner/inclusive-elements/commit/c8998bceae5ef066c8d80e20b324361b8513ff35))
* **tooltip:** only show tooltip on focus via Tab key ([bb9b0ce](https://github.com/tobyzerner/inclusive-elements/commit/bb9b0ced0aa25b1eac667c19cbfe7fc0f4f31879))


### Bug Fixes

* **modal:** activate focus trap after transition and fix autofocus ([66e0ca1](https://github.com/tobyzerner/inclusive-elements/commit/66e0ca19d1443e7eefa6acb500da415a0fb22943))
* **modal:** activate focus trap reliably at start of transition ([5036a4f](https://github.com/tobyzerner/inclusive-elements/commit/5036a4fd74d054e3c2dec3367e2bcd1f1d8f0b59))
* **modal:** fall back to default focus strategy if there is no autofocus element ([fe57357](https://github.com/tobyzerner/inclusive-elements/commit/fe5735724fcf4ab3bbf128ce793e2a37ec16067a))
* **popup:** subtract margins when calculating max popup size ([f842b6d](https://github.com/tobyzerner/inclusive-elements/commit/f842b6dd471c410f79e4a1bf08a904bd56fbbda8))

### [0.4.6](https://github.com/tobyzerner/inclusive-elements/compare/v0.4.5...v0.4.6) (2023-06-29)


### Bug Fixes

* **tooltip:** prevent creating multiple positioners ([4dfc42d](https://github.com/tobyzerner/inclusive-elements/commit/4dfc42df3bfc14399107c9f187fd0b14ab1e4d0d))

### [0.4.5](https://github.com/tobyzerner/inclusive-elements/compare/v0.4.4...v0.4.5) (2023-06-29)


### Bug Fixes

* **tooltip:** clean up tooltip positioner on disconnect ([a163ad7](https://github.com/tobyzerner/inclusive-elements/commit/a163ad768364400c48ea7fa024fde2c639cded75))

### [0.4.4](https://github.com/tobyzerner/inclusive-elements/compare/v0.4.3...v0.4.4) (2023-06-25)


### Bug Fixes

* **alerts:** fix regression causing alerts not to show ([da0b283](https://github.com/tobyzerner/inclusive-elements/commit/da0b2838dc6e253fce11f7374d88a366e95f237b))

### [0.4.3](https://github.com/tobyzerner/inclusive-elements/compare/v0.4.2...v0.4.3) (2023-06-25)


### Bug Fixes

* **alerts:** fix previous alert with same key not being dismissed ([356e028](https://github.com/tobyzerner/inclusive-elements/commit/356e02867ac9f8c8755a4acf2d0b1d5355be1c6b))
* update hello-goodbye to fix transitions not running reliably ([89f23df](https://github.com/tobyzerner/inclusive-elements/commit/89f23df5a896e912a7ddc52b23842a3ba39be027))

### [0.4.2](https://github.com/tobyzerner/inclusive-elements/compare/v0.4.1...v0.4.2) (2023-06-11)


### Features

* **tooltip:** auto-update position on scroll, resize, etc ([587de3b](https://github.com/tobyzerner/inclusive-elements/commit/587de3bfa5937b63ec9117b382e241ea48bb174a))


### Bug Fixes

* **tooltip:** only update tooltip content if original element content has changed ([62ad220](https://github.com/tobyzerner/inclusive-elements/commit/62ad220cff2e0fed09fd47f04c4ab9ac4e90c21e))

### [0.4.1](https://github.com/tobyzerner/inclusive-elements/compare/v0.4.0...v0.4.1) (2023-04-15)


### Bug Fixes

* attempt to fix tree shaking ([ac1f1b1](https://github.com/tobyzerner/inclusive-elements/commit/ac1f1b17268f2fd592605ae575632d1d10da1d30))

## [0.4.0](https://github.com/tobyzerner/inclusive-elements/compare/v0.3.4...v0.4.0) (2023-04-15)


### ⚠ BREAKING CHANGES

* **disclosure:** `open` and `close` events have been removed - use `toggle` instead

### Features

* **disclosure:** add `toggle` event for consistency with `<details>` ([9fc7f74](https://github.com/tobyzerner/inclusive-elements/commit/9fc7f74aebea1b3e48dd99a3000b91258f5ffcea))
* **tabs:** new `tabs` element ([4097e73](https://github.com/tobyzerner/inclusive-elements/commit/4097e7364e3787740d038967d99c25079f65b9ad))

### [0.3.4](https://github.com/tobyzerner/inclusive-elements/compare/v0.3.3...v0.3.4) (2023-03-21)


### Bug Fixes

* **disclosure:** fix issue with widget not closing in some cases ([cb3ae5d](https://github.com/tobyzerner/inclusive-elements/commit/cb3ae5d21be1fdadc284b510924b64e5e58e3137))

### [0.3.3](https://github.com/tobyzerner/inclusive-elements/compare/v0.3.2...v0.3.3) (2023-03-17)


### Bug Fixes

* **popup:** fix layout flicker when opening popup ([42a397b](https://github.com/tobyzerner/inclusive-elements/commit/42a397bd80dce342d34b56d22c26f659c7f7f8f0))

### [0.3.2](https://github.com/tobyzerner/inclusive-elements/compare/v0.3.1...v0.3.2) (2023-03-17)


### Bug Fixes

* **tooltip:** prevent tooltip flicker on touch scroll ([2e461de](https://github.com/tobyzerner/inclusive-elements/commit/2e461de11124f57d5d64f49626d8a36ad1fb7ec4))

### [0.3.1](https://github.com/tobyzerner/inclusive-elements/compare/v0.3.0...v0.3.1) (2023-03-17)


### Bug Fixes

* **tooltip:** show tooltip on touch ([d421649](https://github.com/tobyzerner/inclusive-elements/commit/d4216490099133c038d4557fcff5297f7072a937))

## [0.3.0](https://github.com/tobyzerner/inclusive-elements/compare/v0.2.2...v0.3.0) (2023-03-16)


### Features

* add Disclosure and Accordion elements ([0df80d3](https://github.com/tobyzerner/inclusive-elements/commit/0df80d30e776ea9ecd149da61c96932a39786386))


### Bug Fixes

* **modal:** prevent scroll on focus trap (de)activation ([4e09d5f](https://github.com/tobyzerner/inclusive-elements/commit/4e09d5f331fb2a0b6b07b5dcfae9d87a4945b128))
* **popup:** allow popup trigger button to be nested ([6c62efd](https://github.com/tobyzerner/inclusive-elements/commit/6c62efd39b6f8e628d78711202cf0915f1f733ef))

## [0.2.2] - 2023-03-05
### Added
- Alerts: Handle pre-existing children and any subsequently added to the container. Options can be specified as `[data-*]` attributes.
- Popup: Allow popups to be disabled using the `[disabled]` attribute.
- Popup: Don't open popup if modifier keys are pressed. This allows link popup triggers to be opened in a new tab.

### Fixed
- Popup: Clean up event listeners when popup element is disconnected.

## [0.2.1] - 2022-08-05
### Fixed
- Fix package not including dist files.

## [0.2.0] - 2022-08-05
### Changed
- Upgrade to `@floating-ui/dom` 1.0.0.
- Switch build tool from Rollup to Vite.

## [0.1.3] - 2022-06-05
### Added
- Popup: Update popup position on resize.

### Fixed
- Alerts: Dismiss all alerts by key, not just the first one.
- Modal: Fix some focus issues.
- Popup: Fix max size not being applied.
- Tooltip: Clear timeout on disconnect.

## [0.1.2] - 2022-03-03
### Fixed
- Popup: Fix calculated max size overriding CSS max-size declaration, even if it's larger.

## [0.1.1] - 2022-02-22
### Fixed
- Popup: Fix popup content not having a max size applied.

## [0.1.0] - 2022-01-28
### Fixed
- Menu: Ensure that Arrow keys only navigate to items that are focusable.
- Modal: Fix focus not being placed correctly when modal is open on creation.

## [0.1.0-beta.9] - 2022-01-27
### Added
- New element: Toolbar.
- Support for tree-shaking so unused elements won't be included in the bundle.
- Use `prefers-reduced-motion` media queries for transition CSS examples.
- Alerts: New `clear` method to dismiss all alerts.
- Popup: Additional discussion and demonstration of use-cases.
- Tooltip: Support for hovering over tooltip contents (opt-out with `pointer-events: none`).

### Changed
- External dependencies are no longer included in the bundle, meaning a bundler is required for use.
- Modal: Use [focus-trap](https://github.com/focus-trap/focus-trap) instead of `inert` so that modals do not have to be placed as a direct child of the `<body>`.
- Popup, Tooltip: Use [Floating UI](https://floating-ui.com) instead of Placement.js for element positioning.

### Fixed
- Set various ARIA attributes less aggressively (ie. only if they haven't already been set).
- Alerts: Export the `AlertOptions` type definition.
- Menu: Attach event listeners to menu element rather than document.
- Popup: Only add `aria-haspopup="true"` if the content has the `menu` role.
- Popup: Close the popup if the user tabs away from it.
- Tooltip: Hide the tooltip when the page is scrolled.

## [0.1.0-beta.8] - 2021-09-12
### Added
- Tooltip: Hide tooltip when Escape key is pressed. (3bcdfcc8)

### Removed
- Tooltip: Remove support for touch devices. (7e1c0e69)

### Fixed
- Tooltip: Fix parent event listeners not being removed properly on disconnect. (a75b6997)

## [0.1.0-beta.7] - 2021-05-27
### Fixed
- Tooltip: Only remove event listeners on disconnection if parent still exists.

## [0.1.0-beta.6] - 2021-05-20
### Changed
- Alerts: Increase default alert duration to 10 seconds.

### Fixed
- Tooltip: Fix behavior on touch devices.
- Update Placement.js to fix incorrect positions when horizontally scrolled.

## [0.1.0-beta.5] - 2021-05-18
### Changed
- Update `hello-goodbye` version.

## [0.1.0-beta.4] - 2021-05-09
### Changed
- Popup: Don't close when a `menuitemcheckbox` is clicked.
- Popup: Only return focus to button when Escape key is used to close popup.

### Fixed
- Tooltip: Hide tooltip on click, or if parent becomes disabled.
- Implemented disconnect callbacks to properly clean up element side effects.

### Removed
- Popup: Don't set z-index - leave this to the userspace.

## [0.1.0-beta.3] - 2021-03-05
### Fixed
- Recompile dist file.

## [0.1.0-beta.2] - 2021-03-05
### Fixed
- Update `hello-goodbye` version.
- Mark package as side-effect free.

[0.2.2]: https://github.com/tobyzerner/inclusive-elements/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/tobyzerner/inclusive-elements/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.9...v0.1.0
[0.1.0-beta.9]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.8...v0.1.0-beta.9
[0.1.0-beta.8]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.7...v0.1.0-beta.8
[0.1.0-beta.7]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.6...v0.1.0-beta.7
[0.1.0-beta.6]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.5...v0.1.0-beta.6
[0.1.0-beta.5]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.4...v0.1.0-beta.5
[0.1.0-beta.4]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.3...v0.1.0-beta.4
[0.1.0-beta.3]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.2...v0.1.0-beta.3
[0.1.0-beta.2]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.1...v0.1.0-beta.2