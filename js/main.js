const btnSubmit = document.querySelector(".btnSubmit");
const txtDateTime = document.querySelector("input[name='txtDateTime']");
const baseURL = "https://api.coingecko.com/api/v3/coins";
let formattedNextDrawDateWithTime, bitCoinCurrentPrice, bitCoinValue;
const bitCoinTBody = document.querySelector("#bitcoinvalues");
const bitCoinPriceMsg = "Future Bitcoin Price not found.";
const SAT = 6;
const WED = 3;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DRAW_TIME_HR = 20;

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

const getTimeTillDrawHr = (selectedHrs, selectedMins) => {
  const Hr = (DRAW_TIME_HR - selectedHrs) * 60 * 60 * 1000;
  const Min = selectedMins * 60 * 1000;
  return Hr - Min;
};

// This method can calculate the exact time of next draw date.
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
  let newRow = bitCoinTBody.insertRow();

  bitCoinValue = parseFloat(
    (data?.market_data?.current_price.eur * 100) / bitCoinCurrentPrice
  ).toFixed(2);
  newRow.insertCell().append(formattedNextDrawDateWithTime);
  newRow.className = "new-row";

  data?.market_data
    ? newRow.insertCell().append(bitCoinValue)
    : newRow.insertCell().append(bitCoinPriceMsg);
};

// Tried to write another logic to calculate Next Lotto Draw.

// const getNextLottoDraw = (inputDateTime) => {
//   const nextLottoDrawDateTime = new Date(inputDateTime);
//   let drawDate;
//   const selectedDay = parseInt(nextLottoDrawDateTime.getDay());
//   const selectedHrs = parseInt(nextLottoDrawDateTime.getHours());
//   const selectedMins = parseInt(nextLottoDrawDateTime.getMinutes());

//   /* code update */
//   let timeForDraw = 0;
//   if ((selectedDay === WED || selectedDay === SAT) && selectedHrs < 20) {
//     timeForDraw = getTimeTillDrawHr(selectedHrs, selectedMins);
//   }
//   if ((selectedDay === WED || selectedDay === SAT) && selectedHrs > 20) {
//     let Days = 0;
//     if (selectedDay === WED) {
//       Days = (SAT - WED) * DAY_IN_MS;
//     }
//     if (selectedDay === SAT) {
//       Days = (SAT - WED + 1) * DAY_IN_MS; //not sure about this +1 need to study
//     }
//     timeForDraw = Days + getTimeTillDrawHr(selectedHrs, selectedMins);
//   }
//   if (selectedDay > WED && selectedDay < SAT) {
//     const Days = (SAT - selectedDay) * DAY_IN_MS;
//     timeForDraw = Days + getTimeTillDrawHr(selectedHrs, selectedMins);
//   }
//   if (selectedDay < WED) {
//     const Days = (WED - selectedDay) * DAY_IN_MS;
//     timeForDraw = Days + getTimeTillDrawHr(selectedHrs, selectedMins);
//   }

//   const nextDrawInMs = nextLottoDrawDateTime.getTime() + timeForDraw;
//   const nextDrawDate = new Date(nextDrawInMs);

//   console.log("nextDraw " + nextDrawDate);
//   return nextDrawDate;
// };
