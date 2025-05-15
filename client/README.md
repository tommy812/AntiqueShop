# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Vercel Deployment Instructions

### Before Deploying

1. Make sure your API URL is properly configured for production. Create a `.env.production` file with:
   ```
   REACT_APP_API_URL=https://your-server-url.com/api
   ```
   Replace with your actual server URL.

### Deployment Steps

1. Install Vercel CLI if not already installed:

   ```
   npm install -g vercel
   ```

2. Navigate to the client directory:

   ```
   cd client
   ```

3. Login to Vercel:

   ```
   vercel login
   ```

4. Deploy to Vercel:

   ```
   vercel
   ```

5. Follow the prompts:

   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - What's your project name? (Enter name or accept default)
   - In which directory is your code located? ./
   - Want to override settings? No

6. To deploy to production:
   ```
   vercel --prod
   ```

### Troubleshooting

- If you need to update environment variables after deployment:
  ```
  vercel env add REACT_APP_API_URL
  ```
  Then redeploy with `vercel --prod`
