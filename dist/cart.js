"use strict";
function displayCartItems(items) {
    const cartContainer = document.querySelector('#cart-items');
    cartContainer.innerHTML = '';
    items.forEach(item => {
        const itemCont = document.createElement('div');
        itemCont.className = 'itemCont';
        itemCont.innerHTML = `
            <p>Item Number: ${item.itemNumber}</p>
            <p>Item Name: ${item.itemNames}</p>
            <p>Item Price: ${item.itemPrices}</p>
            <img src="${item.imageUrl}" alt="${item.itemNames}" />
            <button class="removeFromCartBtn" data-id="${item.id}">Remove from Cart</button>
        `;
        cartContainer.appendChild(itemCont);
    });
    document.querySelectorAll('.removeFromCartBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target;
            const id = target.dataset.id;
            const index = items.findIndex(i => i.id === id);
            if (index !== -1) {
                items.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(items));
                displayCartItems(items);
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = localStorage.getItem('cart');
    const items = cartItems ? JSON.parse(cartItems) : [];
    displayCartItems(items);
    const checkoutButton = document.querySelector('#checkout');
    checkoutButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        const top = document.querySelector('.top');
        const checkout = document.createElement('div');
        checkout.className = 'checkout';
        checkout.innerHTML = `Checked Out Successfully`;
        top.appendChild(checkout);
        setTimeout(() => { top.removeChild(checkout); }, 3000);
        setTimeout(() => {
            window.location.href = 'userpage.html';
        }, 3000);
        // alert('Checked out successfully!');
        // window.location.href = 'userpage.html';
    });
});
