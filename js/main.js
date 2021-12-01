const btnSubmit = document.querySelector(".btnSubmit");

btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  const txtDateTime = document.querySelector("input[name='txtDateTime']").value;
  //   console.log("txtDateTime", txtDateTime);
  if (txtDateTime) getNextLottoDraw(new Date(txtDateTime));
});

const getNextLottoDraw = (txtDateTime) => {
  return console.log("Today's date , Entered date = ", new Date(), txtDateTime);
};
