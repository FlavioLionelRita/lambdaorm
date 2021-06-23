import LanguageManager from './language'
import Operand from './../base/operand'

export default class CompiledExpression
{
    protected mgr:LanguageManager 
    protected operand:Operand
    protected language:string   

    constructor(mgr:LanguageManager,operand:Operand,language:string){        
        this.mgr=mgr
        this.operand= operand
        this.language= language
    }       
    public serialize():string
    {
        return this.mgr.serialize(this.operand,this.language );
    }    
    public async run(context:any,connectionName:string)
    {        
        return await this.mgr.run(this.operand as Operand,context,connectionName)
    }
}