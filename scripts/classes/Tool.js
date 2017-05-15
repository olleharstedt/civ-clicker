/**
 * Tool class
 * @constructor
 * @param {object} props - Properties
 */
function Tool(props)
{
  // Prevent accidental namespace pollution
  if (!(this instanceof Tool)) {
    return new Tool(props);
  }
  CivObj.call(this, props);
  copyProps(this, props, null, true);
  return this;
}

/**
 * @property {string} name           - Like 'axe' etc.
 */
Tool.prototype = new CivObj({
  constructor: Tool,
  type: 'tool',
  material: ''
});
