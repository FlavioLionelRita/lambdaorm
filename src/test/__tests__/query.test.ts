import { orm,Helper } from '../../orm'
beforeAll(async () => {
	require('dotenv').config({ path: './test.env' })
	await orm.init()
})
describe('Complete Expression', () => {
	test('query 1', () => {
		const source = 'Products.map(p => p).page(1, 1)'
		const expected = 'Products.map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}).page(1,1)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 2', () => {
		const source = 'Products.page(1, 1)'
		const expected = 'Products.map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}).page(1,1)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 3', () => {
		const source = 'Products.filter(p => p.id === id).map(p => p).sort(p => p.id)'
		const expected = 'Products.filter(p=>(p.id===id)).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}).sort(p=>p.id)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 4', () => {
		const source = 'Products.filter(p => p.id === id).sort(p => p.id)'
		const expected = 'Products.filter(p=>(p.id===id)).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}).sort(p=>p.id)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 5', () => {
		const source = 'Products.map(p => p.category.name)'
		const expected = 'Products.map(p=>{category_name:p.category.name})'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 6', () => {
		const source = 'Products.map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => p.name)'
		const expected = 'Products.map(p=>{category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock}).sort(p=>p.name)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 7', () => {
		const source = 'Products.filter(p => p.discontinued !== false).map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => [p.category, desc(p.name)])'
		const expected = 'Products.filter(p=>(p.discontinued!==false)).map(p=>{category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock}).sort(p=>[p.category,desc(p.name)])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 8', () => {
		const source = 'OrderDetails.filter(p => between(p.order.shippedDate, from, to) && p.unitPrice > minValue).map(p => ({ category: p.product.category.name, product: p.product.name, unitPrice: p.unitPrice, quantity: p.quantity })).sort(p => [p.category, p.product])'
		const expected = 'OrderDetails.filter(p=>(between(p.order.shippedDate,from,to)&&(p.unitPrice>minValue))).map(p=>{category:p.product.category.name,product:p.product.name,unitPrice:p.unitPrice,quantity:p.quantity}).sort(p=>[p.category,p.product])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 9', () => {
		const source = 'OrderDetails.map(p => ({ orderId: p.orderId, subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.orderId)'
		const expected = 'OrderDetails.map(p=>{orderId:p.orderId,subTotal:sum(((p.unitPrice*(p.quantity*(1-(p.discount/100))))*100))}).sort(p=>p.orderId)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 10', () => {
		const source = 'Products.page(1, 1)'
		const expected = 'Products.map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}).page(1,1)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 11', () => {
		const source = 'Products.first(p => p)'
		const expected = 'Products.sort(p=>p.id).page(1,1).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued})'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 12', () => {
		const source = 'Products.last(p => p)'
		const expected = 'Products.sort(p=>desc(p.id)).page(1,1).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued})'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 13', () => {
		const source = 'Products.take(p => p)'
		const expected = 'Products.page(1,1).map(p=>p)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 14', () => {
		const source = 'Products.page(1, 1)'
		const expected = 'Products.map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}).page(1,1)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 15', () => {
		const source = 'Products.first(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock }))'
		const expected = 'Products.sort(p=>p.id).page(1,1).map(p=>{category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock})'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 16', () => {
		const source = 'Products.filter(p => p.discontinued !== false).last(p => p)'
		const expected = 'Products.filter(p=>(p.discontinued!==false)).sort(p=>desc(p.id)).page(1,1).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued})'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 17', () => {
		const source = 'Products.distinct(p => p)'
		const expected = 'Products.map(p=>distinct({id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}))'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 18', () => {
		const source = 'Products.distinct(p => p.category.name)'
		const expected = 'Products.map(p=>distinct({category_name:p.category.name}))'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 19', () => {
		const source = 'Products.distinct(p => ({ quantity: p.quantity, category: p.category.name })).sort(p => p.category)'
		const expected = 'Products.map(p=>distinct({quantity:p.quantity,category:p.category.name})).sort(p=>p.category)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('query 20', () => {
		const source = 'Products.distinct(p => ({ category: p.category.name })).sort(p => p.category)'
		const expected = 'Products.map(p=>distinct({category:p.category.name})).sort(p=>p.category)'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
})
describe('Metadata', () => {
	test('query 1', async () => {
		const expression = 'Products.map(p => p).page(1, 1)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 2', async () => {
		const expression = 'Products.page(1, 1)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 3', async () => {
		const expression = 'Products.filter(p => p.id === id).map(p => p).sort(p => p.id)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 4', async () => {
		const expression = 'Products.filter(p => p.id === id).sort(p => p.id)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 5', async () => {
		const expression = 'Products.map(p => p.category.name)'
		const modelExpected :any= {"category_name":"string"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category_name","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 6', async () => {
		const expression = 'Products.map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => p.name)'
		const modelExpected :any= {"category":"string","name":"string","quantity":"string","inStock":"decimal"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"name","type":"string"},{"name":"quantity","type":"string"},{"name":"inStock","type":"decimal"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 7', async () => {
		const expression = 'Products.filter(p => p.discontinued !== false).map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => [p.category, desc(p.name)])'
		const modelExpected :any= {"category":"string","name":"string","quantity":"string","inStock":"decimal"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"name","type":"string"},{"name":"quantity","type":"string"},{"name":"inStock","type":"decimal"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 8', async () => {
		const expression = 'OrderDetails.filter(p => between(p.order.shippedDate, from, to) && p.unitPrice > minValue).map(p => ({ category: p.product.category.name, product: p.product.name, unitPrice: p.unitPrice, quantity: p.quantity })).sort(p => [p.category, p.product])'
		const modelExpected :any= {"category":"string","product":"string","unitPrice":"decimal","quantity":"decimal"}
		const parametersExpected:any = [{"name":"from","type":"datetime","value":"1997-01-01 00:00:00"},{"name":"to","type":"datetime","value":"1997-12-31 00:00:00"},{"name":"minValue","type":"decimal","value":10}]
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"product","type":"string"},{"name":"unitPrice","type":"decimal"},{"name":"quantity","type":"decimal"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 9', async () => {
		const expression = 'OrderDetails.map(p => ({ orderId: p.orderId, subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.orderId)'
		const modelExpected :any= {"orderId":"integer","subTotal":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"orderId","type":"integer"},{"name":"subTotal","type":"any"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 10', async () => {
		const expression = 'Products.page(1, 1)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 11', async () => {
		const expression = 'Products.first(p => p)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 12', async () => {
		const expression = 'Products.last(p => p)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 13', async () => {
		const expression = 'Products.take(p => p)'
		const modelExpected :any= {"*":"any"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"*","type":"any"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 14', async () => {
		const expression = 'Products.page(1, 1)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 15', async () => {
		const expression = 'Products.first(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock }))'
		const modelExpected :any= {"category":"string","name":"string","quantity":"string","inStock":"decimal"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"},{"name":"name","type":"string"},{"name":"quantity","type":"string"},{"name":"inStock","type":"decimal"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 16', async () => {
		const expression = 'Products.filter(p => p.discontinued !== false).last(p => p)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 17', async () => {
		const expression = 'Products.distinct(p => p)'
		const modelExpected :any= {"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"string"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"boolean"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 18', async () => {
		const expression = 'Products.distinct(p => p.category.name)'
		const modelExpected :any= {"category_name":"string"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category_name","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 19', async () => {
		const expression = 'Products.distinct(p => ({ quantity: p.quantity, category: p.category.name })).sort(p => p.category)'
		const modelExpected :any= {"quantity":"string","category":"string"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"quantity","type":"string"},{"name":"category","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('query 20', async () => {
		const expression = 'Products.distinct(p => ({ category: p.category.name })).sort(p => p.category)'
		const modelExpected :any= {"category":"string"}
		const parametersExpected:any = []
		const fieldsExpected :any= [{"name":"category","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
})
describe('Sentences', () => {
	test('query 1', async () => {
		const expression = 'Products.map(p => p).page(1, 1)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 2', async () => {
		const expression = 'Products.page(1, 1)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 3', async () => {
		const expression = 'Products.filter(p => p.id === id).map(p => p).sort(p => p.id)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE p.ProductID = ? ORDER BY `id` '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  WHERE p.ProductID = :id ORDER BY [id] '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE p.ProductID = ? ORDER BY `id` '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE p.ProductID = :id ORDER BY "id" '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE p.ProductID = $1 ORDER BY "id" '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 4', async () => {
		const expression = 'Products.filter(p => p.id === id).sort(p => p.id)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE p.ProductID = ? ORDER BY `id` '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  WHERE p.ProductID = :id ORDER BY [id] '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE p.ProductID = ? ORDER BY `id` '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE p.ProductID = :id ORDER BY "id" '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE p.ProductID = $1 ORDER BY "id" '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 5', async () => {
		const expression = 'Products.map(p => p.category.name)'
		const mariadbExpected = 'SELECT c.CategoryName AS `category_name` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT c.CategoryName AS [category_name] FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT c.CategoryName AS `category_name` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT c.CategoryName AS "category_name" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT c.CategoryName AS "category_name" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 6', async () => {
		const expression = 'Products.map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => p.name)'
		const mariadbExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `name`, p.QuantityPerUnit AS `quantity`, p.UnitsInStock AS `inStock` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY `name` '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT c.CategoryName AS [category], p.ProductName AS [name], p.QuantityPerUnit AS [quantity], p.UnitsInStock AS [inStock] FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY [name] '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `name`, p.QuantityPerUnit AS `quantity`, p.UnitsInStock AS `inStock` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY `name` '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "name", p.QuantityPerUnit AS "quantity", p.UnitsInStock AS "inStock" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY "name" '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "name", p.QuantityPerUnit AS "quantity", p.UnitsInStock AS "inStock" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY "name" '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 7', async () => {
		const expression = 'Products.filter(p => p.discontinued !== false).map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => [p.category, desc(p.name)])'
		const mariadbExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `name`, p.QuantityPerUnit AS `quantity`, p.UnitsInStock AS `inStock` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE p.Discontinued <> FALSE ORDER BY `category`, `name` desc '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT c.CategoryName AS [category], p.ProductName AS [name], p.QuantityPerUnit AS [quantity], p.UnitsInStock AS [inStock] FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE p.Discontinued <> FALSE ORDER BY [category], [name] desc '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `name`, p.QuantityPerUnit AS `quantity`, p.UnitsInStock AS `inStock` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE p.Discontinued <> FALSE ORDER BY `category`, `name` desc '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "name", p.QuantityPerUnit AS "quantity", p.UnitsInStock AS "inStock" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE p.Discontinued <> FALSE ORDER BY "category", "name" desc '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "name", p.QuantityPerUnit AS "quantity", p.UnitsInStock AS "inStock" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE p.Discontinued <> FALSE ORDER BY "category", "name" desc '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 8', async () => {
		const expression = 'OrderDetails.filter(p => between(p.order.shippedDate, from, to) && p.unitPrice > minValue).map(p => ({ category: p.product.category.name, product: p.product.name, unitPrice: p.unitPrice, quantity: p.quantity })).sort(p => [p.category, p.product])'
		const mariadbExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `product`, o.UnitPrice AS `unitPrice`, o.Quantity AS `quantity` FROM `Order Details` o INNER JOIN Orders o1 ON o1.OrderID = o.OrderID INNER JOIN Products p ON p.ProductID = o.ProductID INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE (o1.ShippedDate BETWEEN ? AND ? AND o.UnitPrice > ?) ORDER BY `category`, `product` '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT c.CategoryName AS [category], p.ProductName AS [product], o.UnitPrice AS [unitPrice], o.Quantity AS [quantity] FROM [Order Details] o INNER JOIN Orders o1 ON o1.OrderID = o.OrderID INNER JOIN Products p ON p.ProductID = o.ProductID INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE (o1.ShippedDate BETWEEN :from AND :to AND o.UnitPrice > :minValue) ORDER BY [category], [product] '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `product`, o.UnitPrice AS `unitPrice`, o.Quantity AS `quantity` FROM `Order Details` o INNER JOIN Orders o1 ON o1.OrderID = o.OrderID INNER JOIN Products p ON p.ProductID = o.ProductID INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE (o1.ShippedDate BETWEEN ? AND ? AND o.UnitPrice > ?) ORDER BY `category`, `product` '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "product", o.UnitPrice AS "unitPrice", o.Quantity AS "quantity" FROM "Order Details" o INNER JOIN Orders o1 ON o1.OrderID = o.OrderID INNER JOIN Products p ON p.ProductID = o.ProductID INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE (o1.ShippedDate BETWEEN :from AND :to AND o.UnitPrice > :minValue) ORDER BY "category", "product" '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "product", o.UnitPrice AS "unitPrice", o.Quantity AS "quantity" FROM "Order Details" o INNER JOIN Orders o1 ON o1.OrderID = o.OrderID INNER JOIN Products p ON p.ProductID = o.ProductID INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE (o1.ShippedDate BETWEEN $1 AND $2 AND o.UnitPrice > $3) ORDER BY "category", "product" '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 9', async () => {
		const expression = 'OrderDetails.map(p => ({ orderId: p.orderId, subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.orderId)'
		const mariadbExpected = 'SELECT o.OrderID AS `orderId`, SUM(((o.UnitPrice * (o.Quantity * (1 - (o.Discount / 100)))) * 100)) AS `subTotal` FROM `Order Details` o  GROUP BY o.OrderID ORDER BY `orderId` '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [orderId], SUM(((o.UnitPrice * (o.Quantity * (1 - (o.Discount / 100)))) * 100)) AS [subTotal] FROM [Order Details] o  GROUP BY o.OrderID ORDER BY [orderId] '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `orderId`, SUM(((o.UnitPrice * (o.Quantity * (1 - (o.Discount / 100)))) * 100)) AS `subTotal` FROM `Order Details` o  GROUP BY o.OrderID ORDER BY `orderId` '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "orderId", SUM(((o.UnitPrice * (o.Quantity * (1 - (o.Discount / 100)))) * 100)) AS "subTotal" FROM "Order Details" o  GROUP BY o.OrderID ORDER BY "orderId" '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "orderId", SUM(((o.UnitPrice * (o.Quantity * (1 - (o.Discount / 100)))) * 100)) AS "subTotal" FROM "Order Details" o  GROUP BY o.OrderID ORDER BY "orderId" '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 10', async () => {
		const expression = 'Products.page(1, 1)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 11', async () => {
		const expression = 'Products.first(p => p)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  ORDER BY `id` LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  ORDER BY [id] LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  ORDER BY `id` LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  ORDER BY "id" LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  ORDER BY "id" OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 12', async () => {
		const expression = 'Products.last(p => p)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  ORDER BY `id` desc LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  ORDER BY [id] desc LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  ORDER BY `id` desc LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  ORDER BY "id" desc LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  ORDER BY "id" desc OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 13', async () => {
		const expression = 'Products.take(p => p)'
		const mariadbExpected = 'SELECT p.* FROM Products p  LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.* FROM Products p  LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.* FROM Products p  LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.* FROM Products p  LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.* FROM Products p  OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 14', async () => {
		const expression = 'Products.page(1, 1)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 15', async () => {
		const expression = 'Products.first(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock }))'
		const mariadbExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `name`, p.QuantityPerUnit AS `quantity`, p.UnitsInStock AS `inStock` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY p.ProductID LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT c.CategoryName AS [category], p.ProductName AS [name], p.QuantityPerUnit AS [quantity], p.UnitsInStock AS [inStock] FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY p.ProductID LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT c.CategoryName AS `category`, p.ProductName AS `name`, p.QuantityPerUnit AS `quantity`, p.UnitsInStock AS `inStock` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY p.ProductID LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "name", p.QuantityPerUnit AS "quantity", p.UnitsInStock AS "inStock" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY p.ProductID LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT c.CategoryName AS "category", p.ProductName AS "name", p.QuantityPerUnit AS "quantity", p.UnitsInStock AS "inStock" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY p.ProductID OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 16', async () => {
		const expression = 'Products.filter(p => p.discontinued !== false).last(p => p)'
		const mariadbExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE p.Discontinued <> FALSE ORDER BY `id` desc LIMIT 0,1  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  WHERE p.Discontinued <> FALSE ORDER BY [id] desc LIMIT 0,1  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE p.Discontinued <> FALSE ORDER BY `id` desc LIMIT 0,1  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE p.Discontinued <> FALSE ORDER BY "id" desc LIMIT 0,1  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE p.Discontinued <> FALSE ORDER BY "id" desc OFFSET 0 LIMIT 1  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 17', async () => {
		const expression = 'Products.distinct(p => p)'
		const mariadbExpected = 'SELECT DISTINCT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT DISTINCT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT DISTINCT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT DISTINCT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT DISTINCT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 18', async () => {
		const expression = 'Products.distinct(p => p.category.name)'
		const mariadbExpected = 'SELECT DISTINCT c.CategoryName AS `category_name` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT DISTINCT c.CategoryName AS [category_name] FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT DISTINCT c.CategoryName AS `category_name` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT DISTINCT c.CategoryName AS "category_name" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT DISTINCT c.CategoryName AS "category_name" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 19', async () => {
		const expression = 'Products.distinct(p => ({ quantity: p.quantity, category: p.category.name })).sort(p => p.category)'
		const mariadbExpected = 'SELECT DISTINCT p.QuantityPerUnit AS `quantity`, c.CategoryName AS `category` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY `category` '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT DISTINCT p.QuantityPerUnit AS [quantity], c.CategoryName AS [category] FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY [category] '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT DISTINCT p.QuantityPerUnit AS `quantity`, c.CategoryName AS `category` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY `category` '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT DISTINCT p.QuantityPerUnit AS "quantity", c.CategoryName AS "category" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY "category" '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT DISTINCT p.QuantityPerUnit AS "quantity", c.CategoryName AS "category" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY "category" '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('query 20', async () => {
		const expression = 'Products.distinct(p => ({ category: p.category.name })).sort(p => p.category)'
		const mariadbExpected = 'SELECT DISTINCT c.CategoryName AS `category` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY `category` '
		let mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT DISTINCT c.CategoryName AS [category] FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY [category] '
		let mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT DISTINCT c.CategoryName AS `category` FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY `category` '
		let mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT DISTINCT c.CategoryName AS "category" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY "category" '
		let oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT DISTINCT c.CategoryName AS "category" FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID ORDER BY "category" '
		let postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
})