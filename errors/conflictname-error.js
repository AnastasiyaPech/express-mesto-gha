class ConflictnameError extends Error {
  constructor(message) {
    super(message);
    this.code = 11000;
  }
}

module.exports = { ConflictnameError };
