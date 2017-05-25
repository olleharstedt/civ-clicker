class WorkUnit extends Unit {
  constructor(props) {
    super(props);

    this.constructor = WorkUnit;
    this.type        = 'unit';  // TODO
  }

  doWork() {
    throw 'Must be overwritten';
  }

  get limit() {
    return 10;
  }
}
