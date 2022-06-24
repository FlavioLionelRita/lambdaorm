import { Enum, Entity, Property, Relation, FormatMapping, EntityMapping, PropertyMapping, DataSource, Schema, Mapping, RelationInfo, Stage, ContextInfo, SchemaError, RelationType, View, EntityView, PropertyView, OrmOptions, Dependent } from '../model'
import { ConnectionConfig } from '../connection'
import path from 'path'
import { Helper } from './helper'
import { Expressions } from 'js-expressions'

const yaml = require('js-yaml')

abstract class ModelConfigBase<TEntity extends Entity, TProperty extends Property> {
	public abstract get entities(): TEntity[];
	public abstract get enums(): Enum[];

	public getEntity (name: string): TEntity | undefined {
		return this.entities.find(p => p.name === name)
	}

	public getForcedEntity (name: string): TEntity {
		const entity = this.getEntity(name)
		if (entity === undefined) {
			throw new SchemaError(`entity ${name} not found`)
		}
		return entity
	}

	public getEnum (name: string): Enum | undefined {
		return this.enums.find(p => p.name === name)
	}

	public isChild (entityName: string): boolean {
		for (const i in this.entities) {
			const entity = this.entities[i]
			for (const j in entity.relations) {
				const relation = entity.relations[j]
				if (relation.type === RelationType.manyToOne && relation.composite && relation.entity === entityName) return true
			}
		}
		return false
	}

	public existsProperty (entityName: string, name: string): boolean {
		const entity = this.getEntity(entityName)
		if (!entity) { throw new SchemaError('Not exists entity:' + entityName) }
		const property = entity.properties.find(p => p.name === name)
		return property !== undefined
	}

	public getProperty (entityName: string, name: string): TProperty {
		const entity = this.getEntity(entityName)
		if (!entity) {
			throw new SchemaError('Not exists entity:' + entityName)
		}
		const property = entity.properties.find(p => p.name === name)
		if (!property) {
			throw new SchemaError('Not exists property: ' + name + ' in entity: ' + entityName)
		}
		return property as TProperty
	}

	public getAutoIncrement (entityName: string): TProperty | undefined {
		const entity = this.getEntity(entityName)
		if (!entity) {
			throw new SchemaError('Not exists entity:' + entityName)
		}
		return entity.properties.find(p => p.autoIncrement === true) as TProperty
	}

	public getFieldIds (entityName: string): TProperty[] | undefined {
		const entity = this.getEntity(entityName)
		if (!entity) {
			throw new SchemaError('Not exists entity:' + entityName)
		}
		return entity.properties.filter(p => entity.primaryKey.includes(p.name)) as TProperty[]
	}

	public listEntities (): string[] {
		return this.entities.map(p => p.name)
	}

	/**
	 * Sort a list of entities according to their relationships
	 * @param entities entities to order
	 * @returns returns the sorted entities
	 */
	public sortByRelations (mainEntities: string[], allEntities: string[]): string[] {
		if (mainEntities.length < 2) return mainEntities
		const sorted: string[] = []
		while (sorted.length < mainEntities.length) {
			for (const entityName of mainEntities) {
				if (sorted.includes(entityName)) {
					continue
				}
				if (this.solveSortEntity(entityName, mainEntities, allEntities, sorted)) {
					sorted.push(entityName)
					break
				}
			}
		}
		return sorted
	}

	/**
	 * Sort a list of entities according to their dependencies
	 * @param entities entities to order
	 * @returns returns the sorted entities
	 */
	public sortByDependencies (entities: string[] = []): string[] {
		if (entities.length < 2) return entities
		const sorted: string[] = []
		while (sorted.length < entities.length) {
			for (const entityName of entities) {
				if (sorted.includes(entityName)) {
					continue
				}
				const entity = this.getEntity(entityName)
				if (entity === undefined) {
					throw new SchemaError('Not exists entity:' + entityName)
				}
				if (!this.hadDependencies(entity, entities, sorted)) {
					sorted.push(entityName)
					break
				}
			}
		}
		return sorted
	}

