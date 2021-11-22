/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropertyMapping, EntityMapping, Relation, Index, Delta, Query } from '../../model'
import { LanguageDDLBuilder } from '..'
import { SchemaConfig } from '../../manager'
import { DialectMetadata } from '../dialectMetadata'

export class SqlDDLBuilder extends LanguageDDLBuilder {
	public truncateEntity (entity:EntityMapping, metadata:DialectMetadata):Query {
		let text = metadata.ddl('truncateTable')
		text = text.replace('{name}', metadata.delimiter(entity.mapping))
		return new Query('truncate', metadata.name, text, entity.name)
	}

	public createEntity (entity:EntityMapping, metadata:DialectMetadata):Query {
		const define:string[] = []
		for (const i in entity.properties) {
			const property = entity.properties[i]
			define.push(this.createColumn(property, metadata))
		}
		if (entity.primaryKey && entity.primaryKey.length > 0) {
			define.push(this.createPk(entity, entity.primaryKey, metadata))
		}
		if (entity.uniqueKey && entity.uniqueKey.length > 0) {
			define.push(this.createUk(entity, entity.uniqueKey, metadata))
		}
		let text = metadata.ddl('createTable')
		text = text.replace('{name}', metadata.delimiter(entity.mapping))
		text = text.replace('{define}', define.join(','))

		return new Query('createTable', metadata.name, text, entity.name)
	}

	private createColumn (property:PropertyMapping, metadata:DialectMetadata):string {
		let type = metadata.type(property.type)
		type = property.length ? type.replace('{0}', property.length.toString()) : type
		const nullable = property.nullable !== undefined && property.nullable === false ? metadata.other('notNullable') : ''

		let text = property.autoincrement ? metadata.ddl('incrementalColumDefine') : metadata.ddl('columnDefine')
		text = text.replace('{name}', metadata.delimiter(property.mapping as string))
		text = text.replace('{type}', type)
		text = text.replace('{nullable}', nullable)
		return text
	}

