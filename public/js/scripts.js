document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculateBtn").addEventListener("click", function (e) {
        e.preventDefault();
        
        let epsGrowth = parseFloat(document.getElementById("epsGrowth").value);
        let peEstimate = parseFloat(document.getElementById("peEstimate").value);
        let epsTTM = parseFloat(document.getElementById("epsTTM").innerText);

        let rawEpsTTM = document.getElementById("epsTTM").value;
console.log("Raw EPS TTM value:", rawEpsTTM); // Check if it's empty

        console.log(typeof epsGrowth, epsGrowth);
console.log(typeof peEstimate, peEstimate);
console.log(typeof epsTTM, epsTTM);

        if (!isNaN(epsGrowth) && !isNaN(peEstimate)) {
            let stickerPrice = (peEstimate * (epsTTM * (1 + epsGrowth) ** 10)) / ((1.15) ** 10);
            let mosPrice = stickerPrice / 2; 
            
            document.getElementById("stickerPrice").innerHTML = stickerPrice.toFixed(2);
            document.getElementById("mosPrice").innerHTML = mosPrice.toFixed(2);
        } else {
            alert("Please enter valid numbers.");
        }
    });
});
