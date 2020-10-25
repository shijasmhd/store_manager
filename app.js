class item{
    constructor(itemId, name, price){
        this.itemId = itemId;
        this.name = name;
        this.price = price;
    }
}

class ui{
    static alert(itemName) {
        var message = document.getElementById('message');
        message.style.cssText = "background-color: rgba(43, 174, 102, 0.432); display: block; color: white;";
        message.appendChild(document.createTextNode(`Item : ${itemName} added!`));
        setTimeout( () => {
            message.removeChild(message.firstChild);
            message.style.cssText = 'padding : 0 !important; border : none !important';
            location.reload();
        }, 2000);
    }
    static addToTable(itemId, name, price, billItemQty){
        const tbody = document.querySelector('#tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
        <th scope ='row'> ${tbody.childElementCount}</th>
        <td>${itemId}</td>
        <td>${name}</td>
        <td>${price}</td>
        <td>${billItemQty}</td>
        <td id="utTotal">${price * billItemQty}</td>
        `;
        tbody.insertBefore(row, tbody.lastElementChild);
        form2.reset();

        totalAmt += price*billItemQty;
        var total = document.getElementById('total');
        total.textContent = totalAmt;
    }
    static fillItem(id, name, price){
        const itemId = document.getElementById('itemId');
        const itemName = document.getElementById('itemName');
        const itemPrice = document.getElementById('itemPrice');
        itemId.value = id;
        itemName.value = name;
        itemPrice.value = price;
    }
}

class store{
    static searchItem(val){
        const retreived = JSON.parse(localStorage.getItem('itemList'));
        let matches = retreived.filter( retreived => {
            const regex = new RegExp(`${val}`, 'gi');
            return retreived.itemId.match(regex);
        });
        if (val.length === 0){
            matches = [];
        }
    
        const html = matches.map(
            x => `<option value = "${x.itemId}"> Item Name: ${x.name}</option>`
        ).join('');
        return html;
    }
    static addItem(itemId, itemName, itemPrice){
        if(itemId !== '' && itemName !== '' && itemPrice !== ''){
            let nwitem = new item(itemId, itemName, itemPrice);
            let itemList;
            if (localStorage.getItem('itemList') === null)
            {
                itemList = [nwitem];
                localStorage.setItem('itemList',JSON.stringify(itemList));
            }
            else
            {
                itemList = JSON.parse(localStorage.getItem('itemList'));
                itemList.push(nwitem);
                localStorage.setItem('itemList',JSON.stringify(itemList));
            }
            ui.alert(nwitem.name);
            form.reset();
        }
        else{
            alert('Enter all values!');
        }
    }
}

var totalAmt = 0;

var form = document.getElementById("form");
var itemId = document.getElementById('itemId');
itemId.addEventListener('input', () =>{
    const html = store.searchItem(itemId.value);
    const datalist = document.querySelector('#datalist1');
    datalist.innerHTML = html;
});
form.addEventListener('submit',additem);

var form2 = document.getElementById('form2');
form2.addEventListener('input', searchItem);
form2.addEventListener('submit', addToBill);

var editForm = document.getElementById('editForm');
let editInput = document.getElementById('editInput');
editInput.addEventListener('input', () =>{
    const html = store.searchItem(editInput.value);
    const datalist = document.querySelector('#datalist1');
    datalist.innerHTML = html;
});
editForm.addEventListener('submit', editItem);

function additem(e){
    e.preventDefault();
    const itemId = document.getElementById('itemId').value;
    const itemName = document.getElementById('itemName').value;
    const itemPrice = document.getElementById('itemPrice').value;
    store.addItem(itemId, itemName, itemPrice);
}

function searchItem(e){
    e.preventDefault();
    let val = document.getElementById('billItem').value;
    let html = store.searchItem(val);
    var datalist = document.querySelector('#datalist1');
    datalist.innerHTML = html;
}

function addToBill(e){
    e.preventDefault;
    const billItem = document.getElementById('billItem').value;
    let billItemQty = document.getElementById('billItemQty').value;
    let retreived = JSON.parse(localStorage.getItem('itemList'));
    for(let i=0; i<retreived.length; i++){
        if (retreived[i].itemId === billItem){
            ui.addToTable(retreived[i].itemId, retreived[i].name, retreived[i].price, billItemQty);
        }
    }
}

function editItem(){
    itemId = editInput.value;
    let count = 0;
    let retreived = JSON.parse(localStorage.getItem('itemList'));
    for(let i=0; i<retreived.length; i++){
        if (retreived[i].itemId === itemId){
            ui.fillItem(retreived[i].itemId, retreived[i].name, retreived[i].price);
            retreived.splice(i,1) ;
            localStorage.setItem('itemList',JSON.stringify(retreived));
            continue;
        }
    }
    editForm.reset();
}