	/**
	 * Determines whether an entity can be included in the entity list based on its relationships
	 * @param entityName name of entity
	 * @param sorted current list of entities sorted by dependencies
	 * @param parent entity parent , used in manyToOne relations
	 * @returns
	 */
	protected solveSortEntity (entityName: string, mainEntities: string[], allEntities: string[], sorted: string[], parent?: string): boolean {
		const entity = this.getEntity(entityName)
		if (entity === undefined) {
			throw new SchemaError('Not exists entity:' + entityName)
		}
		if (entity.relations === undefined || entity.relations.length === 0) {
			return true
		} else {
			let unsolved = false
			for (const relation of entity.relations) {
				if (this.unsolvedRelation(entityName, mainEntities, allEntities, sorted, relation, parent)) {
					unsolved = true
					break
				}
			}
			return !unsolved
		}
	}

	private unsolvedRelation (entityName: string, mainEntities: string[], allEntities: string[], sorted: string[], relation:Relation, parent?: string): boolean {
		if (relation.entity !== entityName && allEntities.includes(relation.entity)) {
			if (relation.type === RelationType.oneToOne || relation.type === RelationType.oneToMany) {
				if (!relation.weak && !sorted.includes(relation.entity) && (parent === null || parent !== relation.entity)) {
					return true
				}
			} else if (relation.type === RelationType.manyToOne) {
				if (relation.composite && !this.solveSortEntity(relation.entity, mainEntities, allEntities, sorted, entityName)) {
					return true
				}
			}
		}
		return false
	}

	/**
	 * Determines whether an entity can be included in the entity list based on its dependencies
	 * @param entityName name of entity
	 * @param sorted current list of entities sorted by dependencies
	 * @param parent entity parent , used in manyToOne relations
	 * @returns
	 */
	protected hadDependencies (entity: TEntity, entities: string[], sorted: string[], parent?: string): boolean {
		if (entity.dependents === undefined || entity.dependents.length === 0) {
			return false
		} else {
			let hadDependents = false
			for (const dependent of entity.dependents) {
				if (dependent.entity !== entity.name && entities.includes(dependent.entity)) {
					if (this.hadDependents(entity, sorted, dependent, parent)) {
						hadDependents = true
						break
					}
				}
			}
			return hadDependents
		}
	}

	private hadDependents (entity: TEntity, sorted: string[], dependent:Dependent, parent?: string): boolean {
		// if the relationship is not weak
		if (!dependent.relation.weak) {
			// look for the related property to see if the dependency is nullable
			const dependentEntity = this.getEntity(dependent.entity)
			if (dependentEntity === undefined) {
				throw new SchemaError('Not exists entity:' + dependent.entity)
			}
			const dependentProperty = dependentEntity.properties.find(p => p.name === dependent.relation.from)
			if (dependentProperty === undefined) {
				throw new SchemaError(`property ${dependent.relation.from} not found in ${entity.name} `)
			}
			const isNullable = dependentProperty.nullable !== undefined ? dependentProperty.nullable : true
			// if the relation is nullable
			// and the related entity is not included in the entities sorted by dependency
			// and the parent entity is null or is the same as the relation
			// in this case it cannot be determined that this entity can still be included in the list of entities ordered by dependency.
			if (!isNullable && !sorted.includes(dependent.entity) && (parent === null || parent !== dependent.entity)) {
				return true
			}
		}

		return false
	}

