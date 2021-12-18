import { orm,Helper } from '../../orm'
beforeAll(async () => {
	require('dotenv').config({ path: './test.env' })
	await orm.init()
})
describe('Complete Expression', () => {
	test('groupBy 1', () => {
		const source = 'Products.map(p=>{maxPrice:max(p.price)})'
		const expected = 'Products.map(p=>{maxPrice:max(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 2', () => {
		const source = 'Products.map(p=>{minPrice:min(p.price)})'
		const expected = 'Products.map(p=>{minPrice:min(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 3', () => {
		const source = 'Products.map(p=>{total:sum(p.price)})'
		const expected = 'Products.map(p=>{total:sum(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 4', () => {
		const source = 'Products.map(p=>{average:avg(p.price)})'
		const expected = 'Products.map(p=>{average:avg(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 5', () => {
		const source = 'Products.map(p=>{count:count(1)})'
		const expected = 'Products.map(p=>{count:count(1)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 6', () => {
		const source = 'Products.map(p=>{category:p.categoryId,largestPrice:max(p.price)})'
		const expected = 'Products.map(p=>{category:p.categoryId,largestPrice:max(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 7', () => {
		const source = 'Products.map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const expected = 'Products.map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 8', () => {
		const source = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:p.price,result:abs(p.price)})'
		const expected = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:p.price,result:abs(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 9', () => {
		const source = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const expected = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 10', () => {
		const source = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const expected = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('groupBy 11', () => {
		const source = 'Products.filter(p=>(p.price>5)).having(p=>(max(p.price)>50)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const expected = 'Products.filter(p=>(p.price>5)).having(p=>(max(p.price)>50)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
})
describe('Metadata', () => {
	test('groupBy 1', async () => {
		const expression = 'Products.map(p=>{maxPrice:max(p.price)})'
		const modelExpected :any= {"maxPrice":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"maxPrice","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 2', async () => {
		const expression = 'Products.map(p=>{minPrice:min(p.price)})'
		const modelExpected :any= {"minPrice":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"minPrice","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 3', async () => {
		const expression = 'Products.map(p=>{total:sum(p.price)})'
		const modelExpected :any= {"total":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"total","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 4', async () => {
		const expression = 'Products.map(p=>{average:avg(p.price)})'
		const modelExpected :any= {"average":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"average","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 5', async () => {
		const expression = 'Products.map(p=>{count:count(1)})'
		const modelExpected :any= {"count":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"count","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 6', async () => {
		const expression = 'Products.map(p=>{category:p.categoryId,largestPrice:max(p.price)})'
		const modelExpected :any= {"category":"integer","largestPrice":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"integer"},{"name":"largestPrice","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 7', async () => {
		const expression = 'Products.map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const modelExpected :any= {"category":"string","largestPrice":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"largestPrice","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 8', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:p.price,result:abs(p.price)})'
		const modelExpected :any= {"name":"string","source":"decimal","result":"any"}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"name","type":"string"},{"name":"source","type":"decimal"},{"name":"result","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 9', async () => {
		const expression = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const modelExpected :any= {"category":"string","largestPrice":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"largestPrice","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 10', async () => {
		const expression = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const modelExpected :any= {"category":"string","largestPrice":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"largestPrice","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('groupBy 11', async () => {
		const expression = 'Products.filter(p=>(p.price>5)).having(p=>(max(p.price)>50)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const modelExpected :any= {"category":"string","largestPrice":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"largestPrice","type":"any"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
})
describe('Sentences', () => {
	test('groupBy 1', async () => {
		const expression = 'Products.map(p=>{maxPrice:max(p.price)})'
		const mysqlExpected = 'SELECT MAX(p.UnitPrice) AS `maxPrice` FROM Products p  '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 2', async () => {
		const expression = 'Products.map(p=>{minPrice:min(p.price)})'
		const mysqlExpected = 'SELECT MIN(p.UnitPrice) AS `minPrice` FROM Products p  '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 3', async () => {
		const expression = 'Products.map(p=>{total:sum(p.price)})'
		const mysqlExpected = 'SELECT SUM(p.UnitPrice) AS `total` FROM Products p  '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 4', async () => {
		const expression = 'Products.map(p=>{average:avg(p.price)})'
		const mysqlExpected = 'SELECT AVG(p.UnitPrice) AS `average` FROM Products p  '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 5', async () => {
		const expression = 'Products.map(p=>{count:count(1)})'
		const mysqlExpected = 'SELECT COUNT(1) AS `count` FROM Products p  '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 6', async () => {
		const expression = 'Products.map(p=>{category:p.categoryId,largestPrice:max(p.price)})'
		const mysqlExpected = 'SELECT p.CategoryID AS `category`, MAX(p.UnitPrice) AS `largestPrice` FROM Products p  GROUP BY p.CategoryID '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 7', async () => {
		const expression = 'Products.map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, MAX(p.UnitPrice) AS `largestPrice` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID GROUP BY c.CategoryName '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 8', async () => {
		const expression = 'Products.filter(p=>(p.id===id)).map(p=>{name:p.name,source:p.price,result:abs(p.price)})'
		const mysqlExpected = 'SELECT p.ProductName AS `name`, p.UnitPrice AS `source`, ABS(p.UnitPrice) AS `result` FROM Products p  WHERE p.ProductID = ? '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 9', async () => {
		const expression = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)})'
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, MAX(p.UnitPrice) AS `largestPrice` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID GROUP BY c.CategoryName HAVING MAX(p.UnitPrice) > 100 '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 10', async () => {
		const expression = 'Products.having(p=>(max(p.price)>100)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, MAX(p.UnitPrice) AS `largestPrice` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID GROUP BY c.CategoryName HAVING MAX(p.UnitPrice) > 100 ORDER BY largestPrice desc '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('groupBy 11', async () => {
		const expression = 'Products.filter(p=>(p.price>5)).having(p=>(max(p.price)>50)).map(p=>{category:p.category.name,largestPrice:max(p.price)}).sort(p=>desc(p.largestPrice))'
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, MAX(p.UnitPrice) AS `largestPrice` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE p.UnitPrice > 5 GROUP BY c.CategoryName HAVING MAX(p.UnitPrice) > 50 ORDER BY largestPrice desc '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
})