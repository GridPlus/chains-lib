# @xdefi-tech/chains-tron

## 2.0.14

### Patch Changes

- 62105c4: Feat: update README.md

## 2.0.13

### Patch Changes

- 5b781e6: Feat: add getAccount method to fallbackDataSource in core lib
- Updated dependencies [5b781e6]
  - @xdefi-tech/chains-core@2.0.8

## 2.0.12

### Patch Changes

- 2fc44eb: Feat: Add address generation unit test

## 2.0.11

### Patch Changes

- 290355b: Fix: export ledger files from package
- Updated dependencies [290355b]
  - @xdefi-tech/chains-graphql@1.2.10
  - @xdefi-tech/chains-core@2.0.5

## 2.0.10

### Patch Changes

- 4fe86fc: feat: pin all package dependencies to strict versions
  feat: update ledger signer initialisation stage, currently required transport. see README for the details
- Updated dependencies [4fe86fc]
  - @xdefi-tech/chains-graphql@1.2.9
  - @xdefi-tech/chains-core@2.0.4

## 2.0.9

### Patch Changes

- 1bd83d3: fix: Set cache policy to 'network-only' for getBalance GQL query

## 2.0.8

### Patch Changes

- e08adeb: fix tron trc20 fee estimation

## 2.0.7

### Patch Changes

- 59ba44a: feat: allow estimating tron fees without signing a tx

## 2.0.6

### Patch Changes

- 5ea32e5: fix: simplify tron indexer data source transaction response
- Updated dependencies [5ea32e5]
  - @xdefi-tech/chains-graphql@1.2.8

## 2.0.5

### Patch Changes

- a559cce: fix: transaction type in core lib
- Updated dependencies [a559cce]
  - @xdefi-tech/chains-core@2.0.3
  - @xdefi-tech/chains-graphql@1.2.7

## 2.0.4

### Patch Changes

- e9a3d69: tsconfig: added references
  @xdefi-tech/chains-graphql: added gql queries for tron
  @xdefi-tech/chains-tron: added IndexerDataSource
- Updated dependencies [e9a3d69]
  - @xdefi-tech/chains-graphql@1.2.6

## 2.0.3

### Patch Changes

- 7638e90: fix: return normalized key for signer provider from core package
  fix: update seed phrase signers with broken private keys
- Updated dependencies [7638e90]
  - @xdefi-tech/chains-core@2.0.2

## 2.0.2

### Patch Changes

- e7c77f6: feat: add seed phrase signer to export

## 2.0.1

### Patch Changes

- 6728ac5: add tron fee estimation logic
- Updated dependencies [6728ac5]
  - @xdefi-tech/chains-core@2.0.1

## 2.0.0

### Major Changes

- 381bcfc: Bump major vesion to get highest version from develop branch

### Patch Changes

- Updated dependencies [381bcfc]
  - @xdefi-tech/chains-core@2.0.0

## 1.3.3

### Patch Changes

- af2734d: Bump all packages to apply changes from develop branch
- Updated dependencies [af2734d]
  - @xdefi-tech/chains-core@1.2.5
  - eslint-config-custom@1.0.2

## 1.3.2

### Patch Changes

- 2e30ddc: feat: update MsgEncoding type in core lib
- Updated dependencies [2e30ddc]
  - @xdefi-tech/chains-core@1.2.4

## 1.3.1

### Patch Changes

- 9adefdc: Update TRON library to get more relevant data about transactions
- Updated dependencies [9adefdc]
  - @xdefi-tech/chains-core@1.2.3

## 1.3.0

### Minor Changes

- 5498e3e: refactor: Streamlined the way signers are exported across various cryptocurrency packages for both web and React Native environments;
  feat: Enhanced accessibility to individual signers for Bitcoin, Bitcoin Cash, Cosmos, Dogecoin, EVM-compatible chains, Litecoin, Solana, Thorchain, and Tron;

## 1.2.3

### Patch Changes

- a0e1019: Feat: switch lib to production environment
- Updated dependencies [a0e1019]
  - @xdefi-tech/chains-core@1.2.2

## 1.2.2

### Patch Changes

- bede5ce: Fix: remove react dependency from each package
- Updated dependencies [bede5ce]
  - @xdefi-tech/chains-core@1.2.1

## 1.2.1

### Patch Changes

- 93a7327: export ledger signer

## 1.2.0

### Minor Changes

- 346e09e: Minor bump; Add Tron Ledger Signer; Fix Lint;

### Patch Changes

- Updated dependencies [346e09e]
  - @xdefi-tech/chains-core@1.2.0

## 1.1.9

### Patch Changes

- 4b0977a: Update TRC20 Balances and Fix Broken Import

## 1.1.8

### Patch Changes

- 9b2f6b6: Update assets for cor package. Add TRC20 balances
- Updated dependencies [9b2f6b6]
  - @xdefi-tech/chains-core@1.1.15

## 1.1.7

### Patch Changes

- 680b517: Add test coverage, bunch minor fixes
- Updated dependencies [680b517]
  - @xdefi-tech/chains-core@1.1.14
  - eslint-config-custom@1.0.1

## 1.1.6

### Patch Changes

- 64ca641: Add option to create message from object, buffer or base64
- Updated dependencies [64ca641]
  - @xdefi-tech/chains-core@1.1.13

## 1.1.5

### Patch Changes

- 3b7b00d: Add test coverage
- 3b7b00d: Add NFT Support
- Updated dependencies [3b7b00d]
  - @xdefi-tech/chains-core@1.1.12

## 1.1.4

### Patch Changes

- 5b6cb9b: Added Ledger signer. Added testing coverage for signers
- Updated dependencies [5b6cb9b]
  - @xdefi-tech/chains-core@1.1.11

## 1.1.3

### Patch Changes

- b2bfe69: Add seed phrase signer type, update core signer's interface
- Updated dependencies [b2bfe69]
  - @xdefi-tech/chains-core@1.1.8

## 1.1.2

### Patch Changes

- 1efef82: Change import from mjs to common js
- Updated dependencies [1efef82]
  - @xdefi-tech/chains-core@1.1.7

## 1.1.1

### Patch Changes

- 14c668d: Update fee fields for each chain. Add solana. Add EVM chain controller
- Updated dependencies [14c668d]
  - @xdefi-tech/chains-core@1.1.3

## 1.1.0

### Minor Changes

- 3b06078: Add getTransaction method

### Patch Changes

- Updated dependencies [3b06078]
  - @xdefi-tech/chains-core@1.1.0

## 1.0.4

### Patch Changes

- 2210abb: Include files for publishind, exclude src files
- Updated dependencies [2210abb]
  - @xdefi-tech/chains-core@1.0.6

## 1.0.3

### Patch Changes

- e7459e3: Test changeset with publishing
- Updated dependencies [e7459e3]
  - @xdefi-tech/chains-core@1.0.3

## 1.0.2

### Patch Changes

- 39a0985: Test changeset with publishing
- Updated dependencies [39a0985]
  - @xdefi-tech/chains-core@1.0.2

## 1.0.1

### Patch Changes

- a9cd85c: Test changeset with publishing
- Updated dependencies [a9cd85c]
  - @xdefi-tech/chains-core@1.0.1
