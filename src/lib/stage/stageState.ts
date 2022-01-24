import { Entity, ModelState } from '../model'
import { SchemaManager } from '../manager'
import { Helper } from '../manager/helper'
const path = require('path')

export class StageState {
	private schema: SchemaManager
	constructor (schema:SchemaManager) {
		this.schema = schema
	}

	public async get (name:string):Promise<ModelState> {
		const file = this.getFile(name)
		const exists = await Helper.existsPath(file)
		if (exists) {
			const content = await Helper.readFile(file)
			if (content) {
				return JSON.parse(content)
			}
		}
		return { entities: [], mappingData: {}, pendingData: [] }
	}

	public async updateModel (name:string, entities:Entity[]):Promise<void> {
		const stateFile = this.getFile(name)
		const state = await this.get(name)
		state.entities = entities
		await Helper.writeFile(stateFile, JSON.stringify(state))
	}

	public async updateData (name:string, mappingData:any, pendingData:any[]):Promise<void> {
		const stateFile = this.getFile(name)
		const state = await this.get(name)
		state.mappingData = mappingData
		state.pendingData = pendingData
		await Helper.writeFile(stateFile, JSON.stringify(state))
	}

	public async remove (name:string):Promise<any> {
		const file = this.getFile(name)
		await Helper.removeFile(file)
	}

	public getFile (name: string) {
		return path.join(this.schema.workspace, this.schema.schema.app.data, `${name}-state.json`)
	}
}