	private createPk (entity:EntityMapping, primaryKey:string[], metadata:DialectMetadata):string {
		const columns:string[] = []
		const columnTemplate = metadata.other('column')
		for (let i = 0; i < primaryKey.length; i++) {
			const property = entity.properties.find(p => p.name === primaryKey[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', metadata.delimiter(property.mapping)))
		}
		let text = metadata.ddl('createPk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_PK'))
		text = text.replace('{columns}', columns.join(','))
		return text
	}

	private createUk (entity:EntityMapping, uniqueKey:string[], metadata:DialectMetadata):string {
		const columns:string[] = []
		const columnTemplate = metadata.other('column')
		for (let i = 0; i < uniqueKey.length; i++) {
			const property = entity.properties.find(p => p.name === uniqueKey[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', metadata.delimiter(property.mapping)))
		}
		let text = metadata.ddl('createUk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_UK'))
		text = text.replace('{columns}', columns.join(','))
		return text
	}

	public createFk (schema:SchemaConfig, entity:EntityMapping, relation:Relation, metadata:DialectMetadata):Query {
		const column = entity.properties.find(p => p.name === relation.from) as PropertyMapping
		const fEntity = schema.getEntity(relation.entity) as EntityMapping
		const fColumn = fEntity.properties.find(p => p.name === relation.to) as PropertyMapping
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('createFk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_' + relation.name + '_FK'))
		text = text.replace('{column}', metadata.delimiter(column.mapping))
		text = text.replace('{fTable}', metadata.delimiter(fEntity.mapping))
		text = text.replace('{fColumn}', metadata.delimiter(fColumn.mapping))
		return new Query('addFk', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public createIndex (entity:EntityMapping, index:Index, metadata:DialectMetadata):Query {
		const columns:string[] = []
		const columnTemplate = metadata.other('column')
		for (let i = 0; i < index.fields.length; i++) {
			const property = entity.properties.find(p => p.name === index.fields[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', metadata.delimiter(property.mapping)))
		}
		let text = metadata.ddl('createIndex')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_' + index.name))
		text = text.replace('{table}', metadata.delimiter(entity.mapping))
		text = text.replace('{columns}', columns.join(','))
		return new Query('createIndex', metadata.name, text, entity.name)
	}

	public alterColumn (entity:EntityMapping, property:PropertyMapping, metadata:DialectMetadata):Query {
		let type = metadata.type(property.type)
		type = property.length ? type.replace('{0}', property.length.toString()) : type
		const nullable = property.nullable !== undefined && property.nullable === false ? metadata.other('notNullable') : ''

		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = property.autoincrement ? metadata.ddl('incrementalColumDefine') : metadata.ddl('columnDefine')
		text = text.replace('{name}', metadata.delimiter(property.mapping as string))
		text = text.replace('{type}', type)
		text = text.replace('{nullable}', nullable)
		text = metadata.ddl('alterColumn').replace('{columnDefine}', text)
		return new Query('alterColumn', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public addColumn (entity:EntityMapping, property:PropertyMapping, metadata:DialectMetadata):Query {
		let type = metadata.type(property.type)
		type = property.length ? type.replace('{0}', property.length.toString()) : type
		const nullable = property.nullable !== undefined && property.nullable === false ? metadata.other('notNullable') : ''

		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = property.autoincrement ? metadata.ddl('incrementalColumDefine') : metadata.ddl('columnDefine')
		text = text.replace('{name}', metadata.delimiter(property.mapping as string))
		text = text.replace('{type}', type)
		text = text.replace('{nullable}', nullable)
		text = metadata.ddl('addColumn').replace('{columnDefine}', text)
		return new Query('addColumn', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public addPk (entity:EntityMapping, primaryKey:string[], metadata:DialectMetadata):Query {
		const columns:string[] = []
		const columnTemplate = metadata.other('column')
		for (let i = 0; i < primaryKey.length; i++) {
			const property = entity.properties.find(p => p.name === primaryKey[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', metadata.delimiter(property.mapping)))
		}
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('addPk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_PK'))
		text = text.replace('{columns}', columns.join(','))
		return new Query('addPk', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public addUk (entity:EntityMapping, uniqueKey:string[], metadata:DialectMetadata):Query {
		const columns:string[] = []
		const columnTemplate = metadata.other('column')
		for (let i = 0; i < uniqueKey.length; i++) {
			const property = entity.properties.find(p => p.name === uniqueKey[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', metadata.delimiter(property.mapping)))
		}
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('addUk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_UK'))
		text = text.replace('{columns}', columns.join(','))
		return new Query('addUk', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public addFk (schema:SchemaConfig, entity:EntityMapping, relation:Relation, metadata:DialectMetadata):Query {
		const column = entity.properties.find(p => p.name === relation.from) as PropertyMapping
		const fEntity = schema.getEntity(relation.entity) as EntityMapping
		const fColumn = fEntity.properties.find(p => p.name === relation.to) as PropertyMapping
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('addFk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_' + relation.name + '_FK'))
		text = text.replace('{column}', metadata.delimiter(column.mapping))
		text = text.replace('{fTable}', metadata.delimiter(fEntity.mapping))
		text = text.replace('{fColumn}', metadata.delimiter(fColumn.mapping))
		return new Query('addFk', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public dropEntity (entity:EntityMapping, metadata:DialectMetadata):Query {
		let text = metadata.ddl('dropTable')
		text = text.replace('{name}', metadata.delimiter(entity.mapping))
		return new Query('dropTable', metadata.name, text, entity.name)
	}

	public dropColumn (entity:EntityMapping, property:PropertyMapping, metadata:DialectMetadata):Query {
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('dropColumn')
		text = text.replace('{name}', metadata.delimiter(property.mapping as string))
		return new Query('dropColumn', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public dropPk (entity:EntityMapping, metadata:DialectMetadata):Query {
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('dropPk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_PK'))
		return new Query('dropPk', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public dropUk (entity:EntityMapping, metadata:DialectMetadata):Query {
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('dropUk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_UK'))
		return new Query('dropUk', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public dropFk (entity:EntityMapping, relation:Relation, metadata:DialectMetadata):Query {
		const alterEntity = metadata.ddl('alterTable').replace('{name}', metadata.delimiter(entity.mapping))
		let text = metadata.ddl('dropFk')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_' + relation.name + '_FK'))
		return new Query('dropFK', metadata.name, alterEntity + ' ' + text, entity.name)
	}

	public dropIndex (entity:EntityMapping, index:Index, metadata:DialectMetadata):Query {
		let text = metadata.ddl('dropIndex')
		text = text.replace('{name}', metadata.delimiter(entity.mapping + '_' + index.name))
		text = text.replace('{table}', metadata.delimiter(entity.mapping))
		return new Query('dropIndex', metadata.name, text, entity.name)
	}
}
