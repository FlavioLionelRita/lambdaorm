import {Node,Context,Operand} from '../../base'
import Language from '../language'
import { SqlConstant,SqlVariable,SqlField,SqlKeyValue,SqlArray,SqlObject,SqlOperator,SqlFunctionRef,SqlArrowFunction,SqlBlock,
SqlSentence,SqlFrom,SqlJoin,SqlMap,SqlFilter,SqlGroupBy,SqlHaving,SqlSort,SqlInsert,SqlInsertFrom,SqlUpdate,SqlUpdateFrom,SqlDelete} from './operands'
import SqlLanguageVariant from './variant'

export default class SqlLanguage extends Language
{
    private _variants:any

    constructor(){
        super('sql');
        this._variants={};
    }
    addLibrary(library){
        this._libraries[library.name] =library;

        for(const p in library.variants){
            let data =  library.variants[p];
            let variant = new SqlLanguageVariant(data.variant);
            variant.addVariant(data);
            this._variants[data.variant] =variant 
        }
    }
    addJoins(parts,to,context){
        let relation = '';
        for(let i=1;i<to;i++){
            relation= (i>1?relation+'.':'')+parts[i];
            if(!context.current.joins[relation]){
                context.current.joins[relation] = this.createAlias(context,parts[i],relation);
            }
        }
        return relation;
    }
    createAlias(context,name,relation=null){
        let c= name.charAt(0).toLowerCase();
        let alias = c;
        for(let i=1;context.aliases[alias];i++)alias=alias+i;
        context.aliases[alias] = relation?relation:name;
        return alias;        
    }    
    createOperand(node,children,scheme,context){
        switch(node.type){
            case 'const':
                return new SqlConstant(node.name,children);
            case 'var':
                let parts = node.name.split('.');
                if(parts[0] == context.current.arrowVar){
                    if(parts.length == 1){
                        return new SqlField(context.current.alias+'.*'); 
                    }
                    else if(parts.length == 2){
                        if(context.current.fields.includes(parts[1])){
                            return new SqlField(parts[1]); 
                        }else{
                            let field= scheme.field(context.current.entity,parts[1]);
                            if(field){
                                return new SqlField(context.current.alias+'.'+field); 
                            }else{
                                let relationInfo= scheme.getRelation(context.current.entity,parts[1]);
                                if(relationInfo){
                                    let relation =  this.addJoins(parts,parts.length,context); 
                                    let relationAlias=context.current.joins[relation];
                                    return new SqlField(relationAlias+'.*'); 
                                }else{
                                    throw 'Property '+parts[1]+' not fount in '+context.current.entity;
                                }

                            }                            
                        } 
                    }else{
                        let propertyName = parts[parts.length-1];
                        let relation =  this.addJoins(parts,parts.length-1,context); 
                        let info = scheme.getRelation(context.current.entity,relation);                        
                        let relationAlias=context.current.joins[relation];
                        let relationField = info.relationScheme.properties[propertyName].field; 
                        if(relationField){
                            return new SqlField(relationAlias+'.'+relationField);
                        }else{
                            let relationName = info.relationScheme.relations[propertyName];
                            if(relationName){
                                let relation2 =  this.addJoins(parts,parts.length,context);
                                let relationAlias2=context.current.joins[relation2];                               
                                return new SqlField(relationAlias2+'.*');
                            }else{
                                throw 'Property '+propertyName+' not fount in '+relation;
                            } 
                        }
                    }
                }
                else
                    return new  SqlVariable(node.name,children);                           
            case 'keyVal':
                return new SqlKeyValue(node.name,children);
            case 'array':
                return new SqlArray(node.name,children);
            case 'obj':
                return new SqlObject(node.name,children);
            case 'oper':
                return new SqlOperator(node.name,children);
            case 'funcRef':
                return new SqlFunctionRef(node.name,children);
            case 'block':
                return  new SqlBlock(node.name,children);
            default:
                throw 'node name: '+node.name +' type: '+node.type+' not supported';
        }
    }    
    createArrowFunction(node,children){
        try{
            switch(node.name){
                case 'map': 
                case 'first': 
                    return new SqlMap(node.name,children);
                case 'filter': 
                    return new SqlFilter(node.name,children);
                case 'having': 
                    return new SqlHaving(node.name,children);
                case 'sort': 
                    return new SqlSort(node.name,children);
                case 'insert': return new SqlInsert(node.name,children);
                case 'insertFrom': return new SqlInsertFrom(node.name,children);
                case 'update': return new SqlUpdate(node.name,children);
                case 'updateFrom': return new SqlUpdateFrom(node.name,children);
                case 'delete': return new SqlDelete(node.name,children);
                default:
                    throw'arrow function : '+node.name+' not supported'; 
            }            
        } 
        catch(error){
            throw'cretae arrow function: '+node.name+' error: '+error.toString(); 
        }
    }
    createClause(clause:Node,scheme:SqlScheme,context:any){        
        context.current.arrowVar = clause.children[1].name;                    
        let child = this.nodeToOperand(clause.children[2],scheme,context);
        return this.createArrowFunction(clause,[child]);
    }
    createMapClause(clause:Node,scheme:SqlScheme,context:any){
        if(clause.children.length==3){
            context.current.arrowVar = clause.children[1].name;
            let fields = clause.children[2];
            let child =null;
            if(fields.children.length==0 && fields.name == context.current.arrowVar){
                let fields = this.createNodeFields(context.current.entity,'p',scheme)
                child = this.nodeToOperand(fields,scheme,context);
            }else{
                child = this.nodeToOperand(clause.children[2],scheme,context);
            }  
            return this.createArrowFunction(clause,[child]);
        }else{
            context.current.arrowVar = 'p';
            let fields = this.createNodeFields(context.current.entity,'p',scheme)
            let child = this.nodeToOperand(fields,scheme,context);
            return this.createArrowFunction(clause, [child]);
        }
    }
    createNodeFields(entityName:string,arrowVar:string,scheme:SqlScheme){
        let obj = new Node('obj', 'obj', []);
        let entity=scheme.getEntity(entityName);
        for(let name in entity.properties){
            let field = new Node(arrowVar+'.'+name, 'var', []);
            let keyVal = new Node(name, 'keyVal', [field])
            obj.children.push(keyVal);
        }
        return obj;
    }
    addIncludes(node:Node,scheme:SqlScheme,context:any){
        let child:SqlSentence,relation:any;
        let sentence = this.nodeToOperand(node.children[0],scheme,context) as SqlSentence;
        let mainEntity=scheme.getEntity(sentence.entity);
        // children.push(main);
        for (let i=1; i< node.children.length;i++) {
            let p = node.children[i]; 
            if(p.type =='arrow'){
                let current = p;
                while (current) {
                    if(current.type == 'var'){
                        relation = mainEntity.relations[current.name];                            
                        current.name = relation.to.entity;
                        break;
                    }
                    if (current.children.length > 0)
                        current = current.children[0];
                    else
                        break;
                }
                child = this.nodeToOperand(p, scheme, context) as SqlSentence;
            }else if (p.type == 'var') {
                let varArrow = new Node('p', 'var', []);
                let varAll = new Node('p', 'var', []);
                relation = mainEntity.relations[p.name];
                p.name = relation.to.entity;
                let map = new Node('map','arrow',[p,varArrow,varAll]);
                child = this.nodeToOperand(map, scheme, context) as SqlSentence;
            }else if (p.type == 'childFunc' && p.name == 'includes') {
                let current = p;
                while (current) {
                    if (current.type == 'var') {
                        relation = mainEntity.relations[current.name];
                        current.name = relation.to.entity;
                        break;
                    }
                    if (current.children.length > 0)
                        current = current.children[0];
                    else
                        break;
                }
                child= this.addIncludes(p, scheme, context);
            }else{
                throw 'Error to add include node '+p.type+':'+p.name; 
            }            
            let toEntity=scheme.getEntity(relation.to.entity);
            let toField = toEntity.properties[relation.to.property].field;
            let fieldRelation = new SqlField(child.alias + '.' + toField);
            let varRelation = new SqlVariable('includeIds',);
            let filterInclude =new SqlFunctionRef('in', [fieldRelation,varRelation]);
            let childFilter= child.children.find(p=> p.name == 'filter');
            if(!childFilter){
                let childFilter = new SqlFilter('filter',[filterInclude]);
                child.children.push(childFilter);
            }else{
                childFilter.children[0] =new SqlOperator('&&', [childFilter.children[0],filterInclude]);
            } 
            sentence.includes.push(child);
        }
        return sentence;
    }
    createSentence(node:Node,scheme:SqlScheme,context:any){
        context.current = {parent:context.current,children:[],joins:{},fields:[],groupByFields:[]};
        if(context.parent)
            context.parent.children.push(context.current);            

        let sentence:any = {}; 
        let current = node;
        while(current){
            let name =current.type == 'var'?'from':current.name;
            sentence[name] =  current;
            if(current.children.length > 0)
                current = current.children[0]
            else
                break;  
        }            
        context.current.entity=sentence.from.name;
        context.current.alias = this.createAlias(context,context.current.entity);            
        let children = [];
        let operand= null;

        if(sentence['filter'] ){
            let clause = sentence['filter'];
            operand = this.createClause(clause,scheme,context);
            children.push(operand); 
        }

        if(sentence['delete']){
            //TODO
        }else if (sentence['insert']){
            //TODO
        }else if (sentence['update']){
            //TODO 
        }else{
            if(sentence['from']){
                let clause = sentence['from'];
                let tableName = scheme.table(clause.name);
                operand =new SqlFrom(tableName+'.'+context.current.alias);
                children.push(operand);
            }
            if(sentence['map'] || sentence['first']){
                let clause = sentence['first']?sentence['first']:sentence['map'];
                operand = this.createMapClause(clause,scheme,context);
                context.current.fields = this.fieldsInSelect(operand);
                context.current.groupByFields = this.groupByFields(operand);
                children.push(operand); 
            }else{
                let varEntity = new Node(context.current.entity, 'var', []);
                let varArrow = new Node('p', 'var', []);
                let varAll = new Node('p', 'var', []);               
                let clause = new Node('map','arrow',[varEntity,varArrow,varAll]);
                operand = this.createMapClause(clause,scheme,context);
                context.current.fields = this.fieldsInSelect(operand);
                context.current.groupByFields = this.groupByFields(operand);
                children.push(operand); 
            }
            if(context.current.groupByFields.length>0){
                let fields = [];
                for(let i=0;i<context.current.groupByFields.length;i++){
                    fields.push( this.clone(context.current.groupByFields[i]));
                }
                if(fields.length==1){
                    operand = new SqlGroupBy('groupBy',fields);
                }else{
                    let array:Operand = new SqlArray('array',fields);
                    operand = new SqlGroupBy('groupBy',[array]);
                } 
                children.push(operand); 
            }
            if(sentence['having']){
                let clause = sentence['having'];
                operand = this.createClause(clause,scheme,context);
                children.push(operand); 
            }
            if(sentence['sort'] ){
                let clause = sentence['sort'];
                operand = this.createClause(clause,scheme,context);
                children.push(operand); 
            }
        }
        for(const key in context.current.joins){

            let info = scheme.getRelation(context.current.entity,key);

            let relatedAlias = info.previousRelation!=''?context.current.joins[info.previousRelation]:context.current.alias;   
            let relatedFieldName = info.previousScheme.properties[info.relationData.from].field;
            let relationTable = info.relationScheme.name;
            let relationAlias =context.current.joins[key];;
            let relationFieldName = info.relationScheme.properties[info.relationData.to.property].field;

            let relatedField = new SqlField(relatedAlias+'.'+relatedFieldName);
            let relationField = new SqlField(relationAlias+'.'+relationFieldName); 
            let equal = new SqlOperator('==',[relationField,relatedField])
            operand = new SqlJoin(relationTable+'.'+relationAlias,[equal]);
            children.push(operand);   
        }
        return new SqlSentence('sentence',children,context.current.entity,context.current.alias,context.current.fields);
    }
    nodeToOperand(node:Node,scheme:SqlScheme,context:any){

        if (node.type == 'childFunc' && node.name == 'includes'){
            return this.addIncludes(node,scheme,context);
        }else if(node.type == 'arrow'){
            return this.createSentence(node,scheme,context);
        }else{
            let children = [];
            if(node.children){
                for(const k in node.children){
                    let p = node.children[k];
                    let child = this.nodeToOperand(p,scheme,context);
                    children.push(child);
                }
            }
            return this.createOperand(node,children,scheme,context);
        }
    }

    
    groupByFields(operand){
        let data = {fields:[],groupBy:false};
        this._groupByFields(operand,data);
        return data.groupBy?data.fields:[]; 
    }
    _groupByFields(operand,data){
        if(operand instanceof SqlField){
            data.fields.push(operand);
        }else if(operand instanceof SqlFunctionRef && ['avg','count','first','last','max','min','sum'].indexOf(operand.name)>-1){
            data.groupBy = true;
        }else if(!(operand instanceof SqlSentence)){
            for(const k in operand.children){
                let p = operand.children[k];
                this._groupByFields(p,data);
            }
        }
    }
    clone(obj){
        let children = [];
        if(obj.children){
            for(const k in obj.children){
                let p = obj.children[k];
                let child = this.clone(p);
                children.push(child);
            }
        }
        return new obj.constructor(obj.name,children);
    } 
    
