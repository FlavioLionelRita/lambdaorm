[Lambda ORM](../README.md) / [connection](../modules/connection.md) / PostgresConnectionPool

# Class: PostgresConnectionPool

[connection](../modules/connection.md).PostgresConnectionPool

## Hierarchy

- [`ConnectionPool`](connection.ConnectionPool.md)

  ↳ **`PostgresConnectionPool`**

## Table of contents

### Constructors

- [constructor](connection.PostgresConnectionPool.md#constructor)

### Properties

- [config](connection.PostgresConnectionPool.md#config)

### Methods

- [acquire](connection.PostgresConnectionPool.md#acquire)
- [end](connection.PostgresConnectionPool.md#end)
- [init](connection.PostgresConnectionPool.md#init)
- [release](connection.PostgresConnectionPool.md#release)

## Constructors

### constructor

• **new PostgresConnectionPool**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ConnectionConfig`](../interfaces/connection.ConnectionConfig.md) |

#### Overrides

[ConnectionPool](connection.ConnectionPool.md).[constructor](connection.ConnectionPool.md#constructor)

#### Defined in

[src/lib/connection/dialects/postgres.ts:11](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/postgres.ts#L11)

## Properties

### config

• **config**: [`ConnectionConfig`](../interfaces/connection.ConnectionConfig.md)

#### Inherited from

[ConnectionPool](connection.ConnectionPool.md).[config](connection.ConnectionPool.md#config)

#### Defined in

[src/lib/connection/connectionPool.ts:6](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/connectionPool.ts#L6)

## Methods

### acquire

▸ **acquire**(): `Promise`<[`Connection`](connection.Connection.md)\>

#### Returns

`Promise`<[`Connection`](connection.Connection.md)\>

#### Overrides

[ConnectionPool](connection.ConnectionPool.md).[acquire](connection.ConnectionPool.md#acquire)

#### Defined in

[src/lib/connection/dialects/postgres.ts:47](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/postgres.ts#L47)

___

### end

▸ **end**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[ConnectionPool](connection.ConnectionPool.md).[end](connection.ConnectionPool.md#end)

#### Defined in

[src/lib/connection/dialects/postgres.ts:60](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/postgres.ts#L60)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[ConnectionPool](connection.ConnectionPool.md).[init](connection.ConnectionPool.md#init)

#### Defined in

[src/lib/connection/dialects/postgres.ts:43](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/postgres.ts#L43)

___

### release

▸ **release**(`connection`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `connection` | [`Connection`](connection.Connection.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[ConnectionPool](connection.ConnectionPool.md).[release](connection.ConnectionPool.md#release)

#### Defined in

[src/lib/connection/dialects/postgres.ts:56](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/postgres.ts#L56)
