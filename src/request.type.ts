export interface RequestType {
  url: string;
  method: string;
  headers: { [key: string]: any };
  initiator?: any;
  body?: string;
}
