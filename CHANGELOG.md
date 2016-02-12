# Change Log

0.9.8 / 2016-02-12
==================

### Added
 * Upload speed
 * File size
 * Current size uploaded on progress
 * Loading svg animation

### Changed
 * Replaced the stylesheet
 * Fixed `zlf-accept` problems

### Removed
 * Toast notification system


0.9.2 / 2016-02-09
==================

### Added
 * Toast notification system
 * Truncate filename in view with limitTo filter
 * `zlf-accept` 100% functional

### Changed
 * Updated Stylesheet


0.9.1 / 2016-02-08
==================

### Removed
  * Multiple parameter

### Changed
  * Updated progressAverage system
  * Updated README
  * attribute to -> zlf-to
  * attribute dragndrop -> zlf-dragndrop
  * attribute autosubmit -> zlf-autosubmit

### Added
 * parameter `zlf-max-files` if set, allow to upload x files maximum. The limit by default is 1 file max
 * parameter `zlf-max-size-mb` if set, provide a limit of size to the files accepted (in MB)
 * parameter `zlf-accept` if set, allow to filter files extensions


0.9.0 / 2016-02-07
==================


### Changed
  * Updated Stylesheet
  * use of $watch changed by callback system in the root directive

### Added
  * Object view management
  * Added multiple parameter for drag & drop
  * Service full documented with ng-doc (still not generated)


0.8.0 / 2016-02-03
==================
###### The first version "0.8.0" is based on the avancement of the first final version (80%)

### Removed
  * Initial changelog
  * broadcast use
  * zlUploadFile directive
  * zlUploadDragndrop directive

### Changed
  * Useless duplicated upload method into a simple upload method in the service
  * Easier html implementation

### Added
  * Custom Stylesheet
  * zlUpload directive managing everything
  * Average Progressbar
  * Multiple parameter for the input file upload
  * Retryer functionality
  * Cancel functionality
  * Autosubmit functionality
