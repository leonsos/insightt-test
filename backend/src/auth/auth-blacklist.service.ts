import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  clearBlacklist(): void {
    this.blacklistedTokens.clear();
  }
}
