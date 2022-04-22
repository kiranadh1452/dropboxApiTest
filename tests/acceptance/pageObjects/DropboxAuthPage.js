class DropboxAuthPage{

  constructor(){
    this.tokenFieldSelector = "//div[@id='auth-code']/input";
    this.accessGrantSelector = "//button[@name='allow_access']";
    this.emailFieldSelector = "//div/input[@name='login_email']";
    this.passwordFieldSelector = "//div/input[@name='login_password']";
    this.loginButtonSelector = "//button[@class='login-button signin-button button-primary']";
    this.url = "https://www.dropbox.com/oauth2/authorize?client_id=qea2qg672mampkw&response_type=code";
  }

  async loginToDropboxAccount(pageInstance,email,password){
    await pageInstance.fill(this.emailFieldSelector,email);
    await pageInstance.fill(this.passwordFieldSelector,password);

    const loginButtonLocator = pageInstance.locator(this.loginButtonSelector);
    loginButtonLocator.click();
    // frequent acess may need you to fill up the captcha
  }

  async getToken(pageInstance){
    // waiting for the allow access button to be found
    await pageInstance.waitForSelector(this.accessGrantSelector,{
      timeout:100000
    });
    
    const accessGrantLocator = await pageInstance.locator(this.accessGrantSelector);
    await accessGrantLocator.click(); // acessing dropbox more often requires two click to verify as a human.
    await accessGrantLocator.click();

    //getting the token value for later use 
    const tokenFieldLocator = await pageInstance.locator(this.tokenFieldSelector);
    const token = await tokenFieldLocator.inputValue();
    return token;
  }

}
module.exports = {DropboxAuthPage};