/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Connection, ConnectionConfig, ConnectionPool } from './..'
import { Parameter } from '../../model'
import { Helper } from './../../helper'

export class MssqlConnectionPool extends ConnectionPool {
	public static tedious: any
	public static MssqlConnectionPool:any
	protected pool:any
	constructor (config: ConnectionConfig) {
		super(config)
		if (!MssqlConnectionPool.tedious) {
			MssqlConnectionPool.tedious = require('tedious')
			MssqlConnectionPool.MssqlConnectionPool = require('tedious-connection-pool')
		}
	}

	public async init (): Promise<void> {
		const defaultPoolConfig = { min: 2, max: 4, log: false }
		this.pool = new MssqlConnectionPool.MssqlConnectionPool(this.config.connection.pool || defaultPoolConfig, this.config.connection)
	}

	public async acquire (): Promise<Connection> {
		const me = this
		return new Promise<Connection>((resolve, reject) => {
			this.pool.acquire(function (err: any, cnx: any) {
				if (err) {
					console.error(err)
					reject(err)
				}
				resolve(new MssqlConnection(cnx, me))
			})
		})
	}

	public async release (connection: Connection): Promise<void> {
		if (connection.cnx.closed) {
			return
		}
		connection.cnx.release()
	}

	public async end (): Promise<void> {
		await this.pool.drain()
	}
}

export class MssqlConnection extends Connection {
	public async select (sql:string, params:Parameter[]):Promise<any> {
		const result = await this._query(sql, params)
		return result
	}

	public async insert (sql:string, params:Parameter[]):Promise<number> {
		const result = await this._execute(sql, params)
		return result.insertId
	}

	public async bulkInsert (sql: string, array: any[], params: Parameter[], fieldId?: string): Promise<any[]> {
		// https://www.sqlservertutorial.net/sql-server-basics/sql-server-insert-multiple-rows/
		let query = ''
		try {
			const ids: any[] = []
			const size = 1000
			for (let i = 0; i * size < array.length; i++) {
				const start = i * size
				let end = start + size
				if (end > array.length) {
					end = array.length
				}
				const buffer = array.slice(start, end)

				const rows = this.toRows(buffer, params)
				query = fieldId
					? `${sql} OUTPUT inserted.${fieldId} VALUES ${rows.join(',')};`
					: `${sql} VALUES ${rows.join(',')};`

				const result = await this._query(query)

				if (fieldId) {
					for (const p in result) {
						const id = result[p][fieldId]
						ids.push(id)
					}
				}
			}
			return ids
		} catch (error) {
			throw new Error(`Error to execute bulkInsert \nerror: ${error} \nquery:\n${query}`)
		}
	}

	public async update (sql:string, params:Parameter[]):Promise<number> {
		return await this._execute(sql, params)
	}

	public async delete (sql:string, params:Parameter[]):Promise<number> {
		return await this._execute(sql, params)
	}

	public async execute (sql:string):Promise<any> {
		return await this._execute(sql)
	}

	public async beginTransaction (): Promise<void> {
		const me = this
		return new Promise<void>((resolve, reject) => {
			this.cnx.beginTransaction((err:any) => {
				if (err) {
					reject(err)
				}
				me.inTransaction = true
				resolve()
			})
		})
	}

	public async commit (): Promise<void> {
		const me = this
		return new Promise<void>((resolve, reject) => {
			this.cnx.commitTransaction((err:any) => {
				if (err) {
					reject(err)
				}
				me.inTransaction = true
				resolve()
			})
		})
	}

	public async rollback (): Promise<void> {
		const me = this
		return new Promise<void>((resolve, reject) => {
			this.cnx.rollbackTransaction((err:any) => {
				if (err) {
					reject(err)
				}
				me.inTransaction = true
				resolve()
			})
		})
	}

	private async _query (query: string, params:Parameter[] = []):Promise<any> {
		return await new Promise<any[]>((resolve, reject) => {
			const rows:any[] = []
			const request = new MssqlConnectionPool.tedious.Request(query, (err: any, raw: any) => {
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
			request.on('row', (columns: any) => {
				const row:any = {}
				for (const p in columns) {
					const column = columns[p]
					row[column.metadata.colName] = column.value
				}
				rows.push(row)
			})
			this.addParameters(request, params)
			this.cnx.execSql(request)
		})
	}

	private async _execute (sql:string, params:Parameter[] = []) {
		return await new Promise<any>((resolve, reject) => {
			const request = new MssqlConnectionPool.tedious.Request(sql, (err: any, raw: any) => {
				if (err) {
					reject(err)
				}
				resolve(raw)
			})
			this.addParameters(request, params)
			this.cnx.execSql(request)
		})
	}

	private addParameters (request:any, params:Parameter[] = []) {
		for (let i = 0; i < params.length; i++) {
			const param = params[i]
			switch (param.type) {
			case 'array': request.addParameter(param.name, MssqlConnectionPool.tedious.TYPES.NVarChar, param.value.join(',')); break
			case 'string': request.addParameter(param.name, MssqlConnectionPool.tedious.TYPES.NVarChar, param.value); break
			case 'number': request.addParameter(param.name, MssqlConnectionPool.tedious.TYPES.Numeric, param.value); break
			case 'integer': request.addParameter(param.name, MssqlConnectionPool.tedious.TYPES.Int, param.value); break
			case 'decimal': request.addParameter(param.name, MssqlConnectionPool.tedious.TYPES.Decimal, param.value); break
			case 'boolean': request.addParameter(param.name, MssqlConnectionPool.tedious.TYPES.Bit, param.value); break
			case 'datetime': request.addParameter(param.name, MssqlConnectionPool.tedious.TYPES.DateTime, param.value); break
			}
		}
	}

	private toRows (array: any[], params: Parameter[]):string[] {
		const rows:string[] = []
		for (const p in array) {
			const values = array[p]
			const row:any[] = []
			for (let i = 0; i < params.length; i++) {
				const parameter = params[i]
				let value = values[i]
				if (value == null || value === undefined) {
					value = 'null'
				} else {
					switch (parameter.type) {
					case 'boolean':
						value = value ? 1 : 0; break
					case 'string':
						value = Helper.escape(value)
						value = Helper.replace(value, '\\\'', '\\\'\'')
						break
					case 'datetime':
					case 'date':
					case 'time':
						value = Helper.escape(value); break
					}
				}
				row.push(value)
			}
			rows.push(`(${row.join(',')})`)
		}
		return rows
	}
}
