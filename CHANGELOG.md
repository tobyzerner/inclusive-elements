# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Update `hello-goodbye` dependency.

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
