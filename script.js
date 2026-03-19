const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const horarioWarn = document.getElementById("horario-warn");
const finalizarWarn = document.getElementById("finalizar-warn");

const cart = [];

cartBtn.addEventListener("click", () => {
  updateCartModal();

  horarioWarn.classList.add("hidden");
  finalizarWarn.classList.add("hidden");
  addressWarn.classList.add("hidden");
  addressInput.classList.remove("border-red-500");

  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
});

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
  }
});

closeModalBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
});

menu.addEventListener("click", (e) => {
  let parentButton = e.target.closest("button");

  if (parentButton) {
    parentButton.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(0.92)", opacity: 0.8 },
        { transform: "scale(1)", opacity: 1 },
      ],
      {
        duration: 180,
        easing: "ease",
      },
    );

    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function animateCartButton() {
  cartBtn.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" },
    ],
    {
      duration: 250,
      easing: "ease",
    },
  );

  cartCounter.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" },
    ],
    {
      duration: 250,
      easing: "ease",
    },
  );
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  animateCartButton();
  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col",
    );

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <div>
          <button class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 cursor-pointer remove-btn" data-name="${item.name}">
            Remover
          </button>
        </div>
      </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.reduce((acc, item) => acc + item.quantity, 0);
}

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const name = e.target.getAttribute("data-name");

    removeItemFromCart(name);
  }
});

function removeItemFromCart(name) {
  const itemIndex = cart.findIndex((item) => item.name === name);
  if (itemIndex !== -1) {
    const item = cart[itemIndex];
    item.quantity -= 1;
    if (item.quantity === 0) {
      cart.splice(itemIndex, 1);
    }
    updateCartModal();
    return;
  }
}

addressInput.addEventListener("input", () => {
  let inputValue = addressInput.value.trim();

  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

checkoutBtn.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();

  horarioWarn.classList.add("hidden");
  finalizarWarn.classList.add("hidden");
  addressWarn.classList.add("hidden");
  addressInput.classList.remove("border-red-500");

  if (!isOpen) {
    Toastify({
      text: "Ops! Estamos fechados no momento. Nosso horário de funcionamento é das 18h às 22h.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#dc2626",
      },
    }).showToast();
  }

  if (cart.length === 0) {
    finalizarWarn.classList.remove("hidden");
    return;
  }

  if (addressInput.value.trim() === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return `${item.name} | Qtd: ${item.quantity} | R$ ${item.price.toFixed(2)}`;
    })
    .join("\n");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const message = `
*Pedido da Hamburgueria do Nicholas*

*Itens do pedido:*
${cartItems}

*Endereço:*
${addressInput.value.trim()}

*Total:*
R$ ${total.toFixed(2)}
`;

  const phone = "5511899999999";

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank",
  );

  cart = [];
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();

  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-500");
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
}
