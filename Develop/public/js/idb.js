
const request = window.indexedDB.open("budget-tracker", 1);
let db;

request.onupgradeneeded = (event) => {
  db = event.target.result; 
  db.createObjectStore("Budget", { autoIncrement: true });
};

request.onsuccess = (event) => {
  db = event.target.result;
  if (navigator.onLine) {
    uploadBudgetInfo();
  }
};

function saveRecord(data) {
  console.log(data);

   
 const transaction = db.transaction(["Budget"], "readwrite");
             
             
const budgetStore = transaction.objectStore("Budget");
  budgetStore.add(data); 
}

async function uploadBudgetInfo() {
  const transaction = db.transaction(["Budget"], "readwrite");
  const budgetStore = transaction.objectStore("Budget");
  const budgetInfo = budgetStore.getAll();

  budgetInfo.onsuccess = () => {
    if (budgetInfo.result.length > 0) {
      fetch("api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetInfo.result),
      })


        .then((result) => result.json())
        .then((response) => {
          if (response.message) {
            throw new Error(message);
          }
          const transaction = db.transaction(["Budget"], "readwrite");
          const budgetStore = transaction.objectStore("Budget");
          budgetStore.clear();

          alert("Your info have all been synchronized!");
          window.location.reload();
        });
    }
  };
}

window.addEventListener('online', uploadBudgetInfo);