import fs from 'fs'
import path from 'path'
import { Helper, Config } from '../index'
const ConfigExtends = require('config-extends')
const yaml = require('js-yaml')

export class Utils {
	public static async writeConfig (workspace: string, database: string, dialect:string, connection?:any): Promise<void> {
		await Helper.createIfNotExists(workspace)
		const configPath = path.join(workspace, 'lambdaORM.yaml')
		let config: Config = { src: 'src', data: 'data' }
		if (fs.existsSync(configPath)) {
			config = await ConfigExtends.apply(configPath)
		}
		// complete config structure
		if (config === undefined) config = { src: 'src', data: 'data' }
		if (config.src === undefined) config.src = 'src'
		if (config.databases === undefined) config.databases = []
		if (config.schemas === undefined) config.schemas = []

		let db = config.databases.find(p => p.name === database)
		if (db === undefined) {
			if (connection === undefined) { connection = Utils.defaultConnection(dialect) }
			db = { name: database, dialect: dialect, connection: connection, schema: 'default' }
			config.databases.push(db)
		} else {
			db.dialect = dialect
			if (connection !== undefined) { db.connection = connection }
		}

		if (db.schema !== undefined) {
			const schema = config.schemas.find(p => p.name === db?.schema)
			if (schema === undefined) {
				config.schemas.push({ name: db.schema, enums: [], entities: [] })
			}
		}

		// create sintaxis file
		await Helper.copyFile(path.join(__dirname, './../sintaxis.d.ts'), path.join(workspace, config.src, 'sintaxis.d.ts'))

		// write lambdaORM.yaml
		const content = yaml.dump(config)
		await Helper.writeFile(configPath, content, true)
	}

	public static defaultConnection (dialect: string): any {
		switch (dialect) {
		case 'mysql':
			return {
				type: 'mysql',
				host: 'localhost',
				port: 3306,
				username: 'test',
				password: 'test',
				database: 'test'
			}
		case 'mariadb':
			return {
				type: 'mariadb',
				host: 'localhost',
				port: 3306,
				username: 'test',
				password: 'test',
				database: 'test'
			}
		case 'sqlite':
			return {
				type: 'sqlite',
				database: 'database.sqlite'
			}
		case 'better-sqlite3':
			return {
				type: 'better-sqlite3',
				database: 'database.sqlite'
			}
		case 'postgres':
			return {
				type: 'postgres',
				host: 'localhost',
				port: 5432,
				username: 'test',
				password: 'test',
				database: 'test'
			}
		case 'cockroachdb':
			return {
				type: 'cockroachdb',
				host: 'localhost',
				port: 26257,
				username: 'root',
				password: '',
				database: 'defaultdb'
			}
		case 'mssql':
			return {
				type: 'mssql',
				host: 'localhost',
				username: 'sa',
				password: 'Admin12345',
				database: 'tempdb'
			}
		case 'oracle':
			return {
				type: 'oracle',
				host: 'localhost',
				username: 'system',
				password: 'oracle',
				port: 1521,
				sid: 'xe.oracle.docker'
			}
		case 'mongodb':
			return {
				type: 'mongodb',
				database: 'test'
			}
		}
	}
}