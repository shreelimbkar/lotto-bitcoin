const btnSubmit = document.querySelector(".btnSubmit");
const txtDateTime = document.querySelector("input[name='txtDateTime']");

window.addEventListener("load", () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  txtDateTime.defaultValue = now.toISOString().slice(0, -8);
});

btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  if (txtDateTime) getNextLottoDraw(new Date(txtDateTime.value));
});

const getNextLottoDraw = (txtDateTime) => {
  return console.log("Today's date , Entered date = ", new Date(), txtDateTime);
};
