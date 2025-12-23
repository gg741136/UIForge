const UPI_ID = "madhubala5422@okicici";
const txn = document.getElementById("txn");
const amount = document.getElementById("amount");

function copyUrl(){
  navigator.clipboard.writeText(UPI_ID);
  alert("copied");
}

function download() {
  const img = document.getElementById("upiQr");
  const a = document.createElement("a");
  a.href = img.src;
  a.download = "upi-qr.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

window.pay = async () => {
  if(!txn.value.trim() || !amount.value.trim()){
    showAlert("Please Enter Details",  "error");
    return;
  }
  const q = db.collection("payments").where("txn", "==", txn.value.trim());
  
  if(!(await q.get()).empty){
    showAlert("Transaction already used");
    return;
  }
  
  await db.collection("payments").add({
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    txn: txn.value.trim(),
    amount: amount.value.trim(),
    status: "pending",
    time: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  showAlert("Submitted for approval, Will we send you update on your email", "success");
};