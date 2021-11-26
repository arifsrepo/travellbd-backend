const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

    app.get('/', (req, res) => {
        res.send('API Running')
    })

    var uri = "mongodb://mongouser:8WY8cXX1eR2pdmD1@cluster0-shard-00-00.c1ygv.mongodb.net:27017,cluster0-shard-00-01.c1ygv.mongodb.net:27017,cluster0-shard-00-02.c1ygv.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-10o2xl-shard-0&authSource=admin&retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    async function server () {
        try{
            await client.connect();
            const database = client.db('packages');
            const packagesCollection = database.collection('details');
            const ordersCollection = database.collection('orders');

            app.get('/packages', async(req, res) => {
                console.log("----Simple Fetch All Package----");
                const cursor = packagesCollection.find({});
                packages = await cursor.toArray();
                console.log("---Loading Package ----")
                res.json(packages)
            })

            app.get('/search', async(req, res) => {
                console.log("----Advance Fetch All Package----");
                const cursor = packagesCollection.find({});
                packages = await cursor.toArray();
                const searchQuery = req.query.key;
                console.log(searchQuery)
                console.log("---Loading Package ----")
                res.json(packages)
            })


            app.get('/orders', async(req, res) => {
                const cursor = ordersCollection.find({});
                orders = await cursor.toArray();
                console.log(orders)
                res.json(orders)
            })

            app.post('/packages', async(req, res) => {
                const newPackages = req.body;
                const result = await packagesCollection.insertOne(newPackages);
                console.log('Post Hited')
                res.json(result);
            })

            app.post('/orders', async(req, res) => {
                console.log("-------------------")
                const newPackages = req.body;
                const result = await ordersCollection.insertOne(newPackages);

                console.log('Post Hited')
                res.json(result);
            })


            

            app.post('/packages/search', async(req, res) =>{
                console.log('-------------FFFF-----------')
                const keys = req.body;
                const emailsearch = req.body;
                console.log(keys, 'and', emailsearch)
                const query = {key :{$in: keys}}
                const ordered = await packagesCollection.find(query).toArray();
                console.log("Search Finished")
                res.json(ordered)
            })
            
            app.delete('/orders:id', async(req, res) => {
                const id = req.params.id;
                console.log('Deleting User id:', id);
                 const query = {order:id}
                 const result = await ordersCollection.deleteOne(query);
                res.json(id)
            })


        }
        finally{
            //  await client.close();
        }
    }
    server().catch(console.dir)

app.listen(port, ()=> {
    console.log('Server Running On Port', port)
})