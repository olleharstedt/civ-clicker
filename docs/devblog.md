# 2017-07-43

* Weather simulation:
    Stochastic model (not vectors etc).
    Uses Markov chains.
    Parameterized by earlier weather data.

* Implementation:
    Markov chain.

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
