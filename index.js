import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

// Note: This project uses the AlphaVantage API. The API key used here has a limit of 25 requests per day. You can get your own free API key at [AlphaVantage](https://www.alphavantage.co/support/#api-key).
const apiKey = "QW8G16PJP5FN70HC";

//Make the styling show up
app.use(express.static('public'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { content: "API Response." });
})

app.post("/submit", async (req, res) => {
    const ticker = req.body.ticker;
    console.log(req.body.ticker);

    try{
        const incomeStatementResponse = await axios.get(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${apiKey}`);
        const incomeStatement = incomeStatementResponse.data;

        const balanceSheetResponse = await axios.get(`https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${ticker}&apikey=${apiKey}`);
        const balanceSheet = balanceSheetResponse.data;

        const cashFlowResponse = await axios.get(`https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${ticker}&apikey=${apiKey}`);
        const cashFlow = cashFlowResponse.data;

        const overviewResponse = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`);
        const overview = overviewResponse.data;

        const extractedData = incomeStatement.annualReports.map(i => {
            // finding total assets and liabilities matching fiscalDateEnding
            const matchingEquity = balanceSheet.annualReports.find(b => 
                b.fiscalDateEnding === i.fiscalDateEnding
            );
            //finding cash flow matching fiscalDateEnding
            const matchingCash = cashFlow.annualReports.find(c => 
                c.fiscalDateEnding === i.fiscalDateEnding
            );
            // Return a new combined object
            return {
                fiscalDateEnding: i.fiscalDateEnding,
                totalRevenue: i.totalRevenue,
                netIncome: i.netIncome,
                totalAssets: matchingEquity? matchingEquity.totalAssets: null,
                totalLiabilities: matchingEquity? matchingEquity.totalLiabilities: null,
                operatingCashflow: matchingCash? matchingCash.operatingCashflow: null,
                capitalExpenditures: matchingCash? matchingCash.capitalExpenditures: null
            }
            ; 
         })
         
        console.log(overview);
        console.log(extractedData);


        //Calculations --> modify to Modified CAGR to account for negative starting values
        function revenueGrowth (years) {

            let start = extractedData[years].totalRevenue;
            let end = extractedData[0].totalRevenue;

            return (((end - start) / Math.abs(start)) ** (1 / years)) - 1;

        };
        
        function earningsGrowth (years) {

            let start = extractedData[years].netIncome;
            let end = extractedData[0].netIncome;

            return (((end - start) / Math.abs(start)) ** (1 / years)) - 1;
        
        };

        function equityGrowth (years) {
       
          let start = extractedData[years].totalAssets - extractedData[years].totalLiabilities;
          let end = extractedData[0].totalAssets - extractedData[0].totalLiabilities;

          return (((end - start) / Math.abs(start)) ** (1 / years)) - 1;
      
      };

        function freeCashFlowGrowth (years) {
      
          let start = extractedData[years].operatingCashflow - extractedData[years].capitalExpenditures;
          let end = extractedData[0].operatingCashflow - extractedData[0].capitalExpenditures;;

          return (((end - start) / Math.abs(start)) ** (1 / years)) - 1;
      
      };


        const calculations = {
            revenueGrowth10: (revenueGrowth(10) * 100).toFixed(2) + "%",
            revenueGrowth5: (revenueGrowth(5) * 100).toFixed(2) + "%",
            revenueGrowth1: (revenueGrowth(1) * 100).toFixed(2) + "%",
            earningsGrowth10: (earningsGrowth(10) * 100).toFixed(2) + "%",
            earningsGrowth5: (earningsGrowth(5) * 100).toFixed(2) + "%",
            earningsGrowth1: (earningsGrowth(1) * 100).toFixed(2) + "%",
            equityGrowth10: (equityGrowth(10) * 100).toFixed(2) + "%",
            equityGrowth5: (equityGrowth(5) * 100).toFixed(2) + "%",
            equityGrowth1: (equityGrowth(1) * 100).toFixed(2) + "%",
            freeCashFlowGrowth10: (freeCashFlowGrowth(10) * 100).toFixed(2) + "%",
            freeCashFlowGrowth5: (freeCashFlowGrowth(5) * 100).toFixed(2) + "%",
            freeCashFlowGrowth1: (freeCashFlowGrowth(1) * 100).toFixed(2) + "%"
        };
        
        console.log(calculations);
        console.log(incomeStatement);
        console.log(revenueGrowth(10));


        res.render("index.ejs", { content: extractedData, companyInfo: overview, calculations: calculations});

      }
      catch (error) {
        if (error.response) {
            // Log the response data if the error is related to the API response
            console.error("API Error response:", error.response.data);
            console.error("API Error status:", error.response.status);
        } else if (error.request) {
            // Log the request if the error was related to the request
            console.error("API request error:", error.request);
        } else {
            // Log other types of errors
            console.error("Error message:", error.message);
        }
        res.render("index.ejs", { content: sampleDataAMZN, companyInfo: sampleComapnyInfoAMZN, calculations: sampleCalculationsAMZN});
        console.log(sampleComapnyInfoAMZN.DilutedEPSTTM);

    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  

// Sample data for when API rate limit reached
const sampleDataAMZN = [
    {
      fiscalDateEnding: '2024-12-31',
      totalRevenue: '637551000000',
      netIncome: '59248000000',
      totalAssets: '624894000000',
      totalLiabilities: '338924000000',
      operatingCashflow: '115877000000',
      capitalExpenditures: '82999000000'
    },
    {
      fiscalDateEnding: '2023-12-31',
      totalRevenue: '571668000000',
      netIncome: '30425000000',
      totalAssets: '527854000000',
      totalLiabilities: '325979000000',
      operatingCashflow: '84946000000',
      capitalExpenditures: '52729000000'
    },
    {
      fiscalDateEnding: '2022-12-31',
      totalRevenue: '511276000000',
      netIncome: '-2722000000',
      totalAssets: '462675000000',
      totalLiabilities: '316632000000',
      operatingCashflow: '46752000000',
      capitalExpenditures: '63645000000'
    },
    {
      fiscalDateEnding: '2021-12-31',
      totalRevenue: '467958000000',
      netIncome: '33364000000',
      totalAssets: '420549000000',
      totalLiabilities: '282304000000',
      operatingCashflow: '46327000000',
      capitalExpenditures: '61053000000'
    },
    {
      fiscalDateEnding: '2020-12-31',
      totalRevenue: '384452000000',
      netIncome: '21331000000',
      totalAssets: '321195000000',
      totalLiabilities: '227791000000',
      operatingCashflow: '66064000000',
      capitalExpenditures: '40140000000'
    },
    {
      fiscalDateEnding: '2019-12-31',
      totalRevenue: '278902000000',
      netIncome: '11588000000',
      totalAssets: '225248000000',
      totalLiabilities: '163188000000',
      operatingCashflow: '38514000000',
      capitalExpenditures: '16861000000'
    },
    {
      fiscalDateEnding: '2018-12-31',
      totalRevenue: '231264000000',
      netIncome: '10073000000',
      totalAssets: '162648000000',
      totalLiabilities: '119099000000',
      operatingCashflow: '30723000000',
      capitalExpenditures: '13427000000'
    },
    {
      fiscalDateEnding: '2017-12-31',
      totalRevenue: '177265000000',
      netIncome: '3033000000',
      totalAssets: '131310000000',
      totalLiabilities: '103601000000',
      operatingCashflow: '18365000000',
      capitalExpenditures: '11955000000'
    },
    {
      fiscalDateEnding: '2016-12-31',
      totalRevenue: '135565000000',
      netIncome: '2371000000',
      totalAssets: '83402000000',
      totalLiabilities: '64117000000',
      operatingCashflow: '17203000000',
      capitalExpenditures: '7804000000'
    },
    {
      fiscalDateEnding: '2015-12-31',
      totalRevenue: '106332000000',
      netIncome: '596000000',
      totalAssets: '64747000000',
      totalLiabilities: '51363000000',
      operatingCashflow: '12039000000',
      capitalExpenditures: '4589000000'
    },
    {
      fiscalDateEnding: '2014-12-31',
      totalRevenue: '88680000000',
      netIncome: '-241000000',
      totalAssets: '54505000000',
      totalLiabilities: '43764000000',
      operatingCashflow: '6842000000',
      capitalExpenditures: '4893000000'
    },
    {
      fiscalDateEnding: '2013-12-31',
      totalRevenue: '74227000000',
      netIncome: '274000000',
      totalAssets: '40159000000',
      totalLiabilities: '30413000000',
      operatingCashflow: '5475000000',
      capitalExpenditures: '3444000000'
    },
    {
      fiscalDateEnding: '2012-12-31',
      totalRevenue: '60926000000',
      netIncome: '-39000000',
      totalAssets: '32555000000',
      totalLiabilities: '24363000000',
      operatingCashflow: '4180000000',
      capitalExpenditures: '3785000000'
    },
    {
      fiscalDateEnding: '2011-12-31',
      totalRevenue: '48097000000',
      netIncome: '631000000',
      totalAssets: '25278000000',
      totalLiabilities: '17521000000',
      operatingCashflow: '3903000000',
      capitalExpenditures: '1811000000'
    },
    {
      fiscalDateEnding: '2010-12-31',
      totalRevenue: '34097000000',
      netIncome: '1152000000',
      totalAssets: '18797000000',
      totalLiabilities: '11933000000',
      operatingCashflow: '3495000000',
      capitalExpenditures: '979000000'
    },
    {
      fiscalDateEnding: '2009-12-31',
      totalRevenue: '24479000000',
      netIncome: '902000000',
      totalAssets: '13813000000',
      totalLiabilities: '8556000000',
      operatingCashflow: '3293000000',
      capitalExpenditures: '373000000'
    }
  ];

  const sampleCalculationsAMZN = {
    revenueGrowth10: '20.00%',
    revenueGrowth5: '5.16%',
    revenueGrowth1: '-88.48%',
    earningsGrowth10: '73.48%',
    earningsGrowth5: '32.69%',
    earningsGrowth1: '-5.27%',
    equityGrowth10: '38.31%',
    equityGrowth5: '29.26%',
    equityGrowth1: '-58.34%',
    freeCashFlowGrowth10: '31.84%',
    freeCashFlowGrowth5: '-12.31%',
    freeCashFlowGrowth1: '-97.95%'
  };

  const sampleComapnyInfoAMZN = {
    "Name": "Amazon.com Inc (Example)",
    "Symbol": "AMZN",
    "AssetType": "Common Stock",
    "CIK": "51143",
    "Exchange": "NYSE",
    "Currency": "USD",
    "Country": "USA",
    "Sector": "TECHNOLOGY",
    "Industry": "COMPUTER & OFFICE EQUIPMENT",
    "Address": "1 NEW ORCHARD ROAD, ARMONK, NY, US",
    "OfficialSite": "https://www.ibm.com",
    "FiscalYearEnd": "December",
    "LatestQuarter": "2024-12-31",
    "MarketCapitalization": "241591239000",
    "EBITDA": "13703000000",
    "PERatio": "40.63",
    "PEGRatio": "1.42",
    "BookValue": "29.49",
    "DividendPerShare": "6.67",
    "DividendYield": "0.0256",
    "EPS": "6.43",
    "RevenuePerShareTTM": "68.08",
    "ProfitMargin": "0.096",
    "OperatingMarginTTM": "0.219",
    "ReturnOnAssetsTTM": "0.0415",
    "ReturnOnEquityTTM": "0.241",
    "RevenueTTM": "62753001000",
    "GrossProfitTTM": "35550999000",
    "DilutedEPSTTM": "6.43",
    "QuarterlyEarningsGrowthYOY": "-0.128",
    "QuarterlyRevenueGrowthYOY": "0.01",
    "AnalystTargetPrice": "254.51",
    "AnalystRatingStrongBuy": "2",
    "AnalystRatingBuy": "5",
    "AnalystRatingHold": "9",
    "AnalystRatingSell": "2",
    "AnalystRatingStrongSell": "1",
    "TrailingPE": "40.63",
    "ForwardPE": "23.98",
    "PriceToSalesRatioTTM": "3.85",
    "PriceToBookRatio": "8.85",
    "EVToRevenue": "4.548",
    "EVToEBITDA": "23.44",
    "Beta": "0.754",
    "52WeekHigh": "263.96",
    "52WeekLow": "157.33",
    "50DayMovingAverage": "233.0",
    "200DayMovingAverage": "205.03",
    "SharesOutstanding": "924645000",
    "DividendDate": "2025-03-10",
    "ExDividendDate": "2025-02-10"
  }