	public getRelation (entity: string, relation: string): RelationInfo {
		let _previousEntity, previousEntity, relationData, _relationEntity, relationEntity
		const parts = relation.split('.')
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i]
			if (i === 0) {
				_previousEntity = entity
				previousEntity = this.getEntity(_previousEntity) as Entity
			} else {
				_previousEntity = _relationEntity
				previousEntity = relationEntity as Entity
			}
			relationData = previousEntity.relations.find(p => p.name === part)
			if (!relationData) { throw new SchemaError('relation ' + part + ' not found in ' + previousEntity.name) }
			_relationEntity = relationData.entity
			relationEntity = this.getEntity(_relationEntity)
		}
		return {
			previousRelation: parts.length > 1 ? parts.slice(0, parts.length - 1).join('.') : '',
			previousEntity: previousEntity as Entity,
			entity: relationEntity as Entity,
			relation: relationData as Relation
		}
	}
}

export class ModelConfig extends ModelConfigBase<Entity, Property> {
	public entities: Entity[]
	public enums: Enum[]

	constructor (entities: Entity[] = [], enums: Enum[] = []) {
		super()
		this.entities = entities
		this.enums = enums
	}
}

export class MappingConfig extends ModelConfigBase<EntityMapping, PropertyMapping> {
	private mapping: Mapping
	public enums: Enum[]
	constructor (mapping: Mapping, enums: Enum[] = []) {
		super()
		this.mapping = mapping
		this.enums = enums
	}

	public get name (): string {
		return this.mapping.name
	}

	public get format (): FormatMapping | undefined {
		return this.mapping.format
	}

	public get (): Mapping {
		return this.mapping
	}

	public set (value: Mapping) {
		this.mapping = value
	}

	public get entities (): EntityMapping[] {
		return this.mapping.entities
	}

	public entityMapping (entityName: string): string | undefined {
		const entity = this.getEntity(entityName)
		return entity ? entity.mapping : undefined
	}
}

export class MappingsConfig {
	public mappings: Mapping[]

	constructor () {
		this.mappings = []
	}

	public load (value: Mapping): void {
		if (value && value.name) {
			const index = this.mappings.findIndex(p => p.name === value.name)
			if (index === -1) {
				this.mappings.push(value)
			} else {
				this.mappings[index] = value
			}
		}
	}

	public delete (name: string): void {
		const index = this.mappings.findIndex(p => p.name === name)
		if (index !== -1) {
			this.mappings.splice(index, 1)
		}
	}

	public get (name: string): Mapping {
		const mapping = this.mappings.find(p => p.name === name)
		if (!mapping) {
			throw new SchemaError(`mapping ${name} not found`)
		}
		return mapping
	}

	public getInstance (name: string): MappingConfig {
		const mapping = this.get(name)
		if (!mapping) {
			throw new SchemaError(`mapping ${name} not found`)
		}
		return new MappingConfig(mapping)
	}
}

export class ViewConfig {
	private view: View
	constructor (view: View) {
		this.view = view
	}

	public get name (): string {
		return this.view.name
	}

	public get (): View {
		return this.view
	}

	public set (value: View) {
		this.view = value
	}

	public get entities (): EntityView[] {
		return this.view.entities ? this.view.entities : []
	}

	public getEntity (name: string): EntityView | undefined {
		return this.view.entities ? this.view.entities.find(p => p.name === name) : undefined
	}

	public getProperty (entityName: string, name: string): PropertyView | undefined {
		const entity = this.getEntity(entityName)
		if (!entity) {
			return undefined
		}
		return entity.properties ? entity.properties.find(p => p.name === name) : undefined
	}

	public excludeEntity (name: string): boolean {
		const entity = this.getEntity(name)
		return entity ? !!entity.exclude : false
	}
}

export class ViewsConfig {
	public views: View[]

	constructor () {
		this.views = []
	}

	public load (value: View): void {
		if (value && value.name) {
			if (!value.entities) {
				value.entities = []
			}
			const index = this.views.findIndex(p => p.name === value.name)
			if (index === -1) {
				this.views.push(value)
			} else {
				this.views[index] = value
			}
		}
	}

	public get (name?: string): View {
		if (name === undefined) {
			return this.views[0]
		}
		const view = this.views.find(p => p.name === name)
		if (view === undefined) {
			throw new SchemaError(`View: ${name} not found`)
		}
		return view
	}

