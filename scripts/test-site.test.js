import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
it('keeps the public root a plain moved notice with no destination or login links',()=>{
 const html=readFileSync('index.html','utf8');expect(html).toContain('Sorry, сайт переехал');expect(html).not.toMatch(/href=|http-equiv|VietSveta|test\//i);
});
it('gives the tester icon a separate start URL and scope',()=>{
 const m=JSON.parse(readFileSync('public/test/manifest.webmanifest','utf8'));expect(m.start_url).toBe('./');expect(m.scope).toBe('./');expect(m.name).toContain('Тестовая');
 const entry=readFileSync('test/index.html','utf8');expect(entry).toContain('/src/testMain.tsx');expect(entry).toContain('noindex,nofollow');
});
