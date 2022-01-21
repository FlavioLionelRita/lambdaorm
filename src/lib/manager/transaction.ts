import { Query } from '../model'
import { QueryExecutor, ExpressionManager } from '.'

export class Transaction {
	private expressionManager:ExpressionManager
	private queryExecutor: QueryExecutor
	private context:any
	constructor (context: any, expressionManager: ExpressionManager, queryExecutor: QueryExecutor) {
		this.context = context
		this.expressionManager = expressionManager
		this.queryExecutor = queryExecutor
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	public async lambda (lambda: Function, data: any): Promise<any> {
		const expression = this.expressionManager.toExpression(lambda)
		return await this.expression(expression, data)
	}

	public async expression (expression:string, data:any):Promise<any> {
		const query = await this.expressionManager.toQuery(expression, this.queryExecutor.stage)
		return await this.execute(query, data)
	}

	public async execute (query: Query, data: any = {}): Promise<any> {
		return await this.queryExecutor.execute(query, data, this.context)
	}
}
