import {Operand,Constant,Variable,KeyValue,Array,Obj,Operator,FunctionRef,ArrowFunction,Block} from '../operands'
import SqlLanguageVariant from './variant'

class SqlConstant extends Constant
{   
    build(metadata:SqlLanguageVariant){ 
        switch (this.type) {
            case 'string':
                return  '\''+this.name+'\'';
            case 'boolean':
                return metadata.other(this.name)     
            default:
                return this.name;
        }
    }
}
class SqlVariable extends Variable
{
    public _number?:number    
    constructor(name:string,children:Operand[]=[]){
        super(name,children);
        this._number  = null; 
    }    
    
    build(metadata:any){
        let text = metadata.other('variable');
        text =text.replace('{name}',this.name);
        text =text.replace('{number}',this._number);
        return text;
    }
}
class SqlField extends Operand
{
    build(metadata:SqlLanguageVariant){ 
        let parts = this.name.split('.');
        if(parts.length == 1){
            let name = parts[0];
            return metadata.other('column').replace('{name}',name);
        }else{
            let aliasEntity = parts[0];
            let name = parts[1];
            let text = metadata.other('field');
            text =text.replace('{enityAlias}',aliasEntity);
            text =text.replace('{name}',name);
            return text;
        }       
    }
}
class SqlKeyValue extends KeyValue
{
    build(metadata):any
    {
        return this.children[0].build(metadata);
    }
}
class SqlArray extends Array
{
    build(metadata:SqlLanguageVariant){ 
        let text = ''
        for(let i=0;i<this.children.length;i++){
            text += (i>0?', ':'')+this.children[i].build(metadata);              
        }
        return text;
    } 
}
class SqlObject extends Obj
{
    build(metadata:SqlLanguageVariant){       
        let text= '';
        let template = metadata.function('as').template;
        for(let i=0;i<this.children.length;i++){
            let value = this.children[i].build(metadata);
            let fieldText = template.replace('{value}',value);
            fieldText = fieldText.replace('{alias}',this.children[i].name);
            text += (i>0?', ':'')+fieldText;
        }
        return text;
    }
} 
class SqlBlock extends Block
{
    build(metadata:SqlLanguageVariant){ 
        let text = ''
        for(let i=0;i<this.children.length;i++){
            text += (this.children[i].build(metadata)+'\n;');    
        }
        return text;
    } 
}
class SqlOperator extends Operator
{
    constructor(name:string,children:Operand[]=[]){
        super(name,children);
    }    
    build(metadata:SqlLanguageVariant){ 
        let text = metadata.operator(this.name,this.children.length);
        for(let i=0;i<this.children.length;i++){
            text = text.replace('{'+i+'}',this.children[i].build(metadata));
        }
        return text;  
    }
}                             
class SqlFunctionRef extends FunctionRef
{
    constructor(name:string,children:Operand[]=[]){
        super(name,children); 
    }    
    build(metadata:SqlLanguageVariant){       
        let funcData = metadata.function(this.name);
        let text= '';
        if(funcData.type == 'multiple'){
            let template = funcData.template;
            text = this.children[0].build(metadata);    
            for(let i=1;i<this.children.length;i++){
                text =template.replace('{acumulated}',text);
                text = text.replace('{value}',this.children[i].build(metadata));
            }
        }else{
            text = funcData.template;
            for(let i=0;i<this.children.length;i++){
                text =text.replace('{'+i+'}',this.children[i].build(metadata));
            }
        }
        return text;
    }
}
class SqlArrowFunction extends ArrowFunction 
{
    constructor(name:string,children:Operand[]=[]){
        super(name,children); 
    }    
    build(metadata:SqlLanguageVariant){       
        let template = metadata.arrow(this.name);
        for(let i=0;i<this.children.length;i++){
            template =template.replace('{'+i+'}',this.children[i].build(metadata));
        }
        return template.trim(); 
    }
}
class SqlSentence extends FunctionRef 
{
    public fields:string[]
    public entity:string
    public alias:string
    public includes:SqlSentence[];

