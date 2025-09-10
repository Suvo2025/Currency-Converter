const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.value = currCode;
    newOption.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const flagUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = flagUrl;
};

const getExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `https://api.frankfurter.app/latest?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();
    const rate = data.rates[toCurr.value];
    document.querySelector(".msg").innerText = `${amtVal} ${fromCurr.value} = ${rate} ${toCurr.value}`;
  } catch (err) {
    document.querySelector(".msg").innerText = "Failed to fetch exchange rate.";
    console.error(err);
  }
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});
const swapBtn = document.getElementById("swap-btn");

swapBtn.addEventListener("click", () => {
  // Swap selected values
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Trigger conversion again
  btn.click();
});

window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  document.querySelector(".amount input").value = "1";
  getExchangeRate();
});
