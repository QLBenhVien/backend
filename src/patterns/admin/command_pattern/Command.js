class Command {
  async execute() {
    throw new Error("Phương thức execute() cần được triển khai!");
  }
}

module.exports = Command;
