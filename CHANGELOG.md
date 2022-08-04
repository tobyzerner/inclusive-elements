# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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


[unreleased]: https://github.com/tobyzerner/inclusive-elements/compare/v0.2.0...HEAD
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
