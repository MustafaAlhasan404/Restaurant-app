const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const uri = "mongodb+srv://Mustafa:Mustafa00313@cluster0.9n4bpm2.mongodb.net/?retryWrites=true&w=majority";

const User = require('./modles/user');
const Reservation = require('./modles/reservation');
const Product = require('./modles/product');
const Stock = require('./modles/stock');
const Orders = require('./modles/orders');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect using Mongoose 
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1  
    });
    console.log("Connected to MongoDB using Mongoose!");

                                        // ----------------- Static Data------------------
                                       // these are staticlly stored in the database but in the future the manger will be 
                                      // able to add/remove products from the menu which needs to give product id's accordingly.

                                          const sampleUsers = [
                                            {username: 'user1', password: 'password1', role: 'employee'},
                                            {username: 'manager1', password: 'password2', role: 'manager'}
                                          ];

                                          const sampleProducts = [
                                            {name: 'Burger', price: 10, ingredients: ['bun', 'patty', 'lettuce'], options: [{name: 'cheese', price: 1}]},
                                            {name: 'Fries', price: 5, ingredients: ['potatoes', 'oil'], options: []},
                                          ];

                                          // Generate MongoDB object IDs for products
                                          const productIds = sampleProducts.map(p => new mongoose.Types.ObjectId()); 

                                          const sampleReservations = [
                                            {name: 'John Doe', phone: '123-456-7890', dateTime: new Date('2023-03-15T17:00:00'), numGuests: 2, notes: 'Birthday celebration'},
                                          ];

                                          const sampleOrders = [
                                            {items: [{productId: productIds[0], name: 'Burger', price: 10}], tableNumber: 1, orderStatus: 'unprocessed'},
                                          ];

                                          const sampleStock = [
                                            {productId: productIds[0], quantity: 10},
                                            {productId: productIds[1], quantity: 20},
                                          ];


                                          // Insert data
                                          await User.insertMany(sampleUsers);
                                          await Product.insertMany(sampleProducts); 
                                          await Reservation.insertMany(sampleReservations);
                                          await Orders.insertMany(sampleOrders);
                                          await Stock.insertMany(sampleStock);

                                        // ----------------- Static Data------------------

    await Product.deleteMany({}); 
    await Orders.deleteMany({}); 
    await Product.insertMany(sampleProducts);
    await Orders.insertMany(sampleOrders);

    console.log('Static data inserted!');

 } catch(err) {
      console.error("Error connecting to MongoDB or inserting data:", err);
  } finally {
    await mongoose.connection.close(); 
  }
}
run().catch(console.dir);
