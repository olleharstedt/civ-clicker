# 2017-10-30

* Animal population simulation
* https://en.wikipedia.org/wiki/Lotka%E2%80%93Volterra_equations
* https://en.wikipedia.org/wiki/Competitive_Lotka%E2%80%93Volterra_equations
* https://en.wikipedia.org/wiki/Agent-based_model_in_biology
* https://en.wikipedia.org/wiki/Monte_Carlo_method#Computational_biology

# 2017-10-26

* Make bigger dev blog entry for /r/incremental_games
* Still very much alpha/under development.
* ES6.
* Plugin system.
* Weather CLIMAK model.
* Tools..
* Screenshots.
* SkyHawkB.
* Help wanted: Animal sim, crop sim, icons.

# 2017-09-14

* Gamma distribution is skewed wrong - less rain is more common than more rain
* Temperature depends on wet/dry days.
* Another article about weather generation: https://www.researchgate.net/publication/228543743_Climak_A_stochastic_model_for_weather_data_generatio
* `8 + 5 * sin(x * (2 * 3.1415) / 100) + 3 * sin(x * (2 * 3.1415) / 50)`
* SkyHawkB helping with icons, coding, ideas.
* More work done on weather simulation, weather-test.html.

# 2017-07-18

* Important property of weather is the probability of wet/dry spells.
* P(w|w) > P(w|d)
* Might be more "fun and colourful" if I use multiple states instead of just wet/dry, like "thunder", "storm", "fog" and so on.
* Annual variety

# 2017-07-16

So, I'm reading up on weather simulation and thought I might share some new found knowledge:

* There seem to be two basic ways to predict weather: Fluid dynamics and stochastic weather simulation.
* Fluid dynamics treat the atmosphere like a fluid, because that's what it is. This method uses physical equations for fluids to simulate how humidity moves, so you end up with a map of temperature, rain fall, air pressure, etc. It's not useful for our case, since CivClicker doesn't have a map!
* Stochastic weather prediction uses probabilities to predict weather. It does not produce a map, but a probability of rain fall etc in a single place. This is perfect for CivClicker, since it has only one place. ;)
* The basis of a stochastic weather prediction model is a Markov chain like so (by Richardson (1981)):

    P(dry today|wet yesterday)=1−P(wet today|wet yesterday)
    P(dry today|dry yesterday)=1−P(wet today|dry yesterday)

That is, the probability of it being dry today when it was wet yesterday, is 1 minus the probability that it is wet today if it was wet yesterday. The right-hand side above (`P(w|w)` and `P(w|d)`) must be known before, by doing measurement at the specific spot you want to predict the weather. If we were meteorologists, we could then calculate the probability of rain on day `t = 150` by doing a matrix calculation, but since this is a computer game we will do the calculations as we go along (we don't need to predict the weather), meaning the Markov chain math can be replaced by some simple if-statements:

    if (wet_yesterday and random_variable > P(w|w)) then
      wet_today
    else
      dry_today

* After you've decided if today is a rainy day, you calculate the amount of rain and the temperature using a normal distribution. The normal distribution is adapted to the weather data you have for this specific spot.
* Seasonal adjustments can be made using Fourier series. A Fourie series is an infinite sum of trigonometric functions (sin, cos, ...). Apparently, a Fourier series can be used to approximate _any_ periodic function.
* The above sketch comes from [this paper](http://journals.ametsoc.org/doi/citedby/10.1175/1520-0450%281996%29035%3C1878%3ASWSOAA%3E2.0.CO%3B2), which compares two stoachastic models, USCLIMATE and CLIGEN. I can only assume there's an endless amount of variations, but I'd have to read up some more first.
* The big question is of course how to parameterize the model sensibly for CivClicker. Where does CivClicker take place, really? Middle east? Meso-America? Yellow river? Best would of course be if the user could choose which climate model to use. This is also related to which crops are being harvested, and number of harvests per year. which vary between civilizations.
* Another question is if we should use the climate variations during the last 20'000 years (end of last ice-age). Not sure if that makes sense, from a gaming point of view.

OK, have a nice week, everybody! Thanks for reading.

# 2017-07-43

* Weather simulation:
    Stochastic model (not vectors etc).
    Uses Markov chains.
    Parameterized by earlier weather data.

* Implementation:
    Markov chain. Only useful for state prediction?
    Continuous distributions are not memoryless.
    Use sin/cos or normal distribution in probability matrix? "sin^2 + cos^2 = 1"
    Run tests to see weather for 100 days.

* How long in realtime is one year in gametime? 1 x day/night = 4 weeks?

# 2017-07-02

* Hearth uses fire to keep citizens warm during night and scare off wild animals.
* Cook food?
* Policy to control hearth fire usage? As in Cities Skylines.
* Use sin(x) to control findings from gatherers; distribution.
* Math: (1 - (1 / (x / 300 + 1))) * 100. See pics.

# 2017-06-23

* Clay - pottery and house building.
* Equipment as configuration. Only allow one equipment per citizen? Or one equipment per type, like one tool/weapon, one clothing, one jewlery. Use equipment to deal with different climate, weather, and war.
* Göbekli Tepe - ideology before material change? Religion before agriculture.
* Culture points.

# 2017-06-16

* Conditional distribution for stone/wood gathering? New object: Place (forrest, mine, steppe, etc, which have their own distribution of stone/wood/etc.) And gatherers always go from one place to the next? Can places be updated every tick, too? To "grow" wood. Discover new places when exploring/battle. Problem: Where should gatheres look? In the most recent place? Or the best place? Or make the user move citisens between places? Then new GUI is needed. Each place has its own climate? Climate zone. What are the probability that one gatherer will be in a forrest? Affected by nation size? How long does it take to move from one place to the other? One tick? Make the world 1-dimensional, push/pop places into list, move time is distance in list.
* Pic of button group to control x.
* What are the steps between hunter/gatherer and agriculture? Wild gardening.
* Dogs were domesticated before agriculture was fully fleshed out.
* Shells as currency? Enabling more efficient trade?
* Hunting dependent on season, as would harvest be.

# Another game

* One-dimensional, all units and buildings placed on a line.
    Walk, horse, Train, car, plane, ...
* Logistics, transfer good between places.
* Logic on backend to enable highscore and multiplayer.
* Backend in vanilla Java, frontend in vanilla ES6.
    Dropwizard, spring
* GPL license.
