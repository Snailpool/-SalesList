const products = require('../../config/products.json');
class Product {
	constructor(name, pricePerBox, count, memo) {
		this.name = name;
		this.pricePerBox = pricePerBox;
		this.count = count;
		this.totalPrice = pricePerBox * count;
		this.count = 0;
		this.memo = memo;
	}
}
// 將預設公司列表組成 options
function getTemplate() {
	let productHtml = '';
	for (let i = 0; i < products.length; i++) {
		productHtml += `<option value=${products[i].name}>`;
	}
	return productHtml;
}

// 選好公司後顯示其他欄位值
function setValue(input) {

}

function add(table) {
	this.totalCount++;
	let localCount = this.totalCount;
	const newProduct = new Product(this.name.value, this.pricePerBox.value,
									this.count.value, this.memo.value);
	this.name.value
		= this.pricePerBox.value
		= this.count.value
		= this.memo.value
		= '';
	this.productList.insertAdjacentHTML('beforeend', `<tr id="product${this.count}">
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
												<td style="width: 300px;" class="list-table__cell  list-table__cell--long">
													${newProduct.memo}
												</td>
												<td  class="list-table__cell  edit-cell btn--delete" id="deletebtn${this.count}" >
													刪除
												</td>
											</tr>`);
	document.getElementById(`deletebtn${this.count}`).addEventListener('click', ()=> this.deleteProduct(localCount, newProduct.totalPrice));
	this.totalPrice += newProduct.totalPrice;
	this.totalPrice.innerHTML = `總金額：${this.totalPrice}`;

}
module.exports.product = {
	getTemplate, setValue, add
};