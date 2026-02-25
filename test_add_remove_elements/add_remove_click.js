const {By,until,Builder} = require("selenium-webdriver");
require("chromedriver");

async function testAddRemoveElements() {
  // Setup WebDriver and navigate to the page
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Step 1: Navigate to the page
    await driver.get('https://the-internet.herokuapp.com/add_remove_elements/');

    // Step 2: Wait for the "Add Element" button to be visible
    const addButton = await driver.wait(
      until.elementIsVisible(driver.findElement(By.xpath('//button[text()="Add Element"]'))),
      5000  // Wait for 5 seconds
    );

    // Step 3: Click the "Add Element" button
    await addButton.click();

    // Step 4: Wait for the "Delete" button to appear (after clicking "Add Element")
    const deleteButton = await driver.wait(
      until.elementIsVisible(driver.findElement(By.xpath('//button[text()="Delete"]'))),
      5000  // Wait for 5 seconds
    );

    // Step 5: Assert that the "Delete" button is visible after adding an element
    const isDeleteButtonDisplayed = await deleteButton.isDisplayed();
    if (!isDeleteButtonDisplayed) {
      throw new Error('Delete button is not visible after adding element');
    }

    // Step 6: Click the "Delete" button to remove the element
    await deleteButton.click();

    // Step 7: Assert that the "Delete" button is no longer visible after clicking
    await driver.wait(
      until.stalenessOf(deleteButton),
      5000  // Wait for 5 seconds to ensure the button is removed
    );

    // Step 8: Verify that the button has been removed (i.e., the element no longer exists)
    try {
      await driver.findElement(By.xpath('//button[text()="Delete"]'));
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
testAddRemoveElements();