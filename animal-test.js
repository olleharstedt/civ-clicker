$(function () {

	function ndsolve(f, x0, dt, tmax) {
		var n = f.size()[0];  // Number of variables
		var x = x0.clone();   // Current values of variables
		var dxdt = [];        // Temporary variable to hold time-derivatives
		var result = [];      // Contains entire solution

		var nsteps = math.divide(tmax, dt);   // Number of time steps
		for(var i=0; i<nsteps; i++) {
			// Compute derivatives
			for(var j=0; j<n; j++) {
				dxdt[j] = f.get([j]).apply(null, x.toArray());
			}
			// Euler method to compute next time step
			for(var j=0; j<n; j++) {
        //console.log(x.get([j]));
        //console.log(dt);
        //console.log(dxdt[j]);
        //console.log(math.multiply(dxdt[j], dt));
				x.set([j], math.add(x.get([j]), math.multiply(dxdt[j], dt)));
			}
			result.push(x.clone());
		}

		return math.matrix(result);
	}

	// Import the numerical ODE solver
	math.import({ndsolve:ndsolve});

	// Create a math.js context for our simulation. Everything else occurs in the context of the expression parser!
  
  var doTheThing = function() {

	var sim = math.parser();

	sim.eval("G = 6.67408e-11 m^3 kg^-1 s^-2"); // Gravitational constant
	sim.eval("mbody = 5.972e24 kg");     // Mass of Earth
	sim.eval("mu = G * mbody");
	sim.eval("dt = 1.0 s");                // Simulation timestep
	sim.eval("tfinal = 162 s");          // Simulation duration
	sim.eval("T = 1710000 lbf * 0.9");         // Engine thrust
	sim.eval("g0 = 9.80665 m/s^2");      // Standard gravity: used for calculating prop consumption (dmdt)
	sim.eval("isp = 290 s");             // Specific impulse
	sim.eval("gamma0 = 89.99883 deg");    // Initial pitch angle (90 deg is vertical)
	sim.eval("r0 = 6378.1370 km");       // Equatorial radius of Earth
	sim.eval("v0 = 10 m/s");             // Initial velocity (must be non-zero because ODE is ill-conditioned)
	sim.eval("phi0 = 0 deg");            // Initial orbital reference angle
	sim.eval("m0 = 1207920 lbm + 30000 lbm");         // Initial mass of rocket and fuel

	// Define the equations of motion. It is important to maintain the same argument order for each of these functions.
	sim.eval("drdt(r, v, m, phi, gamma) = v sin(gamma)");
	sim.eval("dvdt(r, v, m, phi, gamma) = -mu / r^2 sin(gamma) + T / m");
	sim.eval("dmdt(r, v, m, phi, gamma) = -T/g0/isp");
	sim.eval("dphidt(r, v, m, phi, gamma) = v/r cos(gamma) * rad");
	sim.eval("dgammadt(r, v, m, phi, gamma) = (1/r * (v - mu / (r v)) * cos(gamma)) * rad");

	// Again, remember to maintain the same variable order in the call to ndsolve.
	sim.eval("result_stage1 = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], [r0, v0, m0, phi0, gamma0], dt, tfinal)");

	// Reset initial conditions for interstage flight
	sim.eval("T = 0 lbf");
	sim.eval("tfinal = 12 s");
	sim.eval("x = flatten(result_stage1[result_stage1.size()[1],:])");
	sim.eval("result_interstage = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], x, dt, tfinal)");

	console.log(sim.eval("result_interstage[result_interstage.size()[1],3]").toString());

	// Reset initial conditions for stage 2 flight
	sim.eval("T = 210000 lbf");
	sim.eval("isp = 348 s");
	sim.eval("tfinal = 397 s");
	sim.eval("x = flatten(result_interstage[result_interstage.size()[1],:])");
	sim.eval("x[3] = 273600 lbm");  // Lighten the rocket a bit since we discarded the first stage
	sim.eval("result_stage2 = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], x, dt, tfinal)");

	// Reset initial conditions for unpowered flight
	sim.eval("T = 0 lbf");
	sim.eval("tfinal = 60 s");
	sim.eval("x = flatten(result_stage2[result_stage2.size()[1],:])");
	sim.eval("result_unpowered = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], x, dt, tfinal)");

	// Extract the useful information from the results so it can be plotted
	var data_stage1 =     sim.eval("concat( (    result_stage1[:,4]' - phi0) * r0 / rad / km, (    result_stage1[:,1]' - r0) / km, 1 )' ").toArray().map(function(e) { return {x: e[0], y: e[1]}; });
	var data_interstage = sim.eval("concat( (result_interstage[:,4]' - phi0) * r0 / rad / km, (result_interstage[:,1]' - r0) / km, 1 )' ").toArray().map(function(e) { return {x: e[0], y: e[1]}; });
	var data_stage2 =     sim.eval("concat( (    result_stage2[:,4]' - phi0) * r0 / rad / km, (    result_stage2[:,1]' - r0) / km, 1 )' ").toArray().map(function(e) { return {x: e[0], y: e[1]}; });
	var data_unpowered =  sim.eval("concat( ( result_unpowered[:,4]' - phi0) * r0 / rad / km, ( result_unpowered[:,1]' - r0) / km, 1 )' ").toArray().map(function(e) { return {x: e[0], y: e[1]}; });


	var chart = new Chart(document.getElementById('canvas1'), {
		type: 'line',
		data: {
			datasets: [{
				label: "Stage 1",
				data: data_stage1,
				fill: false,
				borderColor: "red",
				pointRadius: 0
			}, {
				label: "Interstage",
				data: data_interstage,
				fill: false,
				borderColor: "green",
				pointRadius: 0
			}, {
				label: "Stage 2",
				data: data_stage2,
				fill: false,
				borderColor: "orange",
				pointRadius: 0
			}, {
				label: "Unpowered",
				data: data_unpowered,
				fill: false,
				borderColor: "blue",
				pointRadius: 0
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}]
			}
		}

	});
  }

  //doTheThing();

  // Test 1

  math.config({
    number: 'number' // Default type of number: 
    // 'number' (default), 'BigNumber', or 'Fraction'
  });
  const sim2 = math.parser();
  sim2.eval("alpha = 0.5");
  sim2.eval("beta = 0.01");
  sim2.eval("delta = 0.003");
  sim2.eval("gamma = 1");
  //sim2.eval("dxdt(x, y) = alpha * x - beta * x * y");
  //sim2.eval("dydt(x, y) = delta * x * y - gamma * y");

	//sim2.eval("dxdt(x, y) = (2 * x) - (x * y)");
	//sim2.eval("dydt(x, y) = (-0.25 * y) + (x * y)");

	//sim2.eval("dxdt(x, y) = 2 * x - 0.1 * (x * x) - 1.1 * x * y");
	//sim2.eval("dydt(x, y) = -y - 0.1 * y * y + 0.9 * x * y");

  // Pan-Ping Liu, 2a, 2b
  sim2.eval("alpha = 6.8");
  sim2.eval("beta = 1.25");
  sim2.eval("delta = 0.8");
  sim2.eval("gamma = 0.5");
	sim2.eval("dxdt(x, y) = x * (alpha - x) - ((beta * x * x * y) / (1 + x * x))");
	sim2.eval("dydt(x, y) = ((delta * x * x * y) / (1 + x * x)) - gamma * y");

  /*
  let x = 2;
  let y = 1;
  let datax = [];
  let datay = [];
  for (let j = 0; j < 4000; j++) {
    if (j % 250 == 0 && y > 1) {
      y -= 1; //Math.random();
      //y = 0;
    }
    sim2.eval("dt = 0.01");
    sim2.eval("x0 = " + x);
    sim2.eval("y0 = " + y);
    sim2.eval("tfinal = 0.02");
    sim2.eval("result_stage1 = ndsolve([dxdt, dydt], [x0, y0], dt, tfinal)");
    let data_stage1 =     sim2.eval("result_stage1").toArray().map(function(e) { return {x: e[0], y: e[1]}; });
    y = data_stage1[0].y;
    x = data_stage1[0].x;
    datax.push({x: j, y: y});
    datay.push({x: j, y: x});
  }
  */

  //console.log(data_stage1);
  /*
  first = [];
  for (let i = 0; i < data_stage1.length; i++) {
    //data_stage1[i].x = i;
    first.push({
      x: i,
      y: data_stage1[i].y
    });
  }
  other = [];
  for (let i = 0; i < data_stage1.length; i++) {
    other.push({
      x: i,
      y: data_stage1[i].x
    });
  }
  //console.log(other);
  */

  /*
  let r = 0.25;
  let k = 10;
  let p =1;
  let datax = [];
  datax.push({x: 0, y: p});
  for (let t = 1; t < 116; t++) {
    p = (1 + r * (1 - p / k)) * p;
    datax.push({x: t, y: p});
    if (t == 30) {
      k += 5;
    }
    if (t > 35 && t < 100 && p >= 1) {
      p -= 1;
    }
  }

  p = 15;
  let datax2 = [];
  k = 10;
  datax2.push({x: 0, y: p});
  for (let t = 1; t < 50; t++) {
    p = (1 + r * (1 - p / k)) * p;
    datax2.push({x: t, y: p});
  }
  */

  let K = 1.0;  // K, carrying capacity, is not stable to increase
  let r = 1.3;
  let s = 0.5;
  let u = 0.7;
  let v = 1.6;
  let h = 0.01;
  let P = 1;
  let Q = 1;
  let dP = null;
  let dQ = null;
  let data1 = [];
  let data2 = [];
  data1.push({x: 0, y: P});
  data2.push({x: 0, y: Q});
  for (let t = 1; t < 9000; t++) {
    dP = (r * (1 - P/K) - s * Q) * P * h;
    dQ = (-u + v * P) * Q * h;
    P = P + dP;  // Wolfs
    Q = Q + dQ;  // Bunnies
    data1.push({x: t, y: P});
    data2.push({x: t, y: Q});
    if (t == 1500) {
      K = 2;  // Bigger terratory
    }
    if (t == 3000) {
      Q -= 0.5;  // Chock hunting
    }
  }

  /*
  // No way to increase "carrying capacity" easy?
  let r = 1.3;
  let s = 0.5;
  let u = 0.7;
  let v = 1.6;
  let h = 0.001;
  let P = 1;
  let Q = 3;
  let dP = null;
  let dQ = null;
  let data1 = [];
  let data2 = [];
  data1.push({x: 0, y: P});
  data2.push({x: 0, y: Q});
  for (let t = 1; t < 30000; t++) {
    dP = (r - s * Q) * P * h;
    dQ = (-u + v * P) * Q * h;
    P += dP;
    Q += dQ;
    data1.push({x: t, y: P});
    data2.push({x: t, y: Q});
    if (t == 10000) {
      //Q += 2;
      //P += 2;
    }
  }
  */

	var chart = new Chart(document.getElementById('canvas1'), {
		type: 'line',
		data: {
			datasets: [{
				label: "Wolfs",
				data: data1,
				fill: false,
				borderColor: "red",
				pointRadius: 0
			},
      {
				label: "Bunnies",
				data: data2,
				fill: false,
				borderColor: "blue",
				pointRadius: 0
			}
      ]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}]
			}
		}
  });


  /*
	const sim3 = math.parser();
	sim3.eval("dydt(x) = x * dt");
	sim3.eval("x0 = 0");
	sim3.eval("tfinal = 100 s");          // Simulation duration
	sim3.eval("dt = 1.0 s");                // Simulation timestep
	sim3.eval("result_stage1 = ndsolve([dydt], [x0], dt, tfinal)");
  */

});
