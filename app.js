const htmlDocx = require('html-docx-js');
const FileSaver = require('file-saver');
const fs = require('fs');
const cssPath = 'styles.css';
const customers = require('./customer.json'); //so convenient
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
function bindCustomerInfo(input){
	if( input.list.querySelector(`option[value='${input.value}']`) !== null){
		const id = input.list.querySelector(`option[value='${input.value}']`).getAttribute("data-id");
		const customer = customers[id];
		document.getElementById('address').value = customer.address;
		document.getElementById('phone').value = customer.phone;
		document.getElementById('fax').value = customer.fax;
	}
	else{
		document.getElementById('address').value = 
		document.getElementById('phone').value = 
		document.getElementById('fax').value = '';

	}
};
function editCustomer() {
	document.getElementById('customerTable').innerHTML = '';
	const fax = document.getElementById('fax').value === ''? '' : ` (傳真：${document.getElementById('fax').value})`;
	document.getElementById('customerTable')
			.innerHTML = `
				<tr>
					<td><p class="upper-block__text">列印日期：${(new Date()).toISOString().split('T')[0]}</p></td>
				</tr>
				<tr>
					<td><p class="upper-block__text">客戶名稱：${document.getElementById('customerName').value}</p></td>
				</tr>
				<tr>
					<td><p class="upper-block__text">客戶地址：${document.getElementById('address').value}</p></td>
					<td><p class="upper-block__text">負責人：胡東茂</p></td>
				</tr>
				<tr>
					<td><p class="upper-block__text">客戶電話：${document.getElementById('phone').value} ${fax}</p></td>
					<td><p class="upper-block__text">聯絡電話：048950029</p></td>
				</tr>`;
}
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
												<td style="width: 300px;" class="list-table__cell  list-table__cell--long">
													${newProduct.memo}
												</td>
												<td  class="list-table__cell  edit-cell btn--delete" onclick="deleteProduct(${count},${newProduct.totalPrice})">
													刪除
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
function saveFile(){
	const table = adjustTableDOM().outerHTML;
	const result = readCssFile()
	.then((cssData) => {
		const template = addHtmlDocument(table,cssData);
		const converted = htmlDocx.asBlob(template);
		FileSaver.saveAs(converted, `${document.getElementById('customerName').value}_${(new Date()).toISOString().split('T')[0]}`);
	})
}
function adjustTableDOM(){
	let copyTable = document.getElementById('salesBlock').cloneNode(true);
	for(let i =  copyTable.getElementsByClassName('edit-cell').length; i > 0 ; i--){
		 copyTable.getElementsByClassName('edit-cell')[0].remove();
	}
	return copyTable;
}
function readCssFile(){
    return new Promise(function (resolve, reject) {
        fs.readFile(cssPath, 'utf8', function(err, contents) {
            if (err) return reject(err.message);
            return resolve(contents);
        });
    });
}
function addHtmlDocument(table,cssData){
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
