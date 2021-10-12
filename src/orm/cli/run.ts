/* eslint-disable no-mixed-spaces-and-tabs */
import { CommandModule, Argv, Arguments } from 'yargs'
import { Orm, Database, Helper } from '../index'
import path from 'path'

export class RunCommand implements CommandModule {
	command = 'run';
	describe = 'Run an expression lambda or return information';

	builder (args: Argv) {
		return args
			.option('w', {
				alias: 'workspace',
				describe: 'project path.'
			})
			.option('n', {
				alias: 'name',
				describe: 'Name of database'
			})
			.option('e', {
				alias: 'expression',
				describe: 'Expression to execute'
			})
			.option('c', {
				alias: 'context',
				describe: 'Context used to execute expression'
			})
			.option('s', {
				alias: 'sentences',
				describe: 'Generates the sentences but does not apply.'
			})
			.option('m', {
				alias: 'metadata',
				describe: 'Generates the metadata but does not apply.'
			})
	}

	async handler (args: Arguments) {
		const workspace = path.resolve(process.cwd(), args.workspace as string || '.')
		const expression = args.expression as string
		let context = args.context || {}
		const database = args.database as string
		const sentences = args.sentences as string
		const metadata = args.metadata !== undefined
		const orm = new Orm()
		if (expression === undefined) {
			console.error('the expression argument is required')
			return
		}
		try {
			await orm.init(workspace)
			const configInfo = await orm.lib.getConfigInfo(workspace)
			// get database
			let db:Database|undefined
			if (database === undefined) {
				if (configInfo.config.databases.length === 1) {
					db = configInfo.config.databases[0]
				} else {
					throw new Error('the database argument is required')
				}
			} else {
				db = configInfo.config.databases.find(p => p.name === database)
				if (db === undefined) {
					throw new Error(`database: ${database} not found in config`)
				}
			}
			// read context
			if (typeof context === 'string') {
				let data = Helper.tryParse(context as string)
				if (data !== null) {
					context = data
				} else {
					try {
						data = await Helper.readFile(path.join(process.cwd(), context as string))
						context = JSON.parse(data as string)
					} catch (error) {
						throw new Error(`Errror to read context: ${error}`)
					}
				}
			}
			// execute or get metadata
			if (sentences || metadata) {
				if (sentences) {
					const resullt = await orm.expression(expression).sentence(db.dialect, db.schema)
					console.log(resullt)
				}
				if (metadata) {
					const model = await orm.expression(expression).model(db.schema)
					const metadata = await orm.expression(expression).metadata(db.schema)
					console.log('model:')
					console.log(JSON.stringify(model, null, 2))
					console.log('metadata:')
					console.log(JSON.stringify(metadata, null, 2))
				}
			} else {
				const resullt = await orm.expression(expression).execute(db.name, context)
				console.log(resullt)
			}
		} catch (error) {
			console.error(`error: ${error}`)
		} finally {
			await orm.end()
		}
	}
}