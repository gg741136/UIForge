const email = document.getElementById("email");
const password = document.getElementById("password");
const Regemail = document.getElementById("remail");
const Regpassword = document.getElementById("rpassword");
const Resemail = document.getElementById("rsemail");
const RegCpassword = document.getElementById("rcpassword");

window.login = async () => {
  try{
    if(!email.value.trim() || !password.value){
      showAlert("Please enter credentials", "error");
      return;
    }
    const res = await auth.signInWithEmailAndPassword(email.value.trim(), password.value);
    
    const snap = await db.collection("users").doc(res.user.uid).get();
    
    if(snap.exists && snap.data().isAdmin){
      location.href = "./admin.html";
    } else {
      location.href = "./index.html";
    }
    
  } catch (err) {
    showAlert(err.message, "error");
  }
};

window.register = async () => {
  try{
    if(!Regemail.value.trim() || !Regpassword.value || !RegCpassword.value){
      showAlert("Please enter credentials", "error");
      return;
    }else if(Regpassword.value !== RegCpassword.value){
      showAlert("Confirm password doesn't match", "error");
      return;
    }
    const res = await auth.createUserWithEmailAndPassword(Regemail.value.trim(), Regpassword.value);
    
    await db.collection("users").doc(res.user.uid).set({
      email: res.user.email,
      isPremium: false,
      premiumExpiry: 0,
      isAdmin: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    showAlert("Account created successfully 🎉", "success");
    setTimeout(() => {
      location.href = "./index.html";
    }, 500);
  } catch (err) {
    showAlert(err.message, "error");
  }
};

window.hide = async (divId) => {
  document.getElementById(divId).classList.add("hidden");
};

window.show = async (divId) => {
  document.getElementById(divId).classList.remove("hidden");
};

window.send = async () => {
  try{
    if(!Resemail.value){
      showAlert("Please Enter Email", "error");
      return;
    }
    await auth.sendPasswordResetEmail(Resemail.value);
    showAlert(`Reset Email has sended to ${Resemail.value}. Please check inbox or spam folder 🎉`, "success");
  }catch (error){
      showAlert(error.message, "error");
  }
};