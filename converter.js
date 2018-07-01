//checking for service worker support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(function () {
            console.log("Service Worker Registered");
        });
}

//url for countries
const url = 'https://free.currencyconverterapi.com/api/v5/countries';

//fetching country currencies for display in the select forms
fetch(url)
    .then((response) => response.json()) // Transform the data into json
    .then((data) => {
        let currencies = data.results;

        //Saving currencies to idb by calling saving_all_currencies function
        saving_all_currencies(currencies);

        for (let currency in currencies) { //Loop through the result

            //Getting the currencyId into the option field for *From*
            let from = document.createElement("option");
            let selectFrom = document.getElementById("from");
            selectFrom.appendChild(from);
            from.innerHTML = `(${currencies[currency].name})` + " " + `(${currencies[currency].currencySymbol})`;
            from.setAttribute("value", `${currencies[currency].currencyId}`);

            //Getting the currencyId into the option field for *to*
            let to = document.createElement("option");
            let selectTo = document.getElementById("to");
            selectTo.appendChild(to);
            to.innerHTML = `(${currencies[currency].name})` + " " + `(${currencies[currency].currencySymbol})`;
            to.setAttribute("value", `${currencies[currency].currencyId}`);
        }
    });

//Conversion function
function convert() {
    let outputBox = document.getElementById("show"); //Where to display result

    let inputBox = document.getElementById('user_input'); //getting user inputs
    let user_input = inputBox.value; //passing the value collected from the user to a declared letible

    let select_from = document.getElementById('from'); //getting the user selected currency to convert from        
    let from = select_from.value; //passing the id which will be used in query

    let select_to = document.getElementById('to'); //getting the user selected currency to convert to
    let to = select_to.value; //passing the id which will be used in query

    let query = `${from}_${to}`; //preparing a query string

    let url = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + query + '&compact=ultra';

    //fetching converion result from api
    fetch(url)
        .then((response) => response.json()) // Transform the data into json
        .then((data) => {
            if (isNaN(user_input)) {
                alert('only Numbers allowed');
            } else {
                let output = (user_input * data[query]).toFixed(2); //multiply to get exchange rate and round up to two decimal places
                console.log(user_input);

                //Saving exchange rate by calling saving_exchange_rate function
                saving_exchange_rate(query, data[query]);

                //Outputting the conversion result for display to the user
                outputBox.innerHTML = output;
                outputBox.setAttribute("value", `${output}`);
            }
        })
        .catch(() => {
            return getting_rate_from_cache(query);

        });
}
//End of Conversion function

//getting_rate_from_cache function
function getting_rate_from_cache(query) {
    alert('YOU ARE OFFLINE');
    alert('YOU CAN ONLY VIEW LAST SAVED CONVERSION');
    console.log('message alerted');
    let indexedDB = window.indexedDB;
    let open = indexedDB.open('rates', 1);
    open.onsuccess = () => {
        //start a new transaction
        let db = open.result;
        let tx = db.transaction('rates', 'readonly');
        let store = tx.objectStore('rates');

        console.log('query display');
        console.log(query);
        let getRequest = store.index('query').get(query);

        getRequest.onerror = (e) => {
            console.log('Error', e.target.error.name);
        };

        getRequest.onsuccess = () => {
            console.log(getRequest.result);
        };
    };
}
//End of getting_rate_from_cache function

//saving_exchange_rate function
function saving_exchange_rate(query, id) {

    //creating or opening database
    if (navigator.serviceWorker) {
        let indexedDB = window.indexedDB;
        let open = indexedDB.open('rates', 1);

        //creating schema
        open.onupgradeneeded = () => {
            let db = open.result;
            let store = db.createObjectStore("rates", {
                keypath: "query"
            });
            store.createIndex(query, 'query');
            open.onsuccess = () => {
                //start a new transaction
                let db = open.result;
                let tx = db.transaction('rates', 'readwrite');
                let store = tx.objectStore('rates');

                //add some data               
                store.add(query, id);

                tx.oncomplete = () => {
                    console.log('saving exchange here 3');
                    db.close();
                };
            };
        };
    } else {
        console.log('No Service Wroker Function with this browser');
    }
}
//End of saving_exchange_rate function

//saving_all_currencies function
function saving_all_currencies(currencies) {

    //creating or opening database
    if (navigator.serviceWorker) {
        let indexedDB = window.indexedDB;
        let open = indexedDB.open('currencies', 1);

        //creating schema
        open.onupgradeneeded = () => {
            let db = open.result;
            let store = db.createObjectStore("currencies", {
                keypath: "id"
            });
            let index = store.createIndex('by-date', 'time');
            open.onsuccess = () => {

                //start a new transaction
                let db = open.result;
                let tx = db.transaction('currencies', 'readwrite');
                let store = tx.objectStore('currencies');

                //add some data        
                for (const currency in currencies) {
                    store.put(currencies[currency].name, currencies[currency].id);
                }
                tx.oncomplete = () => {
                    db.close();
                };
            };
        };
    } else {
        console.log('No Service Wroker Function with this browser');
    }
}
//End of saving_all_currencies function