// This file serves as the API endpoint for the web scraper.
// It will be a Vercel Serverless Function, so all the scraping logic
// will run on the server, not in the user's browser.

// Import necessary libraries for Playwright and Vercel.
import { chromium } from '@sparticuz/chromium';
import playwright from 'playwright-core';
import { NextResponse, type NextRequest } from 'next/server';

// This is the main handler function for GET requests.
// It will receive the search query from the user.
export async function GET(request: NextRequest) {
  try {
    // Extract the 'q' (query) parameter from the URL.
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q');

    // If no keyword is provided, return a 400 Bad Request error.
    if (!keyword) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing search query.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Launch a headless browser instance.
    const browser = await playwright.chromium.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    // Create a new browser context and a new page within it.
    const context = await browser.newContext();
    const page = await context.newPage();

    // Array to store all the scraped product data.
    let allProducts: any[] = [];

    // --- Scraping Logic for Tokopedia ---
    try {
      // Navigate to Tokopedia's search results page.
      await page.goto(`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(keyword)}`, {
        waitUntil: 'networkidle'
      });
      console.log('Navigated to Tokopedia');

      // Wait for product elements to load.
      await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

      // Scrape data from each product card.
      const tokopediaProducts = await page.$$eval('[data-testid="product-card"]', (cards) => {
        return cards.map((card) => {
          const titleElement = card.querySelector('[data-testid="product-card-name"]');
          const priceElement = card.querySelector('[data-testid="product-card-price"]');
          const sellerElement = card.querySelector('[data-testid="shop-name"]');
          const linkElement = card.querySelector('[data-testid="product-card-url"]');
          const imageUrlElement = card.querySelector('img');

          return {
            source: 'Tokopedia',
            name: titleElement?.textContent?.trim() || 'N/A',
            price: priceElement?.textContent ? parseFloat(priceElement.textContent.replace(/[^0-9]/g, '')) : 0,
            seller: sellerElement?.textContent?.trim() || 'N/A',
            url: linkElement?.getAttribute('href') || '#',
            imageUrl: imageUrlElement?.getAttribute('src') || 'https://placehold.co/150x150',
            timestamp: new Date().getTime(),
          };
        });
      });
      allProducts = allProducts.concat(tokopediaProducts);
      console.log(`Found ${tokopediaProducts.length} products from Tokopedia.`);
    } catch (error) {
      console.error('Failed to scrape Tokopedia:', error);
    }

    // --- Scraping Logic for Shopee ---
    try {
      // Navigate to Shopee's search results page.
      await page.goto(`https://shopee.co.id/search?keyword=${encodeURIComponent(keyword)}`, {
        waitUntil: 'networkidle'
      });
      console.log('Navigated to Shopee');

      // Wait for product elements to load.
      await page.waitForSelector('.shopee-search-item-result__item', { timeout: 10000 });

      // Scrape data from each product item.
      const shopeeProducts = await page.$$eval('.shopee-search-item-result__item', (items) => {
        return items.map((item) => {
          const nameElement = item.querySelector('[data-sqm="item_name"] > div:nth-of-type(2)');
          const priceElement = item.querySelector('.shopee-price-part');
          const sellerElement = item.querySelector('.shopee-search-item-result__shop-name-wrapper');
          const linkElement = item.querySelector('a');
          const imageUrlElement = item.querySelector('img');

          return {
            source: 'Shopee',
            name: nameElement?.textContent?.trim() || 'N/A',
            price: priceElement?.textContent ? parseFloat(priceElement.textContent.replace(/[^0-9]/g, '')) : 0,
            seller: sellerElement?.textContent?.trim() || 'N/A',
            url: linkElement?.getAttribute('href') ? `https://shopee.co.id${linkElement.getAttribute('href')}` : '#',
            imageUrl: imageUrlElement?.getAttribute('src') || 'https://placehold.co/150x150',
            timestamp: new Date().getTime(),
          };
        });
      });
      allProducts = allProducts.concat(shopeeProducts);
      console.log(`Found ${shopeeProducts.length} products from Shopee.`);
    } catch (error) {
      console.error('Failed to scrape Shopee:', error);
    }

    // Close the browser.
    await browser.close();

    // Sort products by price in ascending order.
    allProducts.sort((a, b) => a.price - b.price);

    // Return the combined and sorted product data.
    return NextResponse.json(allProducts);

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Enable dynamic rendering for Vercel.
export const dynamic = 'force-dynamic';
