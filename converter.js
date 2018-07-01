/*jshint esversion: 6 */

const url = 'https://free.currencyconverterapi.com/api/v5/countries';
fetch(url)
    .then((response) => response.json()) // Transform the data into json
    .then((data) => {
        let currencies = data.results;
        //Saving to idb by calling function
        //addCurToCache(currencies);

        for (let currency in currencies) { //Loop through the result
            //Getting the currencyId into the option field for *From*
            let from = document.createElement("option");
            let selectFrom = document.getElementById("from");
            selectFrom.appendChild(from);
            from.innerHTML = currencies[currency].name + " " + `(${currencies[currency].currencySymbol})`;
            from.setAttribute("value", `${currencies[currency].currencyId}`);

            //Getting the currencyId into the option field for *to*
            let to = document.createElement("option");
            let selectTo = document.getElementById("to");
            selectTo.appendChild(to);
            to.innerHTML = currencies[currency].name + " " + `(${currencies[currency].currencySymbol})`;
            to.setAttribute("value", `${currencies[currency].currencyId}`);
        }
    });

function showme() {
    let outputBox = document.getElementById("show"); //Where to display result
    let inputBox = document.getElementById('user_input'); //getting user inputs
    console.log()
    let user_input = inputBox.value; //passing the value collected from the user to a declared varible

    let select_from = document.getElementById('from'); //getting the user selected currency to convert from
    let select_to = document.getElementById('to'); //getting the user selected currency to convert to

    let from = select_from.value; //passing the id which will be used in query
    let to = select_to.value; //passing the id which will be used in query

    let query = from + '_' + to; //preparing a query string
    let url = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + query + '&compact=ultra';

    fetch(url)
        .then((response) => response.json()) // Transform the data into json
        .then((data) => {
            let output = (user_input * data[query]).toFixed(2); //multiply to get exchange rate and round up to two decimal places
            //console.log(output);
            outputBox.innerHTML = output;
            outputBox.setAttribute("value", `${output}`);

            //creating or opening database
            let indexedDB = window.indexedDB;
            let open = indexedDB.open('currencies', 1);
            //creating schema
            open.onupgradeneeded = function (database) {
                if (!database) return;
                let db = open.result;
                let store = db.createObjectStore("currencies", {
                    keypath: "id"
                });
                //let index = store.createIndex('by-date', 'time');
                console.log('here');
                open.onsuccess = function () {
                    //start a new transaction
                    let db = open.result;
                    let tx = db.transaction('currencies', 'readwrite');
                    console.log('here 1');
                    let store = tx.objectStore('currencies');
                    let result = data[query];
                    console.log(query)   ;
                    console.log('here 2');
                    // let index = store.index('by-date');
                    //add some data
                    //store.put('12');  
                    console.log(result)   ;
                    store.put(result,query,"key");
                    /* for (const currency in currencies) {
                        store.put(currencies[currency].name, currencies[currency].id);
                    } */
                    //Query data
                    console.log('here 3');
                    let getdata = store.get(from);
                    console.log('here 5');
                    getdata.onsuccess = function () {
                        console.log('here 6');
                        //console.log(getdata.results.id);
                    };
                    tx.oncomplete = function () {
                        console.log('here 7');
                        db.close();
                    };
                };
            };
        }).catch(console.log('error'));
}
/* 
function addCurToCache(currencies) {
    //creating or opening database
    let indexedDB = window.indexedDB;
    let open = indexedDB.open('currencies', 1);
    //creating schema
    open.onupgradeneeded = function (database) {
        let db = open.result;
        let store = db.createObjectStore("currencies", {
            keypath: "id"
        });
        //let index = store.createIndex('by-date', 'time');
        console.log('here');
        open.onsuccess = function () {
            //start a new transaction
            let db = open.result;
            let tx = db.transaction('currencies', 'readwrite');
            console.log('here 1');
            let store = tx.objectStore('currencies');
            console.log('here 2');
            // let index = store.index('by-date');
            //add some data
            //store.put('12');               
            for (const currency in currencies) {
                store.put(currencies[currency].name, currencies[currency].id);
            }
            //Query data
            console.log('here 3');
            let getdata = store.get(from);
            console.log('here 5');
            getdata.onsuccess = function () {
                console.log('here 6');
                //console.log(getdata.results.id);
            };
            tx.oncomplete = function () {
                console.log('here 7');
                db.close();
            };
        };
    };
     dbPromise.then(db => {
               if (!db) return;
               
               let tx = db.transaction('idbObjectStoreName', 'readwrite'); // create a transaction
               let store = tx.objectStore('idbObjectStoreName');
               // loop through the currencies object and add them to the currencies object store
               for (const currency of currencies) {
                   store.put(currency, currency.id);
               }
              return tx.complete;             
                   
           }).then(() => {
               console.log('list of currencies added to cache (db)');
            }).catch(error => console.log('Something went wrong: '+ error)); 


} */