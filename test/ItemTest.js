process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Item = require('../app/models/item');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Items', () => {
    beforeEach((done) => { //Before each test we empty the database
        Item.remove({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/GET item', () => {
      it('it should GET all the items', (done) => {
        chai.request(server)
            .get('/items')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });


/*
  * Test the /POST route
  */
 describe('/POST item', () => {
  it('it should POST a item ', (done) => {
    let item = {
      itemID: 8,
      itemName: "Cookie",
      price: 100,
      available_quantity: 50
    }
    chai.request(server)
        .post('/items')
        .send(item)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('itemID');
          res.body.should.have.property('itemName');
          res.body.should.have.property('price');
          res.body.should.have.property('available_quantity');
      done();

        });
  });
});


// Test the /GET/:id route

describe('/GET/:id item', () => {
    it('it should GET an item by the given id', (done) => {
      let item = new Item({
        itemID: 9,
        itemName: "Butter",
        price: 400,
        available_quantity: 50
      }) 
        //let item = new Item({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
        item.save((err, item) => {
            chai.request(server)
          .get('/items/' + item.itemID)
          .send(item)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('itemID');
                res.body.should.have.property('itemName');
                res.body.should.have.property('price');
                res.body.should.have.property('available_quantity');
                res.body.should.have.property('itemID').eql(item.itemID);
            done();
          });
        });

    });

  });
});