    constructor(name:string,children:Operand[]=[],entity:string,alias:string,fields:string[]){
        super(name,children);
        this.entity=entity;
        this.alias=alias;
        this.fields=fields;
        this.includes=[];
    }    
    build(metadata:SqlLanguageVariant){   
        let text = this.buildMain(metadata).trim();
        for(let i=0;i<this.includes.length;i++){
            text += '\n;\n'+(this.includes[i].build(metadata).trim());    
        }        
        return text;      
    }
    buildMain(metadata:SqlLanguageVariant){

        let map =  this.children.find(p=> p.name=='map');   
        let first = this.children.find(p=> p.name=='first'); 
        let filter = this.children.find(p=> p.name=='filter'); 
        let groupBy = this.children.find(p=> p.name=='groupBy');
        let having = this.children.find(p=> p.name=='having'); 
        let sort = this.children.find(p=> p.name=='sort'); 
        let insert = this.children.find(p=> p.name=='insert'); 
        let insertFrom = this.children.find(p=> p.name=='insertFrom');
        let update = this.children.find(p=> p.name=='update');
        let _delete = this.children.find(p=> p.name=='delete');

        let text = '';
        if(map || first){
            // if(insertFrom) text = insertFrom+' ';
            let from = this.children.find(p=> p instanceof SqlFrom);
            let joins = this.children.filter(p=> p instanceof SqlJoin).sort((a,b)=> a.name>b.name?1:a.name==b.name?0:-1);

            let select = first?first:map;
            text = select.build(metadata) + '\n' + this.solveFrom(from,metadata)+ '\n' +  this.solveJoins(joins,metadata);
            // this._fields= select.fields(metadata);
           
        }else if(update){
            text = update.build(metadata);
        }else if(_delete){
            text = _delete.build(metadata);
        }         
        text = text + (filter?filter.build(metadata)+'\n':'');
        text = text + (groupBy?groupBy.build(metadata)+'\n':'');        
        text = text + (having?having.build(metadata)+'\n':'');
        text = text + (sort?sort.build(metadata)+'\n':'');
        
        return text;
    }
    solveJoins(joins,metadata){
        let text = '';
        
        let template = metadata.other('join');
        for(let i=0;i<joins.length;i++){
            let join = joins[i];
            let parts = join.name.split('.');
            let joinText  = template.replace('{name}',parts[0]);         
            joinText =joinText.replace('{alias}',parts[1]);
            joinText =joinText.replace('{relation}',join.children[0].build(metadata)).trim();           
            text= text + joinText+'\n';
        }
        return text;
    }
    solveFrom(from,metadata){
        let template = metadata.other('from');
        let parts = from.name.split('.');
        template =template.replace('{name}',parts[0]); 
        template =template.replace('{alias}',parts[1]);
        return template.trim();
    }   
}
class SqlFrom extends Operand
{}
class SqlJoin extends Operand
{}
class SqlMap extends SqlArrowFunction {}
class SqlFilter extends SqlArrowFunction {}
class SqlGroupBy extends SqlArrowFunction {}
class SqlHaving extends SqlArrowFunction {}
class SqlSort extends SqlArrowFunction {}
class SqlInsert extends SqlArrowFunction {}
class SqlInsertFrom extends SqlArrowFunction {}
class SqlUpdate extends SqlArrowFunction {}
class SqlUpdateFrom extends SqlArrowFunction {}
class SqlDelete extends SqlArrowFunction {}


export  { 
    SqlConstant,
    SqlVariable,
    SqlField,  
    SqlKeyValue,
    SqlArray,
    SqlObject,
    SqlOperator,
    SqlFunctionRef,
    SqlArrowFunction,
    SqlBlock,
    SqlSentence,
    SqlFrom,
    SqlJoin,
    SqlMap,
    SqlFilter,
    SqlGroupBy,
    SqlHaving,
    SqlSort,
    SqlInsert,
    SqlInsertFrom,
    SqlUpdate,
    SqlUpdateFrom,
    SqlDelete
}