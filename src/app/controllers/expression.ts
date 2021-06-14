import { Post,Get,Delete,Path,SuccessResponse,Body,Response,Route } from "tsoa";
import orm  from './../../orm'
import ExpressionRequest from  './../model/expressionRequest'
  
@Route("expression")
export default class ExpressionController {
    @Post("/compile/{schema}/{language}/{variant}")
    @SuccessResponse("200", "Ok")
    public async compile(@Path() schema:string,@Body() body: ExpressionRequest,@Path() language:string,@Path() variant:string): Promise<any> {
        let operand = orm.compile(body.expression,language,variant,schema);
        return orm.serialize(operand,language);
    }
    @Post("/run/{connection}") 
    @SuccessResponse("200", "Ok")
    public async run(@Body() body: ExpressionRequest,@Path() connection:string): Promise<any> {
        return orm.run(body.expression,body.context,connection);
    }
}