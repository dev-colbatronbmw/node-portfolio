/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  console.log("my fuction");
  document.getElementById("myDropdown").classList.toggle("drop");
}
console.log("connected to js");

// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
  if (!e.target.matches(".dropbtn")) {
    console.log("drop down");
    var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains("drop")) {
      myDropdown.classList.remove("drop");
    }
  }
};
