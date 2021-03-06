import { Query, Entity } from '../model'
import { ExpressionManager, Executor, ModelConfig } from '../manager'
import { StageState } from './stageState'

export abstract class StageActionDML {
	protected state: StageState
	protected model: ModelConfig
	protected expressionManager: ExpressionManager
	protected executor: Executor
	protected stage: string
	protected view: string
	protected arrowVariables = ['p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'o']
	constructor (state:StageState, model: ModelConfig, expressionManager: ExpressionManager, executor: Executor, stage:string, view:string) {
		this.state = state
		this.model = model
		this.expressionManager = expressionManager
		this.executor = executor
		this.stage = stage
		this.view = view
	}

	public async sentence ():Promise<any> {
		const sentences:any[] = []
		const queries = await this.build()
		for (let i = 0; i < queries.length; i++) {
			const query = queries[i]
			sentences.push(query.sentence)
		}
		return sentences
	}

	protected build (): Query[] {
		const queries:Query[] = []
		for (const i in this.model.entities) {
			const entity = this.model.entities[i]
			if (!this.model.isChild(entity.name)) {
				const query = this.createQuery(entity)
				queries.push(query)
			}
		}
		return queries
	}

	protected abstract createQuery(entity:Entity):Query

	protected createInclude (entity:Entity, level = 0):string {
		const arrowVariable = this.arrowVariables[level]
		const includes:string[] = []
		for (const i in entity.relations) {
			const relation = entity.relations[i]
			if (relation.composite) {
				const childEntity = this.model.getEntity(relation.entity)
				if (childEntity !== undefined) {
					const childInclude = this.createInclude(childEntity, level + 1)
					includes.push(`${arrowVariable}.${relation.name}${childInclude}`)
				}
			}
		}
		return includes.length === 0
			? ''
			: `.include(${arrowVariable}=>[${includes.join(',')}])`
	}

	protected getAllEntities (queries:Query[]):string[] {
		const entities:string[] = []
		for (const p in queries) {
			const query = queries[p]
			entities.push(query.entity)
			if (query.children && query.children.length > 0) {
				const childrenQuery = query.children.map(p => p.query)
				const childrenEntity = this.getAllEntities(childrenQuery)
				for (const i in childrenEntity) {
					entities.push(childrenEntity[i])
				}
			}
		}
		return entities
	}
}
