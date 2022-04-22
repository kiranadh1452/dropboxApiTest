class HomePage{

  constructor(){
    this.titleSelector = "//h1[@class='page-title']";
    this.componentSelector = "//div/ul[@id='menu']/li[5]/a";
    this.dropboxComponentSelector = "//div/ul[@id='menu']/li[5]/ul/li[3]/a";

  }

  async checkForHomePage(pageTitle){
    const headingLocator = await page.locator(this.titleSelector);
    const headingText = await headingLocator.innerText();
    
    if(headingText != pageTitle){
      throw new Error('Expected value ' + pageTitle + " but found "+headingText);
    }
  }

  async clickOnComponentsSection(){
    const componentBtnLocator = await page.locator(this.componentSelector);
    await componentBtnLocator.click();
  }

  async clickOnDropboxSection(){
    const dropboxOptionLocator = await page.locator(this.dropboxComponentSelector);
    await dropboxOptionLocator.click();
  }

}
module.exports = {HomePage};