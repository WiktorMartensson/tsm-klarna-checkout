import { getProducts, getProduct } from './services/api.js';
import { createOrder } from './services/klarna.js';

import express from 'express';

const app = express();
import { config } from 'dotenv';
config();

app.get('/', async (req, res) => {
    const products = await getProducts();
    console.log(products);
	const markup = products.map((p)=> `<a style="display: block; color: black; border: solid 2px black; margin: 20px; padding: 10px;" href="/products/${p.id}" >${p.title} - ${p.price} kr</a>`).join(' ');
	res.send(markup);
});

app.get('/products/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const product = await getProduct(id)
        const klarnaResponse = await createOrder(product);
        const markup = klarnaResponse.html_snippet;
        res.send(markup);
    } catch(error) {
        res.send(error.message);
    }
});

app.get('/confirmation', async (req, res) => {
    const markup = `<h1> Hello Checkout </h1>`;
	res.send(markup);
});

app.listen(process.env.PORT);
