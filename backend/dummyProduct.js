import mongoose from 'mongoose';
import Product from './models/productModel.js'; // Assuming the schema and model are defined in a separate file

// import Product from './models/productModel';
// Connect to MongoDB
mongoose.connect('mongodb+srv://dpython88:Va*01*lay@smartshop.mqswz6r.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Define dummy data
    const dummyData = [
      {
        name: 'Sketboard',
        slug: 'product-4',
        image: '/home/valay/mern/ecommerce-amazon-clone/mern-amazona/backend/images/image-2.jpg',
        images: ['/home/valay/mern/ecommerce-amazon-clone/mern-amazona/backend/images/image-2.jpg', '/home/valay/mern/ecommerce-amazon-clone/mern-amazona/backend/images/image-2.jpg'],
        brand: 'espot',
        category: 'sports',
        description: 'sketing description',
        price: 17.99,
        countInStock: 60,
        rating: 4.3,
        numReviews: 26,
        reviews: [
          {
            name: 'John Doe',
            comment: 'Great product!',
            rating: 5,
          },
          {
            name: 'Jane Smith',
            comment: 'Nice quality.',
            rating: 4,
          },
        ],
      },
      // Add more dummy data objects as needed
    ];

    // Insert dummy data
    Product.insertMany(dummyData)
      .then(() => {
        console.log('Dummy data inserted successfully');
        mongoose.connection.close(); // Close the database connection
      })
      .catch((error) => {
        console.error('Error inserting dummy data:', error);
        mongoose.connection.close(); // Close the database connection
      });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
