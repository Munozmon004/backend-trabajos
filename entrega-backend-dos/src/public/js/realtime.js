const socket = io();
const form = document.getElementById('productForm');
const list = document.getElementById('productList');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    id: form.id.value,
    title: form.title.value
  };
  socket.emit('addProduct', data);
  form.reset();
});

socket.on('productList', products => {
  list.innerHTML = '';
  products.forEach(prod => {
    const li = document.createElement('li');
    li.innerHTML = `${prod.title} <button onclick="deleteProduct('${prod.id}')">Eliminar</button>`;
    list.appendChild(li);
  });
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}
