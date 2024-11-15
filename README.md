# Hexagonal Architecture boilerplate

## Installation

```sh
pnpm i @carbonteq/hexapp
```

```sh
npm i @carbonteq/hexapp
```

```sh
yarn add @carbonteq/hexapp
```

## Usage

### Entity Declaration

```typescript
import { BaseEntity } from "@carbonteq/hexapp/domain/base.entity.js";

class User extends BaseEntity {
  constructor(readonly name: string) {
    super();
  }

  serialize() {
    return {
      ...super._serialize(),
      name: this.name,
    };
  }
}
```
