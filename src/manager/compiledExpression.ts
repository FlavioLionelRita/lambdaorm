import {ITransaction,Operand,IOrm } from './../model/index'

export class CompiledExpression
{
    private orm:IOrm
    private operand:Operand
    private dialect:string   

    constructor(orm:IOrm,operand:Operand,dialect:string){        
        this.orm=orm
        this.operand= operand
        this.dialect= dialect
    }       
    public serialize():string
    {
        return this.orm.language.serialize(this.operand,this.dialect );
    }
    public query():string
    {
        return this.orm.language.query(this.operand,this.dialect );
    }
    public schema():any
    {
        return this.orm.language.schema(this.operand,this.dialect);
    }      
    public async execute(context:any,connection?:string|ITransaction):Promise<any>
    {        
        return await this.orm.execute(this.operand,this.dialect,context,connection);
    }
}