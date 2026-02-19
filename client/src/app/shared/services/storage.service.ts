import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  myCipher = null;
  myDecipher = null;

  constructor(@Inject('systemConfig') public SystemConfig) {
    this.myCipher = this.cipher(this.SystemConfig.cipherKey || '8GFBx2ucQ8');
    this.myDecipher = this.decipher(this.SystemConfig.cipherKey || '8GFBx2ucQ8');
  }

  setData(key: string, data: any, type: any = 'session') {
    const _data = this.myCipher(JSON.stringify(data));
    switch (type) {
      case 'local':
        localStorage.setItem(key, _data);
        break;
      case 'session':
        sessionStorage.setItem(key, _data);
        break;
    }
  }

  getData(key: string, type: any = 'session') {
    let _data = 'undefined';
    switch (type) {
      case 'local':
        _data = localStorage.getItem(key);
        break;
      case 'session':
        _data = sessionStorage.getItem(key);
        break;
    }
    if (_data && _data != 'undefined') {
      if (!this.chipperChecker(_data)) {
        return JSON.parse(this.myDecipher(_data));
      } else {
        return JSON.parse(_data);
      }
    } else {
      return null;
    }
  }

  flush(key: string, type: any = 'session') {
    switch (type) {
      case 'local':
        localStorage.removeItem(key);
        break;
      case 'session':
        sessionStorage.removeItem(key);
        break;
    }
  }

  cipher = (salt) => {
    const enc = new TextEncoder();
    const saltBytes = enc.encode(String(salt));

    return (text) => {
      const bytes = enc.encode(String(text));
      const out = new Uint8Array(bytes.length);

      for (let i = 0; i < bytes.length; i++) {
        out[i] = bytes[i] ^ saltBytes[i % saltBytes.length];
      }

      return Array.from(out, b => b.toString(16).padStart(2, "0")).join("");
    };
  };

  decipher = (salt) => {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const saltBytes = enc.encode(String(salt));

    return (hex) => {
      const clean = String(hex);
      if (clean.length % 2 !== 0) throw new Error("Invalid hex string");

      const bytes = new Uint8Array(clean.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
      }

      const out = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        out[i] = bytes[i] ^ saltBytes[i % saltBytes.length];
      }

      return dec.decode(out);
    };
  };
  chipperChecker(item: string) {
    try {
      JSON.parse(item);
      return true;
    } catch (error) {
      return false;
    }
  }
}
