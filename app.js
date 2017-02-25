const htmlDocx = require('html-docx-js');
const FileSaver = require('file-saver');
const fs = require('fs');
const cssPath = 'styles.css';
const customers = require('./config/customer.json');
const products = require('./config/products.json');

// return a Product object for product list.
class Product {
	constructor(name, pricePerBox, count, memo) {
		this.name = name;
		this.pricePerBox = pricePerBox;
		this.count = count;
		this.totalPrice = pricePerBox * count;
		this.memo = memo;
	}
}
// handle this app
class SalesForm {

	// bind page events
	constructor() {
		this.count = 0;
		this.totalPrice = 0;
		this.cacheDOM();
		this.bindEvent();
		this.ready();
	}
	cacheDOM() {
		this.customerName = document.getElementById('customerName');
		this.customerTable = document.getElementById('customerTable');
		this.addCustomerBtn = document.getElementById('addCustomerBtn');
		this.addProductBtn = document.getElementById('addProductBtn');
		this.saveFilebtn = document.getElementById('saveFilebtn');
		this.customerList = document.getElementById('customerList');
		this.productList = document.getElementById('productList');
		this.nameList = document.getElementById('nameList');
		this.address = document.getElementById('address');
		this.phone = document.getElementById('phone');
		this.fax = document.getElementById('fax');
		this.name =	document.getElementById('name');
		this.pricePerBox = document.getElementById('pricePerBox');
		this.ecount = document.getElementById('count');
		this.memo =	document.getElementById('memo');
		this.etotalPrice = document.getElementById('totalPrice');

	}
	bindEvent(){
		this.customerName.addEventListener('change', (evt) => this.bindCustomerInfo(evt.target));
		this.addCustomerBtn.addEventListener('click', () => this.editCustomer());
		this.addProductBtn.addEventListener('click', () => this.appendProduct());
		this.saveFilebtn.addEventListener('click', () => this.saveFile());
	}
	// add customer list, product list.
	ready() {
		let customerHtml = '';
		let productHtml = '';
		for (let i = 0; i < customers.length; i++) {
			customerHtml += `<option data-id=${i} value=${customers[i].name}>`;
		}
		for (let i = 0; i < products.length; i++) {
			productHtml += `<option value=${products[i].name}>`;
		}
		this.customerList.innerHTML = customerHtml;
		this.nameList.innerHTML = productHtml;
	}
	// when user choose a custoner, append other information, if it's in customers.json file.
	bindCustomerInfo(input) {
		if (input.list.querySelector(`option[value='${input.value}']`) !== null) {
			const id = input.list.querySelector(`option[value='${input.value}']`).getAttribute('data-id');
			const customer = customers[id];
			this.address.value = customer.address;
			this.phone.value = customer.phone;
			this.fax.value = customer.fax;
		} else {
			this.address.value = '';
			this.phone.value = '';
			this.fax.value = '';
		}
	}

	// when user click edit customer button, show the info in the form.
	editCustomer() {
		this.customerTable.innerHTML = '';
		const fax = this.fax.value === '' ? '' : ` (傳真：${this.fax.value})`;
		this.customerTable
				.innerHTML = `
					<tr>
						<td><p class="upper-block__text">列印日期：${(new Date()).toISOString().split('T')[0]}</p></td>
					</tr>
					<tr>
						<td><p class="upper-block__text">客戶名稱：${this.customerName.value}</p></td>
					</tr>
					<tr>
						<td><p class="upper-block__text">客戶地址：${this.address.value}</p></td>
						<td><p class="upper-block__text">負責公司：呼嚕嚕有限公司</p></td>
					</tr>
					<tr>
						<td><p class="upper-block__text">客戶電話：${this.phone.value} ${fax}</p></td>
						<td><p class="upper-block__text">聯絡電話：0411212121</p></td>
					</tr>`;
	}

	// when user click add product button, add one product in the list, and count total price.
	appendProduct() {
		this.count++;
		let localCount = this.count;
		const newProduct = new Product(this.name.value, this.pricePerBox.value,
										this.ecount.value, this.memo.value);
		this.name.value
			= this.pricePerBox.value
			= this.ecount.value
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

	// delete one product.
	deleteProduct(number, priceToMinus) {
		//evt.preventDefault;
		const domToRemove = document.getElementById(`product${number}`);
		domToRemove.parentNode.removeChild(domToRemove);
		this.totalPrice -= priceToMinus;
		this.etotalPrice.innerHTML = `總金額：${this.totalPrice}`;
	}
	// save this form in docx format.
	saveFile() {
		const table = this.adjustTableDOM().outerHTML;
		const result = this.readCssFile()
		.then((cssData) => {
			const template = this.addHtmlDocument(table, cssData);
			const converted = htmlDocx.asBlob(template);
			FileSaver.saveAs(converted, `${this.customerName.value}_${(new Date()).toISOString().split('T')[0]}`);
		});
	}

	//	remove edit part of form, so that the docx file wound not show that.
	adjustTableDOM() {
		const copyTable = document.getElementById('salesBlock').cloneNode(true);
		for (let i = copyTable.getElementsByClassName('edit-cell').length; i > 0; i--) {
			copyTable.getElementsByClassName('edit-cell')[0].remove();
		}
		return copyTable;
	}

	//	include the style for docx file.
	readCssFile() {
		return new Promise((resolve, reject) => {
			fs.readFile(cssPath, 'utf8', (err, contents) => {
				if (err) return reject(err.message);
				return resolve(contents);
			});
		});
	}

	//	combine whole structure for saving docx file.
	addHtmlDocument(table, cssData) {
		const cssContent = `<style>${cssData}</style>`;
		const template = `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				${cssContent}
			</head>
		  <body>
			${table}
		  </body>
		</html>`;
		return template;
	}
}
const start = new SalesForm();

