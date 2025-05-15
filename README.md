# XRPL-EVM-AUTO-BOT

A versatile terminal bot for interacting with XRPL EVM DEX (e.g., XRiSE33) using Node.js and ethers.js.  
Supports token swaps, liquidity management, token deployment, random airdrops, and multi-wallet operations.

---

## Features

- **Token Swaps** (XRP, RISE, RIBBIT, WXRP, or any custom token)
- **Custom Token Swaps** (choose any tokenIn/tokenOut)
- **Add Liquidity** (liquidity pool management)
- **Deploy ERC20 Token** (requires ERC20Bytecode.json & ABI)
- **Random Token Transfers** (simulate airdrop)
- **Multi-wallet Support** (just add more PRIVATE_KEYs in your `.env`)
- **Interactive Terminal Menu**
- **Send transactions to random or custom addresses**

---

## Requirements

- Node.js (v16 or higher)
- NPM
- XRPL EVM RPC endpoint (default: `http://rpc.xrplevm.org/`, configurable via `.env` or `index.js`)
- At least one private key (add in `.env`)


---

## Setup

1. **Clone the repository & enter the directory:**
   ```bash
   git clone https://github.com/IkySyptraa/XRPL-EVM-AUTO-BOT.git
   cd XRPL-EVM-AUTO-BOT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Prepare your `.env` file:**
   ```
   PRIVATE_KEY1=0xyourfirstprivatekey
   # PRIVATE_KEY2=0xyoursecondprivatekey
   # PRIVATE_KEY3=...
   # Add more wallets if needed:
   ```


## Usage

1. **Run the bot:**
   ```bash
   node index.js
   ```
   _or with npm:_
   ```bash
   npm start
   ```

2. **Follow the interactive terminal menu:**
   - Choose swap, add liquidity, deploy, etc.
   - Enter amounts, recipient addresses, and other prompts as needed.

---

## Default Tokens

- XRP:    `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
- RISE:   `0x0c28777DEebe4589e83EF2Dc7833354e6a0aFF85`
- RIBBIT: `0x73ee7BC68d3f07CfcD68776512b7317FE57E1939`
- WXRP:   `0x`.**

---

## Notes

- **Never share your private key.**  
  Store it in `.env` and never commit your `.env` to public repositories.
- **Deploy Token:**  
  Make sure `ERC20Bytecode.json` and related ABI are correct before using the deploy menu.
- **Multi-wallet:**  
  The bot will automatically loop through all `PRIVATE_KEY` entries in your `.env`.
- **Random Transfer:**  
  Random address transfer is useful for airdrop simulation and testnet usage.

---

## License

MIT

---

## Credits

Developed by @PetrukStar

telegram: https://t.me/PetrukStar

github: https://github.com/PetrukStar
XRPL EVM Multi-Bot Terminal

---

Let me know if you want to add badges, usage tips, screenshots, or any other section!