// API documentation: https://www.thecocktaildb.com/api.php

import path from 'path';
import fs from 'fs/promises';


const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

// Add helper functions as needed here

export async function main() {
  if (process.argv.length < 3) {
    console.error('Please provide a cocktail name as a command line argument.');
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `./output/${cocktailName}.md`);

  try {
    // 1. Fetch data from the API at the given URL
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const jsonData = await response.json();

    if (!jsonData.drinks) throw new Error('No cocktails found with that name.');
    const drinks = jsonData.drinks;

    // 2. Generate markdown content to match the examples
    let markdown = '# Cocktail Recipes\n\n';

    drinks.forEach(drink => {
      markdown += `## ${drink.strDrink}\n`;
      markdown += `![${drink.strDrink}](${drink.strDrinkThumb}/medium)\n`;
      markdown += `**Category**: ${drink.strCategory}\n`;
      markdown += `**Alcoholic**: ${drink.strAlcoholic === 'Alcoholic' ? 'Yes' : 'No'}\n\n`;
      markdown += `### Ingredients\n`;
      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
          markdown += `- ${measure ? measure : ''}${ingredient}\n`;
        }
      }
      markdown += `\n### Instructions\n`;
      markdown += `${drink.strInstructions}\n\n`;
      markdown += `Serve in: ${drink.strGlass}\n\n`;
    });

    
    // 3. Write the generated content to a markdown file as given by outPath
    await fs.writeFile(outPath, markdown, 'utf-8');
    console.log(`Markdown file created at ${outPath}`);

  } catch (error) {
    // 4. Handle errors
     console.error(error.message);
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
  

