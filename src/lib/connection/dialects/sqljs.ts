
/* eslint-disable no-tabs */

import { Connection, ConnectionConfig, ConnectionPool } from '..'
import { Parameter, Query } from '../../model'
import { Helper } from '../../manager/helper'
import { MappingConfig } from '../../manager'

export class SqlJsConnectionPool extends ConnectionPool {
	private static lib:any
	private db :any
	constructor (config:ConnectionConfig) {
		super(config)
		if (!SqlJsConnectionPool.lib) { SqlJsConnectionPool.lib = require('sql.js') }
	}

	public async init (): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const me = this
		const filebuffer = await Helper.readFile(me.config.connection)
		this.db = await new Promise<void>((resolve, reject) => {
			SqlJsConnectionPool.lib.then(function (SQL:any) {
				// Load the db
				try {
					const db = new SQL.Database(filebuffer)
					resolve(db)
				} catch (error) {
					reject(error)
				}
			})
		})
	}

	public async acquire (): Promise<Connection> {
		return new SqlJsConnection(this.db, this)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async release (connection: Connection): Promise<void> {
		console.info('sqljs release pool not Implemented')
	}

	public async end (): Promise<void> {
		const data = this.db.export()
		await Helper.writeFile(this.config.connection, data)
	}
}

export class SqlJsConnection extends Connection {
	public async select (mapping:MappingConfig, query: Query, params:Parameter[]):Promise<any> {
		return await this._execute(query, params)
	}

	public async insert (mapping:MappingConfig, query: Query, params:Parameter[]):Promise<number> {
		const result = await this._execute(query, params)
		return result as number
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async bulkInsert (mapping:MappingConfig, query: Query, array: any[], params: Parameter[]): Promise<number[]> {
		const sql = query.sentence
		try {
			if (!array || array.length === 0) {
				return []
			}
			// https://github.com/sidorares/node-mysql2/issues/830
			const result = await this.cnx.query(sql, [array])

			// TODO: verificar https://github.com/sidorares/node-mysql2/issues/435
			const start = result[0].insertId
			const end = result[0].insertId + (result[0].affectedRows - 1)
			const lastInsertedIds:number[] = []
			for (let i = start; i <= end; i++)lastInsertedIds.push(i)
			return lastInsertedIds
		} catch (error:any) {
			throw new Error(`sentence: ${sql} error: ${error.message}`)
		}
	}

	public async update (mapping:MappingConfig, query: Query, params:Parameter[]):Promise<number> {
		const result = await this._execute(query, params)
		return result
	}

	public async delete (mapping:MappingConfig, query: Query, params:Parameter[]):Promise<number> {
		const result = await this._execute(query, params)
		return result
	}

	public async execute (query: Query):Promise<any> {
		return await this.cnx._query(query)
	}

	public async executeDDL (query: Query):Promise<any> {
		return await this.cnx.db.run(query.sentence)
	}

	public async executeSentence (sentence: any):Promise<any> {
		return await this.cnx.db.run(sentence)
	}

	public async beginTransaction ():Promise<void> {
		// TODO:
		this.inTransaction = true
	}

	public async commit (): Promise<void> {
		// TODO:
		this.inTransaction = false
	}

	public async rollback ():Promise<void> {
		// TODO:
		this.inTransaction = false
	}

	protected async _execute (query: Query, params: Parameter[] = []): Promise<any> {
		const sql = query.sentence
		const values:any[] = []
		for (let i = 0; i < params.length; i++) {
			values.push(params[i].value)
		}
		return this.cnx.db.run(sql, values)
	}

	protected async _query (query: Query, params: Parameter[] = []): Promise<any[]> {
		const sql = query.sentence
		const values:any[] = []
		for (let i = 0; i < params.length; i++) {
			values.push(params[i].value)
		}
		const result = this.cnx.db.run(sql, values)

		const rows = []
		const cols = result.columns
		for (let i = 0; i < result.values.length; i++) {
			const values = result.values[i]
			const row:any = {}
			for (let j = 0; j < cols.length; j++) {
				const col = cols[j] as string
				row[col] = values[j]
			}
			rows.push(row)
		}
		return rows
	}
}
