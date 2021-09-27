
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

try {
	let category = {
		"name": "include",
		"schema": "northwind:0.0.2",
		"context": {
			"a": {
				"id": 1,
				"list_id": [
					null
				],
				"list_orderId": [
					1
				]
			}
		},
		"test": [
			{
				"name": "include 8",
				"context": "a",
				"lambda": "(id) => Orders.filter(p => p.id == id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])])",
				"sentences": [
					{
						"dialect": "mariadb",
						"sentence": "SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? \nSELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (?) \nSELECT o1.Quantity, o1.UnitPrice FROM `Order Details` o1  WHERE  o1.OrderID IN (?) \nSELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (?) \nSELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (?) "
					},
					{
						"dialect": "mssql",
						"sentence": "SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id \nSELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (:list_id) \nSELECT o1.Quantity, o1.UnitPrice FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) \nSELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (:list_id) \nSELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (:list_id) "
					},
					{
						"dialect": "mysql",
						"sentence": "SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? \nSELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (?) \nSELECT o1.Quantity, o1.UnitPrice FROM `Order Details` o1  WHERE  o1.OrderID IN (?) \nSELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (?) \nSELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (?) "
					},
					{
						"dialect": "oracle",
						"sentence": "SELECT o.OrderID AS \"id\", o.CustomerID AS \"customerId\", o.EmployeeID AS \"employeeId\", o.OrderDate AS \"orderDate\", o.RequiredDate AS \"requiredDate\", o.ShippedDate AS \"shippedDate\", o.ShipVia AS \"shipViaId\", o.Freight AS \"freight\", o.ShipName AS \"name\", o.ShipAddress AS \"address\", o.ShipCity AS \"city\", o.ShipRegion AS \"region\", o.ShipPostalCode AS \"postalCode\", o.ShipCountry AS \"country\" FROM Orders o  WHERE o.OrderID = :id \nSELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (:list_id) \nSELECT o1.Quantity, o1.UnitPrice FROM \"Order Details\" o1  WHERE  o1.OrderID IN (:list_orderId) \nSELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (:list_id) \nSELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (:list_id) "
					},
					{
						"dialect": "postgres",
						"sentence": "SELECT o.OrderID AS \"id\", o.CustomerID AS \"customerId\", o.EmployeeID AS \"employeeId\", o.OrderDate AS \"orderDate\", o.RequiredDate AS \"requiredDate\", o.ShippedDate AS \"shippedDate\", o.ShipVia AS \"shipViaId\", o.Freight AS \"freight\", o.ShipName AS \"name\", o.ShipAddress AS \"address\", o.ShipCity AS \"city\", o.ShipRegion AS \"region\", o.ShipPostalCode AS \"postalCode\", o.ShipCountry AS \"country\" FROM Orders o  WHERE o.OrderID = $1 \nSELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN ($1) \nSELECT o1.Quantity, o1.UnitPrice FROM \"Order Details\" o1  WHERE  o1.OrderID IN ($1) \nSELECT p.ProductName FROM Products p  WHERE  p.ProductID IN ($1) \nSELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN ($1) "
					}
				],
				"errors": 1,
				"expression": " Orders.filter(p => p.id == id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])])",
				"completeExpression": "Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>[p.customer.filter(p=>includes(p.id,list_id)).map(p=>p.name),p.details.include(p=>p.product.include(p=>p.category.filter(p=>includes(p.id,list_id)).map(p=>p.name)).filter(p=>includes(p.id,list_id)).map(p=>p.name)).filter(p=>includes(p.orderId,list_orderId)).map(p=>[p.quantity,p.unitPrice])])",
				"model": {
					"id": "integer",
					"customerId": "string",
					"employeeId": "integer",
					"orderDate": "datetime",
					"requiredDate": "datetime",
					"shippedDate": "datetime",
					"shipViaId": "integer",
					"freight": "decimal",
					"name": "string",
					"address": "string",
					"city": "string",
					"region": "string",
					"postalCode": "string",
					"country": "string",
					"customer": {
						"name": "string"
					},
					"details": [
						{
							"quantity": "decimal",
							"unitPrice": "decimal",
							"product": {
								"name": "string",
								"category": {
									"name": "string"
								}
							}
						}
					]
				},
				"parameters": [
					{
						"name": "id",
						"type": "integer",
						"value": 1
					}
				],
				"fields": [
					{
						"name": "id",
						"type": "integer"
					},
					{
						"name": "customerId",
						"type": "string"
					},
					{
						"name": "employeeId",
						"type": "integer"
					},
					{
						"name": "orderDate",
						"type": "datetime"
					},
					{
						"name": "requiredDate",
						"type": "datetime"
					},
					{
						"name": "shippedDate",
						"type": "datetime"
					},
					{
						"name": "shipViaId",
						"type": "integer"
					},
					{
						"name": "freight",
						"type": "decimal"
					},
					{
						"name": "name",
						"type": "string"
					},
					{
						"name": "address",
						"type": "string"
					},
					{
						"name": "city",
						"type": "string"
					},
					{
						"name": "region",
						"type": "string"
					},
					{
						"name": "postalCode",
						"type": "string"
					},
					{
						"name": "country",
						"type": "string"
					}
				],
				"executions": [
					{
						"database": "postgres",
						"error": "Error: execute:  Orders.filter(p => p.id == id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])]) error: error: invalid input syntax for integer: \"{NULL}\""
					},
					{
						"database": "mysql"
					}
				],
				"result": [
					{
						"id": 1,
						"customerId": "ALFKI",
						"employeeId": 6,
						"orderDate": "1997-08-24T22:00:00.000Z",
						"requiredDate": "1997-09-21T22:00:00.000Z",
						"shippedDate": "1997-09-01T22:00:00.000Z",
						"shipViaId": 1,
						"freight": "29.4600",
						"name": "Alfreds Futterkiste",
						"address": "Obere Str. 57",
						"city": "Berlin",
						"region": null,
						"postalCode": "12209",
						"country": "Germany",
						"details": []
					}
				]
			}
		],
		"errors": 1
	}

	let yamlStr = yaml.safeDump(category)
	fs.writeFileSync('test.yaml', yamlStr)
} catch (error) {
	console.log(error)
}
