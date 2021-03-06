
$(document).ready(function() {

    getItems();

    $('#order_btn').on('click', function (e) {
        e.preventDefault();
        addItemsToOrder().then((id) => location.replace("/order/" + id));
    })
})
let checkFetch = 0;
async function getItems() {
    const response = await fetch("/api/cart")
    const cartItems = await response.json();

    if(cartItems.length > 0) {


        for(let i = 0; i < cartItems.length; i++) {
            let desc = await fetch("/api/discounts/" + cartItems[i].shop.id);
            cartItems[i].desc = await desc.json();
        }
    console.log(cartItems);
    }
    console.log(data);
    if(document.getElementById("cartItems")) {
        cartItems.forEach(cartItem=> insertCartItemRow(cartItem))
    }
}

/**
 *Отправляет товары из карзины и возвращает id созданого ордера
 * @returns {Promise<void>}
 */
async function addItemsToOrder() {
    const response = await fetch("/api/cart");
    if(response.ok) {
        let carts = await response.json();
        let items = new Array();
        for(let i = 0; i < carts.length; i++) {
            items.push(carts[i].item);
        }
        console.log(items);
        const orderResponse = await fetch("/api/order", {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'post',
            body: JSON.stringify(items)
        })
        if(orderResponse.ok) {
            let order = await orderResponse.json();
            return order.id;
        } else {
            alert("Ошибка при создании заказа")
        }
    }
}

let i = 0;
function insertCartItemRow(cartItem) {
    let ci = {
        id: cartItem.id,
        quantity: cartItem.quantity,
        item: cartItem.item,
        shop: cartItem.shop,
        user: cartItem.user,
        desc: cartItem.desc
    };
    i++;
    document.querySelector('#cartItems').insertAdjacentHTML('beforeend', `
    <div class="row rounded" id="cartItem${ci.id}" style="border: 1px solid" name="cartItemRow">
        <div class="col-2">
          <div class="mt-2"><h4>${i}</h4></div>
          <div><button type="submit" onclick="deleteCartItem(${ci.id}); collapseRow(${ci.id});" style="border: none"><img src="https://static.thenounproject.com/png/147529-200.png" class="img-fluid"
          width="25" height="25"/></button></div>
        </div>
        <div class="col-3">
          <img src="${ci.item.images[0]}" class="img-fluid" />
        </div>
        <div class="col-7" id="checkExists">
          <p id="itemName">${ci.item.name}</p>
          <p id="itemDescription">${ci.item.description}</p>
          <div class="col-3">
            <div>
              <label for="cartItemQuantity">Количество:</label>
              <input type="number" id="cartItemQuantity${ci.id}" value="${ci.quantity}" class="form-control" min="1">
              <button type="submit" class="btn btn-secondary btn-sm mt-2" id="changeQuantity" onclick=
              "sumForCartItem(${ci.id}, ${ci.item.price}); updateQuantity(${ci.id}); subtotalForCartItems();">Пересчитать сумму</button>
            </div>
          </div>
          <div name = "itemPrice">
            <span>X</span>
            <span id="itemPrice">${ci.item.price}</span>
            <p>Стоимость со скидкой: </p>
            <p>${ci.item.price - ci.desc.fixedDiscount}</p>
          </div>
          <div>
            <span>= </span>
            <h5><span id="itemTotalPrice${ci.id}" name="itemTotalPrice"></span></h5>
          </div>
        </div>
    </div> 
    <div class="row m-1">&nbsp;</div>
    `)
    sumForCartItem(ci.id, ci.item.price);
    subtotalForCartItems();
}

async function deleteCartItem(id) {
    let url = new URL("http://localhost:8888/api/cart/delete/"+id)

    const response = await fetch(url, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'DELETE'
    })
}

function collapseRow(id) {
    let idHTML = "cartItem"+id;
    document.getElementById(idHTML).remove();
}

async function updateQuantity(id) {

    let quantHTML = "cartItemQuantity"+id;
    let newQuant = document.getElementById(quantHTML).value;

    const response = await fetch("http://localhost:8888/api/cart/update/"+id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PATCH',
        body: JSON.stringify({
            id: id,
            quantity: newQuant,
        })
    })
}

function sumForCartItem(id, price) {
    let idHTML = "itemTotalPrice"+id;
    let quantHTML = "cartItemQuantity"+id;
    let newQuant = document.getElementById(quantHTML).value;
    let sum = newQuant * price;
    document.getElementById(idHTML).innerHTML = `<span>${sum}</span>`;
}

function subtotalForCartItems() {
    let result = 0;
    let elems = document.getElementsByName("itemTotalPrice");
    for (let j = 0; j < elems.length; j++) {
        let el = elems[j].innerText;
        result = result + parseFloat(el);
    }
    document.getElementById("itemSubtotal").innerHTML = `<span>${result}</span>`;
}