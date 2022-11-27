This folder contains both the backend and front end part of the PayPal application that our tean is required to deliver on the 14th of December. I belive that all must implement it and then istruct the class on how to do so. The code is working as it should.

HOW IT WORKS
^^^^^^^^^^^^^^^

- PayPal
  ^^^^^^
This application uses an API provided by PayPal in the form of Sandboxes. The api allows the developer to create multiple accounts of mainly two types; Personal and Merchant. The Personal account represents the person who is paying while the Merchant is receiving. Follow 
the tutorial in this link to make sure to set up this functionality correctly: https://medium.com/@adityasingh_32512/integrating-paypal-in-your-react-native-app-4dcf89e11dd. I am not sure if using my API key and created accounts will work for you. It may be required to create
your own account and use your own personal information.

- Backend connection
  ^^^^^^^^^^^^^^^^^
Since the app uses a backend which requires a server (localhost:3000), a third party framework is required to put this server not only on you local machine, but also on you local network in order to be accessed through you phone when using the expo app. The framwork which
worked for me was ngork (https://ngrok.com/). After creating an account, follow the docs on how to get started adn install the application to your machine. Despite the fact that in the tutorial the uri for the webview is the localhost, in order to use on a physical device use the
one in my code, which is the same one generated when the ngork tunnel is opened. If you have an emulator on you machine, the tutorial method should suffice. 

- How to execute the application.
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^
In order to successfully execute the application, the following steps need to be followed:

	1. First start the backend in order to get the server running. This can be done by using nodemond app.js in the terminal (make sure that nodemond is installed).
	2. Start a ngrok tunnel by following the example in the docs. Do this in the terminal using the same directory as were the application is located.
	3. Run the application using npm start and everything should work.