	public getInstance (name?: string): ViewConfig {
		const view = this.get(name)
		if (!view) {
			throw new SchemaError(`view ${name} not found`)
		}
		return new ViewConfig(view)
	}
}

export class DataSourceConfig {
	public dataSources: DataSource[]
	public default?: string

	constructor () {
		this.dataSources = []
	}

	public load (value: DataSource): void {
		if (value && value.name) {
			const index = this.dataSources.findIndex(p => p.name === value.name)
			if (index === -1) {
				this.dataSources.push(value)
			} else {
				this.dataSources[index] = value
			}
		}
	}

	public get (name?: string): DataSource {
		const _name = name === undefined ? this.default : name
		if (_name === undefined) {
			if (this.dataSources.length === 1) {
				return this.dataSources[0]
			} else {
				throw new SchemaError('the name of the dataSource is required')
			}
		}
		const db = this.dataSources.find(p => p.name === _name)
		if (db === undefined) {
			throw new SchemaError(`default dataSource: ${_name} not found`)
		}
		return db
	}
}

export class StageConfig {
	public stages: Stage[]

	constructor () {
		this.stages = []
	}

	public load (value: Stage): void {
		if (value && value.name) {
			const index = this.stages.findIndex(p => p.name === value.name)
			if (index === -1) {
				this.stages.push(value)
			} else {
				this.stages[index] = value
			}
		}
	}

	public get (name?: string): Stage {
		if (name === undefined) {
			return this.stages[0]
		}
		const stage = this.stages.find(p => p.name === name)
		if (stage === undefined) {
			throw new SchemaError(`Stage: ${name} not found`)
		}
		return stage
	}
}

class SchemaExtender {
	private expressions: Expressions
	constructor (expressions: Expressions) {
		this.expressions = expressions
	}

	public extend (source: Schema): Schema {
		let schema: Schema = { app: { src: 'src', data: 'data', model: 'model' }, enums: [], entities: [], mappings: [], dataSources: [], stages: [], views: [] }
		if (source) {
			schema = Helper.clone(source)
		}
		this.extendEntities(schema)
		this.extendMappings(schema)
		this.extendDataSources(schema)
		this.extendDataStages(schema)
		// views
		if (!schema.views || !schema.views.length || schema.views.length === 0) {
			schema.views = [{ name: 'default', entities: [] }]
		}
		// exclude entities not used in mapping
		for (const k in schema.mappings) {
			schema.mappings[k] = this.clearMapping2(schema, schema.mappings[k])
		}
		return schema
	}

	private extendEntities (schema: Schema) {
		if (schema.entities) {
			for (const entity of schema.entities) {
				if (entity && entity.extends) {
					this.extendEntity(entity, schema.entities)
				}
			}
		}
		schema.entities = this.clearEntities(schema.entities)
		this.complete(schema)
	}

	private extendMappings (schema: Schema) {
		if (!schema.mappings || !schema.mappings.length || schema.mappings.length === 0) {
			schema.mappings = [{ name: 'default', entities: [] }]
		} else {
			// extend entities into mapping
			for (const k in schema.mappings) {
				const entities = schema.mappings[k].entities || []
				for (const entity of entities) {
					this.extendEntityMapping(entity, entities)
				}
			}
			// extends mappings
			for (const mapping of schema.mappings) {
				this.extendMapping(mapping, schema.mappings)
			}
		}
		// extend mapping for model
		for (const k in schema.mappings) {
			this.extendObject(schema.mappings[k], { entities: schema.entities })
			schema.mappings[k] = this.clearMapping(schema.mappings[k])
			const mapping = schema.mappings[k]
			if (mapping && mapping.entities) {
				this.completeMapping(schema.mappings[k])
			}
		}
	}

