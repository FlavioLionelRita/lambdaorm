
import { Parameter, Query, Data, MethodNotImplemented } from '../model'
import { ConnectionConfig } from './connectionConfig'
import { MappingConfig, Dialect, Helper } from '../manager'

export abstract class Connection {
	public cnx: any
	public pool: any
	public inTransaction: boolean

	public maxChunkSizeOnSelect: number
	public maxChunkSizeIdsOnSelect: number
	public maxChunkSizeOnBulkInsert: number

	protected formatDateTime?: string
	protected formatDate?: string
	protected formatTime?: string

	constructor (cnx: any, pool: any) {
		this.cnx = cnx
		this.pool = pool
		this.inTransaction = false
		this.formatDateTime = 'yyyy-LL-dd HH:mm:ss'
		this.formatDate = 'yyyy-LL-dd'
		this.formatTime = 'HH:mm:ss'
		this.maxChunkSizeOnSelect = 10000
		this.maxChunkSizeIdsOnSelect = 7000
		this.maxChunkSizeOnBulkInsert = 100000
	}

	public get config (): ConnectionConfig {
		return this.pool.config
	}

	protected arrayToRows (query: Query, mapping: MappingConfig, array: any[]): any[] {
		const rows: any[] = []
		for (const item of array) {
			const row: any[] = []
			for (const parameter of query.parameters) {
				let value = item[parameter.name]
				if (value) {
					switch (parameter.type) {
					case 'datetime':
						value = this.writeDateTime(value, mapping)
						break
					case 'date':
						value = this.writeDate(value, mapping)
						break
					case 'time':
						value = this.writeTime(value, mapping)
						break
					}
				}
				row.push(value === undefined ? null : value)
			}
			rows.push(row)
		}
		return rows
	}

	protected dataToParameters (query: Query, mapping: MappingConfig, data: Data): Parameter[] {
		const parameters: Parameter[] = []
		for (const parameter of query.parameters) {
			let value = data.get(parameter.name)
			if (value) {
				switch (parameter.type) {
				case 'datetime':
					value = this.writeDateTime(value, mapping)
					break
				case 'date':
					value = this.writeDate(value, mapping)
					break
				case 'time':
					value = this.writeTime(value, mapping)
					break
				}
			} else {
				value = null
			}
			parameters.push({ name: Helper.transformParameter(parameter.name), type: parameter.type, value: value })
		}
		return parameters
	}

	protected writeDateTime (value: any, mapping: MappingConfig): any {
		const format = mapping.format?.datetime || this.formatDateTime
		return format ? Helper.dateFormat(value, format) : value
	}

	public writeDate (value: any, mapping: MappingConfig): any {
		const format = mapping.format?.datetime || this.formatDate
		return format ? Helper.dateFormat(value, format) : value
	}

	public writeTime (value: any, mapping: MappingConfig): any {
		const format = mapping.format?.datetime || this.formatTime
		return format ? Helper.dateFormat(value, format) : value
	}

	public abstract select(mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<any>
	public abstract insert(mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<any>
	public abstract bulkInsert(mapping: MappingConfig, dialect: Dialect, query: Query, array: any[]): Promise<any[]>
	public abstract update(mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<number>
	public abstract delete(mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<number>
	public abstract execute(query: Query): Promise<any>
	public abstract executeDDL(query: Query): Promise<any>
	public abstract executeSentence(sentence: any): Promise<any>
	public abstract beginTransaction(): Promise<void>
	public abstract commit(): Promise<void>
	public abstract rollback(): Promise<void>

	public async bulkDelete (_mapping: MappingConfig, _dialect: Dialect, _query: Query, _array: any[]): Promise<number> {
		throw new MethodNotImplemented('Connection', 'deleteMany')
	}

	public async bulkUpdate (_mapping: MappingConfig, _dialect: Dialect, _query: Query, _array: any[]): Promise<number> {
		throw new MethodNotImplemented('Connection', 'updateMany')
	}

	public async truncateEntity (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async createEntity (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async createSequence (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async createFk (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async createIndex (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async alterProperty (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async addProperty (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async addPk (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async addUk (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async addFk (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async dropSequence (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async dropEntity (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async dropProperty (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async dropPk (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async dropUk (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async dropFK (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}

	public async dropIndex (_mapping: MappingConfig, query: Query): Promise<any> {
		return this.executeDDL(query)
	}
}
