const {Given, When, Then, And, But } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const {LoginPage} = require('../pageObjects/LoginPage.js');
const {HomePage} = require('../pageObjects/HomePage.js');

const loginPage = new LoginPage();
const homePage = new HomePage();

// login.feature
// Scenario: Login with valid credentials
Given('the user has browsed to login page', async function () {
  await loginPage.browseToLoginPage();
});


When('the user enters username {string} and password {string}', async function (username, password) {
  await loginPage.login(username,password);
});


Then('the user should see {string} heading', async function (pageTitle) {
  await homePage.checkForHomePage(pageTitle);
});


// Scenario: Login with invalid credentials
Then('the user should see {string} error message', async function (errorMsg) {
  await loginPage.displayLoginMsg(errorMsg);
});

