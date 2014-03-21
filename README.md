# Colaborativo.js

Lo nuevo de [Colaborativo](http://colaborativo.co). La forma inteligente de agrupar redes sociales.

Creado por [8manos S.A.S](http://8manos.com), [Activa MC](http://activamc.com) y [Contenidos El Rey](http://contenidoselrey.com).

_Actualmente en fase beta_

## Features

* HTML5
* Real-time twitter and instagram updates.
* Responsive layout.
* Minimal css and html
* Built on top of the best software available.

## Quick start

1. Install dependencies
<pre>npm install</pre>
2. Edit the included sample.env to include your local configurations and save it as .env
<pre>cp sample.env .env</pre>
3. Copy de sample local confg file from `config/sample.local.js` to `config/local.js`
<pre>cp config/sample.local.js config/local.js</pre>
4. Start the local server
<pre>foreman start</pre>
5. To see how it's working, the console is pretty verbose, you can also visit the job status page at `/kue/active`

**Requirements**

* Redis
* MongoDB


## Contributing

Anyone and everyone is welcome to contribute. 
Please submit your pull requests to make this script better.


## License

Pending ... 

### Major components:

* [Sails.js](http://sailsjs.org)
* [Angular.js](http://angularjs.org)
