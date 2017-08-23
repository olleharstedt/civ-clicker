class WorkUnit extends Unit {
  constructor(props) {
    super(props);

    this.constructor = WorkUnit;
    this.type        = 'unit';  // TODO
  }

  doWork() {
    throw 'doWork must be overwritten';
  }

  get limit() {
    return 10;
  }
}
