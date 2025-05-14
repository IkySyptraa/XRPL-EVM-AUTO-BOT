# XRPL-EVM-AUTO-BOT

A multi-purpose terminal bot for interacting with XRPL EVM DEX (e.g., XRiSE33) using Node.js and ethers.js.  
Supports token swaps, liquidity management, transfers, and more—across one or multiple wallets.

---

## Features

- **Swap Tokens** (including Native XRPL, RISE, RIBBIT, WXRP)
- **Custom Token Swaps**
- **Add Liquidity**
- **Deploy ERC20 Token** (requires ERC20 bytecode, optional)
- **Transfer Tokens or Native XRPL**
- **Random/Custom Recipient Address**
- **Multi-wallet support** (just add more private keys)

---

## Requirements

- Node.js (v16 or above recommended)
- NPM/Yarn
- An XRPL EVM RPC endpoint
- Your private key(s) for wallet(s)
- ABI JSON files:  
  - `ERC20.json`  
  - `UniswapV2Router02.json`  
  - `UniswapV2Factory.json`

---

## Setup

1. **Clone the repository and enter the directory:**

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
   RPC_URL=https://your-xrpl-evm-rpc-url
   PRIVATE_KEY1=0xyourfirstprivatekey
   # Add more wallets as needed:
   # PRIVATE_KEY2=0xyoursecondprivatekey
   # PRIVATE_KEY3=...
   ```

4. **Place ABI files in the project folder:**

   - `ERC20.json`
   - `UniswapV2Router02.json`
   - `UniswapV2Factory.json`

5. **Edit DEX addresses in `index.js` if necessary:**

   ```js
   const ROUTER_ADDRESS  = "0x..."; // Your DEX router address
   const FACTORY_ADDRESS = "0x..."; // Your DEX factory address
   ```

---

## Usage

1. **Run the bot:**

   ```
   node index.cjs
   ```

2. **Follow the on-screen menu:**
   - Choose operations like token swap, add liquidity, transfer, etc.
   - Enter amounts and addresses as prompted.

---

## Supported Tokens (example)

- XRP:    `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
- RISE:   `0x0c28777DEebe4589e83EF2Dc7833354e6a0aFF85`
- RIBBIT: `0x73ee7BC68d3f07CfcD68776512b7317FE57E1939`
- WXRP:   `0x81Be083099c2C65b062378E74Fa8469644347BB7`

You can add more tokens in the `tokens` object in `index.js`.

---

## Notes

- **Never share your private key.**  
  Use .env for private key storage, and never commit your .env to public repositories.
- **Deploy Token**: To enable token deployment, supply `ERC20Bytecode.json` and uncomment the relevant code in `index.js`.
- **Multi-wallet**: The bot will loop through every wallet found in your `.env` file.

---

## License

MIT

---

## Credits

Developed by [@PetrukStar](https://github.com/PetrukStar)  
XRPL-EVM-AUTO-BOT

---