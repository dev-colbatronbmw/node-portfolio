/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myToggle(id) {
  document.getElementById(id).classList.toggle("toggle");
}
console.log("connected to js");
// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
  if (!e.target.matches(".dropbtn")) {
    var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains("toggle")) {
      myDropdown.classList.remove("toggle");
    }
  }
  if (!e.target.matches(".feedback-toggle")) {
    var myDropdown = document.getElementById("myFeedback");
    if (myDropdown.classList.contains("toggle")) {
      myDropdown.classList.remove("toggle");
    }
  }
};
