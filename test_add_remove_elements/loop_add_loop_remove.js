const {By,until,Builder} = require("selenium-webdriver");
require("chromedriver");

async function loopClick() {

  const driver = await new Builder().forBrowser('chrome').build();

  try {

    // Step 1: Navigate to the page
    await driver.get('https://the-internet.herokuapp.com/add_remove_elements/');

    // Step 2: Wait for the "Add Element" button to be visible
    const addButton = await driver.wait(
      until.elementIsVisible(driver.findElement(By.xpath('//div[@id="content"]/div[@class="example"]/button'))),
      5000  // Wait for 5 seconds
    );

    // Step 3: Loop to Click the "Add Element" button 10 Times
    for (let i = 0; i < 10; i++) {
            await addButton.click();
            console.log(`Clicked ${i + 1} time`);

            // Optional: Add a delay if needed
            await driver.sleep(1000); // Sleep for 1 second
        }
    
    // Now click all the 'Delete' buttons that appear after clicking 'Add Element'
    let deleteButtons = await driver.findElements(By.xpath('//div[@id="elements"]/button[@class="added-manually"]'));

    // Ensure there are delete buttons to click
    if (deleteButtons.length === 0) {
        throw new Error('No delete buttons found');
    }

    for (let i = 0; i < 10; i++) {
        const deleteButton = deleteButtons[i];
    
        // Step 4: Wait for the "Delete" button to appear (after clicking "Add Element")
        await driver.wait(until.elementIsVisible(deleteButton),5000);

        // Step 5: Assert that the "Delete" button is visible after adding an element
        const isDeleteButtonDisplayed = await deleteButton.isDisplayed();
        if (!isDeleteButtonDisplayed) {
            throw new Error('Delete button is not visible after adding element');
        }

        // Step 6: Click the "Delete" button to remove the element
        await deleteButton.click();
        console.log(`Clicked 'Delete' button ${i + 1}`);
    }

    // Step 7: Assert that the "Delete" button is no longer visible after clicking
    await driver.wait(
      until.stalenessOf(deleteButtons[0]),
      5000  // Wait for 5 seconds to ensure the button is removed
    );

    // Step 8: Verify that the button has been removed (i.e., the element no longer exists)
    try {
      await driver.findElement(By.xpath('//div[@id="elements"]/button[@class="added-manually"]'));
      throw new Error('Delete button still exists after removal');
    } catch (err) {
      if (err.name !== 'NoSuchElementError') {
        throw err; // Rethrow if the error isn't "NoSuchElementError"
      }
    }

    console.log('Test Passed: Element added and removed correctly');
  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    // Cleanup: Quit the WebDriver
    await driver.quit();
  }
}

// Run the test
loopClick();