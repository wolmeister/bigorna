# BIGORNA

<p align="center">
  <img src="https://raw.githubusercontent.com/wolmeister/bigorna/main/web/public/favicon.png" width="400" />
</p>

# Objective
This project aims to create an environment for publishing and disseminating mods/addons
# Database
Diagram:
<p align="center">
  <img src="https://raw.githubusercontent.com/wolmeister/bigorna/main/api/diagram.png" width="600" />
</p>

# Technologies
<p>
<img src="https://blog.4linux.com.br/wp-content/uploads/2019/12/node-js-1900x950_c.png" alt="drawing" width="200"/>
<img src="https://miro.medium.com/max/852/1*1ckgC6nPiidH23AUBxBS_A.png" alt="drawing" width="200"/>
<img src="https://miro.medium.com/max/578/0*T_qnjkS2GPw7995A.png" alt="drawing" width="200"/>
<img src="https://camo.githubusercontent.com/87724523063a50fdb4afb3e99a06d7c23d5853c41226e8f48b3ef5035db0e894/68747470733a2f2f692e696d6775722e636f6d2f774434725674342e706e67" alt="drawing" width="200"/>
<p>

# Installation
You need:
* Node ```https://nodejs.org/en/```
* pnpm ```if you have npm, run: npm install -g pnpm```

clone this repository
```bash
git clone https://github.com/wolmeister/bigorna
```
go to /bigorna and run:
```bash
pnpm install
```

## Run project
### API

go to /bigorna/api and run:
```bash
pnpm run gen
```
Start server:
```bash
pnpm run dev
```

### WEB

go to /bigorna/web and start server:
```bash
pnpm run dev
