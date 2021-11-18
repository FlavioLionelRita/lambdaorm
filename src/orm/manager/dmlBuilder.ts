import { ConfigManager, SchemaHelper } from '.'
import { Sentence, LanguageManager } from '../language'
import { DialectMetadata } from '../language/dialectMetadata'
import { Query, Datastore, Include, Entity } from '../model'

export abstract class LanguageDMLBuilder {
	abstract build (sentence:Sentence, schema:SchemaHelper, datastore:string, metadata:DialectMetadata):Query
}

export class DMLBuilder {
	private configManager: ConfigManager
	private languageManager: LanguageManager
	private schema:SchemaHelper
	public datastore: Datastore

	constructor (configManager:ConfigManager, schema:SchemaHelper, languageManager: LanguageManager, datastore: Datastore) {
		this.configManager = configManager
		this.schema = schema
		this.languageManager = languageManager
		this.datastore = datastore
	}

	private getDatabase (entity: string): Datastore {
		if (entity !== undefined) {
			const _entity = this.schema.getEntity(entity) as Entity
			if (_entity.datastore !== undefined && _entity.datastore !== this.datastore.name) {
				return this.configManager.datastore.get(_entity.datastore)
			}
		}
		return this.datastore
	}

	public build (sentence:Sentence):Query {
		const children = []
		const includes = sentence.getIncludes()
		const datastore = this.getDatabase(sentence.entity)
		const metadata = this.languageManager.dialectMetadata(datastore.dialect)

		for (const p in includes) {
			const sentenceInclude = includes[p]
			const query = this.build(sentenceInclude.children[0] as Sentence)
			const include = new Include(sentenceInclude.name, [query], sentenceInclude.relation)
			children.push(include)
		}
		const query = this.languageManager.dmlBuilder(datastore.dialect).build(sentence, this.schema, datastore.name, metadata)
		query.children = children
		return query
	}
}