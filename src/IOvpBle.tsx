export interface IOvpBle {
  startTransfer(): Promise<String>;
  stopTransfer(): void;
}
