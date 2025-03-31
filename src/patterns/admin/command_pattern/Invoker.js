class ShiftInvoker {
  constructor() {
    // this.history = []; // Lưu lịch sử các command để hỗ trợ undo
  }

  async executeCommand(command) {
    try {
      const result = await command.execute();
      //   this.history.push(command);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //   async undoLastCommand() {
  //     if (this.history.length === 0) {
  //       throw new Error("Không có thao tác nào để hoàn tác!");
  //     }

  //     const lastCommand = this.history.pop();
  //     return await lastCommand.undo();
  //   }
}

module.exports = ShiftInvoker;
