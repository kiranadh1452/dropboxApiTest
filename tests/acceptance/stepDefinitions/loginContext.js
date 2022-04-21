const {Given, When, Then, And, But } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// login.feature
// Scenario: Login with valid credentials
Given('the user has browsed to login page', async function () {
  await page.goto('http://localhost/administrator');
});


When('the user enters username {string} and password {string}', async function (username, password) {

  const unameSelector = "//input[@id='mod-login-username']"
  const unameLocator = await page.locator(unameSelector);
  await page.fill(unameSelector, username);

  const passwordSelector = "//input[@id='mod-login-password']"
  const passwordLocator = await page.locator(passwordSelector);
  await page.fill(passwordSelector, password);

  const loginBtnLocator = await page.locator("//button[@class='btn btn-primary btn-block btn-large login-button']");
  await loginBtnLocator.click();
});


Then('the user should see {string} heading', async function (pageTitle) {
  const headingLocator = await page.locator("//h1[@class='page-title']");

  const headingText = await headingLocator.innerText();
  
  if(headingText != pageTitle){
    throw new Error('Expected value ' + pageTitle + " but found "+headingText);
  }

});


// Scenario: Login with invalid credentials
Then('the user should see {string} error message', async function (errorMsg) {
  const msgLocator = await page.locator("//div/div[@class='alert-message']");

  const msgText = await msgLocator.innerText();

  if(msgText != errorMsg){
    throw new Error('Expected value ' + errorMsg + " but found "+ msgText);
  }
});

