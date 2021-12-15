import { Respository, IOrm } from '../orm'
import { Category, QryCategory } from './model'

export class CategoryRespository extends Respository<Category, QryCategory> {
	constructor (dataSource: string, Orm?:IOrm) {
		super('Categories', dataSource, Orm)
	}
	// Add your methods here
}
