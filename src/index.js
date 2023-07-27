import fs from 'fs';
import { createInterface } from 'readline';

await main();

/**
 * Top-level function
 * @returns {Promise<void>}
 */
async function main() {
  /** JSON file with the menu selection hierarchy */
  const pricingModel = './data/options.json';

  console.log('START');

  const model = loadModel(pricingModel);

  const selections = await displayMenu(model);

  if (!selections || selections.length == 0) {
    console.log('No selections made');
    return;
  }

  displayResults(selections);

  console.log('END');
}

/**
 * Loads the pricing model from file
 * @param {string} file JSON pricing model file
 * @returns (JSON) pricing model (or throws an error)
 */
function loadModel(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(data);
    return parsed;
  } catch (err) {
    throw new Error(`Error loading JSON model: ${err.message}`);
  }
}

/**
 *
 * @param {JSON} model entire product hierarchy
 * @returns {Object[]} Array of selected product objects
 */
async function displayMenu(model) {
  if (!model) {
    console.log('No menu to display');
    return;
  }
  if (!model['menu'].length) {
    console.log('No menu items to display');
    return;
  }

  // Array to hold all chosen selections
  let allSelections = [];
  // The most recently selected item
  let selectedItem = {};

  // Display menu header
  console.log('Menu');
  console.log('----');

  let menuLevel = model['menu'];

  while (menuLevel.length) {
    const selection = await promptUser(menuLevel);

    if (!selection || selection.toLowerCase() == 'q') {
      return allSelections;
    }

    // Grab the selected item
    if (validSelection(selection, menuLevel.length)) {
      selectedItem = menuLevel[Number(selection) - 1];

      console.log(
        `\nYou selected ${selectedItem.name} for ${formatCurrency(
          selectedItem.price
        )}\n`
      );

      // Push the selection to the selection array
      allSelections.push(selectedItem);
    } else continue;

    // Advance menu level to next tier if exists within with selected item
    if (selectedItem['children']) {
      menuLevel = selectedItem['children'];
    } else {
      menuLevel = [];
    }
  }
  return allSelections;
}

/**
 * Prompt the user with (sub)menu items determined by prior selection(s)
 * Track price of all selections and return the total
 * @param {JSON} model Selection hierarchy
 * @returns {Object} The selected item object
 */
async function promptUser(submodel) {
  // Setup readline interface
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Display all menu items at this level
  submodel.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} - ${formatCurrency(item.price)}`);
  });

  return new Promise((resolve) =>
    readline.question('Make a selection (q to quit): ', (chosen) => {
      readline.close();
      resolve(chosen);
    })
  );
}

/**
 * Validates chosen menu item
 * @param {*} selection
 * @returns {number} valid selection (or false)
 */
function validSelection(selection, max) {
  if (!selection) return false;
  if (isNaN(selection)) return false;
  if (Number(selection) < 1) return false;
  if (Number(selection) > max) return false;

  return Number(selection);
}

/**
 * Formats a numerical price as USD
 * @param {number | string} price
 * @returns {string} formatted price in USD
 */
function formatCurrency(price) {
  if (typeof price != 'string' && typeof price != 'number') return;

  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

/**
 * Handles all post-selection display
 * @param {Object[]} selections array of all chosen items
 * @returns {void}
 */
function displayResults(selections) {
  // Format all display prices as currency
  const formatted = selections.map((item) => {
    return {
      ...item,
      price: formatCurrency(item.price),
    };
  });

  console.log('\nAll selections:');
  console.table(formatted, ['id', 'name', 'description', 'price']);

  const totalPrice = selections.reduce((total, item) => {
    return total + item.price;
  }, 0);

  const finalSelection = selections[selections.length - 1];
  console.log(
    `The final selection made was ${finalSelection.name} for ${formatCurrency(
      finalSelection.price
    )}`
  );
  console.log(`Total selections: ${selections.length}`);
  console.log(`Final price: ${formatCurrency(totalPrice)}`);

  // Display URL for product summary page
  console.log(`\nProduct Summary Page: ${createLink(selections)}`);
}

/**
 * Creates a URL with the ID's of all chosen items
 * @param {Object[]} selections array of all chosen items
 * @returns {string} link to product page
 */
function createLink(selections) {
  if (!selections || selections.length == 0) return;

  const ids = selections.map((item) => item.id);
  return `"https://www.example.com/products?ids=${ids.join(',')}"`;
}
