document.addEventListener('DOMContentLoaded', () => {
    const totalPrice = localStorage.getItem('totalPrice');
    const totalPriceElement = document.querySelector('#total-price') as HTMLSpanElement;

    if (totalPrice) {
        totalPriceElement.textContent = `Ksh ${totalPrice}`;
    } else {
        totalPriceElement.textContent = 'No items checked out';
    }

    const backToHomeButton = document.querySelector('#back-to-home') as HTMLButtonElement;
    backToHomeButton.addEventListener('click', () => {
        window.location.href = 'userpage.html';
    });
});
