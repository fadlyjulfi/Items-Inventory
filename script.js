const form = document.getElementById("item-form");
const itemNameInput = document.getElementById("item-name");
const itemList = document.getElementById("item-list");

let items = JSON.parse(localStorage.getItem("items")) || [];

function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
  }

  function renderItems() {
    itemList.innerHTML = "";
      items.forEach((item, index) => {
          const li = document.createElement("li");
              li.innerHTML = `
                    <span>${item.name} (Stok: ${item.quantity})</span>
                          <div class="controls">
                                  <button onclick="changeQuantity(${index}, -1)">–</button>
                                          <button onclick="changeQuantity(${index}, 1)">+</button>
                                                </div>
                                                    `;
                                                        itemList.appendChild(li);
                                                          });
                                                          }

                                                          function changeQuantity(index, delta) {
                                                            items[index].quantity += delta;
                                                              if (items[index].quantity < 0) items[index].quantity = 0;
                                                                saveItems();
                                                                  renderItems();
                                                                  }

                                                                  form.addEventListener("submit", function (e) {
                                                                    e.preventDefault();
                                                                      const name = itemNameInput.value.trim();
                                                                        if (name) {
                                                                            items.push({ name, quantity: 0 });
                                                                                saveItems();
                                                                                    renderItems();
                                                                                        itemNameInput.value = "";
                                                                                          }
                                                                                          });

                                                                                          // Initial render
                                                                                          renderItems();
                                                                                          