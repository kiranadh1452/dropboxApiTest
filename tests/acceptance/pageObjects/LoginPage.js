class LoginPage{

  constructor(){
    this.loginLogoSelector = "//div[@id='element-box']/img";
    this.unameSelector = "//input[@id='mod-login-username']";
    this.passwordSelector = "//input[@id='mod-login-password']";
    this.loginButtonSelector = "//button[@class='btn btn-primary btn-block btn-large login-button']";
    this.msgSelector = "//div/div[@class='alert-message']";
  }

  async browseToLoginPage(){
    await page.goto('http://localhost/administrator');

    const logoLocator = page.locator(this.loginLogoSelector);
    await expect(logoLocator).toBeVisible();
  }

  async login(username,password){
    await page.fill(this.unameSelector, username);
    await page.fill(this.passwordSelector, password);

    const loginBtnLocator = await page.locator(this.loginButtonSelector);
    await loginBtnLocator.click();
  }

  async displayLoginMsg(errorMsg){
    const msgLocator = await page.locator(this.msgSelector);

    const msgText = await msgLocator.innerText();

    if(msgText != errorMsg){
      throw new Error('Expected value ' + errorMsg + " but found "+ msgText);
    }

  }

}
module.exports = {LoginPage};