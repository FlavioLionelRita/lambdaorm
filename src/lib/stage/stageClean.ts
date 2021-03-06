import { Query, ExecuteResult } from '../model'
import { StageActionDDL } from './stageActionDDL'
import { DDLBuilder } from '../manager/ddlBuilder'
export class StageClean extends StageActionDDL {
	public async queries (): Promise<Query[]> {
		const state = await this.state.get(this.stage)
		if (state && state.mappings) {
			return new DDLBuilder(this.schema, this.routing, this.languages, this.stage).drop(state.mappings)
		}
		return []
	}

	public async execute (tryAllCan = false): Promise<ExecuteResult[]> {
		const queries = await this.queries()
		const result = await this.executor.executeList(this.stage, undefined, queries, tryAllCan)
		await this.state.remove(this.stage)
		await this.state.ddl(this.stage, 'clean', queries)
		return result
	}
}
