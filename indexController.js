if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('sw.js')
             .then(function() { console.log("Service Worker Registered"); });
  }
/* 
//creating or opening database
let indexedDB = window.indexedDB;
let open = indexedDB.open('currencies', 1);
//creating schema
open.onupgradeneeded = function () {
    let db = open.result;
    let store = db.createObjectStore("currencies", {
        keypath: "id"
    });
    let index = store.createIndex('by-date', 'time');
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
        store.put(data[query], query);
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
}; */