/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myToggle(id) {
  document.getElementById(id).classList.toggle("toggle");
}
console.log("connected to js");
// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
  if (!e.target.matches(".dropbtn")) {
    var myDropdown1 = document.getElementById("myDropdown1");
    if (myDropdown1.classList.contains("toggle")) {
      myDropdown1.classList.remove("toggle");
    }
    var myDropdown2 = document.getElementById("myDropdown2");
    if (myDropdown2.classList.contains("toggle")) {
      myDropdown2.classList.remove("toggle");
    }
  }

  if (!e.target.matches(".dropbtnup")) {
    var feedback = document.getElementById("myFeedback");
    if (feedback.classList.contains("toggle")) {
      feedback.classList.remove("toggle");
    }
  }
};
