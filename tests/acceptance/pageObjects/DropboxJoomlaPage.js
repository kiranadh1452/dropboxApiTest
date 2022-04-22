class DropboxJoomlaPage{

  constructor(){
    this.headingSelector = "//h1[@class='page-title']";
    this.createNewSelector = "//div[@id='toolbar-new']/button";
    this.form = {
      formTitleSelector: "//h1[@class='page-title']/small",
      folderNameSelector : "//input[@id='jform_folder']",
      saveBtnSelector: "//div[@id='toolbar-apply']/button",
    };
  }

  async checkForDropboxHeader(heading){
    const headingLocator = await page.locator(this.headingSelector);

    const headingText = await headingLocator.innerText();
    
    if(headingText != heading){
      throw new Error('Expected value ' + pageTitle + " but found "+headingText);
    }
  }

  async clickOnCreateNew(){
    const newdropboxBtnLocator = await page.locator(this.createNewSelector);
    await newdropboxBtnLocator.click();

    const formTitleLocator = await page.locator(this.form.formTitleSelector);
    await expect(formTitleLocator).toBeVisible();
  }

  async fillupFolderName(folderName){
    await page.fill(this.form.folderNameSelector, folderName);
  }

  async clickOnSaveBtn(){
    const saveBtnLocator = page.locator(this.form.saveBtnSelector);
    await saveBtnLocator.click();
  }

}
module.exports = {DropboxJoomlaPage};