import { MappingConfig, ViewConfig } from '.'
import { Sentence, EntityMapping, Field, Filter, Join, SchemaError, SentenceInclude, Insert, Update, Constant2, PropertyMapping } from '../model'
import { Expressions, Variable, Operand, Operator, KeyValue } from 'js-expressions'

export class SentenceCompleter {
	protected expressions: Expressions

	constructor (expressions:Expressions) {
		this.expressions = expressions
	}

	public complete (mapping: MappingConfig, view: ViewConfig, sentence: Sentence) {
		const entity = mapping.getEntity(sentence.entity) as EntityMapping
		if (entity.filter || entity.hadKeys) {
			if (sentence.name !== 'insert' && sentence.name !== 'bulkInsert') {
				this.solveFilter(sentence, entity)
			}
			if (entity.hadKeys && ['insert', 'bulkInsert', 'update'].includes(sentence.name)) {
				this.solveKeys(sentence, entity)
			}
			if (sentence.name === 'select') {
				this.solveJoin(sentence, mapping)
			}
		}
		if (sentence.name === 'select' && (entity.hadReadExps || entity.hadReadMappingExp || entity.hadViewReadExp)) {
			this.solveProperty(sentence, mapping, view)
		}
	}

	private solveFilter (sentence: Sentence, entity: EntityMapping) {
		let newFilter: Operand | undefined
		// add filter for filter in entity
		if (entity.filter) {
			const expression = this.expressions.parse(entity.filter)
			newFilter = this.replaceField(entity, sentence.alias, expression)
		}
		// add filter for keys in properties
		if (entity.hadKeys) {
			const expressionKeys = this.filterbyKeys(sentence, entity)
			if (expressionKeys) {
				if (newFilter) {
					newFilter = new Operator('&&', [newFilter, expressionKeys])
				} else {
					newFilter = expressionKeys
				}
			}
		}
		// if exists newFilter  add to current filter
		if (newFilter) {
			const filter = sentence.children.find(p => p.name === 'filter') as Filter|undefined
			if (filter) {
				filter.children[0] = new Operator('&&', [filter.children[0], newFilter])
			} else {
				sentence.children.push(new Filter('filter', [newFilter]))
			}
		}
	}

	private solveKeys (sentence: Sentence, entity: EntityMapping) {
		const insert = sentence.children.find(p => p instanceof Insert)
		const update = sentence.children.find(p => p instanceof Update)
		for (const p in entity.properties) {
			const property = entity.properties[p]
			if (property.key) {
				if (insert) {
					this.solveKey(property, insert)
				} else if (update) {
					this.solveKey(property, update)
				}
				// TODO: ver como resolver en los casos que el parametro no tiene el mismo nombre que el campo
				const index = sentence.parameters.findIndex(p => p.name === property.name)
				if (index >= 0) {
					sentence.parameters.splice(index, 1)
				}
			}
		}
	}

	private solveKey (property:PropertyMapping, operand:Operand):Operand {
		for (const i in operand.children) {
			const child = operand.children[i]
			if (child instanceof KeyValue) {
				const keyValue = child as KeyValue
				if (keyValue.name === property.name) {
					child.children[0] = new Constant2(property.key as string)
				}
			} else if (child.children && child.children.length > 0) {
				operand.children[i] = this.solveKey(property, child)
			}
		}
		return operand
	}

	private filterbyKeys (sentence: Sentence, entity: EntityMapping) : Operand|undefined {
		let expression:string|undefined
		for (const i in entity.properties) {
			const property = entity.properties[i]
			if (property.key) {
				if (!expression) {
					expression = ''
				}
				if (typeof property.key === 'string') {
					expression = expression + `${property.name} == '${property.key}' `
				} else {
					expression = expression + `${property.name} == ${property.key} `
				}
			}
		}
		if (expression) {
			const operand = this.expressions.parse(expression)
			return this.replaceField(entity, sentence.alias, operand)
		} else {
			return undefined
		}
	}

	private solveJoin (sentence: Sentence, mapping: MappingConfig) {
		const joins = sentence.children.filter(p => p instanceof Join)
		for (let i = 0; i < joins.length; i++) {
			const join = joins[i]
			const parts = join.name.split('.')
			const entity = mapping.getEntity(parts[0])
			if (entity === undefined) {
				throw new SchemaError(`not found mapping for ${parts[0]}`)
			}
			let newFilter: Operand | undefined
			// add filter for filter in entity
			if (entity.filter) {
				const expression = this.expressions.parse(entity.filter)
				newFilter = this.replaceField(entity, parts[1], expression)
			}
			// add filter for keys in properties
			const expressionKeys = this.filterbyKeys(sentence, entity)
			if (expressionKeys) {
				if (newFilter) {
					newFilter = new Operator('&&', [newFilter, expressionKeys])
				} else {
					newFilter = expressionKeys
				}
			}
			// if exists newFilter  add to current filter
			if (newFilter) {
				join.children[0] = new Operator('&&', [join.children[0], newFilter])
			}
		}
	}

	private solveProperty (operand:Operand, mapping: MappingConfig, view:ViewConfig) {
		for (const i in operand.children) {
			const child = operand.children[i]
			if (child instanceof Field) {
				const field = child as Field
				const alias = field.alias as string
				const entity = mapping.getEntity(field.entity)
				const property = entity?.properties.find(p => p.name === field.name)
				if (entity && property) {
					const viewPorperty = view.getProperty(entity.name, property.name)
					if (property.readMappingExp || property.readExp || (viewPorperty && viewPorperty.readExp)) {
						let sourceOperand = child as Operand
						if (property.readMappingExp) {
							const expression = this.expressions.parse(property.readMappingExp)
							sourceOperand = this.replaceField(entity, alias, expression, field.name, sourceOperand)
						}
						if (property.readExp) {
							const expression = this.expressions.parse(property.readExp)
							sourceOperand = this.replaceField(entity, alias, expression, field.name, sourceOperand)
						}
						if (viewPorperty && viewPorperty.readExp) {
							const expression = this.expressions.parse(viewPorperty.readExp)
							sourceOperand = this.replaceField(entity, alias, expression, field.name, sourceOperand)
						}
						operand.children[i] = sourceOperand
					}
				}
			} else if (child instanceof SentenceInclude === false) {
				this.solveProperty(child, mapping, view)
			}
		}
	}

	private replaceField (entity:EntityMapping, alias:string, operand:Operand, sourceName?:string, source?:Operand):Operand {
		for (const i in operand.children) {
			const child = operand.children[i]
			if (child instanceof Variable) {
				const property = entity.properties.find(p => p.name === child.name)
				if (property) {
					if (sourceName && source && property.name === sourceName) {
						operand.children[i] = source
					} else {
						operand.children[i] = new Field(entity.name, child.name, property.type, alias)
					}
				}
			} else if (child.children && child.children.length > 0) {
				operand.children[i] = this.replaceField(entity, alias, child, sourceName, source)
			}
		}
		return operand
	}
}
