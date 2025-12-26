const list = document.getElementById("list");

auth.onAuthStateChanged(async (user) => {
  if(user){
    if(!user.emailVerified){
      location.href = "../auth/verify.html";
    }
  }else{
    location.href = "../auth/";
  }
});

async function updateCodes(){
  const snap = await db.collection("payments").get();
  
  snap.forEach(d => {
    if(d.data().status !== "pending") return;
    list.innerHTML += `
     <div class="card">
      TXN: ${d.data().txn}
      <button class="btn" onclick="approve('${d.id}','${d.data().uid}',${d.data().amount},'${d.data().email}')">Approve</button>
      <button onclick="declinePayment('${d.id}','${d.data().email}')" class="btn danger">Decline</button>
     </div>
    `;
  });
}

updateCodes();

window.approve = async (pid, uid, pamount, pemail) => {
  let choice = await customConfirm("Approve this payment?");
  if(!choice) return;
  
  await db.collection("payments").doc(pid).update({
    status: "approved"
  });
  
  const result = (pamount / 49) * 30;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + result);
  
    await fetch("https://gs-mailer-1.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: pemail,
        subject: "🎉 Premium Activated! No Watermark. No Ads. UIForge – by GoyalSoft.",
        message: `<div style="font-family: Arial, sans-serif; background:#ffffff; color:#222; padding:20px;">
    <h3>Hi ${pemail},</h3>

    <p><strong>Great news! 🎉</strong></p>

    <p>
      Your <strong>Premium payment was successful</strong> and your account
      is now fully activated. Till : ${expiry}
    </p>

    <p><strong>You can now:</strong></p>
    <ul>
      <li>Install mockups without watermark</li>
      <li>Use the app without ads</li>
      <li>Enjoy a smooth premium experience</li>
    </ul>

    <p>
      No further action is needed — just log in and start creating.
    </p>

    <p>
      Thanks for supporting us 💙<br>
      <strong>UIForge Team</strong>
    </p>
  </div>
  `
      })
    }).then(res => res.json()).then(data => {
      alert(data.message);
    }).catch(() => {
      alert("Error");
    });
  
  await db.collection("users").doc(uid).update({
    isPremium: true,
    premiumExpiry: expiry
  });
  
  
  showAlert("Payment approved & premium activated", "success");
  window.location.reload();
};

window.declinePayment = async (pid, pemail) => {
  let choice = await customConfirm("Decline this payment as fake?");
  if(!choice) return;

 await fetch("https://gs-mailer-1.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: pemail,
        subject: "Payment Declined – Premium Not Activated. UIForge – by GoyalSoft",
        message: `
  <div style="font-family: Arial, sans-serif; background:#ffffff; color:#222; padding:20px;">
    <h3>Hi ${pemail},</h3>

    <p>
      We reviewed your recent payment submission, and unfortunately,
      it could not be verified.
    </p>

    <p>
      As a result, <strong>Premium access has not been activated</strong>
      for your account.
    </p>

    <p><strong>Possible reasons:</strong></p>
    <ul>
      <li>Payment screenshot or details were incorrect</li>
      <li>Transaction was not completed successfully</li>
      <li>Invalid or fake payment submission</li>
    </ul>

    <p>
      If you believe this is a mistake, you may try again using a
      <strong>valid UPI payment</strong> and submit correct details.
    </p>

    <p>
      For any questions, feel free to contact our support team.
    </p>

    <p style="margin-top:20px;">
      Regards,<br>
      <strong>UIForge Team</strong>
    </p>
  </div>
  `
      })
    }).then(res => res.json()).then(data => {
      alert(data.message);
    }).catch(() => {
      alert("Error");
    });
  
  await db.collection("payments").doc(pid).update({
    status: "declined",
    declinedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  await db.collection("payments").doc(pid).delete();
  
  showAlert("Payment declined", "error");
  
  window.location.reload();
};