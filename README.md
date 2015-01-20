Data Glider
=========

Data Glider is a real-time data monitoring system which enables users to identify and resolve data pipeline problems before they affect business processes. Data Glider provides easy access to visualization of time-series data in databases.

  - Examine data as daily or hourly
  - Support MySQL and Vertica databases
  - Adjustable refresh rate and lookback window
  - Status dashboard for target database connections
  - No need to set up additional database 

Website: http://wing3s.github.io/data-glider
![alt tag](http://i.imgur.com/n9qSCHl.png)


Version
----

0.1.0

Tech
-----------

Data Glider uses a number of open source projects:

* [AngularJS] - awesome structural framework for single-page web application
* [Highcharts] - easy way of adding interactive charts
* [Bootstrap] - great UI boilerplate for web apps
* [node.js] - software platform for scalable server-side and networking applications
* [Express] - fast node.js network app framework

Requirements
--------------
- [node.js](http://nodejs.org/download/)
- [npm](https://github.com/npm/npm)

For users using Ubuntu:
```sh
apt-get install nodejs
apt-get install npm
```

For Mac users:


```sh
// Use Homebrew
brew install node
brew install npm
// or Macports
port install nodejs
port install npm
```


Quick Start
--------------
No need to configure. Just simply start!
```sh
git clone https://github.com/wing3s/data-glider.git
cd data-glider
npm install
npm start
```
Now check [http://localhost:3001](http://localhost:3001)


License
----

MIT

[AngularJS]:https://angularjs.org
[Highcharts]:http://www.highcharts.com
[node.js]:http://nodejs.org
[Bootstrap]:http://twitter.github.com/bootstrap/
[express]:http://expressjs.com
