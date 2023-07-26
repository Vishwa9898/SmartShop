# Steps to run the backend

1. Install the dependencies using `npm install` or `yarn install`
2. Add .env

   ```ini
    JWT_SECRET=<JWT_SECRET>
    MONGODB_URI=<MONGODB_URI>
    CLIENT_ID=<PAYPAL_CLIENT_ID>
    APP_SECRET=<PAYPAL_APP_SECRET>
   ```
3. Add Dummy Data to the database using `npm run seed` (optional)(only run once)
4. Start the server using `npm start` or `yarn start` or `npm run dev` or `yarn dev`
