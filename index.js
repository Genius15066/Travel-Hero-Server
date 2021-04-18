const express = require('express')
require('dotenv').config()
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID
const port = 3002

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.82nqp.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json())
app.use(cors())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err)
  const tourCollection = client.db("tourInfo").collection("tour");
  const reviewCollection = client.db("tourInfo").collection("review");
  const orderCollection = client.db("tourInfo").collection("order");
  const adminCollection = client.db("tourInfo").collection("admin");

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get('/tours', (req, res) => {
    tourCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.get('/review', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/tour/:id', (req, res) => {
    tourCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      })
  })

  app.post('/addTour', (req, res) => {
    const newTourData = req.body;
    tourCollection.insertOne(newTourData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.post('/addReview', (req, res) => {
    const newReviewData = req.body;
    reviewCollection.insertOne(newReviewData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.post('/addDeals', (req, res) => {
    const newUserInfo = req.body;
    orderCollection.insertOne(newUserInfo)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })
  app.post('/addAdmin', (req, res) => {
    const newAdminInfo = req.body;
    adminCollection.insertOne(newAdminInfo)
      .then(result => {
        res.send(result.insertedCount > 0)

      })

  })

  app.post('/getOrder', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email:email })
      .toArray((err, admin) => {
        if (admin.length === 0) {
          orderCollection.find({email:email })
            .toArray((err, items) => {
              res.send(items)
            })
        }
        else {
          orderCollection.find()
          .toArray((err, items) => {
            res.send(items)
          })
        }
      })

  })

  app.post('/isadmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })
  })




});


app.listen(process.env.PORT || port)