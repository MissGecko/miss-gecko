// DOM Elements
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-button');
const searchResults = document.querySelector('#search-results');
const cartButton = document.querySelector('#shopping-cart-button');
const shoppingCart = document.querySelector('.shopping-cart');
const closeCart = document.querySelector('.close-cart');
const geckoMenu = document.querySelector('#gecko-menu');
const navbarNav = document.querySelector('.navbar-nav');
const cartItems = document.querySelector('.cart-items');
const cartTotalPrice = document.querySelector('#cart-total-price');
const checkoutButton = document.querySelector('#checkout-button');

// Product Data
const products = [
  {
    id: 1,
    name: "SUNGLOW FULL CT - MIS 39",
    price: 500000,
    originalPrice: 650000,
    image: "img/products/1.jpg",
  },
  {
    id: 2,
    name: "WY MACKSNOW ENIGMA - MIS 51",
    price: 1000000,
    originalPrice: 1200000,
    image: "img/products/2.jpg",
  },
  {
    id: 3,
    name: "WY MACKSNOW TREMPER - MIS 48",
    price: 800000,
    originalPrice: 1000000,
    image: "img/products/3.jpg",
  }
];

// Cart State
let cart = [];

// Search Functionality
searchButton.onclick = (e) => {
  e.preventDefault();
  searchForm.classList.toggle('active');
  searchBox.focus();
};

searchBox.onkeyup = () => {
  const searchTerm = searchBox.value.toLowerCase();
  if (searchTerm.length > 0) {
    searchResults.classList.add('active');
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredProducts);
  } else {
    searchResults.classList.remove('active');
  }
};

function displaySearchResults(results) {
  searchResults.innerHTML = results.map(product => `
    <div class="search-result-item">
      <img src="${product.image}" alt="${product.name}">
      <div class="search-result-info">
        <h4>${product.name}</h4>
        <p>IDR ${product.price.toLocaleString()}</p>
      </div>
    </div>
  `).join('');
}

// Shopping Cart Functionality
cartButton.onclick = (e) => {
  e.preventDefault();
  shoppingCart.classList.add('active');
};

closeCart.onclick = (e) => {
  e.preventDefault();
  shoppingCart.classList.remove('active');
};

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCartDisplay();
  showNotification('Produk berhasil ditambahkan ke keranjang!');
}

function updateCartDisplay() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-detail">
        <h4>${item.name}</h4>
        <div class="cart-item-price">IDR ${item.price.toLocaleString()}</div>
        <div class="cart-item-quantity">
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">
        <i data-feather="trash-2"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalPrice.textContent = `IDR ${total.toLocaleString()}`;

  // Refresh Feather icons
  feather.replace();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartDisplay();
    }
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
  showNotification('Produk dihapus dari keranjang');
}

// Checkout Function
checkoutButton.onclick = () => {
  if (cart.length === 0) {
    showNotification('Keranjang belanja masih kosong!');
    return;
  }

  const message = `*Order Detail*\n\n${cart.map(item => 
    `${item.name}\nQuantity: ${item.quantity}\nHarga: IDR ${(item.price * item.quantity).toLocaleString()}`
  ).join('\n\n')}\n\nTotal: IDR ${cartTotalPrice.textContent}`;

  const encodedMessage = encodeURIComponent(message);
  
  // Buka WhatsApp dalam tab baru
  window.open(`https://wa.me/628816896408?text=${encodedMessage}`, '_blank');
  
  // Kosongkan keranjang
  cart = [];
  
  // Update tampilan keranjang
  updateCartDisplay();
  
  // Tutup modal keranjang
  shoppingCart.classList.remove('active');
  
  // Tampilkan notifikasi
  showNotification('Pesanan berhasil dikirim! Keranjang telah dikosongkan');
};

// Notification System
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

// Modal Box Functionality
const itemDetailButtons = document.querySelectorAll('.item-detail-button');
const modals = document.querySelectorAll('.modal');
const closeIcons = document.querySelectorAll('.close-icon');

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    const modalId = btn.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
  };
});

closeIcons.forEach((icon) => {
  icon.onclick = (e) => {
    e.preventDefault();
    const modal = icon.closest('.modal');
    modal.style.display = 'none';
  };
});

