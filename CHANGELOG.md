# Cryptex Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## [Development]
Nothing yet!

## [v0.6.0] - 2015-10-28
### Added
- Cryptex CLI now understands getSecret command, and makes Cryptex useful in
non-Node.js projects!

## [v0.5.0] - 2015-10-28
### Added
- getSecrets() method for more efficient secret retrieval batching

### Changed
- Cryptex now rejects on encrypt/decrypt/getSecret when a keySource isn't explicitly
set. This provides far better error messaging when Cryptex isn't properly configured.
- The CLI now produces shockingly better error messages.

## [v0.4.1] - 2015-10-27
### Fixed
- Babel doesn't transpile String.prototype.includes, breaking 0.12 compatibility.
This has been corrected.

## [v0.4.0] - 2015-10-27
### Added
- Optional flag for getSecret().

### Changed
- getSecret() treats secrets as required by default, and rejects if one isn't found.

## [v0.3.1] - 2015-10-27
### Fixed
- AES256 now handles strings longer than the key

## [v0.3.0] - 2015-10-26
### Changed
- Calling getSecret() for a missing secret now resolves to null instead of rejecting.
This is in an effort to separate actual key source failures from a possibly optional
secret.

## [v0.2.2] - 2015-10-26
### Fixed
- Package aws-sdk; not having it caused too many issues
- Errors in modules no longer get swallowed on require

## [v0.2.1] - 2015-10-26
### Fixed
- Invalid build to NPM

## [v0.2.0] - 2015-10-26
### Added
- Travis.ci testing
- CodeClimate
- 'region' KMS option

### Changed
- Minor documentation corrections

### Fixed
- Relative path issues when requiring modules
- CLI's -e flag not being observed

## v0.1.0 - 2015-10-23
### Added
- Initial release

[Development]: https://github.com/TechnologyAdvice/Cryptex/compare/0.6.0...HEAD
[v0.6.0]: https://github.com/TechnologyAdvice/Cryptex/compare/0.5.0...0.6.0
[v0.5.0]: https://github.com/TechnologyAdvice/Cryptex/compare/0.4.1...0.5.0
[v0.4.1]: https://github.com/TechnologyAdvice/Cryptex/compare/0.4.0...0.4.1
[v0.4.0]: https://github.com/TechnologyAdvice/Cryptex/compare/0.3.1...0.4.0
[v0.3.1]: https://github.com/TechnologyAdvice/Cryptex/compare/0.3.0...0.3.1
[v0.3.0]: https://github.com/TechnologyAdvice/Cryptex/compare/0.2.2...0.3.0
[v0.2.2]: https://github.com/TechnologyAdvice/Cryptex/compare/0.2.1...0.2.2
[v0.2.1]: https://github.com/TechnologyAdvice/Cryptex/compare/0.2.0...0.2.1
[v0.2.0]: https://github.com/TechnologyAdvice/Cryptex/compare/0.1.0...0.2.0
