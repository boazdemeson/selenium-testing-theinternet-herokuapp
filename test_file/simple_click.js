const {By,until,Builder} = require("selenium-webdriver");
require("chromedriver");

async function addButton(){
 
        const driver = await new Builder().forBrowser('chrome').build();
        
            try {
            //To fetch http://google.com from the browser with our code.
            await driver.get("https://the-internet.herokuapp.com/add_remove_elements/");

            await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="content"]/h3'))),10000);

            const button = await driver.findElement(By.xpath('//div[@id="content"]/div[@class="example"]/button'));
            await button.click();

            const element = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="elements"]/button[@class="added-manually"]'))),10000 );
            //console.log('Element is visible!', await element.getText());
            await element.click();
            }

            finally {
            await driver.sleep(3000);
            await driver.quit();
            }
 
}

addButton()