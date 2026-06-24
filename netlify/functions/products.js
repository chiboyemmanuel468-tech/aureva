// netlify/functions/products.js
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;   // comes from Netlify
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;       // comes from Netlify
const TABLE_NAME = 'Products';

exports.handler = async function () {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch products' }),
      };
    }

    const data = await response.json();
    const products = data.records.map((record) => ({
      name: record.fields.Name || '',
      description: record.fields.Description || '',
      price: record.fields.Price || '',
      image: record.fields.Image || '',
      link: record.fields.Link || '',
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
