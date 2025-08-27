const meals = document.getElementsByClassName("prodSpan");
const selectedMeals = [];
const selectedPrices = [];
const printMeals = [];
const div = document.getElementById("selectedProducts");
const between = document.getElementById("between");
const all = document.getElementById("all");

Array.from(meals).forEach((meal) => {
  const label = meal.querySelector("label");
  const checkbox = meal.querySelector(".prodCheck");
  const mealName = meal.querySelector("p").textContent;
  const price = meal.querySelector(".price").textContent;
  let total = 0;

  label.addEventListener("click", function (e) {
    if (e.shiftKey) {
      const mealIndex = selectedMeals.indexOf(mealName);
      if (mealIndex !== -1) {
        selectedMeals.splice(mealIndex, 1);
        selectedPrices.splice(mealIndex, 1);
      }
      if (!selectedMeals.includes(mealName)) {
        const mealIndex2 = printMeals.indexOf(mealName);
        if (mealIndex2 !== -1) {
          printMeals.splice(mealIndex2, 1);
        }
        checkbox.checked = false;
      }
    } else {
      selectedMeals.push(mealName);
      selectedPrices.push(price);
      if (!printMeals.includes(mealName)) {
        printMeals.push(mealName);
      }
      checkbox.checked = true;
    }

    div.innerHTML = "<p>מנות:</p>";
    printMeals.forEach((name) => {
      const divv = document.createElement("div");
      divv.classList.add("product");

      const pName = document.createElement("p");
      const count = selectedMeals.filter((m) => m === name).length;
      pName.textContent = count > 1 ? `${name} (${count})` : name;

      const firstIndex = selectedMeals.indexOf(name);
      const pPrice = document.createElement("p");
      pPrice.classList.add("price");
      pPrice.textContent = selectedPrices[firstIndex];

      divv.appendChild(pName);
      divv.appendChild(pPrice);

      div.appendChild(divv);
    });
    console.log(selectedPrices);
    
    selectedPrices.forEach((pricee) => {
      pricee = pricee.replace("₪", "").trim();
      pricee = parseInt(pricee);
      total += pricee;
    });
    between.textContent = "סכום ביניים: " + total.toString() + "₪";
    all.textContent = "סה\"כ לתשלום: " + (total+15).toString() + "₪";
    total = 0
  });
});

function send() {
  localStorage.setItem("prices", JSON.stringify(selectedPrices));
  localStorage.setItem("meals", JSON.stringify(selectedMeals));
  console.log('send: ' + selectedMeals + "\n" + selectedPrices);
  window.open("./order_check.html", "_top");
}