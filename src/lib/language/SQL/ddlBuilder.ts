/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropertyMapping, Property, Relation, Index, Query, EntityMapping, SchemaError } from '../../model'
import { LanguageDDLBuilder } from '../../manager'

export class SqlDDLBuilder extends LanguageDDLBuilder {
	public truncateEntity (entity: EntityMapping): Query | undefined {
		let text = this.dialect.ddl('truncateEntity')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping))
		return new Query('truncateEntity', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}

	public createEntity (entity: EntityMapping): Query | undefined {
		const define: string[] = []

		for (const i in entity.properties) {
			const property = entity.properties[i]
			if (!property.view) {
				define.push(this.createColumn(entity, property))
			}
		}
		if (entity.primaryKey && entity.primaryKey.length > 0) {
			define.push(this.createPk(entity, entity.primaryKey))
		}
		let text = this.dialect.ddl('createEntity')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping))
		text = text.replace('{define}', define.join(','))

		return new Query('createEntity', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}

	private createColumn (entity: EntityMapping, property: PropertyMapping): string {
		let type = this.dialect.type(property.type)
		if (type === undefined) {
			throw new SchemaError(`Undefined type for ${entity.name}.${property.name}`)
		}
		type = property.length ? type.replace('{0}', property.length.toString()) : type
		const nullable = property.nullable !== undefined && property.nullable === false ? this.dialect.other('notNullable') : ''

		let text = property.autoIncrement ? this.dialect.ddl('incrementalColumDefine') : this.dialect.ddl('columnDefine')
		text = text.replace('{name}', this.dialect.delimiter(property.mapping as string))
		text = text.replace('{type}', type)
		text = text.replace('{nullable}', nullable)
		return text
	}

	private createPk (entity: EntityMapping, primaryKey: string[]): string {
		const columns: string[] = []
		const columnTemplate = this.dialect.other('column')
		for (let i = 0; i < primaryKey.length; i++) {
			const property = entity.properties.find(p => p.name === primaryKey[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', this.dialect.delimiter(property.mapping)))
		}
		let text = this.dialect.ddl('createPk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_PK'))
		text = text.replace('{columns}', columns.join(','))
		return text
	}

	public createFk (entity: EntityMapping, relation: Relation): Query | undefined {
		const column = entity.properties.find(p => p.name === relation.from) as PropertyMapping
		const fEntity = this.mapping.getEntity(relation.entity) as EntityMapping
		const fColumn = fEntity.properties.find(p => p.name === relation.to) as PropertyMapping
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('createFk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_' + relation.name + '_FK'))
		text = text.replace('{column}', this.dialect.delimiter(column.mapping))
		text = text.replace('{fTable}', this.dialect.delimiter(fEntity.mapping))
		text = text.replace('{fColumn}', this.dialect.delimiter(fColumn.mapping))
		return new Query('addFk', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public createSequence (entity: EntityMapping): Query | undefined {
		let text = this.dialect.ddl('createSequence')
		text = text.replace('{name}', this.dialect.delimiter(entity.sequence))
		return new Query('createSequence', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}

	public createIndex (entity: EntityMapping, index: Index): Query | undefined {
		const columns: string[] = []
		const columnTemplate = this.dialect.other('column')
		for (let i = 0; i < index.fields.length; i++) {
			const propertyMapping = entity.properties.find(p => p.name === index.fields[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', this.dialect.delimiter(propertyMapping.mapping)))
		}
		let text = this.dialect.ddl('createIndex')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_' + index.name))
		text = text.replace('{table}', this.dialect.delimiter(entity.mapping))
		text = text.replace('{columns}', columns.join(','))
		return new Query('createIndex', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}

	public alterProperty (entity: EntityMapping, property: Property): Query | undefined {
		const propertyMapping = this.mapping.getProperty(entity.name, property.name) as PropertyMapping
		let type = this.dialect.type(propertyMapping.type)
		if (type === undefined) {
			throw new SchemaError(`Undefined type for ${entity.name}.${property.name}`)
		}
		type = property.length ? type.replace('{0}', property.length.toString()) : type
		const nullable = property.nullable !== undefined && property.nullable === false ? this.dialect.other('notNullable') : ''

		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = property.autoIncrement ? this.dialect.ddl('incrementalColumDefine') : this.dialect.ddl('columnDefine')
		text = text.replace('{name}', this.dialect.delimiter(propertyMapping.mapping as string))
		text = text.replace('{type}', type)
		text = text.replace('{nullable}', nullable)
		text = this.dialect.ddl('alterProperty').replace('{columnDefine}', text)
		return new Query('alterProperty', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public addProperty (entity: EntityMapping, property: Property): Query | undefined {
		const propertyMapping = this.mapping.getProperty(entity.name, property.name) as PropertyMapping
		let type = this.dialect.type(property.type)
		if (type === undefined) {
			throw new SchemaError(`Undefined type for ${entity.name}.${property.name}`)
		}
		type = property.length ? type.replace('{0}', property.length.toString()) : type
		const nullable = property.nullable !== undefined && property.nullable === false ? this.dialect.other('notNullable') : ''

		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = property.autoIncrement ? this.dialect.ddl('incrementalColumDefine') : this.dialect.ddl('columnDefine')
		text = text.replace('{name}', this.dialect.delimiter(propertyMapping.mapping as string))
		text = text.replace('{type}', type)
		text = text.replace('{nullable}', nullable)
		text = this.dialect.ddl('addProperty').replace('{columnDefine}', text)
		return new Query('addProperty', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public addPk (entity: EntityMapping, primaryKey: string[]): Query | undefined {
		const columns: string[] = []
		const columnTemplate = this.dialect.other('column')
		for (let i = 0; i < primaryKey.length; i++) {
			const property = entity.properties.find(p => p.name === primaryKey[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', this.dialect.delimiter(property.mapping)))
		}
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('addPk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_PK'))
		text = text.replace('{columns}', columns.join(','))
		return new Query('addPk', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public addUk (entity: EntityMapping, uniqueKey: string[]): Query | undefined {
		const columns: string[] = []
		const columnTemplate = this.dialect.other('column')
		for (let i = 0; i < uniqueKey.length; i++) {
			const property = entity.properties.find(p => p.name === uniqueKey[i]) as PropertyMapping
			columns.push(columnTemplate.replace('{name}', this.dialect.delimiter(property.mapping)))
		}
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('addUk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_UK'))
		text = text.replace('{columns}', columns.join(','))
		return new Query('addUk', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public addFk (entity: EntityMapping, relation: Relation): Query | undefined {
		const column = entity.properties.find(p => p.name === relation.from)
		if (!column) {
			throw new SchemaError(`Property ${relation.from} not found in entity ${entity.name}`)
		}
		const fEntity = this.mapping.getEntity(relation.entity)
		if (!fEntity) {
			throw new SchemaError(`Entity ${relation.entity} not found`)
		}
		const fColumn = fEntity.properties.find(p => p.name === relation.to)
		if (!fColumn) {
			throw new SchemaError(`Property ${relation.to} not found in entity ${fEntity.name}`)
		}
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('addFk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_' + relation.name + '_FK'))
		text = text.replace('{column}', this.dialect.delimiter(column.mapping))
		text = text.replace('{fTable}', this.dialect.delimiter(fEntity.mapping))
		text = text.replace('{fColumn}', this.dialect.delimiter(fColumn.mapping))
		return new Query('addFk', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public dropEntity (entity: EntityMapping): Query | undefined {
		let text = this.dialect.ddl('dropEntity')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping))
		return new Query('dropEntity', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}

	public dropProperty (entity: EntityMapping, property: Property): Query | undefined {
		const propertyMapping = this.mapping.getProperty(entity.name, property.name) as PropertyMapping
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('dropProperty')
		text = text.replace('{name}', this.dialect.delimiter(propertyMapping.mapping as string))
		return new Query('dropProperty', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public dropPk (entity: EntityMapping): Query | undefined {
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('dropPk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_PK'))
		return new Query('dropPk', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public dropUk (entity: EntityMapping): Query | undefined {
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('dropUk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_UK'))
		return new Query('dropUk', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public setNull (entity: EntityMapping, relation: Relation): Query | undefined {
		const alias = 'a'
		const templateColumn = this.dialect.other('column')
		const propertyFrom = entity.properties.find(p => p.name === relation.from)
		if (!propertyFrom) {
			throw new SchemaError(`not found relation form ${entity.name}.${relation.name}.${relation.from} `)
		}
		const column = templateColumn.replace('{name}', propertyFrom.mapping)
		const templateAssign = this.dialect.operator('=', 2)
		let assign = templateAssign.replace('{0}', column)
		const _null = this.dialect.other('null')
		assign = assign.replace('{1}', _null)
		let text = this.dialect.dml('update')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping))
		text = text.replace('{alias}', alias)
		text = text.replace('{assigns}', assign)
		return new Query('update', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}

	public dropFk (entity: EntityMapping, relation: Relation): Query | undefined {
		const alterEntity = this.dialect.ddl('alterTable').replace('{name}', this.dialect.delimiter(entity.mapping))
		let text = this.dialect.ddl('dropFk')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_' + relation.name + '_FK'))
		return new Query('dropFK', this.dataSource.dialect, this.dataSource.name, alterEntity + ' ' + text, entity.name)
	}

	public dropIndex (entity: EntityMapping, index: Index): Query | undefined {
		let text = this.dialect.ddl('dropIndex')
		text = text.replace('{name}', this.dialect.delimiter(entity.mapping + '_' + index.name))
		text = text.replace('{table}', this.dialect.delimiter(entity.mapping))
		return new Query('dropIndex', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}

	public dropSequence (entity: EntityMapping): Query | undefined {
		let text = this.dialect.ddl('dropSequence')
		text = text.replace('{name}', this.dialect.delimiter(entity.sequence))
		return new Query('dropSequence', this.dataSource.dialect, this.dataSource.name, text, entity.name)
	}
}
