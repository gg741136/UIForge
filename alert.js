function showAlert(message, type = "info"){
  let alertBox = document.getElementById("alertBox");
  let alertDiv = document.createElement("div");
  alertDiv.className = "alert " + type;
  alertDiv.innerHTML = `
   <span class="closeBtn" onclick="this.parentElement.remove()">×</span>
   ${message}
  `;
  alertBox.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.classList.add("show");
  },10);
  setTimeout(() => {
    alertDiv.classList.remove("show");
    setTimeout(() => alertDiv.remove(), 300);
  }, 4000);
}

function customConfirm(message){
  return new Promise((resolve) => {
    const overlay = document.getElementById("confirmOverlay");
    const box = document.getElementById("confirmBox");
    const msg = document.getElementById("confirmMessage");
    msg.textContent = message;
    overlay.style.display = "flex";
    setTimeout(() => {
      box.classList.add("show");
    }, 10);
    document.getElementById("okBtn").onclick = () => {
      closeConfirm();
      resolve(true);
    };
    document.getElementById("cancelBtn").onclick = () => {
      closeConfirm();
      resolve(false);
    };
    
    function closeConfirm(){
      box.classList.remove("show");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 200);
    }
  });
}