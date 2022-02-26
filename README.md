# Mini Maestro

Welcome to the Mini Maestro app! This app walks you through composing your very own music, even if you have no experience. The purpose of this project was to use contrapuntal techniques (A.K.A. [Counterpoint](https://www.masterclass.com/articles/how-to-play-species-counterpoint#what-is-counterpoint-in-music)) to guide the user through composing their own music. By following contrapuntal techniques, the user is almost guaranteed to produce something beautiful, even if they do not know what they are doing.

## Demo
View live demo: [mini-maestro.jpholmes.com](https://mini-maestro.jpholmes.com/).

![Mini Maestro demo gif](./mini-maestro.gif)

## How to Run Locally
*Your local environment should have the following installed and setup:*

* _"npm package manager" and "node" for the frontend_
* _"rvm (Ruby Version Manager so you can install ruby)", "gem package manager", "Ruby on Rails" and "ruby" for the backend_
* _"PostgreSQL" for the database_
* _OS must be Linux, Mac, or Windows. If you are using Windows, you must have WSL installed._

Once the dependencies above are met, follow these instructions to run locally:

1. Clone down this repository from GitHub onto your local machine, then cd into root project directory
2. The root directory for the Rails backend from here is `./ror` and the root directory for the React frontend is `./ror/client`. Open one more terminal window so you have two terminal windows open total. In one terminal, run `cd ./ror` and in the other run `cd ./ror/client`.
3. In the backend terminal window (the one in `./ror`), run:
```
bundle install && rails db:create db:migrate && rails s
```
4. In the frontend terminal window, run:
```
npm install && npm start
```
5. This will install all other dependencies automatically, create the database on your machine, and start the backend and frontend. After the first time running these commands, you only need `rails s` in the backend terminal and `npm start` in the frontend terminal to start the servers, since you do not need to install dependencies more than once.
6. Open a browser and go to `http://localhost:4000` to view the running application. Running `npm start` may have done this for you already.

## Made by
Joshua Holmes<br/>
[jpholmes.com](https://www.jpholmes.com)<br/>
[linkedin.com/in/joshua-phillip-holmes](https://www.linkedin.com/in/joshua-phillip-holmes/)<br/>
[github.com/joshua-holmes](https://github.com/joshua-holmes)<br/>
[joshua.phillip.holmes@gmail.com](mailto:joshua.phillip.holmes@gmail.com)