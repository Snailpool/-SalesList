const htmlDocx = require('html-docx-js');
const FileSaver = require('file-saver');
const fs = require('fs');
const customers = require('./config/customer.json');
const company = require('./config/company.json');
const products = require('./config/products.json');
const cssPath = './styles.css';

// return a Product object for product list.
class Product {
	constructor(date, name, pricePerBox, count, memo) {
		this.date = date;
		this.name = name;
		this.pricePerBox = pricePerBox;
		this.count = count;
		this.totalPrice = pricePerBox * count;
		this.count = 0;
		this.memo = memo;
	}
}
// handle this app
class SalesForm {
	// bind page events
	constructor() {
		this.totalPrice = pricePerBox * count;
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
		this.clearProductBtn = document.getElementById('clearProductBtn');
		this.saveFilebtn = document.getElementById('saveFilebtn');
		this.customerList = document.getElementById('customerList');
		this.productList = document.getElementById('productList');
		this.rangeFrom = document.getElementById('rangeFrom');
		this.rangeTo = document.getElementById('rangeTo');
		this.nameList = document.getElementById('nameList');
		this.address = document.getElementById('address');
		this.phone = document.getElementById('phone');
		this.fax = document.getElementById('fax');
		this.name =	document.getElementById('name');
		this.date =	document.getElementById('date');
		this.pricePerBox = document.getElementById('pricePerBox');
		this.ecount = document.getElementById('count');
		this.memo =	document.getElementById('memo');
		this.etotalPrice = document.getElementById('totalPrice');
	}
	bindEvent() {
		this.customerName.addEventListener('change', (evt) => this.bindCustomerInfo(evt.target));
		this.addCustomerBtn.addEventListener('click', () => this.editCustomer());
		this.addProductBtn.addEventListener('click', () => this.appendProduct());
		this.clearProductBtn.addEventListener('click', () => this.clearProduct());
		this.saveFilebtn.addEventListener('click', () => this.saveFile());
		this.rangeFrom.addEventListener('change', () => this.setDateRange());
	}
	clearProduct() {
		this.name.value = '';
		this.pricePerBox.value = '';
		this.ecount.value = '';
		this.memo.value = '';
		this.date.value = '';
	}
	// add 29 days
	setDateRange() {
		const rangeFrom = new Date(event.target.value);
		const rangeTo = new Date(rangeFrom.getTime() + (29 * 24 * 60 * 60 * 1000));
		this.rangeTo.value = `${rangeTo.toJSON().slice(0, 10)}`;
	}
	// add customer list, product list.
	ready() {
		let customerHtml = '';
		let productHtml = '';
		for (let i = 0; i < customers.length; i ++) {
			customerHtml += `<option data-id=${i} value=${customers[i].name}>`;
		}
		for (let i = 0; i < products.length; i ++) {
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
						<td><p class="upperBlock-text">列印日期：${(new Date()).toISOString().split('T')[0]}</p></td>
					</tr>
					<tr>
						<td><p class="upperBlock-text">客戶名稱：${this.customerName.value}</p></td>
						<td><p class="upperBlock-text">負責公司：${company.name}</p></td>
					</tr>
					<tr>
						<td><p class="upperBlock-text">客戶地址：${this.address.value}</p></td>
						<td><p class="upperBlock-text">聯絡電話：${company.phone}</p></td>
					</tr>
					<tr>
						<td><p class="upperBlock-text">客戶電話：${this.phone.value} ${fax}</p></td>
						<td><p class="upperBlock-text">傳真號碼：${company.fax}</p></td>
					</tr>`;
	}

	// when user click add product button, add one product in the list, and count total price.
	appendProduct() {
		this.count++;
		let localCount = this.count;
		const newProduct = new Product(this.date.value, this.name.value, this.pricePerBox.value,
										this.ecount.value, this.memo.value);
		this.name.value
			= this.pricePerBox.value
			= this.ecount.value
			= this.memo.value
			= '';
		this.productList.insertAdjacentHTML('beforeend', `<tr id="product${this.count}">
													<td class="listTable-cell">
														${newProduct.date}
													</td>	<td class="listTable-cell">
														${newProduct.name}
													</td>
													<td class="listTable-cell">
														${newProduct.pricePerBox}
													</td>
													<td class="listTable-cell">
														${newProduct.count}
													</td>
													<td class="listTable-cell">
														${newProduct.totalPrice}
													</td>
													<td style="width: 300px;" class="listTable-cell  listTable-cell--long">
														${newProduct.memo}
													</td>
													<td  class="listTable-cell  edit-cell btn--delete" id="deletebtn${this.count}" >
														刪除
													</td>
												</tr>`);
		document.getElementById(`deletebtn${this.count}`).addEventListener('click', ()=> this.deleteProduct(localCount, newProduct.totalPrice));
		this.totalPrice += newProduct.totalPrice;
		this.etotalPrice.innerHTML = `總金額：${this.totalPrice}`;
	}

	// delete one product.
	deleteProduct(number, priceToMinus) {
		// evt.preventDefault;
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
	readCssFile(){
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

