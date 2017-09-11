$(function () {

  // Return number of rain streaks.
  function getNumberOfStreaks(list) {
    //let streaks = 0;
    let isStreak = true;
    let streakLength;
    let streakLengths = [];
    for (let i = 0; i < list.length; i++) {
      let rain = list[i];
      if (rain && list[i - 1]) {
        if (!isStreak) {
          //streaks++;
        }
        isStreak = true;
        streakLength++;
      } else {
        isStreak = false;
        if (streakLength > 0) {
          streakLengths.push(streakLength);
        }
        streakLength = 0;
      }
    }
    return streakLengths;
  }

  let weatherList = [];
  const totalDays = 100;
  let precList= [];
  let totalPrec = 0;
  let precSeasonList = [];
  let cosList = [];
  for (let i = 0; i < totalDays; i++) {
    CivClicker.plugins.Weather.decideWetOrDry();
    if (CivClicker.plugins.Weather.wetOrDry == 2) {
      // 2 == DRY
      weatherList.push(0);
    } else {
      // 3 == WET
      weatherList.push(1);
    }
    const prec = CivClicker.plugins.Weather.getPrecipitation();
    totalPrec += prec;
    precList.push(prec);
    const cos = Math.cos(i / (50/Math.PI)) /2 + 1;
    cosList.push(cos);
    precSeasonList.push(prec * cos);
  }

  var streaks = getNumberOfStreaks(weatherList);
  document.getElementById('info').innerHTML = `
    <p>Total "days": ${totalDays}</p>
    <p>Rain streaks: ${streaks.length}</p>
    `;

  streaks.sort((a, b) => { return b - a;});
  let ctx = document.getElementById('streaks').getContext('2d');
  let myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: streaks,
      datasets: [
        {
          label: 'Length of streak',
          data: streaks
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  // Gamma
  let list = [];
  let a = 0.5;
  let b = 10;
  for (let i = 0; i < 1; i += 0.01) {
    list.push(CivClicker.plugins.Weather.getGammaDistribution(i, a, b));
  }
  ctx = document.getElementById('gamma').getContext('2d');
  gammaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: list,
      datasets: [
        {
          label: 'Gamma distribution function',
          data: list
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  // Precipitation during 100 days above.
  const totalPrecElem = document.getElementById('totalPrec');
  totalPrecElem.innerHTML = totalPrec;
  ctx = document.getElementById('prec').getContext('2d');
  precChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: precList,
      datasets: [
        {
          label: 'Precipitation during 100 "days"',
          data: precList
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  // Seasonal precipitation during 100 days above.
  //const totalPrecElem = document.getElementById('totalPrec');
  //totalPrecElem.innerHTML = totalPrec;
  ctx = document.getElementById('seasonalPrec').getContext('2d');
  precChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: precSeasonList,
      datasets: [
        {
          label: 'Seasonal precipitation during 100 "days"',
          data: precSeasonList
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  /*
  // Seasonal precipitation during 100 days above.
  //const totalPrecElem = document.getElementById('totalPrec');
  //totalPrecElem.innerHTML = totalPrec;
  ctx = document.getElementById('cos').getContext('2d');
  precChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cosList,
      datasets: [
      {
        label: 'Cos',
        data: cosList
      }
      ]
    },
    options: {
      'label': 'bla'
    }
  });
  */
});

