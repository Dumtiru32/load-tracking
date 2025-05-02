//Shared data object

const loadData = {
  driver: "",
  dispatcher: "",
  pickupDate: "",
  pickupTimeStr: "",
  deliveryDate: "",
  pickupCity: "",
  deliveryCity: "",
  rate: 0,
  fullMiles: 0,
  totalMiles: 0,
  deadhead: 0,
  fuelPrice: 0,
  fuelCost: 0,
  ratePerMile: 0,
  dispatcherPercent: 0,
  dispatcherProfit: 0,
  driverProfit: 0,
  eta: 0
}

//Dead Head and fuel consuption calculating



function calculateDeadHead() {
    loadData.rate = Number(document.getElementById('rate').value) || 0;
    loadData.totalMiles = Number(document.getElementById('totalMiles').value) || 0;
    loadData.fullMiles = Number(document.getElementById('fullMiles').value) || 0;
    loadData.fuelPrice = Number(document.getElementById('fuelPrice').value) || 0;
    loadData.dispatcherPercent = document.getElementById('profitDisp').value || 0;
    loadData.driver = document.getElementById('drivId').value;
    loadData.dispatcher = document.getElementById('dispId').value;
    loadData.pickupDate = document.getElementById('puDate').value;
    loadData.deliveryDate = document.getElementById('delDate').value;
    loadData.pickupCity = document.getElementById('puCity').value;
    loadData.deliveryCity = document.getElementById('delCity').value;
    loadData.pickupTimeStr = document.getElementById('pickupTime').value || 0;

    const rateN = Number(loadData.rate);
    const total = Number(loadData.totalMiles);
    const full = Number(loadData.fullMiles);
    const price = Number(loadData.fuelPrice);
    const disp = Number(loadData.dispatcherPercent);
    const pickupTime = String(loadData.pickupTimeStr);
    const pickupDate = new Date(loadData.pickupDate);

    if (!isNaN(total) && !isNaN(full) && !isNaN(price) && !isNaN(rateN) && !isNaN(disp)) {
        const deadHead = total - full;
        const fuel = total / 6.47 * price;
        const rateMile = rateN / total;
        const dispProf = rateN * (disp / 100);
        const driveProf = rateN - fuel - dispProf;
        const avgSpeed = 50;
        const driveHours = total / avgSpeed;
        const maxDriveTime = 11;
        const restTime = 10; // in hours
        let remainingDrive = driveHours;
        let totalTime = 0;
        


        while (remainingDrive > 0) {
          if (remainingDrive > maxDriveTime) {
            totalTime += maxDriveTime + restTime; // driving + mandatory rest
            remainingDrive -= maxDriveTime;
          } else {
            totalTime += remainingDrive;
            remainingDrive = 0;
          }
        }
        // Parse pickup time into Date object
          const [hours, minutes] = pickupTime.split(":").map(Number);
          
          pickupDate.setHours(hours, minutes, 0);

          const etaDate = new Date(pickupDate.getTime() + totalTime * 60 * 60 * 1000);

          // Format ETA
          const eta = etaDate.toLocaleString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "short"
          });
      

        // Save to loadData
        loadData.deadhead = deadHead;
        loadData.fuelCost = fuel;
        loadData.ratePerMile = rateMile;
        loadData.dispatcherProfit = dispProf;
        loadData.driverProfit = driveProf;
        loadData.eta = eta;

        // Update UI
        document.getElementById('deadHead').innerHTML = `Deadhead Miles: <strong>${deadHead}</strong>`;
        document.getElementById('fuelCons').innerHTML = `Fuel cost: <strong>$${fuel.toFixed(2)}</strong>`;
        document.getElementById('rateMile').innerHTML = `Rate per mile: <strong>$${rateMile.toFixed(2)}</strong>`;
        document.getElementById('profitDispatcher').innerHTML = `Dispatcher's profit: <strong>$${dispProf.toFixed(2)}</strong>`;
        document.getElementById('profitDriver').innerHTML = `Driver's profit: <strong>$${driveProf.toFixed(2)}</strong>`;
        document.getElementById('eta').innerHTML = `ETA: <strong>${eta}</strong>`
    } else {
        document.getElementById('deadHead').innerHTML = "Please enter valid miles.";
        document.getElementById('fuelCons').innerHTML = "Please enter valid price.";
        document.getElementById('rateMile').innerHTML = "Please enter a valid rate.";
        document.getElementById('profitDispatcher').innerHTML = "Please enter valid dispatcher %.";
        document.getElementById('profitDriver').innerHTML = "Please enter valid numbers.";
        document.getElementById('eta').innerHTML = 'Please enter valid pickup date.'
    }
}
function addLoad() {
    const table = document.getElementById("loadBord");
    const row = table.insertRow();
  
    row.insertCell(0).innerText = loadData.driver;
    row.insertCell(1).innerText = loadData.dispatcher;
    row.insertCell(2).innerText = loadData.pickupDate;
    row.insertCell(3).innerText = loadData.pickupTimeStr;
    row.insertCell(4).innerText = loadData.deliveryDate;
    row.insertCell(5).innerText = loadData.pickupCity;
    row.insertCell(6).innerText = loadData.deliveryCity;
    row.insertCell(7).innerText = '$' + Number(loadData.rate).toFixed(2);
    row.insertCell(8).innerText = loadData.fullMiles;
    row.insertCell(9).innerText = loadData.totalMiles;
    row.insertCell(10).innerText = loadData.deadhead;
    row.insertCell(11).innerText = '$' + Number(loadData.fuelPrice).toFixed(2);
    row.insertCell(12).innerText = '$' + Number(loadData.fuelCost).toFixed(2);
    row.insertCell(13).innerText = '$' + Number(loadData.ratePerMile).toFixed(2);
    row.insertCell(14).innerText = loadData.eta;
    row.insertCell(15).innerText = '$' + Number(loadData.driverProfit).toFixed(2);
    row.insertCell(16).innerText = loadData.dispatcherPercent + "%";
    row.insertCell(17).innerText = '$' + Number(loadData.dispatcherProfit).toFixed(2);

    let savedLoads = JSON.parse(localStorage.getItem("loads")) || [];
savedLoads.push({ ...loadData });
localStorage.setItem("loads", JSON.stringify(savedLoads));
  }

  function loadSavedLoads() {
    const savedLoads = JSON.parse(localStorage.getItem("loads")) || [];
  
    const table = document.getElementById("loadBord");
  
    savedLoads.forEach(data => {
      const row = table.insertRow();
      row.insertCell(0).innerText = data.driver;
      row.insertCell(1).innerText = data.dispatcher;
      row.insertCell(2).innerText = data.pickupDate;
      row.insertCell(3).innerText = data.pickupTimeStr;
      row.insertCell(4).innerText = data.deliveryDate;
      row.insertCell(5).innerText = data.pickupCity;
      row.insertCell(6).innerText = data.deliveryCity;
      row.insertCell(7).innerText = '$' + Number(data.rate).toFixed(2);
      row.insertCell(8).innerText = data.fullMiles;
      row.insertCell(9).innerText = data.totalMiles;
      row.insertCell(10).innerText = data.deadhead;
      row.insertCell(11).innerText = '$' + Number(data.fuelPrice).toFixed(2);
      row.insertCell(12).innerText = '$' + Number(data.fuelCost).toFixed(2);
      row.insertCell(13).innerText = '$' + Number(data.ratePerMile).toFixed(2);
      row.insertCell(14).innerText = data.eta;
      row.insertCell(15).innerText = '$' + Number(data.driverProfit).toFixed(2);
      row.insertCell(16).innerText = data.dispatcherPercent + "%";
      row.insertCell(17).innerText = '$' + Number(data.dispatcherProfit).toFixed(2);
    });
  };


window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('rate').addEventListener("input", calculateDeadHead);
    document.getElementById('totalMiles').addEventListener("input", calculateDeadHead);
    document.getElementById('fullMiles').addEventListener("input", calculateDeadHead);
    document.getElementById('fuelPrice').addEventListener("input", calculateDeadHead);
    document.getElementById('profitDisp').addEventListener("input", calculateDeadHead);
    document.getElementById('eta').addEventListener("input", calculateDeadHead);
    loadSavedLoads();
});

//document.querySelector('.proceedBt').addEventListener('click', addLoad);
