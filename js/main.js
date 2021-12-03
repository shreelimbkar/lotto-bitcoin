const btnSubmit = document.querySelector(".btnSubmit");
const txtDateTime = document.querySelector("input[name='txtDateTime']");

window.addEventListener("load", () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  txtDateTime.defaultValue = now.toISOString().slice(0, -8);
});

btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  if (!txtDateTime) return false;
  let nextDrawDate = new Date(getNextLottoDraw(txtDateTime.value));

  nextDrawDate.setHours(8);
  nextDrawDate.setMinutes(0);
  nextDrawDate.setMilliseconds(0);
  // formate date by dd-mm-yyyy hh:mm
  const formattedNextDrawDate = `${nextDrawDate
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("-")} 20:00`;
  console.log("formattedNextDrawDate Date = ", formattedNextDrawDate);
});

const getNextLottoDraw = (inputDateTime) => {
  const nextLottoDrawDateTime = new Date(inputDateTime);
  let drawDate;
  console.log("inputDateTime Wed = ", nextLottoDrawDateTime);
  //   //   const getDay = inputDateTime.toString().split(" ")[0];
  //   const getTime = parseInt(
  //     nextLottoDrawDateTime.toString().split(" ")[4].split(":")[0]
  //   );
  const selectedDay = parseInt(nextLottoDrawDateTime.getDay());
  const selectedHrs = parseInt(nextLottoDrawDateTime.getHours());
  const selectedMins = parseInt(nextLottoDrawDateTime.getMinutes());
  console.log(
    "selectedDay, selectedHrs, selectedMins",
    selectedDay,
    selectedHrs,
    selectedMins
  );

  if (selectedDay <= 3 && selectedHrs <= 20) {
    console.log("WED in if");
    if (selectedHrs == 20 && selectedMins > 0) {
      console.log("WED in if if");
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (6 - selectedDay) * (60 * 60 * 24 * 1000)
      );
    } else {
      console.log("WED in else");
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (3 - selectedDay) * (60 * 60 * 24 * 1000)
      );
    }
  }
  if (selectedDay > 3 && selectedDay <= 6 && selectedHrs <= 20) {
    console.log("SAT in if");
    if (selectedHrs == 20 && selectedMins > 0) {
      console.log("SAT in if if");
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (selectedDay - 2) * (60 * 60 * 24 * 1000)
      );
    } else {
      console.log("SAT in else");
      drawDate = new Date(
        nextLottoDrawDateTime.getTime() +
          (6 - selectedDay) * (60 * 60 * 24 * 1000)
      );
    }
  }

  // console.log("drawDate", drawDate);
  return drawDate;
};
