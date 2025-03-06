DeepMoat 🏰💰
A stock fundamentals research tool that saves time by automating financial data retrieval and analysis.

Overview
DeepMoat is a stock research tool that pulls 10 years of financial data from the AlphaVantage API—twice the amount most finance websites provide. It helps investors by:

Fetching raw financial data (income statements, balance sheets, etc.)
Calculating growth rates for key metrics
Providing a Margin of Safety Calculator to estimate fair stock prices
Eliminating manual data entry into spreadsheets
Tech Stack
Backend: Node.js, Express
Data Fetching: Axios
Templating: EJS

Setup Instructions
Clone the Repository
git clone https://github.com/adrianwansk/deepmoat.git
cd deepmoat

Install Dependencies
npm install

Get an API Key
The project uses AlphaVantage API, which has a 25 requests/day limit on the free tier. Get your own API key here:
Get an AlphaVantage API Key

Run the Project
npm start
Then visit http://localhost:3000 in your browser.

Features
10 Years of Financial Data – Most sites only provide 5 years.
Automated Growth Rate Calculations – No need to manually crunch numbers.
Margin of Safety Calculator – Quickly determine a stock's fair value.
Saves Time – Eliminates tedious copy-pasting into spreadsheets.
License
This project is licensed under MIT License.

