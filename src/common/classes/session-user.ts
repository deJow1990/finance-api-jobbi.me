export class SessionUser {
  constructor(id: string) {
    this.id = id;
  }

  static create(id: string): SessionUser {
    return new SessionUser(id);
  }
  id: string;
}