// Contact Form Functionality
const contactForm = document.getElementById('contactForm');
const confirmationModal = document.getElementById('confirmationModal');
const messagePreview = document.getElementById('messagePreview');
const sendButton = document.getElementById('sendButton');
const cancelButton = document.getElementById('cancelButton');

function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

function handleSubmit(event) {
  event.preventDefault();
  
  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const noHP = document.getElementById('noHP').value;
  
  const message = 
`*Data Pengunjung*
Nama: ${nama}
Email: ${email}
No HP: ${noHP}

Halo, saya tertarik dengan produk Anda dan ingin informasi lebih lanjut.`;

  messagePreview.textContent = message;
  confirmationModal.style.display = 'block';
  
  sendButton.onclick = () => {
    const formattedPhone = formatPhoneNumber(noHP);
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/628816896408?text=${encodedMessage}`, '_blank');
    confirmationModal.style.display = 'none';
    contactForm.reset();
  };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productCard = button.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      addToCart(productId);
    });
  });

  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
  }

  // Phone number validation
  const phoneInput = document.getElementById('noHP');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }
});

// Click Outside Handlers
document.addEventListener('click', (e) => {
  // Close search when clicking outside
  if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
    searchResults.classList.remove('active');
  }

  // Close gecko menu when clicking outside
  if (!geckoMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }

  // Close cart when clicking outside
  if (!cartButton.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }

  // Close modals when clicking outside
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// gecko menu toggle
geckoMenu.onclick = (e) => {
  e.preventDefault();
  navbarNav.classList.toggle('active');
};

// Product details untuk Buy Now
const productDetails = {
  1: {
    name: "SUNGLOW FULL CT - MIS 39",
    morph: "SUNGLOW FULL CT",
    dam: "DREAMSICKLE",
    sire: "WHITE AND YELLOW RAPTOR",
    dob: "9/8/2024",
    sex: "FEMALE",
    price: 500000
  },
  2: {
    name: "WY MACKSNOW ENIGMA - MIS 51",
    morph: "WHITE AND YELLOW MACKSNOW ENIGMA",
    dam: "SUPER SNOW",
    sire: "ENIGMA",
    dob: "15/8/2024",
    sex: "MALE",
    price: 1000000
  },
  3: {
    name: "WY MACKSNOW TREMPER - MIS 48",
    morph: "WHITE AND YELLOW MACKSNOW TREMPER HET ECLIPSE",
    dam: "MACKSNOW",
    sire: "TREMPER ALBINO",
    dob: "12/8/2024",
    sex: "FEMALE",
    price: 800000
  }
};

// Handle Buy Now buttons
document.querySelectorAll('.buy-now-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const productId = this.getAttribute('data-product-id');
    const product = productDetails[productId];
    
    const message = `*Order Detail*\n
Nama Produk: ${product.name}
Morph: ${product.morph}
Dam: ${product.dam}
Sire: ${product.sire}
DOB: ${product.dob}
Sex: ${product.sex}
Harga: IDR ${product.price.toLocaleString()}

Saya ingin membeli produk ini. Mohon informasi lebih lanjut.`;

    const encodedMessage = encodeURIComponent(message);
    
    // Buka WhatsApp di tab baru
    window.open(`https://wa.me/628816896408?text=${encodedMessage}`, '_blank');
    
    // Tutup modal
    const modal = this.closest('.modal');
    modal.style.display = 'none';
    
    // Tampilkan notifikasi
    showNotification('Mengarahkan ke WhatsApp...');
  });
});

// Ambil elemen modal dan tombol
const closeIcon = confirmationModal.querySelector('.close-icon');

// Fungsi untuk menutup modal
function closeConfirmationModal() {
    confirmationModal.style.display = 'none';
    // Reset preview pesan
    document.getElementById('messagePreview').innerHTML = '';
}

// Event listener untuk tombol cancel
cancelButton.addEventListener('click', closeConfirmationModal);

// Event listener untuk tombol close (X) di pojok kanan atas
closeIcon.addEventListener('click', function(e) {
    e.preventDefault();
    closeConfirmationModal();
});

// Optional: Menutup modal ketika user mengklik area di luar modal
window.addEventListener('click', function(e) {
    if (e.target === confirmationModal) {
        closeConfirmationModal();
    }
});
