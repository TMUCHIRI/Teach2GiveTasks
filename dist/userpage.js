"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let cart = [];
function fetchItem() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/commodities');
        if (!response.ok) {
            throw new Error('Error fetching commodities');
        }
        return yield response.json();
    });
}
function displayItem(items) {
    const itemsContainer = document.querySelector('#product-list');
    itemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemCont = document.createElement('div');
        itemCont.className = 'itemCont';
        itemCont.innerHTML = `
            <p>Item Number: ${item.itemNumber}</p>
            <p>Item Name: ${item.itemNames}</p>
            <p>Item Price: ${item.itemPrices}</p>
            <img src="${item.imageUrl}" alt="${item.itemNames}" />
            <button class="addToCartBtn" data-id="${item.id}">Add to Cart</button>
        `;
        itemsContainer.appendChild(itemCont);
    });
    document.querySelectorAll('.addToCartBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target;
            const id = target.dataset.id;
            const description = document.querySelector('.description');
            const item = items.find(i => i.id === id);
            if (item && !cart.find(c => c.id === id)) {
                cart.push(item);
                const success = document.createElement('div');
                success.className = 'success';
                success.innerHTML = 'Item added to cart';
                description.appendChild(success);
                setTimeout(() => {
                    description.removeChild(success);
                }, 3000);
                console.log('Item added to cart:', item);
            }
        });
    });
}
function searchItem(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/commodities');
        if (!response.ok) {
            throw new Error('Error fetching commodities');
        }
        const commodities = yield response.json();
        return commodities.filter((commodity) => commodity.itemNames.toLowerCase().includes(name.toLowerCase()));
    });
}
function createsearchForm() {
    const description = document.querySelector('.description');
    const forms = document.querySelectorAll('.searchForm');
    forms.forEach((form) => {
        description === null || description === void 0 ? void 0 : description.removeChild(form);
    });
    const searchForm = document.createElement('div');
    searchForm.className = 'searchForm';
    searchForm.innerHTML = `
        <input type="text" id="searchText" placeholder="Search Commodity Name">
        <button id="searchSubmit">Search</button>
    `;
    document.querySelector('.description').appendChild(searchForm);
    document.querySelector('#searchSubmit').addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        const searchText = document.querySelector('#searchText').value;
        if (searchText) {
            try {
                const items = yield searchItem(searchText);
                displayItem(items);
            }
            catch (error) {
                console.error('Error searching commodities:', error);
            }
        }
    }));
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const searchButton = document.querySelector('#search');
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        createsearchForm();
    });
    const cartButton = document.querySelector('#cart');
    cartButton.addEventListener('click', () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'cart.html';
    });
    try {
        const items = yield fetchItem();
        displayItem(items);
    }
    catch (error) {
        console.error('Error fetching commodities:', error);
    }
    const homeButton = document.querySelector('#home');
    homeButton.addEventListener('click', () => {
        window.location.href = 'landing.html';
    });
}));
