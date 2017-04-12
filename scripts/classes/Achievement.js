function Achievement(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Achievement)) { 
		// Prevent accidental namespace pollution
		return new Achievement(props); 
	} 
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: test
	return this;
}
// Common Properties: type="achievement"
Achievement.prototype = new CivObj({
	constructor: Achievement,
	type: "achievement",
	initOwned: false,
	prestige : true, // Achievements are not lost on reset.
	vulnerable : false,
	get limit() { 		return 1; }, // Can't re-buy these.
	set limit(value) { 	return this.limit; } // Only here for JSLint.
},true);
