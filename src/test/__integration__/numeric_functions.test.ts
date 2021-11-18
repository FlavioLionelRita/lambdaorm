import { orm } from '../../orm'
beforeAll(async () => {
	require('dotenv').config({ path: './test.env' })
	await orm.init()
})
describe('Execute', () => {
	const dataContext = {"a":{"id":1}}
	test('function abs', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:(p.price*-1),result:round(abs((p.price*-1)),10)})'
		const expected = [{"name":"Chai","source":-18,"result":18}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function acos', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:0.25,result:round(acos(0.25),10)})'
		const expected = [{"name":"Chai","source":0.25,"result":1.3181160717}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function asin', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:0.25,result:round(asin(0.25),10)})'
		const expected = [{"name":"Chai","source":0.25,"result":0.2526802551}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function atan', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:0.25,result:round(atan(0.25),10)})'
		const expected = [{"name":"Chai","source":0.25,"result":0.2449786631}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function atan2', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:0.5,result:round(atan2(0.25,1),10)})'
		const expected = [{"name":"Chai","source":0.5,"result":0.2449786631}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function ceil', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:25.75,result:round(ceil(25.75),10)})'
		const expected = [{"name":"Chai","source":25.75,"result":26}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function cos', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:2,result:round(cos(2),10)})'
		const expected = [{"name":"Chai","source":2,"result":-0.4161468365}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function exp', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:1,result:round(exp(1),10)})'
		const expected = [{"name":"Chai","source":1,"result":2.7182818285}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function floor', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:25.75,result:round(floor(25.75),10)})'
		const expected = [{"name":"Chai","source":25.75,"result":25}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function ln', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:2,result:round(ln(2),10)})'
		const expected = [{"name":"Chai","source":2,"result":0.6931471806}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function log', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,m:10,n:20,result:round(log(10,20),10)})'
		const expected = [{"name":"Chai","m":10,"n":20,"result":1.3010299957}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function round', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:135.375,result:round(135.375,2)})'
		const expected = [{"name":"Chai","source":135.375,"result":135.38}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function sign', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:255.5,result:round(sign(255.5),10)})'
		const expected = [{"name":"Chai","source":255.5,"result":1}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function tan', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:1.75,result:round(tan(1.75),10)})'
		const expected = [{"name":"Chai","source":1.75,"result":-5.5203799225}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
	test('function trunc', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:135.375,result:round(trunc(135.375,2),10)})'
		const expected = [{"name":"Chai","source":135.375,"result":135.37}]
		const mysqlResult =  await orm.expression(expression).execute(dataContext,'mysql')
		expect(expected).toEqual(mysqlResult)
		const postgresResult =  await orm.expression(expression).execute(dataContext,'postgres')
		expect(expected).toEqual(postgresResult)
		const mariadbResult =  await orm.expression(expression).execute(dataContext,'mariadb')
		expect(expected).toEqual(mariadbResult)
		const mssqlResult =  await orm.expression(expression).execute(dataContext,'mssql')
		expect(expected).toEqual(mssqlResult)
	})
})