	private extendDataSources (schema: Schema) {
		if (!schema.dataSources || !schema.dataSources.length || schema.dataSources.length === 0) {
			console.log('DataSources not defined')
			schema.dataSources = [{ name: 'default', dialect: 'MySQL', mapping: schema.mappings[0].name, connection: null }]
		}
		for (const k in schema.dataSources) {
			const dataSource = schema.dataSources[k]
			if (dataSource.mapping === undefined) {
				dataSource.mapping = schema.mappings[0].name
			}
		}
	}

	private extendDataStages (schema: Schema) {
		if (!schema.stages || !schema.stages.length || schema.stages.length === 0) {
			schema.stages = [{ name: 'default', dataSources: [{ name: schema.dataSources[0].name }] }]
		}
		for (const k in schema.stages) {
			const stage = schema.stages[k]
			if (stage.dataSources === undefined) {
				stage.dataSources = [{ name: schema.dataSources[0].name }]
			}
		}
	}

	public complete (schema: Schema): void {
		if (schema) {
			if (schema.entities) {
				this.completeEntities(schema.entities, schema.views)
				if (schema.entities && schema.entities.length) {
					this.completeRelations(schema.entities)
					this.completeDependents(schema.entities)
				}
			}
		}
	}

	public isCompound (parent, child):boolean {
		const parentRoot = parent.split('.')[0]
		const childRoot = child.split('.')[0]
		return parentRoot === childRoot
	}

	private clearEntities (source: Entity[]): Entity[] {
		const target: Entity[] = []
		if (source && source.length) {
			for (const sourceEntity of source) {
				if (sourceEntity.abstract === true) continue
				target.push(sourceEntity)
			}
		}
		return target
	}

	private completeEntities (entities: Entity[], views: View[]): void {
		if (entities && entities.length) {
			for (const entity of entities) {
				this.completeEntity(entity, views)
			}
		}
	}

	private completeEntity (entity: Entity, views: View[]):void {
		entity.composite = entity.name.includes('.')
		this.completeEntityProperties(entity)
		this.completeEntityRelations(entity)
		if (entity.properties) {
			entity.hadReadExps = entity.properties.some(p => p.readExp !== undefined)
			entity.hadWriteExps = entity.properties.some(p => p.writeExp !== undefined)
			entity.hadReadValues = entity.properties.some(p => p.readValue !== undefined)
			entity.hadWriteValues = entity.properties.some(p => p.writeValue !== undefined)
			entity.hadDefaults = entity.properties.some(p => p.default !== undefined)
			entity.hadViewReadExp = views ? views.some(p => p.entities ? p.entities.some(q => q.name === entity.name && q.properties ? q.properties.some(r => r.readExp !== undefined) : false) : false) : false
		} else {
			entity.hadReadExps = false
			entity.hadWriteExps = false
			entity.hadReadValues = false
			entity.hadWriteValues = false
			entity.hadDefaults = false
			entity.hadViewReadExp = false
		}
	}

	private completeEntityProperties (entity: Entity):void {
		if (entity.properties !== undefined) {
			for (const property of entity.properties) {
				if (property.type === undefined) property.type = 'string'
				if (property.type === 'string' && property.length === undefined) property.length = 80
				if (property.length !== undefined && isNaN(property.length)) {
					throw new SchemaError(`Invalid length in ${entity.name}.${property.name}`)
				}
			}
		}
	}

	private completeEntityRelations (entity: Entity):void {
		if (entity.relations !== undefined) {
			for (const relation of entity.relations) {
				if (relation.type === undefined) relation.type = RelationType.oneToMany
				// All relations manyToOne are weak
				if (relation.type === RelationType.manyToOne) relation.weak = true
				if (relation.weak === undefined) relation.weak = false
			}
		}
	}

	private completeRelations (entities: Entity[]): void {
		for (const source of entities) {
			if (source.relations !== undefined) {
				for (const sourceRelation of source.relations) {
					if (sourceRelation.target && (sourceRelation.type === RelationType.oneToMany || sourceRelation.type === RelationType.oneToOne)) {
						this.completeRelation(sourceRelation, entities)
					}
				}
			}
		}
	}

