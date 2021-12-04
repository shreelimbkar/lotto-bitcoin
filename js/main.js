const btnSubmit = document.querySelector(".btnSubmit");
const txtDateTime = document.querySelector("input[name='txtDateTime']");
const baseURL = "https://api.coingecko.com/api/v3/coins";
let formattedNextDrawDateWithTime, bitCoinCurrentPrice, bitCoinValue;
const bitCoinTBody = document.querySelector("#bitcoinvalues");

window.addEventListener("load", () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  txtDateTime.defaultValue = now.toISOString().slice(0, -8);
  getBitCoinCurrentPrice();
});

btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  if (!txtDateTime) return false;
  let nextDrawDate = new Date(getNextLottoDraw(txtDateTime.value));

  // set draw time at 8:00 PM
  nextDrawDate.setHours(8);
  nextDrawDate.setMinutes(0);
  nextDrawDate.setMilliseconds(0);
  // formate date by dd-mm-yyyy hh:mm
  const formattedNextDrawDate = `${nextDrawDate
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("-")}`;
  formattedNextDrawDateWithTime = `${formattedNextDrawDate} 20:00`;
  drawDateBitCoinPrice(formattedNextDrawDate);
});

const getNextLottoDraw = (inputDateTime) => {
  const nextLottoDrawDateTime = new Date(inputDateTime);
  let drawDate;
  const selectedDay = parseInt(nextLottoDrawDateTime.getDay());
  const selectedHrs = parseInt(nextLottoDrawDateTime.getHours());
  const selectedMins = parseInt(nextLottoDrawDateTime.getMinutes());

  if (selectedDay <= 3 && selectedHrs <= 20) {
    if (selectedHrs == 20 && selectedMins > 0) {
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (6 - selectedDay) * (60 * 60 * 24 * 1000)
      );
    } else {
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (3 - selectedDay) * (60 * 60 * 24 * 1000)
      );
    }
  } else if (selectedDay <= 3 && selectedHrs > 20) {
    drawDate = new Date(
      nextLottoDrawDateTime.getTime() +
        (3 - selectedDay) * (60 * 60 * 24 * 1000)
    );
  }
  if (selectedDay > 3 && selectedDay <= 6 && selectedHrs <= 20) {
    if (selectedHrs == 20 && selectedMins > 0) {
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (selectedDay - 2) * (60 * 60 * 24 * 1000)
      );
    } else {
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (6 - selectedDay) * (60 * 60 * 24 * 1000)
      );
    }
  } else if (selectedDay > 3 && selectedDay <= 6 && selectedHrs > 20) {
    drawDate = new Date(
      nextLottoDrawDateTime.getTime() +
        (6 - selectedDay) * (60 * 60 * 24 * 1000)
    );
  }
  return drawDate;
};

const getBitCoinCurrentPrice = async () => {
  const response = await fetch(`${baseURL}/bitcoin`);
  const data = await response.json();
  bitCoinCurrentPrice = data.market_data.current_price.eur;
};

const drawDateBitCoinPrice = async (drawDate) => {
  const response = await fetch(`${baseURL}/bitcoin/history?date=${drawDate}`);
  const data = await response.json();
  if (data?.market_data) {
    bitCoinValue = parseFloat(
      (data.market_data.current_price.eur * 100) / bitCoinCurrentPrice
    ).toFixed(2);
    let newRow = bitCoinTBody.insertRow();
    newRow.insertCell().append(formattedNextDrawDateWithTime);
    newRow.insertCell().append(bitCoinValue);
  } else {
    alert("Future Bitcoin Price not found.");
  }
};
