process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Order = require('../app/models/order');
let Item = require('../app/models/item');


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Orders', () => {
    beforeEach((done) => { //Before each test we empty the database
        Order.remove({}, (err) => { 
          Item.remove({}, (err) => { 
            done();           
         });            
        });        
       
    });
/*
  * Test the /GET all orders
  */
  describe('/GET Order', () => {
      it('it should GET all the orders', (done) => {
        chai.request(server)
            .get('/orders')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });


/*
  * Test the /POST order
  */
 describe('/POST order', () => {
  it('it should POST an order ', (done) => {
    let item = new Item({
      itemID: 20,
      itemName: "Butters",
      price: 400,
      available_quantity: 50
    })
    
    
    item.save( (err,item) => {
      let order= {
        OrderID: 2, 
        OrderName: "Order_1",
        status:"open",
        itemDetails: [{itemID:item._id,itemQuantity:5}],
        OrderTotal: 800
    }

  //  console.log(order)

    chai.request(server)
        .post('/orders')
        .send(order)
        .end((err, res) => {
          //console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
         res.body.should.have.property("OrderID");
          res.body.should.have.property('OrderName');
          //res.body.should.have.property('OrderStatus');
          res.body.should.have.property('itemDetails');
      done();

        });
    })

  });
});


//Test the /GET/:id route (get one order)

describe('/GET/:id order', () => {
    it('it should GET an order by the given id', (done) => {
      let item = new Item({
        itemID: 20,
        itemName: "Butters",
        price: 400,
        available_quantity: 50
      })
      
      
      item.save( (err,item) => {
        let order= new Order({
          OrderID: 2, 
          OrderName: "Order_1",
          OrderStatus:"open",
          itemDetails: [{itemID:item._id,itemQuantity:5}],
          OrderTotal: 800
      })
  
      order.save((err,order)=>{
        chai.request(server)
        .get('/orders/'+order.OrderID)
        .send(order)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property("OrderID");
          res.body.should.have.property('OrderName');
          res.body.should.have.property('OrderStatus');
          res.body.should.have.property('itemDetails');
      done();

        });
      })
      })

    });

  });

//test add New item to the order


// describe('/PUT/:id/:id order', () => {
//   it('it should PUT an item by the given id to the given order', (done) => {
//     let item = new Item({
//       itemID: 20,
//       itemName: "Butters",
//       price: 400,
//       available_quantity: 50
//     })
    
    
//     item.save( (err,item) => {
//       let order= new Order({
//         OrderID: 2, 
//         OrderName: "Order_1",
//         OrderStatus:"open",
//         itemDetails: [{itemID:item._id,itemQuantity:5}],
//         OrderTotal: 800
//     })

//     order.save((err,order)=>{
//       chai.request(server)
//       .get('/orders/add/:orderId/:itemId')
//       .send(order)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         res.body.should.have.property("OrderID");
//         res.body.should.have.property('OrderName');
//         //res.body.should.have.property('OrderStatus');
//         res.body.should.have.property('itemDetails');
//     done();

//       });
//     })
//     })

//   });

// });

//Test remove item from the Order

describe('/PUT/:id/:id order', () => {
  it('it should remove an item by the given id from the given order', (done) => {
    let item = new Item({
      itemID: 20,
      itemName: "Butters",
      price: 400,
      available_quantity: 50
    })
    
    
    item.save( (err,item) => {
      let order= new Order({
        OrderID: 2, 
        OrderName: "Order_1",
        OrderStatus:"open",
        itemDetails: [{itemID:item._id,itemQuantity:5}],
        OrderTotal: 800
    })

    order.save((err,order)=>{
      //console.log(order)
      chai.request(server)
      .put('/orders/remove/'+order.OrderID+'/'+item.itemID)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property("OrderID");
        res.body.should.have.property('OrderName');
        res.body.should.have.property('OrderStatus');
        res.body.should.have.property('itemDetails');
    done();

      });
    })
    })

  });

});

//TEst delete order

describe('/DELETE/:id/:id order', () => {
  it('it should delete an order by the given id', (done) => {
    let item = new Item({
      itemID: 20,
      itemName: "Butters",
      price: 400,
      available_quantity: 50
    })
    
    
    item.save( (err,item) => {
      let order= new Order({
        OrderID: 2, 
        OrderName: "Order_1",
        OrderStatus:"open",
        itemDetails: [{itemID:item._id,itemQuantity:5}],
        OrderTotal: 800
    })

    order.save((err,order)=>{
      chai.request(server)
      .delete('/orders/delete/'+order._id)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        // res.body.should.have.property("OrderID");
        // res.body.should.have.property('OrderName');
        // res.body.should.have.property('OrderStatus');
        // res.body.should.have.property('itemDetails');
    done();

      });
    })
    })

  });

});

//Test chane item count in a given order

describe('/PUT/:id/:id order', () => {
  it('it should update item count by the given id from the given order', (done) => {
    let item = new Item({
      itemID: 20,
      itemName: "Butters",
      price: 400,
      available_quantity: 50
    })
    
    
    item.save( (err,item) => {
      let order= new Order({
        OrderID: 2, 
        OrderName: "Order_1",
        OrderStatus:"open",
        itemDetails: [{itemID:item._id,itemQuantity:5}],
        OrderTotal: 800
    })

    order.save((err,order)=>{
      chai.request(server)
      .put('/orders/change/'+order.OrderID+'/'+item.itemID+'/'+3)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property("OrderID");
        res.body.should.have.property('OrderName');
        res.body.should.have.property('OrderStatus');
        res.body.should.have.property('itemDetails');
    done();

      });
    })
    })

  });

});


});