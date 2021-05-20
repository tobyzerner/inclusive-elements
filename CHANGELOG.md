# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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


[Unreleased]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.6...HEAD
[0.1.0-beta.6]: https://github.com/tobyzerner/inclusive-elements/compare/v0.1.0-beta.5...v0.1.0-beta.6
