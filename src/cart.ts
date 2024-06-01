interface Commodity {
    id?: string;
    itemNumber: number;
    itemNames: string;
    itemPrices: number;
    imageUrl: string;
}

function displayCartItems(items: Commodity[]): void {
    const cartContainer = document.querySelector('#cart-items') as HTMLDivElement;
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
            const target = event.target as HTMLButtonElement;
            const id = target.dataset.id!;
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
    const items: Commodity[] = cartItems ? JSON.parse(cartItems) : [];

    displayCartItems(items);

    const checkoutButton = document.querySelector('#checkout') as HTMLButtonElement;
    checkoutButton.addEventListener('click', () => {
        if (items.length === 0) {
            const top = document.querySelector('.top') as HTMLDivElement;
            const checkout = document.createElement('div');
            checkout.className = 'checkout1';
            checkout.innerHTML = `Add an Item To Checkout`;
            top.appendChild(checkout);
            setTimeout(() => {
                top.removeChild(checkout);
            }, 3000);
        } else {
            localStorage.removeItem('cart');
            const top = document.querySelector('.top') as HTMLDivElement;
            const checkout = document.createElement('div');
            checkout.className = 'checkout';
            checkout.innerHTML = `Check Out Successful`;
            top.appendChild(checkout);
            setTimeout(() => {
                top.removeChild(checkout);
            }, 3000);
            const totalPrice = items.reduce((total, item) => total + item.itemPrices, 0);
            localStorage.setItem('totalPrice', totalPrice.toFixed(2));
            localStorage.removeItem('cart');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 3000);
        }
    });

    const userPage = document.querySelector('#back') as HTMLElement;
    userPage.addEventListener('click', () => {
        window.location.href = 'userpage.html';
    });
});
