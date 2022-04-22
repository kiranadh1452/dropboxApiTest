const {HomePage} = require('../pageObjects/HomePage.js');
const {LoginPage} = require('../pageObjects/LoginPage.js');
const {DropboxAuthPage} = require('../pageObjects/DropboxAuthPage.js');
const {DropboxJoomlaPage} = require('../pageObjects/DropboxJoomlaPage.js');
const {Given, When, Then, And, But } = require('@cucumber/cucumber');

const homePage = new HomePage();
const loginPage = new LoginPage();
const dropboxAuth = new DropboxAuthPage();
const dropboxJoomla = new DropboxJoomlaPage();

let dropboxSignInPage, token, newLink;
const joomlaHome = 'http://joomla.test';

/**
 * checkDropbox.feature
 */

/**
 * Enter username, password and click on login button
 */
Given('the user has entered username {string} and password {string}', async function (username, password) {
  await loginPage.login(username,password);
});

/**
 * Click on `components`
 */
Given('the user has clicked on components', async function () {
    await homePage.clickOnComponentsSection();
    await homePage.clickOnDropboxSection();
});

/**
 * This works for both Homepage and Dropbox Page as the title locator is same in both cases
 */
Given('the user has seen {string} heading in {string} page', async function (pageHeader, currLocation){

  if(currLocation=='Home'){
    await homePage.checkForHomePage(pageHeader);
  }

  else if(currLocation=='Dropbox'){
    await dropboxJoomla.checkForDropboxHeader(pageHeader);
  }

  else throw new Error(`There isn't any ${currLocation} page`);
});


When('the user creates a new dropbox folder as {string}', async function (folderName) {
  await dropboxJoomla.clickOnCreateNew();
  await dropboxJoomla.fillupFolderName(folderName);
});

/**
 * save dropbox, then open a new page(dropbox authorization page) to setup connection
 */
When('the user saves and connects to dropbox', async function () {
  await dropboxJoomla.clickOnSaveBtn();

  //creating a new page to perform authorization from dropbox side
  dropboxSignInPage = await context.newPage();
  await dropboxSignInPage.goto('https://www.dropbox.com/oauth2/authorize?client_id=qea2qg672mampkw&response_type=code');
});

/**
 * login to dropbox and grant access
 */
When('the user enters email {string} and password {string}', async function(email,password){
  //logging in to dropbox
  await dropboxAuth.loginToDropboxAccount(dropboxSignInPage,email,password);

  token = await dropboxAuth.getToken(dropboxSignInPage);
  
  await dropboxSignInPage.close();
});

// Enter the token received from dropbox and save it
When('the user enters the received token in Dropbox Code and saves', async function(){
  
  // fill up token received and make a connection
  await dropboxJoomla.makeDropboxConnection(token);

});

Then('the user should see {string} in folder name', async function(folderName){
  const isFolderCreated = await dropboxJoomla.checkForCreatedFolder(folderName);
  
  if(! isFolderCreated[0]){
    throw new Error(`Expected: ${folderName}\nObtained: ${isFolderCreated[1]}`);
  }

  // link to preview the above created dropbox instance in joomla
  newLink = await dropboxJoomla.returnPreviewLink(joomlaHome);
  console.log(newLink);
  await page.goto(newLink);
});

Then('the user should see {string} message', async function(message){
  const response = await dropboxJoomla.verifyDropboxFolder(message);

  if(! response[0]){
    throw new Error(`Expected: '${message}'\nObtained: '${response[1]}'`);
  }
});


