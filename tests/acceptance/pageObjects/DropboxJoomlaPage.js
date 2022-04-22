class DropboxJoomlaPage{

  constructor(){
    this.headingSelector = "//h1[@class='page-title']";

    this.form = {
      tokenField: "//input[@id='jform_dropbox_secret']",
      folderNameSelector : "//input[@id='jform_folder']",
      saveAndCloseBtn: "//div[@id='toolbar-save']/button",
      formTitleSelector: "//h1[@class='page-title']/small",
      saveBtnSelector: "//div[@id='toolbar-apply']/button",
    };

    this.folderList = {
      latestFolderSelector: "//table/tbody/tr[last()]/td[3]",
      previewBtnSelector: "//table/tbody/tr[last()]/td[last()]/a",
      latestConnectionStatusSelector: "//table/tbody/tr[last()]/td[4]",
    };

    this.instanceViewer = {
      msgSelector : "//div[@class='dropbox_content']/h1",
    }

    this.createNewSelector = "//div[@id='toolbar-new']/button";
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

  async makeDropboxConnection(dropboxToken){
    // enter the token in `Dropbox code` field
    await page.fill(this.form.tokenField,dropboxToken);
    
    // save the changes
    const saveAndCloseBtn = await page.locator(this.form.saveAndCloseBtn);
    await saveAndCloseBtn.click();
  }

  async returnPreviewLink(joomlaHomePageLink){
    // among several folders of dropbox, getting the hold on the one we created just now
    const previewBtn = await page.locator(this.folderList.previewBtnSelector);
    let newLink = await previewBtn.getAttribute('href');

    /**
     * Site uses a relative url of format `../index.php?*`
     * So, removing the first two characters('..') and adding domain(stored in `joomlaHomePageLink` variable) ahead of them
     */
    newLink = newLink.slice(2);
    newLink = joomlaHomePageLink + newLink;

    return newLink;
  }

  async checkForCreatedFolder(folderName){
    const folderNameLocator = await page.locator(this.folderList.latestFolderSelector);
    const folderNameField = await folderNameLocator.innerText();

    if(folderNameField != folderName){
      return [false,folderNameField];
    }

    return [true,folderNameField];

  }

  async verifyDropboxFolder(message){
    const msgLocator = await page.locator(this.instanceViewer.msgSelector);
    const msg = await msgLocator.innerText();

    if(msg != message){
      return [false,msg];
    }

    return [true,msg];
  }

}
module.exports = {DropboxJoomlaPage};