    fieldsInSelect(operand){
        //TODO: hay que resolver si es un obj, un array o un campo y obtener los nombres de los fields que se crean,
        // para poder utilizarlos en el order by.
        let fields = [];
        if(operand.children.length==1){
            if(operand.children[0] instanceof SqlObject){
                let obj = operand.children[0];
                for(let p in obj.children){
                    let keyVal = obj.children[p];
                    fields.push(keyVal.name); 
                }    
            }else if(operand.children[0] instanceof SqlArray){
                let array = operand.children[0];
                for(let i=0;i< array.children.length;i++){
                    let element = array.children[i];
                    if(element instanceof SqlField){
                        let parts =element.name.split('.');
                        fields.push(parts[parts.length-1]);
                    }else{
                        fields.push('field'+i);
                    } 
                }    
            }else if(operand.children[0] instanceof SqlField){
                let parts =operand.children[0].name.split('.');
                fields.push(parts[parts.length-1]);
            }
            else{
                fields.push('field0');
            }  
        }
        return fields;
        
    }
    protected _deserialize(serialized:any,language:string):Operand{
        throw 'NotImplemented';
    }
    reduce(operand:Operand):Operand{
        return operand
    }
    setContext(operand,context){
        // let current = context;
        // if( operand.prototype instanceof ArrowFunction){
        //     let childContext=current.newContext();
        //     operand.context = childContext;
        //     current = childContext;
        // }
        // else if(operand.prototype instanceof Variable){
        //     operand.context = current;
        // }       
        // for(const k in operand.children){
        //     const p = operand.children[k];
        //     this.setContext(p,current);
        // } 
    }
    execute(sentence,context,cnx){
        //TODO
        return [];
    }
    compile(node,scheme){
        try{
            let context = {aliases:{},current:null};
            let sqlScheme = new SqlScheme(scheme);
            let operand = this.nodeToOperand(node,sqlScheme,context);
            operand = this.reduce(operand);
            operand =this.setParent(operand);
            return operand;
        } 
        catch(error){
            console.error(error);
            throw error; 
        }
    }
    public sentence(operand:Operand,variant:string):any{
        try{
            let _variant = this._variants[variant];
            return operand.build(_variant);
        } 
        catch(error){
            console.error(error);
            throw error; 
        }
    }
    public run(operand:Operand,context:any,scheme?:any,cnx?:any):any{          
        let sentence = this.sentence(operand,cnx.variant);
        return this.execute(sentence,context,cnx);
    }
}


