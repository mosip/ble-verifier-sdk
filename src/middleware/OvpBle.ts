class OvpBle {
  private resultResolve: (value: PromiseLike<string>) => void;
  private resultReject: (reason?: any) => void;

  startTransfer() {
    return new Promise((res, rej) => {
      this.resultResolve = res;
      this.resultReject = rej;
    });
  }
}

export default OvpBle;
