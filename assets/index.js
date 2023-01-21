    // Creating avariables
    let i = 1;
    let index;
    let exists = false;
    let noDataRow = true;
    let productsArray; // created array to store json data
    const table = document.getElementsByTagName("table");
    const speechButton = document.querySelector("#speechButton");
    const productForm = document.querySelector("#productForm");    
    const pName = document.querySelector("#pName");
    const pBrand = document.querySelector("#pBrand");
    const pType = document.querySelector("#pType");
    const pQuantity = document.querySelector("#pQuantity");
    const pWeight = document.querySelector("#pWeight");
    const quantityOverlay = document.querySelector("#quantityOverlay");
    const productQuantity = document.querySelector(".product-quantity");
    const selectQuantityButtons = document.querySelector(".select-quantity-buttons");
    const selectedQuantity = document.querySelector("#selectedQuantity");
    const quantityForm = document.querySelector("#quantityForm");
    const clearForm = document.querySelector("#clearForm");
    const closeForm = document.querySelector("#closeForm");
    const replaceBtn = document.querySelector("#replaceBtn");
    const addedProductList = [];
    const noData = document.querySelector("#nodata");
    // Fetching data from JSON file.

    (async function getProducts(){
        const res = await fetch("../data/inventory_dict.json");
        const data = await res.json();
        productsArray = [...data]; // adding json data into productsArray Variable
    })();


    // Adding events
    speechButton.addEventListener("click", generateRandomIndex);
    quantityOverlay.addEventListener("click",selectQuantity);
    Array.prototype.slice.call(selectQuantityButtons.children).map(buttons=>buttons.addEventListener("click",getQuantityValue));
    
    clearForm.addEventListener("click",resetQuantityForm);
    quantityForm.addEventListener("submit",submitQuantityForm);
    closeForm.addEventListener("click",closeQuantityForm)
    productForm.addEventListener("submit",addProductToLeftSide)
    replaceBtn.addEventListener("click",replaceQuantity);


    // Get random number b/w 0 to 7
    function generateRandomIndex(){
        if(replaceBtn.style.display == "block") replaceBtn.style.display = "none";
        if(productQuantity.style.display == "block") productQuantity.style.display = "none"; 
        let randomProductIndex = Math.floor(Math.random() * productsArray.length);
        let randomProduct = productsArray[randomProductIndex];
        // Adding value to form
        setTimeout(()=>{
            pName.value = randomProduct.item;
            pName.style.backgroundColor = "#f48225";
        });
        setTimeout(()=>{
            pBrand.value = randomProduct.brand;
            pName.style.backgroundColor = "";
            pBrand.style.backgroundColor = "#f48225";
        },500)
        setTimeout(()=>{
            pType.value = randomProduct.sub_type;
            pBrand.style.backgroundColor = "";
            pType.style.backgroundColor = "#f48225";
        },1000)
        setTimeout(()=>{
            pQuantity.value = randomProduct.quantity;
            pType.style.backgroundColor = "";
            pQuantity.style.backgroundColor = "#f48225";
            quantityOverlay.style.display = "block";
            quantityOverlay.style.cursor = "pointer";
        },1500)
        setTimeout(()=>{
            pWeight.value = `${randomProduct.sizing}${randomProduct.sizing_unit}`;
            pQuantity.style.backgroundColor = "";
            pWeight.style.backgroundColor = "#f48225";
        },2000)
        setTimeout(()=>{
            pWeight.style.backgroundColor = "";
        },2500);

        if(addedProductList.includes(randomProduct.item)){
            // if(randomProduct.item == "" || randomProduct.brand == "" || randomProduct.sub_type == "" || randomProduct.sizing == "" || randomProduct.quantity == "" ) alert("wait");
            // else{
                exists = true;
                index = addedProductList.indexOf(randomProduct.item) + 1;
                replaceBtn.style.display = "block";
            // }
        }else{
            exists = false;
            addedProductList.push(randomProduct.item)
        }
    }

    // Select quantity function
    function selectQuantity(){
        if(productQuantity.style.display == "none") productQuantity.style.display = "block";
        else productQuantity.style.display = "none";

    }

    //  function to get product data
    function productInfo(){
        if(pName.value == "" && pBrand.value == "" && pType.value == "" && pQuantity.value == "" && pWeight.value == "" ){
            return 0;
        }else{
            return {
                name:pName.value,
                brand:pBrand.value,
                type:pType.value,
                quantity:pQuantity.value,
                weight:pWeight.value,
            }
        }
    }

    // Get selected value and add it to the input type number field.
    function getQuantityValue(event){
        let selectedQuantityByUser = event.target.getAttribute("value");
        selectedQuantity.value = +selectedQuantityByUser
    }

    // Reset quantity form
    function resetQuantityForm(event){
        event.preventDefault();
        quantityForm.reset();
    }

    // get quanity selected by user
    function submitQuantityForm(event){
        event.preventDefault();
        let val = event.target.selectedQuantity.value;
        if(val != ""){
            pQuantity.value = val;
            productQuantity.style.display = "none";
            quantityForm.reset();
        }else{
            alert("Select quantity or close it.");
        }
    }

    // function close quantity form
    function closeQuantityForm(){
        productQuantity.style.display = "none";
    }

    // function add product to the left panel
    function addProductToLeftSide(event){
        event.preventDefault();
        let productData = productInfo();
        if(productData !== 0){
            if(productData.weight == "") alert("wait");
            else{
                if(exists){
                    let previousVal = table[0].children[0].children[index].children[4].textContent;
                    table[0].children[0].children[index].children[4].textContent = +previousVal +  +pQuantity.value;
                    table[0].children[0].children[index].children[4].style.backgroundColor = "#f48225";
                    setTimeout(()=>{
                        table[0].children[0].children[index].children[4].style.backgroundColor = ""
                    },500);
                    productForm.reset();
                    replaceBtn.style.display = "none";
                }           
                else{
                    if(noDataRow){
                        table[0].children[0].deleteRow(table[0].children[0].children.length - 1);
                        noDataRow = false;
                    }
                    let row = table[0].insertRow(i);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    let cell4 = row.insertCell(3);
                    let cell5 = row.insertCell(4);

                    cell1.innerHTML = productData.name;
                    cell2.innerHTML = productData.brand; 
                    cell3.innerHTML = productData.type;
                    cell4.innerHTML = productData.weight;
                    cell5.innerHTML = productData.quantity;
                    // addedProductList.push(productData.item)
                    productForm.reset();
                    i++;
                    quantityOverlay.style.display = "none";
                    quantityOverlay.style.cursor = "pointer";
                    table[0].children[0].children[table[0].children[0].children.length - 1].style.backgroundColor = "#f48225";
                    setTimeout(()=>{
                        table[0].children[0].children[table[0].children[0].children.length - 1].style.backgroundColor = "";
                    });
                }
            }
        }else{
            alert("Add product by click on speech.");
        }   

    }

    // Product exists replace quantity
    function replaceQuantity(){
        // console.log(pQuantity.weight)
        if(pWeight.value == ""){
            alert("wait");
        }else{
            if(productQuantity.style.display == "block") productQuantity.style.display = "none";
            table[0].children[0].children[index].children[4].textContent = pQuantity.value;
            table[0].children[0].children[index].children[4].style.backgroundColor = "#f48225";
            setTimeout(()=>{
                table[0].children[0].children[index].children[4].style.backgroundColor = "";
            },500);
            productForm.reset();
            replaceBtn.style.display = "none";
        }
    }