	private completeRelation (sourceRelation: Relation, entities: Entity[]) {
		const targetEntity = entities.find(p => p.name === sourceRelation.entity)
		if (targetEntity) {
			let exists = false
			if (targetEntity.relations) {
				exists = targetEntity.relations.find(p => p.name === sourceRelation.target) !== undefined
			}
			if (!exists) {
				if (targetEntity.relations === undefined) {
					targetEntity.relations = []
				}
				targetEntity.relations.push({
					name: sourceRelation.target as string,
					type: sourceRelation.type === RelationType.oneToOne ? RelationType.oneToOne : RelationType.manyToOne,
					composite: this.isCompound(targetEntity.name, source.name),
					from: sourceRelation.to,
					entity: source.name,
					weak: true,
					to: sourceRelation.from,
					target: sourceRelation.name
				})
			}
		}
	}

	private completeDependents (entities: Entity[]): void {
		for (const entity of entities) {
			entity.dependents = []
			for (const related of entities) {
				if (related.relations === undefined) {
					continue
				}
				for (const relation of related.relations) {
					if (relation.entity === entity.name && !relation.weak) {
						const dependent = { entity: related.name, relation: relation }
						entity.dependents.push(dependent)
					}
				}
			}
		}
	}

	private extendEntity (entity: Entity, entities: Entity[]): void {
		const base = entities.find(p => p.name === entity.extends)
		if (base === undefined) {
			throw new SchemaError(`${entity.extends} not found`)
		}
		this.extendEntity(base, entities)
		if (entity.primaryKey === undefined && base.primaryKey !== undefined) entity.primaryKey = base.primaryKey
		// extend properties
		if (base.properties !== undefined && base.properties.length > 0) {
			if (entity.properties === undefined) {
				entity.properties = []
			}
			this.extendObject(entity.properties, base.properties)
		}
		// extend relations
		if (base.relations !== undefined && base.relations.length > 0) {
			if (entity.relations === undefined) {
				entity.relations = []
			}
			this.extendObject(entity.relations, base.relations)
		}
		// elimina dado que ya fue extendido
		delete entity.extends
	}

	private extendMapping (mapping: Mapping, mappings: Mapping[]): void {
		if (mapping && mapping.extends) {
			const base = mappings.find(p => p.name === mapping.extends)
			if (base === undefined) {
				throw new SchemaError(`${mapping.extends} not found`)
			}
			this.extendMapping(base, mappings)
			this.extendObject(mapping, base)
			// elimina dado que ya fue extendido
			delete mapping.extends
		}
	}

	private extendEntityMapping (entity: EntityMapping, entities: EntityMapping[]): void {
		if (entity && entity.extends) {
			const base = entities.find(p => p.name === entity.extends)
			if (base === undefined) {
				throw new SchemaError(`${entity.extends} not found`)
			}
			this.extendEntityMapping(base, entities)
			if (entity.uniqueKey === undefined && base.uniqueKey !== undefined) {
				entity.uniqueKey = base.uniqueKey
			}
			if (entity.mapping === undefined && base.mapping !== undefined) {
				entity.mapping = base.mapping
			}
			this.extendEntityMappingIndexes(entity, base)
			this.extendEntityMappingProperties(entity, base)
			// delete since it was already extended
			delete entity.extends
		}
	}

	private extendEntityMappingIndexes (entity: EntityMapping, base: EntityMapping): void {
		if (base.indexes !== undefined && base.indexes.length > 0) {
			if (entity.indexes === undefined) {
				entity.indexes = []
			}
			this.extendObject(entity.indexes, base.indexes)
		}
	}

	private extendEntityMappingProperties (entity: EntityMapping, base: EntityMapping): void {
		if (base.properties !== undefined && base.properties.length > 0) {
			if (entity.properties === undefined) {
				entity.properties = []
			}
			this.extendObject(entity.properties, base.properties)
		}
	}

