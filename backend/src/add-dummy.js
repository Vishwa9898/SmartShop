const connectMongoose = require('./utils/connectMongoose');
const dotenv = require('dotenv');
const cliProgress = require('cli-progress');
const {setTimeout} = require('timers/promises');

const {faker} = require('@faker-js/faker');

dotenv.config();

/**
 * {
	name: String,
	description: String,
	price: Number,
	image: [
		{
			url: String,
			alt: String,
		},
    ],
    thumnail: string,
	category: String,
	seller: String,
	description: String,
	discounted_price: Number,
}
 */

const Product = require('./Models/Product');
const User = require('./Models/User');
const Review = require('./Models/Review');
const { hash } = require('./utils/Encryption');

const addProduct = async () => {
    const bar = new cliProgress.SingleBar({
        format: 'Adding Products |' + '{bar}' + '| {percentage}% || {value}/{total} Chunks || Speed: {speed} Chunks/sec',
    }, cliProgress.Presets.shades_classic);
    const products = [];
    bar.start(1000, 0);
    for (let i = 1; i <= 1000; i++) {
        const product = getNewProduct();
        bar.update(i);
        products.push(product);
    }
    bar.stop();

    await Product.insertMany(products);

   
    console.log('Product added');
}


const getNewProduct = () => { 
    const category = faker.commerce.department();
    const name = faker.commerce.productName();
    const imageProps = {
        height: 300,
        width: 500,
        category
    }
    const price = faker.commerce.price();
    const product = {
        name,
        description: faker.lorem.paragraphs(4),
        price,
        image: [
            {
                url: faker.image.urlLoremFlickr(imageProps),
                alt: faker.lorem.sentence(),
            },
            {
                url: faker.image.urlLoremFlickr(imageProps),
                alt: faker.lorem.sentence(),

            },
            {
                url: faker.image.urlLoremFlickr(imageProps),
                alt: faker.lorem.sentence(),
            }
        ],
        thumbnail: faker.image.urlLoremFlickr(imageProps),
        category,
        seller: faker.company.name(),
        discounted_price: price - Math.floor(Math.random() * price),
    }
    return product;
}

const addNewUsers = async () => { 
    const bar = new cliProgress.SingleBar({
        format: 'Adding Users |' + '{bar}' + '| {percentage}% || {value}/{total} Chunks || Speed: {speed} Chunks/sec',
    }, cliProgress.Presets.shades_classic);
    const users = [];
    bar.start(1000, 0);
    for (let i = 1; i <= 1000; i++) {
        bar.update(i);
        const user = await getNewUser();
        users.push(user);
    }
    bar.stop();
    await User.insertMany(users);
    console.log('Users added');
}



const getNewUser = async () => {

    const user = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(faker.internet.password()),
        role: 'user',
    }
    return user;
}

const getNewReview = (userId, productId) => { 
    
    const review = {
        user: userId,
        title: faker.lorem.sentence(),
        product: productId,
        description: faker.lorem.paragraph(),
        rating: Math.floor(Math.random() * 5) + 1,
    }
    return review;
}


const createNewReviews = async () => {
    const bar = new cliProgress.SingleBar({
        format: 'Adding Reviews |' + '{bar}' + '| {percentage}% || {value}/{total} Chunks || Speed: {speed} Chunks/sec',
    }, cliProgress.Presets.shades_classic);
    const users = await User.find();
    const products = await Product.find();
    const reviews = [];
    bar.start(1000, 0);
    for (let i = 1; i <= 1000; i++) {
        const review = getNewReview(users[ Math.floor(Math.random() * users.length) ]._id, products[ Math.floor(Math.random() * products.length) ]._id);
        reviews.push(review);
        bar.update(i);
    }
    bar.stop();
    await Review.insertMany(reviews);
   
};

(async () => {
    await connectMongoose();
    await setTimeout(100);
    await addProduct();
    await setTimeout(100);
    await addNewUsers();
    await setTimeout(100);
    for (let i = 1; i <= 4; i++) {
        await createNewReviews();
        await setTimeout(100);
    }
    console.log('Reviews added');
    process.exit(0);
 })();