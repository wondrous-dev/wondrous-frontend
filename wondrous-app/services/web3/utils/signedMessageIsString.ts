export default function signedMessageIsString(message: string | boolean): message is string {
  return typeof message === 'string';
}