	private extendObject (obj: any, base: any) {
		if (Array.isArray(base)) {
			for (const baseChild of base) {
				const objChild = obj.find((p: any) => p.name === baseChild.name)
				if (objChild === undefined) {
					obj.push(Helper.clone(baseChild))
				} else {
					this.extendObject(objChild, baseChild)
				}
			}
		} else if (typeof base === 'object') {
			for (const k in base) {
				if (obj[k] === undefined) {
					obj[k] = Helper.clone(base[k])
				} else if (typeof obj[k] === 'object') {
					this.extendObject(obj[k], base[k])
				}
			}
		}
		return obj
	}

	private completeMapping (mapping: Mapping): void {
		for (const entity of mapping.entities) {
			if (Helper.isEmpty(entity.mapping)) {
				entity.mapping = entity.name
			}
			if (entity.properties === undefined || entity.properties.length === 0) {
				entity.hadKeys = false
				continue
			}
			for (const property of entity.properties) {
				if (Helper.isEmpty(property.mapping)) {
					property.mapping = property.name
				}
			}
			entity.hadKeys = entity.properties.some(p => p.key !== undefined)
		}
	}

	private clearMapping (source: Mapping): Mapping {
		const target: Mapping = { name: source.name, mapping: source.mapping, entities: [] }
		if (source && source.entities) {
			for (const sourceEntity of source.entities) {
				if (sourceEntity.abstract === true) continue
				target.entities.push(sourceEntity)
			}
		}
		return target
	}

	private clearMapping2 (schema: Schema, source: Mapping): Mapping {
		const target: Mapping = { name: source.name, mapping: source.mapping, entities: [] }

		if (source && source.entities) {
			for (const sourceEntity of source.entities) {
				if (!this.existsInMapping(schema, source.name, sourceEntity.name)) continue
				target.entities.push(sourceEntity)
			}
		}
		return target
	}

	private existsInMapping (schema: Schema, mapping: string, entity: string): boolean {
		const context: ContextInfo = { entity: entity, sentence: 'ddl', read: false, write: true, dml: false, ddl: true }
		const dataSourcesNames = schema.dataSources.filter(p => p.mapping === mapping).map(p => p.name)
		for (const stage of schema.stages) {
			const ruleDataSources = stage.dataSources.filter(p => dataSourcesNames.includes(p.name))
			for (const ruleDataSource of ruleDataSources) {
				if (ruleDataSource.condition === undefined || this.expressions.eval(ruleDataSource.condition, context)) {
					return true
				}
			}
		}
		return false
	}
}

export class SchemaManager {
	public dataSource: DataSourceConfig
	public model: ModelConfig
	public mapping: MappingsConfig
	public stage: StageConfig
	public view: ViewsConfig
	public schema: Schema
	public workspace: string
	private extender: SchemaExtender
	private expressions: Expressions

	constructor (workspace: string, expressions: Expressions) {
		this.expressions = expressions
		this.workspace = workspace
		this.dataSource = new DataSourceConfig()
		this.model = new ModelConfig()
		this.mapping = new MappingsConfig()
		this.stage = new StageConfig()
		this.view = new ViewsConfig()
		this.extender = new SchemaExtender(this.expressions)
		this.schema = { app: { src: 'src', data: 'data', model: 'model' }, enums: [], entities: [], mappings: [], dataSources: [], stages: [], views: [] }
	}

	public async init (source?: string | Schema): Promise<Schema> {
		let schema
		if (!source || typeof source === 'string') {
			schema = await this.get(source)
		} else {
			if (source === undefined) {
				throw new SchemaError(`Schema: ${source} not supported`)
			}
			schema = source
		}
		Helper.solveEnvironmentVariables(schema)
		return this.load(schema)
	}

