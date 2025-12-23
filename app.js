let isPremiumUser = false;

auth.onAuthStateChanged(async (user) => {
  if(!user){
    location.href= "./auth.html";
    return;
  }
  
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();
  
  if(!snap.exists) return;
  
  const data = snap.data();
  
  if(!data.premiumExpiry && Date.now() > data.premiumExpiry){
    await ref.update({ isPremium: false });
    isPremiumUser = false;
  } else {
    isPremiumUser = data.isPremium === true;
  }
  
  if(isPremiumUser) {
    document.querySelector(".ad").style.display = "none";
    document.getElementById("ads").style.display = "none";
  }
});

window.download = async () => {
  const canvas = await html2canvas(
    document.getElementById("mockup"),
    {
      backgroundColor: "#000",
      scale: 2
    }
  );

  const ctx = canvas.getContext("2d");

  if (isPremiumUser !== true) {
    const text = "UIForge • Free Version";

    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const angle = -Math.PI / 4;
    const stepX = 300;
    const stepY = 180;

    // COVER FULL CANVAS
    for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
      for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }
  }

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "mockup.png";
  link.click();
};