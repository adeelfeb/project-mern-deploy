
```js
import 'dotenv/config'; // Load environment variables from .env
import ngrok from 'ngrok';
import conf from './src/conf/conf.js';

(async function () {
  try {
    // Authenticate with your ngrok API key
    await ngrok.authtoken(conf.ngrokApiKey);

    // Start a tunnel to the frontend (Vite runs on port 5173 by default)

    const url = await ngrok.connect(conf.PORT);

    console.log(`🚀 Ngrok tunnel is running: ${url}`);

    // Optional: If you want to expose the URL to your frontend, you could write it to a file.
  } catch (error) {
    console.error('Error starting ngrok:', error);
  }
})();
```


