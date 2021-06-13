const assert = require('assert');
const ConfigExtends = require("config-extends");
const orm = require("../dist/orm.js");

describe('queries', function() {
    let schema = 'northwind';
    let language = 'sql';
    let variant = 'oracle';

    before(async function() {
        
        let schemas =  await ConfigExtends.apply('test/config/schema');
        for(const p in schemas){
            let schema =  schemas[p];
            orm.applySchema(schema);
        }
    });
    describe('select from join whrere order by', function() {        
        let expression =
        `Product.filter(p=> p.discontinued != false )                 
                .map(p=> {category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock} )
                .sort(p=> [p.category,desc(p.name)])
        `;
        let expected =
`SELECT c.CategoryName AS category, p.ProductName AS name, p.QuantityPerUnit AS quantity, p.UnitsInStock AS inStock
FROM Products p
INNER JOIN Categories c ON c.CategoryID = p.CategoryID
WHERE p.Discontinued <> 0
ORDER BY category, name desc
`;
        it(expression, function() {
            let sentence = orm.sentence(expression,scheme,language,variant);
            assert.strictEqual(sentence,expected);
        });
    });

    describe('select from joins whrere order by', function() {        
        let expression =
        `OrderDetail.filter(p=> between(p.order.shippedDate,'19970101','19971231') )                 
                    .map(p=> {category: p.product.category.name,product:p.product.name,unitPrice:p.unitPrice,quantity:p.quantity})
                    .sort(p=> [p.category,p.product])
        `;
        let expected =
`SELECT c.CategoryName AS category, p.ProductName AS product, o.UnitPrice AS unitPrice, o.Quantity AS quantity
FROM OrderDetails o
INNER JOIN Orders o1 ON o1.OrderID = o.OrderID
INNER JOIN Products p ON p.ProductID = o.ProductID
INNER JOIN Categories c ON c.CategoryID = p.CategoryID
WHERE o1.ShippedDate BETWEEN '19970101' AND '19971231'
ORDER BY category, product
`;
        it(expression, function() {
            let sentence = orm.sentence(expression,scheme,language,variant);
            assert.strictEqual(sentence,expected);
        });
    });

    describe('group by', function() {        
        let expression =
        `OrderDetail.map(p=> {order: p.id,subTotal:sum((p.unitPrice*p.quantity*(1-p.discount/100))*100) })`;
        let expected =
`SELECT o.OrderDetailID AS order, SUM((((o.UnitPrice * o.Quantity) * (1 - (o.Discount / 100))) * 100)) AS subTotal
FROM OrderDetails o
GROUP BY o.OrderDetailID
`;
        it(expression, function() {
            let sentence = orm.sentence(expression,scheme,language,variant);
            assert.strictEqual(sentence,expected);
        });
    });
});


