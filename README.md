# dnsimple-sample

An example how to update a register (IP) in Dnsimple.com

## Introdution

I'm using Dnsimple (https://dnsimple.com) because they have an API that works very well.

I made a Shell Script with requests to the API us "curl". But I decided to make one in Node.js.

I could have used the library request (https://github.com/request/request) to use the API but I found this module https://github.com/fvdm/nodejs-dnsimple is fine.

## Testing

Clone this repository.

```js
git clone https://github.com/monchopena/dnsimple-sample
cd dnsimple-sample
npm install
```

Then copy config.sample.js

```js
cp config.sample.js config.js
```

And change test data for you Dnsimple domain, register, ...

## Other things

This program is funny because include a Cron.
