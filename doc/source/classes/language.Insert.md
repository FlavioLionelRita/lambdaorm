[Lambda ORM](../README.md) / [language](../modules/language.md) / Insert

# Class: Insert

[language](../modules/language.md).Insert

## Hierarchy

- `ArrowFunction`

  ↳ **`Insert`**

## Table of contents

### Constructors

- [constructor](language.Insert.md#constructor)

### Properties

- [children](language.Insert.md#children)
- [clause](language.Insert.md#clause)
- [data](language.Insert.md#data)
- [id](language.Insert.md#id)
- [index](language.Insert.md#index)
- [level](language.Insert.md#level)
- [metadata](language.Insert.md#metadata)
- [name](language.Insert.md#name)
- [parent](language.Insert.md#parent)
- [type](language.Insert.md#type)

### Methods

- [clone](language.Insert.md#clone)
- [eval](language.Insert.md#eval)
- [set](language.Insert.md#set)

## Constructors

### constructor

• **new Insert**(`name`, `children?`, `clause`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `children` | `Operand`[] | `[]` |
| `clause` | `string` | `undefined` |

#### Overrides

ArrowFunction.constructor

#### Defined in

[src/lib/operand/operands.ts:57](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/operand/operands.ts#L57)

## Properties

### children

• **children**: `Operand`[]

#### Inherited from

ArrowFunction.children

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:10

___

### clause

• **clause**: `string`

#### Defined in

[src/lib/operand/operands.ts:56](https://github.com/FlavioLionelRita/lambda-orm/blob/c4a0e00/src/lib/operand/operands.ts#L56)

___

### data

• `Optional` **data**: `Data`

#### Inherited from

ArrowFunction.data

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:51

___

### id

• `Optional` **id**: `string`

#### Inherited from

ArrowFunction.id

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:6

___

### index

• `Optional` **index**: `number`

#### Inherited from

ArrowFunction.index

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:8

___

### level

• `Optional` **level**: `number`

#### Inherited from

ArrowFunction.level

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:9

___

### metadata

• `Optional` **metadata**: `ExpressionConfig`

#### Inherited from

ArrowFunction.metadata

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:44

___

### name

• **name**: `string`

#### Inherited from

ArrowFunction.name

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:4

___

### parent

• `Optional` **parent**: `Operand`

#### Inherited from

ArrowFunction.parent

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:7

___

### type

• **type**: `string`

#### Inherited from

ArrowFunction.type

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:5

## Methods

### clone

▸ **clone**(): `void`

#### Returns

`void`

#### Inherited from

ArrowFunction.clone

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:12

___

### eval

▸ **eval**(): `any`

#### Returns

`any`

#### Inherited from

ArrowFunction.eval

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:45

___

### set

▸ **set**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

ArrowFunction.set

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:13
