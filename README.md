# Production Selection PoC Console App

A quick and dirty JavaScript console app that uses a JSON listing of products to prompt the user for a selection, iterating through all child nodes and tallying the resulting price

## Data (JSON)

The product/menu hierarchy is in [/data/options.json](https://github.com/PhilomathJ/product-selector/blob/main/data/options.json)

## Code (JavaScript)

The entrypoint is [src/index.js](https://github.com/PhilomathJ/product-selector/blob/main/src/index.js)

### Overview

#### `main()`

Calls `loadModel()` to read the JSON file with the menu/products

Then calls `displayMenu()` to start the entire product selection process

Then calls `displayResults()` to print a summary of the results

#### `loadModel()`

Reads the JSON file

#### `displayMenu()`

Iteratively calls `promptUser()` as long as subsequent levals of the hierarchy exist

Keeps track of each selection in the `allSelections` array

#### `promptUser()`

Prints all menu/product items and takes the selection input

#### `validSelection()`

Validates the user input

#### `formatCurrency()`

Converts a number aor string representation of a number to USD as string

#### `displayResults()`

Prints the desired results of all selections

Currently displays:

- Table of every selection made
- Calls out the final selection details
- Count of selections made
- Grand total price of all selections
- Displays a sample link that could point to a summary page

Screenshot:
![output-screenshot][output-screenshot]

#### `createLink()`

Creates the URL with all selected IDs as query parameters

[output-screenshot]: https://github.com/PhilomathJ/product-selector/blob/main/resources/sample-output.png
