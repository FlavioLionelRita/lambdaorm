[Lambda ORM](../README.md) / [connection](../modules/connection.md) / SqlJsConnection

# Class: SqlJsConnection

[connection](../modules/connection.md).SqlJsConnection

## Hierarchy

- [`Connection`](connection.Connection.md)

  ↳ **`SqlJsConnection`**

## Table of contents

### Constructors

- [constructor](connection.SqlJsConnection.md#constructor)

### Properties

- [cnx](connection.SqlJsConnection.md#cnx)
- [inTransaction](connection.SqlJsConnection.md#intransaction)
- [pool](connection.SqlJsConnection.md#pool)

### Accessors

- [config](connection.SqlJsConnection.md#config)

### Methods

- [beginTransaction](connection.SqlJsConnection.md#begintransaction)
- [bulkInsert](connection.SqlJsConnection.md#bulkinsert)
- [commit](connection.SqlJsConnection.md#commit)
- [delete](connection.SqlJsConnection.md#delete)
- [execute](connection.SqlJsConnection.md#execute)
- [executeSentence](connection.SqlJsConnection.md#executesentence)
- [insert](connection.SqlJsConnection.md#insert)
- [rollback](connection.SqlJsConnection.md#rollback)
- [select](connection.SqlJsConnection.md#select)
- [update](connection.SqlJsConnection.md#update)

## Constructors

### constructor

• **new SqlJsConnection**(`cnx`, `pool`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cnx` | `any` |
| `pool` | `any` |

#### Inherited from

[Connection](connection.Connection.md).[constructor](connection.Connection.md#constructor)

#### Defined in

[src/lib/connection/connection.ts:10](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/connection.ts#L10)

## Properties

### cnx

• **cnx**: `any`

#### Inherited from

[Connection](connection.Connection.md).[cnx](connection.Connection.md#cnx)

#### Defined in

[src/lib/connection/connection.ts:7](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/connection.ts#L7)

___

### inTransaction

• **inTransaction**: `boolean`

#### Inherited from

[Connection](connection.Connection.md).[inTransaction](connection.Connection.md#intransaction)

#### Defined in

[src/lib/connection/connection.ts:9](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/connection.ts#L9)

___

### pool

• **pool**: `any`

#### Inherited from

[Connection](connection.Connection.md).[pool](connection.Connection.md#pool)

#### Defined in

[src/lib/connection/connection.ts:8](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/connection.ts#L8)

## Accessors

### config

• `get` **config**(): [`ConnectionConfig`](../interfaces/connection.ConnectionConfig.md)

#### Returns

[`ConnectionConfig`](../interfaces/connection.ConnectionConfig.md)

#### Inherited from

Connection.config

#### Defined in

[src/lib/connection/connection.ts:16](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/connection.ts#L16)

## Methods

### beginTransaction

▸ **beginTransaction**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[Connection](connection.Connection.md).[beginTransaction](connection.Connection.md#begintransaction)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:98](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L98)

___

### bulkInsert

▸ **bulkInsert**(`mapping`, `query`, `array`, `params`): `Promise`<`number`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapping` | [`MappingConfig`](manager.MappingConfig.md) |
| `query` | [`Query`](model.Query.md) |
| `array` | `any`[] |
| `params` | [`Parameter`](../interfaces/model.Parameter.md)[] |

#### Returns

`Promise`<`number`[]\>

#### Overrides

[Connection](connection.Connection.md).[bulkInsert](connection.Connection.md#bulkinsert)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:60](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L60)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[Connection](connection.Connection.md).[commit](connection.Connection.md#commit)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:103](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L103)

___

### delete

▸ **delete**(`mapping`, `query`, `params`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapping` | [`MappingConfig`](manager.MappingConfig.md) |
| `query` | [`Query`](model.Query.md) |
| `params` | [`Parameter`](../interfaces/model.Parameter.md)[] |

#### Returns

`Promise`<`number`\>

#### Overrides

[Connection](connection.Connection.md).[delete](connection.Connection.md#delete)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:85](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L85)

___

### execute

▸ **execute**(`query`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | [`Query`](model.Query.md) |

#### Returns

`Promise`<`any`\>

#### Overrides

[Connection](connection.Connection.md).[execute](connection.Connection.md#execute)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:90](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L90)

___

### executeSentence

▸ **executeSentence**(`sentence`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sentence` | `any` |

#### Returns

`Promise`<`any`\>

#### Overrides

[Connection](connection.Connection.md).[executeSentence](connection.Connection.md#executesentence)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:94](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L94)

___

### insert

▸ **insert**(`mapping`, `query`, `params`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapping` | [`MappingConfig`](manager.MappingConfig.md) |
| `query` | [`Query`](model.Query.md) |
| `params` | [`Parameter`](../interfaces/model.Parameter.md)[] |

#### Returns

`Promise`<`number`\>

#### Overrides

[Connection](connection.Connection.md).[insert](connection.Connection.md#insert)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:54](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L54)

___

### rollback

▸ **rollback**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[Connection](connection.Connection.md).[rollback](connection.Connection.md#rollback)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:108](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L108)

___

### select

▸ **select**(`mapping`, `query`, `params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapping` | [`MappingConfig`](manager.MappingConfig.md) |
| `query` | [`Query`](model.Query.md) |
| `params` | [`Parameter`](../interfaces/model.Parameter.md)[] |

#### Returns

`Promise`<`any`\>

#### Overrides

[Connection](connection.Connection.md).[select](connection.Connection.md#select)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:50](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L50)

___

### update

▸ **update**(`mapping`, `query`, `params`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapping` | [`MappingConfig`](manager.MappingConfig.md) |
| `query` | [`Query`](model.Query.md) |
| `params` | [`Parameter`](../interfaces/model.Parameter.md)[] |

#### Returns

`Promise`<`number`\>

#### Overrides

[Connection](connection.Connection.md).[update](connection.Connection.md#update)

#### Defined in

[src/lib/connection/dialects/sqljs.ts:80](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/connection/dialects/sqljs.ts#L80)
