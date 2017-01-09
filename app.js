
class Product {
	constructor(name, pricePerBox, count, memo) {
		this.name = name;
		this.pricePerBox = pricePerBox;
		this.count = count;
		this.totalPrice = pricePerBox * count;
		this.memo = memo;
	}
}
let count = 0;
let totalPrice = 0;
function append() {
	count++;
	const newProduct = new Product(document.getElementById('name').value, document.getElementById('pricePerBox').value,
									document.getElementById('count').value, document.getElementById('memo').value);
	document.getElementById('name').value
		= document.getElementById('pricePerBox').value
		= document.getElementById('count').value
		= document.getElementById('memo').value
		= '';
	document.getElementById('productList')
			.insertAdjacentHTML('beforeend', `<tr id="product${count}">
												<td class="list-table__cell">
													${newProduct.name}
												</td>
												<td class="list-table__cell">
													${newProduct.pricePerBox}
												</td>
												<td class="list-table__cell">
													${newProduct.count}
												</td>
												<td class="list-table__cell">
													${newProduct.totalPrice}
												</td>
												<td class="list-table__cell">
													${newProduct.memo}
												</td>
												<td class="list-table__cell" onclick="deleteProduct(${count},${newProduct.totalPrice})">
													X
												</td>
											</tr>`);
	totalPrice += newProduct.totalPrice;
	document.getElementById('totalPrice').innerHTML = `總金額：${totalPrice}`;
}

function deleteProduct(number, priceToMinus) {
	const domToRemove = document.getElementById(`product${number}`);
	domToRemove.parentNode.removeChild(domToRemove);
	totalPrice -= priceToMinus;
	document.getElementById('totalPrice').innerHTML = `總金額：${totalPrice}`;
}
