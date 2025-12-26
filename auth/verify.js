auth.onAuthStateChanged(async (user) => {
  if(user){
    document.getElementById("email1") = user.email;
    if(user.emailVerified){
      location.href = "../index.html";
    }
  }else{
    location.href = "./index.html";
  }
});

async function send(){
  await auth.currentUser.sendEmailVerification().then(() => {
    showAlert("Verification email sended successfully", "success");
  }).catch((error) => {
    showAlert(error.message, "error");
  });
}

async function check(){
  window.location.reload();
}