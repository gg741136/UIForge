const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
const oobCode = params.get("oobCode");

const verifyDiv = document.getElementById("verify"),
 statusVer = document.querySelector("#verify #status"),
 ResetDiv = document.getElementById("reset"),
 StatusRes = document.querySelector("#reset #status"),
 input = document.querySelector("#reset #newPassword"),
 button = document.querySelector("#reset #btn");

if(!mode || !oobCode){
  statusVer.textContent = "Invalid or expired link.";
  statusVer.style.color = "#ff4d4d";
  showAlert("Invalid or expired link.", "error");
}

if(mode === "verifyEmail"){
  verifyDiv.classList.remove("hidden");
  ResetDiv.classList.add("hidden");
  
  auth.applyActionCode(oobCode).then(() => {
    statusVer.textContent = "Email verified successfully!";
    statusVer.style.color = "#00ffd5";
    showAlert("Email verified successfully!", "success");
  }).catch(() => {
    statusVer.textContent = "Verification failed or expired.";
    statusVer.style.color = "#ff4d4d";
    showAlert("Verification failed or expired.", "success");
  });
} else if(mode === "resetPassword"){
  verifyDiv.classList.add("hidden");
  ResetDiv.classList.remove("hidden");
  StatusRes.textContent = "Set your new password";
  button.onclick = () => {
    if(input.value.length < 6){
      StatusRes.textContent = "Password must be 6+ characters";
      StatusRes.style.color = "#ff4d4d";
      showAlert("Password must be 6+ characters", "error");
      return;
    }
    
    auth.confirmPasswordReset(oobCode, input.value).then((resp) => {
      StatusRes.textContent = "Password reset successful!";
      StatusRes.style.color = "#00ffd5";
      showAlert("Password reset successful!", "success");
      input.style.display = "none";
      button.style.display = "none";
    }).catch(() => {
      StatusRes.textContent = "Reset failed. Try again.";
      StatusRes.style.color = "#ff4d4d";
      showAlert("Reset failed. Try again.", "error");
    });
  };
}else{
  statusVer.textContent = "Invalid or expired link.";
  statusVer.style.color = "#ff4d4d";
  showAlert("Invalid or expired link.", "error");
}