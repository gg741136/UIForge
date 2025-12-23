const list = document.getElementById("list");

async function updateCodes(){
  const snap = await db.collection("payments").get();
  
  snap.forEach(d => {
    list.innerHTML += `
     <div class="card">
      TXN: ${d.data().txn}
      <button class="btn" onclick="approve('${d.id}','${d.data().uid}',${d.data().amount})">Approve</button>
      <button onclick="declinePayment('${d.id}')" class="btn danger">Decline</button>
     </div>
    `;
  });
}

updateCodes();

window.approve = async (pid, uid, pamount) => {
  let choice = await customConfirm("Approve this payment?");
  if(!choice) return;
  
  await db.collection("payments").doc(pid).update({
    status: "approoved"
  });
  
  const result = (pamount / 49) * 30;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + Math.floor(result));
  
  await db.collection("users").doc(uid).update({
    isPremium: true,
    premiumExpiry: expiry
  });
  
  showAlert("Payment approved & premium activated", "success");
};

window.declinePayment = async (pid) => {
  let choice = await customConfirm("Decline this payment as fake?");
  if(!choice) return;
  
  await db.collection("payments").doc(pid).update({
    status: "declined",
    declinedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  await db.collection("payments").doc(pid).delete();
  
  showAlert("Payment declined", "error");
  
  setTimeout(() => {
    window.location.reload();
  },1000);
};