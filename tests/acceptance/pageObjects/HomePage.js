class HomePage{

  constructor(){
    this.titleSelector = "//h1[@class='page-title']";

  }

  async checkForHomePage(pageTitle){
    const headingLocator = await page.locator(this.titleSelector);
    const headingText = await headingLocator.innerText();
    
    if(headingText != pageTitle){
      throw new Error('Expected value ' + pageTitle + " but found "+headingText);
    }
  }

}
module.exports = {HomePage};