	public async get (source?: string): Promise<Schema> {
		const configPath = await this.getConfigPath(source)
		let schema: Schema = { app: { src: 'src', data: 'data', model: 'model' }, entities: [], enums: [], dataSources: [], mappings: [], stages: [], views: [] }
		if (configPath) {
			if (path.extname(configPath) === '.yaml' || path.extname(configPath) === '.yml') {
				const content = await Helper.readFile(configPath)
				if (content !== null) {
					schema = yaml.load(content)
				} else {
					throw new SchemaError(`Schema file: ${configPath} empty`)
				}
			} else if (path.extname(configPath) === '.json') {
				const content = await Helper.readFile(configPath)
				if (content !== null) {
					schema = JSON.parse(content)
				} else {
					throw new SchemaError(`Schema file: ${configPath} empty`)
				}
			} else {
				throw new SchemaError(`Schema file: ${configPath} not supported`)
			}
		}
		this.completeSchema(schema)
		return schema
	}

	private async getConfigPath (source?: string):Promise<string|undefined> {
		let workspace: string
		let configFile: string | undefined
		workspace = process.cwd()

		if (source === undefined) {
			configFile = await this.getConfigFileName(workspace)
		} else if (typeof source === 'string') {
			if (await Helper.existsPath(source)) {
				const lstat = await Helper.lstat(source)
				if (lstat.isFile()) {
					configFile = path.basename(source)
					workspace = path.dirname(source)
				} else {
					workspace = source
					configFile = await this.getConfigFileName(workspace)
				}
			} else {
				console.log(`Not exists path ${source}`)
			}
		} else {
			console.log('Schema: not supported:')
			console.log(source)
		}
		if (configFile) {
			return path.join(workspace, configFile)
		} else {
			return undefined
		}
	}

	private completeSchema (schema: Schema) {
		if (schema.app === undefined) {
			schema.app = { src: 'src', data: 'data', model: 'model' }
		} else {
			if (schema.app.src === undefined) {
				schema.app.src = 'src'
			}
			if (schema.app.data === undefined) {
				schema.app.data = 'data'
			}
			if (schema.app.model === undefined) {
				schema.app.model = 'model'
			}
		}
		if (schema.dataSources === undefined) schema.dataSources = []
	}

	public async getConfigFileName (workspace: string): Promise<string | undefined> {
		if (await Helper.existsPath(path.join(workspace, 'lambdaORM.yaml'))) {
			return 'lambdaORM.yaml'
		} else if (await Helper.existsPath(path.join(workspace, 'lambdaORM.yml'))) {
			return 'lambdaORM.yml'
		} else if (await Helper.existsPath(path.join(workspace, 'lambdaORM.json'))) {
			return 'lambdaORM.json'
		} else {
			return undefined
		}
	}

	public complete (schema: Schema): void {
		this.extender.complete(schema)
	}

	public extend (schema: Schema): Schema {
		return this.extender.extend(schema)
	}

	public load (schema: Schema): Schema {
		this.schema = this.extend(schema)
		this.model.entities = this.schema.entities || []
		this.model.enums = this.schema.enums || []
		if (!this.schema.views) {
			this.schema.views = [{ name: 'default', entities: [] }]
		}
		for (const view of this.schema.views) {
			this.view.load(view)
		}
		if (this.schema.mappings) {
			for (const mapping of this.schema.mappings) {
				this.mapping.load(mapping)
			}
		}
		if (this.schema.dataSources) {
			for (const dataSource of this.schema.dataSources) {
				dataSource.connection = Helper.tryParse(dataSource.connection)
				const connectionConfig: ConnectionConfig = { name: dataSource.name, dialect: dataSource.dialect, connection: {} }
				connectionConfig.connection = dataSource.connection
				this.dataSource.load(dataSource)
			}
		}
		if (this.schema.stages) {
			for (const stage of this.schema.stages) {
				this.stage.load(stage)
			}
		}
		return this.schema
	}

	public solveOptions (options?: OrmOptions):OrmOptions {
		if (!options) {
			options = {}
		}
		if (!options.stage) {
			const _stage = this.stage.get()
			options.stage = _stage.name
		}
		if (!options.view) {
			const _view = this.view.get()
			options.view = _view.name
		}
		return options
	}
}
