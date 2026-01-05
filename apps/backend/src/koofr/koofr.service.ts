// koofr.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { WebDAVClient } from 'webdav'; // ⭐ type-only，不会生成 require

@Injectable()
export class KoofrService implements OnModuleInit {
  private client!: WebDAVClient;

  async onModuleInit() {
    const webdav = await import('webdav'); // ⭐关键点
    const { createClient } = webdav;

    this.client = createClient(process.env.KOOFR_DAV_URL!, {
      username: process.env.KOOFR_USERNAME!,
      password: process.env.KOOFR_PASSWORD!,
    });
  }

  async uploadFile(path: string, buffer: Buffer) {
    await this.client.putFileContents(path, buffer, {
      overwrite: true,
    });
  }
}
