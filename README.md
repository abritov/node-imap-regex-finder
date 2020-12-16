# Imap-regex-finder

For example, if you need to extract steam confrimation codes from your mailbox:

```js

const { imapFindMatchedPatterns } = require('imap-regex-finder');

const creds = {
    user: 'YOUR_EMAIL',
    password: 'YOUR_PASSWORD',
    host: 'imap.mail.ru',
    port: 993,
    tls: true,
}

const codeFindRegex = new RegExp('\\r\\n[\\t+]{5,}([A-Z0-9]{5})[\\t]{5,}<\/td>', 'gm');

function recent5Hours() {
    const delay = 5 * 3600 * 1000;
    const recent = new Date();
    recent.setTime(Date.now() - delay);
    return recent;
}

async function main() {
    const codes = await imapFindMatchedPatterns(creds, new RegExp('Steam Account Recovery'), codeFindRegex, recent5Hours());
    console.debug(codes);
}

main()
    .then(() => console.debug('done'))
    .catch(err => console.error(err));
```
