import {Parameter } from '../model'
import {IConnectionManager } from './iConnectionManager'
import {IExecutor } from './iExecutor'

export class Executor implements IExecutor
{
    private connectionManager:IConnectionManager
    public connectionName:string
    constructor(connectionManager:IConnectionManager,connectionName:string){
        this.connectionManager=connectionManager;
        this.connectionName=connectionName; 
    }    
    public async select(sql:string,params:Parameter[]):Promise<any>
    {
        const connection = await this.connectionManager.acquire(this.connectionName);
        let result= await connection.select(sql,params);
        await this.connectionManager.release(connection);
        return result;
    }
    public async insert(sql:string,params:Parameter[]):Promise<number>
    {
        const connection = await this.connectionManager.acquire(this.connectionName);
        let result= await connection.insert(sql,params);
        await this.connectionManager.release(connection);
        return result;
    }
    public async bulkInsert(sql:string,params:Parameter[],array:any[]):Promise<number[]>
    {
        const connection = await this.connectionManager.acquire(this.connectionName);
        let result= await connection.bulkInsert(sql,params,array);
        await this.connectionManager.release(connection);
        return result;
    }
    public async update(sql:string,params:Parameter[]):Promise<number>
    {
        const connection = await this.connectionManager.acquire(this.connectionName);
        let result= await connection.update(sql,params);
        await this.connectionManager.release(connection);
        return result;
    }
    public async delete(sql:string,params:Parameter[]):Promise<number>
    {
        const connection = await this.connectionManager.acquire(this.connectionName);
        let result= await connection.delete(sql,params);
        await this.connectionManager.release(connection);
        return result;
    }
    public async execute(sql:string):Promise<any>
    {
        const connection = await this.connectionManager.acquire(this.connectionName);
        let result= await connection.execute(sql);
        await this.connectionManager.release(connection);
        return result;
    }
}