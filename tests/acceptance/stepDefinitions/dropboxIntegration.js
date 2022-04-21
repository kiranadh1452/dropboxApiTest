const {Given, When, Then, And, But } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const joomlaHome = 'http://joomla.test';

let dropboxSignInPage, token, folderName, newLink;

/**
 * checkDropbox.feature
 */

/**
 * Enter username, password and click on login button
 */
Given('the user has entered username {string} and password {string}', async function (username, password) {

  const unameSelector = "//input[@id='mod-login-username']";
  await page.fill(unameSelector, username);

  const passwordSelector = "//input[@id='mod-login-password']";
  await page.fill(passwordSelector, password);

  const loginBtnLocator = await page.locator("//button[@class='btn btn-primary btn-block btn-large login-button']");
  await loginBtnLocator.click();
});

/**
 * Click on `components`
 */
Given('the user has clicked on components', async function () {
  const componentBtn = await page.locator("//div/ul[@id='menu']/li[5]/a");
  await componentBtn.click();

  const menuLocator = await page.locator("//div/ul[@id='menu']/li[5]/ul/li[3]/a");
  await menuLocator.click();

});

/**
 * Dropbox option should be visible
 */
Given('the user has seen {string} heading', async function (pageTitle) {
  const headingLocator = await page.locator("//h1[@class='page-title']");

  const headingText = await headingLocator.innerText();
  
  if(headingText != pageTitle){
    throw new Error('Expected value ' + pageTitle + " but found "+headingText);
  }
});


When('the user creates a new dropbox folder as {string}', async function (folderName) {
  const newdropboxBtn = await page.locator("//div[@id='toolbar-new']/button");
  await newdropboxBtn.click();

  const folderNameField = await page.locator("//input[@id='jform_folder']");
  await page.fill("//input[@id='jform_folder']", folderName);
});

/**
 * save dropbox, then open a new page(dropbox authorization page) to setup connection
 */
When('the user saves and connects to dropbox', async function () {
  const saveBtn = await page.locator("//div[@id='toolbar-apply']/button");
  await saveBtn.click();

  //creating a new page to perform authorization from dropbox side
  dropboxSignInPage = await context.newPage();
  await dropboxSignInPage.goto('https://www.dropbox.com/oauth2/authorize?client_id=qea2qg672mampkw&response_type=code');
});

/**
 * login to dropbox and grant access
 */
When('the user enters email {string} and password {string}', async function(email,password){
  //logging in to dropbox
  await dropboxSignInPage.fill("//div/input[@name='login_email']",email);
  await dropboxSignInPage.fill("//div/input[@name='login_password']",password);
  await dropboxSignInPage.locator("//button[@class='login-button signin-button button-primary']").click();


  // granting access
  const accessGrantSelector = "//button[@name='allow_access']";

  await dropboxSignInPage.waitForSelector(accessGrantSelector,{
    timeout:100000
  });
  
  const accessGrantLocator = await dropboxSignInPage.locator(accessGrantSelector);
  await accessGrantLocator.click();
  await accessGrantLocator.click(); // due to some issues it is requiring click two times

  //getting the token value for later use 
  const tokenField = await dropboxSignInPage.locator("//div[@id='auth-code']/input");
  token = await tokenField.inputValue();
  
  await dropboxSignInPage.close();
});

// Enter the token received from dropbox and save it
When('the user enters the received token in Dropbox Code and saves', async function(){
  // enter the token in `Dropbox code` field
  await page.fill("//input[@id='jform_dropbox_secret']",token);
  
  // save the changes
  const saveBtn = await page.locator("//div[@id='toolbar-save']/button");
  await saveBtn.click();

  // among several instances of dropbox, getting the hold on the one we created just now
  const previewBtn = await page.locator("//table/tbody/tr[last()]/td[last()]/a");
  newLink = await previewBtn.getAttribute('href');

  /**
   * Site uses a relative url of format `../*.php?*`
   * So, removing the first two characters('..') and adding domain(stored in `joomlaHome` variable) ahead of them
   */
  newLink = newLink.slice(2);
  newLink = joomlaHome+newLink;

});

Then('the user should see {string} in folder name', async function(folderName){
  const folderNameLocator = await page.locator("//table/tbody/tr[last()]/td[3]");
  const folderNameField = await folderNameLocator.innerText();

  if(folderNameField != folderName){
    throw new Error(`Expected: ${folderName}\nObtained: ${folderNameField}`)
  }

  await page.goto(newLink);
});

Then('the user should see {string} message', async function(message){
  const msgLocator = await page.locator("//div[@class='dropbox_content']/h1");
  const msg = await msgLocator.innerText();

  console.log(msg);

  if(msg != message){
    throw new Error(`Expected: '${message}'\nObtained: '${msg}'`);
  }
});


